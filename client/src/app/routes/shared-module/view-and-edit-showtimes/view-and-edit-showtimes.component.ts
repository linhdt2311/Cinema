import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, finalize, of } from 'rxjs';
import { FormatMovieScreen } from 'src/app/helpers/FormatMovieScreen';
import { Setting } from 'src/app/models/setting';
import { User } from 'src/app/models/user';
import { CinemaService } from 'src/app/services/cinema.service';
import { MovieService } from 'src/app/services/movie.service';
import { RoomService } from 'src/app/services/room.service';
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
  movies: any[] = [];
  rooms: any[] = [];
  roomsFilter: any[] = [];
  cinemas: any[] = [];
  isLoading: boolean = false;
  user: User;
  setting: Setting;
  form!: FormGroup;
  formatMovieScreen: any[] = [
    { value: FormatMovieScreen.IMAX, viewValue: 'IMAX' },
    { value: FormatMovieScreen.TwoD, viewValue: '2D' },
    { value: FormatMovieScreen.ThreeD, viewValue: '3D' },
    { value: FormatMovieScreen.FourD, viewValue: '4D' }];
  date: any[] = [{ value: new Date() },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 2) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 3) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 4) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 5) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 6) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 7) }];
  constructor(
    private fb: FormBuilder,
    private showtimesService: ShowtimesService,
    private movieService: MovieService,
    private roomService: RoomService,
    private cinemaService: CinemaService,
    private notification: NzNotificationService,
    private datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.setting = JSON.parse(localStorage.getItem('setting') || '{}');
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.movieData();
    this.roomData();
    this.cinemaData();
    this.showtimesData();
    this.initForm();
    this.form.reset();
    this.form.disable();
    if (this.mode === 'create') {
      this.form.enable();
    } else {
      this.form.patchValue(this.data);
      this.changeRoom();
    }
  }

  ngOnChanges(): void {
    if (this.form) {
      if (this.isEdit) {
        this.form.enable();
      } else {
        this.form.disable();
      }
      this.form.get('roomId')?.disable();
      this.changeRoom();
    }
  }

  initForm() {
    this.form = this.fb.group({
      id: [null],
      creatorUserId: [null, Validators.required],
      lastModifierUserId: [null],
      movieId: [null, Validators.required],
      timeStart: [null, Validators.required],
      roomId: [null, Validators.required],
      formatMovieScreen: [null],
      cinemaId: [null],
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

  showtimesData() {
    this.showtimesService
      .getAllShowtimes()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.showtimes = response
      })
  }

  roomData() {
    this.roomService
      .getAllRoom()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.rooms = response
      })
  }

  cinemaData() {
    this.cinemaService
      .getAllCinema()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.cinemas = response
      })
  }

  getFormatScreen(id: any) {
    const format = this.rooms.find(r => r.id === id)?.formatMovieScreen;
    return this.formatMovieScreen.find(f => f.value === format)?.viewValue;
  }

  getCinemaName(id: any) {
    const name = this.rooms.find(r => r.id === id)?.cinemaId;
    return this.cinemas.find(f => f.id === name)?.name;
  }

  changeRoom() {
    this.form.get('formatMovieScreen')?.setValue(this.getFormatScreen(this.form.value.roomId));
    this.form.get('formatMovieScreen')?.disable();
  }

  changeCinema(id: any) {
    this.form.get('roomId')?.enable();
    this.roomsFilter = this.rooms.filter(c => c.cinemaId === id);
    return this.roomsFilter;
  }

  checkDate(date: Date, room: any) {
    const filter = this.showtimes.filter(s => this.datepipe.transform(s.timeStart, 'YYYY-MM-dd') === this.datepipe.transform(date, 'YYYY-MM-dd') && s.roomId === room);
    filter.filter(s => 
      this.datepipe.transform(s.timeStart, 'HH:mm') === '10:00'
      || this.datepipe.transform(s.timeStart, 'HH:mm') === '13:00'
      || this.datepipe.transform(s.timeStart, 'HH:mm') === '16:00'
      || this.datepipe.transform(s.timeStart, 'HH:mm') === '19:00'
      || this.datepipe.transform(s.timeStart, 'HH:mm') === '22:00'
      || this.datepipe.transform(s.timeStart, 'HH:mm') === '01:00'
    );
  }

  submit() {
    this.isLoading = true;
    this.form.get('creatorUserId')?.setValue(this.user.id);
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.valid) {
      this.form.get('cinemaId')?.disable();
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
