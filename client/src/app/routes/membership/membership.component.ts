import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.css']
})
export class MembershipComponent implements OnInit {
  registerForm!: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,

  ) { }

  ngOnInit(): void {
    this.initForm();
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
    this.registerForm.get('role')?.setValue(1);
    for (const i in this.registerForm.controls) {
      this.registerForm.controls[i].markAsDirty();
      this.registerForm.controls[i].updateValueAndValidity();
    }
    console.log('registerForm', this.registerForm.value);
  }
}
