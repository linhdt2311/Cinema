import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, of } from 'rxjs';
import { FormatMovieScreen } from 'src/app/helpers/FormatMovieScreen';
import { GetAllShowtimes } from 'src/app/models/getallshowtimes';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { MovieService } from 'src/app/services/movie.service';
import { SeatService } from 'src/app/services/seat.service';
import { ShowtimesService } from 'src/app/services/showtimes.service';
import { NavbarComponent } from '../../navbar/navbar.component';

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
  getAllShowtimes: GetAllShowtimes = new GetAllShowtimes();
  screen: boolean = true;
  movies: any[] = [];
  rooms: any[] = [];
  seats: any[] = [];
  booking: any[] = [];
  showtimes: any[] = [];
  accounts: any[] = [];
  seat: any;
  url: any;
  user: User;
  times: any;
  checkUser: boolean = true;
  cinemaId: string = '';
  total: number = 0;
  money: any;
  formatMovieScreen: any[] = [{ value: FormatMovieScreen.IMax, viewValue: 'IMAX' },
  { value: FormatMovieScreen.TwoD, viewValue: '2D' },
  { value: FormatMovieScreen.ThreeD, viewValue: '3D' },
  { value: FormatMovieScreen.FourD, viewValue: '4D' }];
  constructor(
    private seatService: SeatService,
    private showtimesService: ShowtimesService,
    private movieService: MovieService,
    private accountService: AccountService,
    private notification: NzNotificationService,
    protected route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }
  
  ngOnChanges(): void {
    if (this.showtimesId) {
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

  getPoster(id: any){
    this.url = this.movies.find(m => m.id == id )?.poster
    if(this.url == ''){
      this.url = 'https://i.pinimg.com/originals/85/9f/52/859f5219ba0b8d67f399c0db5a648694.jpg';
    }
    return this.url
  }

  getFormatMovieScreen(screen: any){
    return this.formatMovieScreen.find(f => f.value == screen)?.viewValue
  }

  getMovieTime(id: any){
    return this.movies.find(m => m.id == id)?.time
  }

  seatInfo(id: any) {
    this.seat = this.seats.find(s => s.seatId === id)
    return this.seat
  }

  bookingSeat(id: any) {
    this.seat = this.seats.find(s => s.seatId === id)
    if(this.seat.seatStatus == 1){
      if (!this.booking.find(b => b.seatId === id)) {
        if (this.booking.length < 6) {
          this.booking.push(this.seat);
          this.total = this.total + this.seat.price
          this.money = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'VND' }).format(this.total)
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
        this.total = this.total - this.seat.price
        this.money = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'VND' }).format(this.total)
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
    this.booking = [];
    this.cancel.emit();
  }

  handleOk(): void {
    if(this.checkUser == true){
      this.notification.create(
        'warning',
        'You must be login!',
        ''
      );
      this.showLogin = true;
    } else {
      this.booking = [];
      this.submit.emit();
    }
  }

  CancelLogin(){
    this.showLogin = false;
  }

  SumitLogin(){
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.checkUser = Object.keys(this.user).length === 0
    this.showLogin = false;
  }
}
