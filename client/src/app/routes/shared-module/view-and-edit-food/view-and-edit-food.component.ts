import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, finalize, of } from 'rxjs';
import { Size } from 'src/app/helpers/Size';
import { Setting } from 'src/app/models/setting';
import { User } from 'src/app/models/user';
import { FoodService } from 'src/app/services/food.service';

@Component({
  selector: 'app-view-and-edit-food',
  templateUrl: './view-and-edit-food.component.html',
  styleUrls: ['./view-and-edit-food.component.css']
})
export class ViewAndEditFoodComponent implements OnInit {
  @Input() mode: string = 'create';
  @Input() data: any;
  @Input() isEdit: boolean;
  @Input() cinemas: any[];
  @Output() onSubmit = new EventEmitter();
  isLoading: boolean = false;
  user: User;
  setting: Setting;
  form!: FormGroup;
  size: any[] = [
    { value: Size.S, viewValue: 'S' },
    { value: Size.M, viewValue: 'M' },
    { value: Size.L, viewValue: 'L' }];
  constructor(
    private fb: FormBuilder,
    private foodService: FoodService,
    private notification: NzNotificationService,
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
      this.form.get('cinemaId')?.disable();
    }
  }

  initForm() {
    this.form = this.fb.group({
      id: [null],
      creatorUserId: [null, Validators.required],
      lastModifierUserId: [null],
      name: [null, Validators.required],
      cinemaId: [null, Validators.required],
      size: [null, Validators.required],
      price: [null, Validators.required],
    });
  }

  getCinemaName(id: any) {
    return this.cinemas.find(c => c.id == id)?.name
  }

  submit() {
    this.isLoading = true;
    this.form.get('creatorUserId')?.setValue(this.user.id);
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.valid) {
      if (this.mode === 'create') {
        this.foodService
          .createFood(this.form.value)
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
        this.form.get('cinemaId')?.enable();
        this.form.get('lastModifierUserId')?.setValue(this.user.id);
        this.foodService
          .updateFood(this.form.value)
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

