import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() mode: string = 'create';
  @Input() data: any;
  @Input() isEdit: boolean;
  @Output() onSubmit = new EventEmitter();
  accounts: any[] = [];
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
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
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
        this.form.enable();
      } else {
        this.form.disable();
      }
    }
  }

  initForm() {
    this.form = this.fb.group({
      id: [null],
      creatorUserId: [null, Validators.required],
      lastModifierUserId: [null],
      name: [null, Validators.required],
      time: [null, Validators.required],
      openingDay: [null, Validators.required],
      country: [null, Validators.required],
      director: [null, Validators.required],
      description: [null],
      poster: [null],
    });
  }

  movieData() {
    this.accountService
      .getAllAccount()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.accounts = response
      })
  }

  submit() {
    this.isLoading = true;
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.valid) {
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
      this.notification.create('warning', 'You must enter all information!', '');
    }
  }
}
