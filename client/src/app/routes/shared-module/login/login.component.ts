import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, of } from 'rxjs';
import { User } from 'src/app/models/user';
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
  user: User;
  loginForm!: FormGroup;
  loggedIn: boolean = false;
  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private notification: NzNotificationService,
    ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
      remember: [true]
    });
  }

  onSubmit(key?: any) {
    let checkRemember = false;
    if((<HTMLInputElement>document.getElementById('remember')).checked) {
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
            this.notification.create('error','Email or password not correct!', '');
          }
        });
    } else {
      this.notification.create('error','Email or password not correct!', '');
    }
  }

  handleCancel(){
    this.cancel.emit();
  }
}
