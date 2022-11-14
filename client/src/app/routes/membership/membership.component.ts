import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { en_US, NzI18nService } from 'ng-zorro-antd/i18n';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, of } from 'rxjs';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.css']
})
export class MembershipComponent implements OnInit {
  registerForm!: UntypedFormGroup;
  user: User;
  isVisible = false;
  checkUser: boolean = true;
  dateFormat = "YYYY-MM-dd"
  constructor(
    private fb: UntypedFormBuilder,
    private accountService: AccountService,
    private notification: NzNotificationService,
    private i18n: NzI18nService,
  ) { }

  ngOnInit(): void {
    this.i18n.setLocale(en_US)
    this.initForm();
  }

  ngDoCheck() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.checkUser = Object.keys(this.user).length === 0;
  }

  initForm() {
    this.registerForm = this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
      name: [null, Validators.required],
      identityCard: [null, Validators.required],
      address: [null, Validators.required],
      phone: [null, Validators.required],
      dob: [null, Validators.required],
      role: [null]
    });
  }

  submitForm(): void {
    console.log('registerForm', this.registerForm.value);
  }

  onSubmit(key?: any) {
    if (this.registerForm.valid) {
      this.accountService
        .createAccount(this.registerForm.value)
        .pipe(catchError((err) => of(err)))
        .subscribe((response) => {
          if (response) {
            this.notification.create(
              'success',
              'Successfully!',
              ''
            );
          } else {
            this.notification.create(
              'error',
              'Failed!',
              ''
            );
          }
        })
    }
    this.isVisible = false;
    this.registerForm.get('email')?.enable();
    this.registerForm.reset();
  }

  showModal(): void {
    this.registerForm.get('role')?.setValue(1);
    this.registerForm.get('password')?.setValue("123456");
    for (const i in this.registerForm.controls) {
      this.registerForm.controls[i].markAsDirty();
      this.registerForm.controls[i].updateValueAndValidity();
    }
    if (this.registerForm.valid) {
      this.isVisible = true;
      this.registerForm.get('password')?.setValue(null);
      this.registerForm.get('email')?.disable();
    }
  }

  handleCancel(): void {
    this.isVisible = false;
    this.registerForm.get('email')?.enable();
  }
}
