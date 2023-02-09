import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, finalize, of } from 'rxjs';
import { Setting } from 'src/app/models/setting';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-view-and-edit-customer',
  templateUrl: './view-and-edit-customer.component.html',
  styleUrls: ['./view-and-edit-customer.component.css']
})
export class ViewAndEditCustomerComponent implements OnInit {
  @ViewChild('identityCard', { static: false }) identityCard?: ElementRef;
  @ViewChild('phone', { static: false }) phone?: ElementRef;
  @Input() mode: string = 'create';
  @Input() data: any;
  @Input() isEdit: boolean;
  @Output() onSubmit = new EventEmitter();
  accounts: any[] = [];
  valueIdentityCard = '';
  valuePhone = '';
  isLoading: boolean = false;
  user: User;
  setting: Setting;
  form!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private notification: NzNotificationService,
    private datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.setting = JSON.parse(localStorage.getItem('setting') || '{}');
    this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    this.accountData();
    this.initForm();
    this.form.reset();
    this.form.disable();
    if (this.mode === 'create') {
      this.form.enable();
    } else {
      this.form.patchValue(this.data);
    }
  }

  ngOnChanges(): void {
    if (this.form) {
      if (this.isEdit) {
        console.log(this.data)
        this.form.enable();
      } else {
        this.form.disable();
      }
    }
  }

  initForm() {
    this.form = this.fb.group({
      id: [null],
      lastModifierUserId: [null],
      email: [null, Validators.required],
      password: [null],
      name: [null, Validators.required],
      identityCard: [null, Validators.required],
      address: [null, Validators.required],
      phone: [null, Validators.required],
      doB: [null, Validators.required],
      role: [null, Validators.required],
      point: [0, Validators.required],
    });
  }

  accountData() {
    this.accountService
      .getAllAccount()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.accounts = response
      })
  }

  checkPhone(value: string): void {
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(+value) && reg.test(value)) || value === '' || value === '-') {
      this.valueIdentityCard = value;
    }
    this.phone!.nativeElement.value = this.valueIdentityCard;
  }

  checkIdentity(value: string): void {
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(+value) && reg.test(value)) || value === '' || value === '-') {
      this.valuePhone = value;
    }
    this.identityCard!.nativeElement.value = this.valuePhone;
  }

  submit() {
    let check = true;
    this.accounts.forEach((item) => {
      if (item.email == this.form.value.email && item.id != this.form.value.id) {
        check = false;
      }
      if (item.identityCard == this.form.value.identityCard && item.id != this.form.value.id) {
        check = false;
      }
    })
    this.isLoading = true;
    this.form.get('role')?.setValue(1);
    this.form.get('doB')?.setValue(this.datepipe.transform(this.form.value.doB, 'YYYY-MM-dd'));
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.valid) {
      if (check == true) {
        if (this.mode === 'create') {
          this.accountService
            .createAccount(this.form.value)
            .pipe(catchError((err) => of(err)), finalize(() => this.isLoading = false))
            .subscribe((response) => {
              if (response) {
                this.notification.create('success', 'Successfully!', '');
              } else {
                this.notification.create('error', 'Failed!', '');
              }
            })
          this.onSubmit.emit(this.form.value);
        } else {
          this.form.get('lastModifierUserId')?.setValue(this.user.id);
          this.accountService
            .updateAccount(this.form.value)
            .pipe(catchError((err) => of(err)), finalize(() => this.isLoading = false))
            .subscribe((response) => {
              if (response) {
                this.notification.create('success', 'Successfully!', '');
              } else {
                this.notification.create('error', 'Failed!', '');
              }
            })
          this.onSubmit.emit(this.form.value);
        }
      } else {
        this.notification.create('warning', 'This email or identity card is existed!!!', '')
      }
    } else {
      this.notification.create('warning', 'You must enter all information!', '');
    }
  }
}
