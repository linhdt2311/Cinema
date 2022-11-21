import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, finalize, of } from 'rxjs';
import { FormatMovieScreen } from 'src/app/helpers/FormatMovieScreen';
import { Setting } from 'src/app/models/setting';
import { User } from 'src/app/models/user';
import { ShowtimesService } from 'src/app/services/showtimes.service';

@Component({
  selector: 'app-view-and-edit-showtimes',
  templateUrl: './view-and-edit-showtimes.component.html',
  styleUrls: ['./view-and-edit-showtimes.component.css']
})
export class ViewAndEditShowtimesComponent implements OnInit {
  @Input() mode: string = 'create';
  @Input() data: any;
  @Input() isEdit: boolean;
  @Output() onSubmit = new EventEmitter();
  showtimes: any[] = [];
  isLoading: boolean = false;
  user: User;
  setting: Setting;
  form!: FormGroup;
  formatMovieScreen: any[] = [{ value: FormatMovieScreen.IMAX, viewValue: 'IMAX' },
  { value: FormatMovieScreen.TwoD, viewValue: '2D' },
  { value: FormatMovieScreen.ThreeD, viewValue: '3D' },
  { value: FormatMovieScreen.FourD, viewValue: '4D' }];
  
  constructor(
    private fb: FormBuilder,
    private showtimesService: ShowtimesService,
    private notification: NzNotificationService,
    private datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
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
      movieId: [null, Validators.required],
      timeStart: [null, Validators.required],
      formatMovieScreen: [null, Validators.required],
      roomId: [null, Validators.required],
    });
  }

  movieData() {
    this.showtimesService
      .getAllShowtimes()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.showtimes = response
      })
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
        this.showtimesService
          .createShowtimes(this.form.value)
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
        this.showtimesService
          .updateShowtimes(this.form.value)
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
