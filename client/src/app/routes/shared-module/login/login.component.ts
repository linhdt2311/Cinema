import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, of } from 'rxjs';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() isVisible: boolean | undefined;
  @Output() submit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  index: number = 0;
  user: User;
  loginForm!: FormGroup;
  passwordForm!: FormGroup;
  loggedIn: boolean = false;
  accounts: any[] = [];
  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private notification: NzNotificationService,
    private accountService: AccountService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.forgotPasswordForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
      remember: [true]
    });
  }

  forgotPasswordForm() {
    this.passwordForm = this.fb.group({
      lastModifierUserId: [null, Validators.required],
      id: [null, Validators.required],
      email: [null, Validators.required],
      password: [null, Validators.required],
      name: [null, Validators.required],
      identityCard: [null, Validators.required],
      address: [null, Validators.required],
      phone: [null, Validators.required],
      doB: [null, Validators.required],
      role: [null, Validators.required],
      point: [null, Validators.required],
      newPassword: [null, Validators.required],
      confirmPassword: [null, Validators.required],
    });
  }

  onSubmit(key?: any) {
    let checkRemember = false;
    if ((<HTMLInputElement>document.getElementById('remember')).checked) {
      checkRemember = true;
    }
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }
    if (this.loginForm.valid) {
      this.authenticationService
        .login(this.loginForm.value, checkRemember)
        .pipe(catchError((err) => of(err)))
        .subscribe((response) => {
          if (!response) {
            this.loggedIn = true;
            this.notification.create('success', 'Login success!', '');
            this.submit.emit();
          } else {
            this.notification.create('error', 'Email or password not correct!', '');
          }
        });
    } else {
      this.notification.create('error', 'Email or password not correct!', '');
    }
  }

  handleCancel() {
    this.cancel.emit();
  }

  routerRegister() {
    this.index = 1;
    this.accountService
      .getAllAccount()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.accounts = response;
      });
  }

  submitForgotPasswordForm() {
    let isEmail = false;
    for (const item of this.accounts) {
      if (item.email === this.passwordForm.value.email) {
        isEmail = true;
        this.passwordForm.patchValue(item);
        break;
      }
    }
    if (isEmail === false) {
      this.notification.create('error', 'Email isn\'t correct!', '');
    } else {
      if (this.passwordForm.value.confirmPassword === this.passwordForm.value.newPassword) {
        this.passwordForm.get('password')?.setValue(this.passwordForm.value.newPassword);
        this.passwordForm.get('lastModifierUserId')?.setValue(this.passwordForm.value.id);
        this.accountService
          .updateAccount(this.passwordForm.value)
          .pipe(catchError((err) => of(err)))
          .subscribe(() => {
            this.notification.create('success', 'Successfully!', '');
            this.index = 0;
          })
      } else {
        this.notification.create('error', 'Password confirm don\'t match the new password!', '');
      }
    }
  }
  
  back(){
    this.index = 0;
  }
}
