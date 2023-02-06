import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, finalize, interval, of, takeWhile, tap, timer } from 'rxjs';
import { FormatMovieScreen } from 'src/app/helpers/FormatMovieScreen';
import { GetAllShowtimes } from 'src/app/models/getallshowtimes';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { BillService } from 'src/app/services/bill.service';
import { MovieService } from 'src/app/services/movie.service';
import { SeatService } from 'src/app/services/seat.service';
import { ShowtimesService } from 'src/app/services/showtimes.service';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-modal-room',
  templateUrl: './modal-room.component.html',
  styleUrls: ['./modal-room.component.css']
})
export class ModalRoomComponent implements OnInit {
  @Input() showtimesId: any;
  @Output() submit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  showLogin: boolean = false;
  showFood: boolean = false;
  isLoading: boolean = false;
  getAllShowtimes: GetAllShowtimes = new GetAllShowtimes();
  screen: boolean = true;
  movies: any[] = [];
  seats: any[] = [];
  tickets: any[] = [];
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
  counter: any = 900;
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
    private ticketService: TicketService,
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    this.booking = JSON.parse(localStorage.getItem('seat') || '[]');
    this.tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    this.booking.forEach(item => { this.money += item.price })
    this.checkUser = Object.keys(this.user).length === 0;
    this.getAllShowtimes.id = this.showtimesId
    this.showtimesData();
    this.seatData();
    this.movieData();
    this.ticketData();
    this.accountData();
    if (Object.keys(this.booking).length !== 0) {
      this.countTime();
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
        this.times = this.showtimes.find(t => t.id == this.showtimesId);
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

  ticketData() {
    this.ticketService
      .getAllTicket()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        localStorage.setItem('tickets', JSON.stringify(response));
      })
  }

  getMovieName(id: any) {
    return this.movies.find(m => m.id == id)?.name;
  }

  getPoster(id: any) {
    this.url = this.movies.find(m => m.id == id)?.poster;
    if (this.url == '') {
      this.url = 'https://picsum.photos/200/300';
    };
    return this.url;
  }

  getFormatMovieScreen(screen: any) {
    return this.formatMovieScreen.find(f => f.value == screen)?.viewValue;
  }

  getMovieTime(id: any) {
    return this.movies.find(m => m.id == id)?.time;
  }

  seatInfo(id: any) {
    this.seat = this.seats.find(s => s.seatId === id);
    return this.seat;
  }

  changeToVND(price: any) {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'VND' }).format(price);
  }

  bookingSeat(id: any) {
    let allow = false;
    if (this.checkSeat(id) === 'red' || this.checkSeat(id) === 'green') {
      allow = false;
    } else {
      allow = true;
    }
    if (this.checkUser == true) {
      this.notification.create('warning', 'You must be login!', '');
      this.isLoading = false;
      this.showLogin = true;
    } else {
      this.seat = this.seats.find(s => s.seatId === id);
      if (allow == true) {
        if (!this.booking.find(b => b.seatId === id)) {
          if (this.booking.length < 6) {
            this.booking.push(this.seat);
            this.money = this.money + this.seat.price;
            const payload = {
              creatorUserId: this.user.id,
              seatId: this.seat.seatId,
              price: this.seat.price,
            }
            this.ticketService
              .createTicket(payload)
              .pipe(catchError((err) => of(err)), finalize(() =>
                setTimeout(() => { this.isLoading = false }, 1000)))
              .subscribe(() => {
                const ticket = {
                  "date": this.datepipe.transform(new Date(), "YYYY-MM-ddTHH:mm:ss"),
                  "seatId": this.seat.seatId,
                  "price": this.seat.price,
                  "promotionId": "",
                  "billId": null,
                  "creatorUserId": this.user.id
                }
                this.tickets = [ticket, ...this.tickets];
                localStorage.setItem('tickets', JSON.stringify(this.tickets));
              })
          } else {
            this.notification.create('warning', 'You cannot book more than 6 seat!', '');
          };
        } else {
          let index = this.booking.findIndex((item) => item.seatId == id);
          this.booking.splice(index, 1);
          this.booking = [...this.booking];
          this.money = this.money - this.seat.price;
          this.ticketService
            .deleteTicket(this.seat.seatId)
            .pipe(catchError((err) => of(err)), finalize(() =>
              setTimeout(() => { this.isLoading = false }, 1000)))
            .subscribe(() => {
              const index = this.tickets.findIndex((item) => item.seatId == id);
              this.tickets.splice(index, 1);
              this.tickets = [...this.tickets];
              localStorage.setItem('tickets', JSON.stringify(this.tickets));
            })
        }
      } else {
        this.notification.create('warning', 'This seat has been booked. You cannot be selected!', '');
      }
      localStorage.setItem('seat', JSON.stringify(this.booking));
      if (this.booking.length === 1) {
        this.countTime();
      }
    }
    return this.booking;
  }

  handleCancel(): void {
    this.money = 0;
    this.booking = [];
    this.cancel.emit();
  }

  handleOk(): void {
    this.isLoading = true;
    const point = this.user.point;
    if (0 <= point && point <= 1000) {
      this.money = this.money;
    } else if (1001 <= point && point <= 2000) {
      this.money = this.money - 2500;
    } else if (2001 <= point && point <= 3500) {
      this.money = this.money - 5000;
    } else if (3501 <= point && point <= 5500) {
      this.money = this.money - 7500;
    } else if (5501 <= point && point <= 8000) {
      this.money = this.money - 10000;
    } else if (8001 <= point && point <= 11000) {
      this.money = this.money - 15000;
    } else if (11001 <= point && point <= 14500) {
      this.money = this.money - 20000;
    } else {
      this.money = this.money - 30000;
    }
    this.cinemaId = this.times.cinemaId;
    const payload = {
      creatorUserId: this.user.id,
      accountId: this.user.id,
    }
    this.billService
      .createBill(payload)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.createDate = this.datepipe.transform(new Date(), 'YYYY-MM-dd%20HH%3Amm%3Ass');
        if (response) {
          setTimeout(() => {
            console.log("create bill successfully!")
            this.isLoading = false;
          }, 1000);
        } else {
          setTimeout(() => {
            console.log("create bill failed!")
            this.isLoading = false;
          }, 1000);
        }
      });
    this.showFood = true;
  }

  close() {
    this.showLogin = false;
    this.showFood = false;
  }

  loginSubmit() {
    this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    this.checkUser = Object.keys(this.user).length === 0;
    this.showLogin = false;
  }

  foodSubmit() {
    this.showFood = false;
    this.money = 0;
    this.booking = [];
    this.submit.emit();
  }

  countTime() {
    this.counter = 900;
    timer(this.counter, 1000).pipe(
      takeWhile(() => this.counter > 0),
      tap(() => this.counter--))
      .subscribe(this.counter = this.counter);
    interval(this.counter * 1000).subscribe(() => {
      this.tickets = [];
      this.ticketService
        .getAllTicket()
        .pipe(catchError((err) => of(err)))
        .subscribe((response: any[]) => {
          response.forEach((item) => {
            const expired = Date.now() - Date.parse(item.creationTime);
            if (item.billId == null && expired > 900000) {
              this.ticketService
                .deleteTicket(item.seatId)
                .pipe(catchError((err) => of(err)), finalize(() =>
                  setTimeout(() => { this.isLoading = false }, 1000)))
                .subscribe()
            } else {
              this.tickets.push(item);
              localStorage.setItem('tickets', JSON.stringify(this.tickets));
            }
          })
          localStorage.removeItem('seat');
          this.handleCancel();
        });
    })
  }

  checkSeat(id: any) {
    const seat = this.tickets.find(t => t.seatId === id);
    if (!seat) {
      const s = this.seats.find(s => s.seatId == id);
      if (s.type == 1) {
        return 'yellow';
      } else {
        return 'gray';
      }
    } else {
      if (seat.billId != null) {
        return 'red';
      } else {
        if (seat.creatorUserId == this.user.id) {
          return 'blue';
        } else {
          return 'green';
        }
      }
    }
  }
}