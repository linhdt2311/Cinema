import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, finalize, of } from 'rxjs';
import { Setting } from 'src/app/models/setting';
import { User } from 'src/app/models/user';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-view-and-edit-movie',
  templateUrl: './view-and-edit-movie.component.html',
  styleUrls: ['./view-and-edit-movie.component.css']
})
export class ViewAndEditMovieComponent implements OnInit {
  @Input() mode: string = 'create';
  @Input() data: any;
  @Input() isEdit: boolean;
  @Output() onSubmit = new EventEmitter();
  movies: any[] = [];
  isLoading: boolean = false;
  user: User;
  setting: Setting;
  form!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
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
    this.movieService
      .getAllMovie()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.movies = response
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
        this.movieService
          .createMovie(this.form.value)
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
        this.form.get('openingDay')?.setValue(this.datepipe.transform(this.form.get('openingDay')?.value, 'YYYY-MM-dd'));
        this.movieService
          .updateMovie(this.form.value)
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