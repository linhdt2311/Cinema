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
  dateFormat = "YYYY-MM-dd";
  email: any;
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

  checkRegister() {
    const phone = /([+]?84|0[3|5|7|8|9])+([0-9]{8})/
    const email = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    const identityCard = /0([0-9]{11})/
    if (phone.test(this.registerForm.get('phone')?.value) == false) {
      this.notification.create('error', 'Register failed!', 'This phone is invalid');
      this.registerForm.get('phone')?.setValue(null)
    } else if (email.test(this.registerForm.get('email')?.value) == false) {
      this.notification.create('error', 'Register failed!', 'This email is invalid');
      this.registerForm.get('email')?.setValue(null)
    } else if (identityCard.test(this.registerForm.get('identityCard')?.value) == false) {
      this.notification.create('error', 'Register failed!', 'This identity card is invalid');
      this.registerForm.get('identityCard')?.setValue(null)
    } else {
      this.accountService
        .getAllAccount()
        .pipe(catchError((err) => of(err)))
        .subscribe((response) => {
          if (response) {
            const acc = response
            if (acc.find((a: any) => a.email == this.registerForm.get('email')?.value)) {
              this.notification.create('error', 'Register failed!', 'This email is registered');
              this.registerForm.get('email')?.setValue(null)
            }
            if (acc.find((a: any) => a.identityCard === this.registerForm.get('identityCard')?.value)) {
              this.notification.create('error', 'Register failed!', 'This identity card is registered');
              this.registerForm.get('identityCard')?.setValue(null)
            }
          } else {
            this.notification.create('error', 'Failed!', '');
          }
        })
    }
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
            this.notification.create('success', 'Successfully!', '');
          } else {
            this.notification.create('error', 'Failed!', '');
          }
        })
    } else {
      this.notification.create('error', 'Warning', 'You need to enter in all the information to register!');
    }
    this.isVisible = false;
    this.registerForm.reset();
  }

  showModal(): void {
    this.registerForm.get('role')?.setValue(1);
    this.registerForm.get('password')?.setValue("123456");
    for (const i in this.registerForm.controls) {
      this.registerForm.controls[i].markAsDirty();
      this.registerForm.controls[i].updateValueAndValidity();
    }
    this.checkRegister();
    if (this.registerForm.valid) {
      this.isVisible = true;
      this.registerForm.get('password')?.setValue(null);
      this.email = this.registerForm.get('email')?.value
    } else {
      this.notification.create('error', 'Warning', 'You need to enter in all the information to register!');
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  getRankCustomer(point: number) {
    let rank = 'Unknown Rank';
    if (0 <= point && point <= 1000) {
      rank = 'Unknown Rank';
    } else if (1001 <= point && point <= 2000) {
      rank = 'Bronze';
    } else if (2001 <= point && point <= 3500) {
      rank = 'Silver';
    } else if (3501 <= point && point <= 5500) {
      rank = 'Gold';
    } else if (5501 <= point && point <= 8000) {
      rank = 'Platinum';
    } else if (8001 <= point && point <= 11000) {
      rank = 'Diamond';
    } else if (11001 <= point && point <= 14500) {
      rank = 'Master';
    } else {
      rank = 'Challenger';
    }
    return rank;
  }
}
