import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, finalize, of } from 'rxjs';
import { Setting } from 'src/app/models/setting';
import { User } from 'src/app/models/user';
import { PromotionService } from 'src/app/services/promotion.service';

@Component({
  selector: 'app-view-and-edit-promotion',
  templateUrl: './view-and-edit-promotion.component.html',
  styleUrls: ['./view-and-edit-promotion.component.css']
})
export class ViewAndEditPromotionComponent implements OnInit {
    @Input() mode: string = 'create';
    @Input() data: any;
    @Input() isEdit: boolean;
    @Output() onSubmit = new EventEmitter();
    promotions: any[] = [];
    isLoading: boolean = false;
    user: User;
    setting: Setting;
    form!: FormGroup;
    warningstr: string = '';
    constructor(
      private fb: FormBuilder,
      private promotionService: PromotionService,
      private notification: NzNotificationService,
      private datepipe: DatePipe,
    ) { }
  
    ngOnInit(): void {
      this.setting = JSON.parse(localStorage.getItem('setting') || '{}');
      this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
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
        code: [null, Validators.required],
        discount: [null, Validators.required],
        startDate: [null, Validators.required],
        endDate: [null, Validators.required],
      });
    }
  
    promotionData() {
      this.promotionService
        .getAllPromotion()
        .pipe(catchError((err) => of(err)))
        .subscribe((response) => {
          this.promotions = response
        })
    }

    warning(){
      if(new Date(this.form.value.endDate) < new Date()){
        this.warningstr = '* This time is unexpired';
      }
    }
  
    submit() {
      this.isLoading = true;
      this.form.get('creatorUserId')?.setValue(this.user.id);
      this.form.get('startDate')?.setValue(this.datepipe.transform(this.form.value.startDate, 'YYYY-MM-dd'));
      this.form.get('endDate')?.setValue(this.datepipe.transform(this.form.value.endDate, 'YYYY-MM-dd'));
      for (const i in this.form.controls) {
        this.form.controls[i].markAsDirty();
        this.form.controls[i].updateValueAndValidity();
      }
      if (this.form.valid) {
        if (this.mode === 'create') {
          this.promotionService
            .createPromotion(this.form.value)
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
          this.promotionService
            .updatePromotion(this.form.value)
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
