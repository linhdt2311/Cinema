import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, of } from 'rxjs';
import { FormatMovieScreen } from 'src/app/helpers/FormatMovieScreen';
import { GetAllShowtimes } from 'src/app/models/getallshowtimes';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { BillService } from 'src/app/services/bill.service';
import { MovieService } from 'src/app/services/movie.service';
import { SeatService } from 'src/app/services/seat.service';
import { ShowtimesService } from 'src/app/services/showtimes.service';

@Component({
  selector: 'app-modal-room',
  templateUrl: './modal-room.component.html',
  styleUrls: ['./modal-room.component.css']
})
export class ModalRoomComponent implements OnInit {
  @Input() isVisible: boolean | undefined;
  @Input() showtimesId: any;
  @Output() submit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  showLogin: boolean = false;
  showFood: boolean = false;
  getAllShowtimes: GetAllShowtimes = new GetAllShowtimes();
  screen: boolean = true;
  movies: any[] = [];
  seats: any[] = [];
  booking: any[] = [];
  showtimes: any[] = [];
  accounts: any[] = [];
  cinemaId: string;
  seat: any;
  url: any;
  user: User;
  times: any;
  checkUser: boolean = true;
  money: number = 0;
  createDate: any;
  formatMovieScreen: any[] = [{ value: FormatMovieScreen.IMAX, viewValue: 'IMAX' },
  { value: FormatMovieScreen.TwoD, viewValue: '2D' },
  { value: FormatMovieScreen.ThreeD, viewValue: '3D' },
  { value: FormatMovieScreen.FourD, viewValue: '4D' }];
  constructor(
    private seatService: SeatService,
    private showtimesService: ShowtimesService,
    private movieService: MovieService,
    private accountService: AccountService,
    private notification: NzNotificationService,
    private datepipe: DatePipe,
    private billService: BillService,
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.isVisible == true) {
      this.user = JSON.parse(localStorage.getItem('user') || '{}');
      this.checkUser = Object.keys(this.user).length === 0
      this.getAllShowtimes.id = this.showtimesId
      this.showtimesData();
      this.seatData();
      this.movieData();
      this.accountData();
    }
  }

  seatData() {
    this.seatService
      .getAllSeat(this.showtimesId)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.seats = response;
      });
  }

  showtimesData() {
    this.showtimesService
      .getAllShowtimes(this.getAllShowtimes)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.showtimes = response;
        this.times = this.showtimes.find(t => t.id == this.showtimesId)
      });
  }

  movieData() {
    this.movieService
      .getAllMovie()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.movies = response;
      });
  }

  accountData() {
    this.accountService
      .getAllAccount()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.accounts = response;
      });
  }

  getMovieName(id: any) {
    return this.movies.find(m => m.id == id)?.name
  }

  getPoster(id: any) {
    this.url = this.movies.find(m => m.id == id)?.poster
    if (this.url == '') {
      this.url = 'https://i.pinimg.com/originals/85/9f/52/859f5219ba0b8d67f399c0db5a648694.jpg';
    }
    return this.url
  }

  getFormatMovieScreen(screen: any) {
    return this.formatMovieScreen.find(f => f.value == screen)?.viewValue
  }

  getMovieTime(id: any) {
    return this.movies.find(m => m.id == id)?.time
  }

  seatInfo(id: any) {
    this.seat = this.seats.find(s => s.seatId === id)
    return this.seat
  }

  changeToVND(price: any) {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'VND' }).format(price)
  }

  bookingSeat(id: any) {
    this.seat = this.seats.find(s => s.seatId === id)
    if (this.seat.seatStatus == 1) {
      if (!this.booking.find(b => b.seatId === id)) {
        if (this.booking.length < 6) {
          this.booking.push(this.seat);
          this.money = this.money + this.seat.price
        }
        else {
          this.notification.create(
            'warning',
            'You cannot book more than 6 seat!',
            ''
          );
        }
      } else {
        this.booking.splice(this.booking.indexOf(this.seat), 1)
        this.money = this.money - this.seat.price
      }
    } else {
      this.notification.create(
        'warning',
        'This seat has been booked. You cannot be selected!',
        ''
      )
    }
    return this.booking
  }

  handleCancel(): void {
    this.money = 0;
    this.booking = [];
    this.cancel.emit();
  }

  handleOk(): void {
    if (this.checkUser == true) {
      this.notification.create(
        'warning',
        'You must be login!',
        ''
      );
      this.showLogin = true;
    } else {
      this.cinemaId = this.times.cinemaId;
      const payload = {
        creatorUserId: this.user.id,
        accountId: this.user.id,
      }
      this.billService
        .createBill(payload)
        .pipe(
          catchError((err) => {
            return of(err);
          }),
        )
        .subscribe((response) => {
          this.createDate = this.datepipe.transform(new Date(), 'YYYY-MM-dd%20HH%3Amm%3Ass');
          if (response) {
            console.log("create bill successfully!")
          } else {
            console.log("create bill failed!")
          }
        });
      this.showFood = true;
    }
  }

  close() {
    this.showLogin = false;
    this.showFood = false;
  }

  loginSubmit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.checkUser = Object.keys(this.user).length === 0
    this.showLogin = false;
  }

  foodSubmit() {
    this.showFood = false;
    this.booking = [];
    this.submit.emit();
  }
}
