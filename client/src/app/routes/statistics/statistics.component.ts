import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { BillService } from 'src/app/services/bill.service';
import { FoodService } from 'src/app/services/food.service';
import { MovieService } from 'src/app/services/movie.service';
import { SeatService } from 'src/app/services/seat.service';
import { ShowtimesService } from 'src/app/services/showtimes.service';
import { TicketService } from 'src/app/services/ticket.service';
import { AccountService } from 'src/app/services/account.service';
import { DatePipe } from '@angular/common';
import { CinemaService } from 'src/app/services/cinema.service';
import { Size } from 'src/app/helpers/Size';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  bills: any[] = [];
  foods: any[] = [];
  billDetails: any[] = [];
  movies: any[] = [];
  seats: any[] = [];
  showtimes: any[] = [];
  accounts: any[] = [];
  tickets: any[] = [];
  cinemas: any[] = [];
  topCustomer: any[] = [];
  size: any[] = [
    { value: Size.S, viewValue: 'S' },
    { value: Size.M, viewValue: 'M' },
    { value: Size.L, viewValue: 'L' }];
  countMoneyBill: number = 0;
  bestFood: any;
  worstFood: any;
  bestMovie: any;
  worstMovie: any;
  bestCinema: any;
  worstCinema: any;
  bestTime: any;
  constructor(
    private billService: BillService,
    private ticketService: TicketService,
    private foodService: FoodService,
    private movieService: MovieService,
    private seatService: SeatService,
    private showtimesService: ShowtimesService,
    private accountService: AccountService,
    private cinemaService: CinemaService,
    private datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.cinemaData();
    this.billData();
    this.billDetailData();
    this.foodData();
    this.getTheBestMovie();
    this.getTheWorstMovie();
    this.getTheBestCinema();
    this.getTheWorstCinema();
    this.getTheBestTime();
    this.getTopCustomer();
    // this.ticketData();
    this.accountData();
    // this.movieData();
    // this.showtimesData();
  }

  billData() {
    this.billService
      .getAllBill()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        if (response) {
          this.bills = response;
          this.countMoneyBillForMonth();
        }
      })
  }

  billDetailData() {
    this.billService
      .getAllBillDetail()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        if (response) {
          this.billDetails = response;
        }
      })
  }

  cinemaData() {
    this.cinemaService
      .getAllCinema()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        if (response) {
          this.cinemas = response;
        }
      })
  }

  ticketData() {
    this.ticketService
      .getAllTicket()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        if (response) {
          this.tickets = response;
        }
      })
  }

  foodData() {
    this.foodService
      .getAllFood()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        if (response) {
          this.foods = response;
          this.getBestnWorstFood();
        }
      })
  }

  movieData() {
    this.movieService
      .getAllMovie()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        if (response) {
          this.movies = response;
        }
      })
  }

  seatData(id: any) {
    this.seatService
      .getAllSeatByTicket(id)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        if (response) {
          this.seats = response;
        }
      })
  }

  showtimesData() {
    this.showtimesService
      .getAllShowtimes()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        if (response) {
          this.showtimes = response;
        }
      })
  }

  accountData() {
    this.accountService
      .getAllAccount()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        if (response) {
          this.accounts = response;
        }
      })
  }

  countMoneyBillForMonth() {
    this.bills.forEach(b => {
      if (this.datepipe.transform(b.creationTime, 'MM') == this.datepipe.transform(new Date(), 'MM')){
        this.countMoneyBill += b.cost;
      }
    });
  }

  getBestnWorstFood() {
    const A = [{ foodId: "0", count: 0 }];
    A.shift();
    this.foods.forEach(f => {
      let count = 0;
      const food = this.billDetails.filter(b => b.foodId == f.id);
      food.forEach(x => {count += x.quantity;})
      A.push({ foodId: f.id, count: count });
    })
    let countBestFood = 0;
    for (let i = 0; i < A.length; i++) {
      if(countBestFood < A[i].count){
        countBestFood = A[i].count;
        this.bestFood = A[i].foodId;
      }
    }
    let countWorstFood = Infinity;
    for (let i = 0; i < A.length; i++) {
      if(countWorstFood > A[i].count){
        countWorstFood = A[i].count;
        this.worstFood = A[i].foodId;
      }
    }
  }

  getFoodName(id: any){
    return this.foods.find(f => f.id === id)?.name + ' size ' + this.getSize(this.foods.find(f => f.id === id)?.size);
  }

  getSize(size: any){
    return this.size.find(f => f.value === size)?.viewValue;
  }

  getTheBestMovie() {
    this.movieService
      .getthebestmovie('true')
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        if (response) {
          this.bestMovie = response.name;
        }
      })
  }

  getTheWorstMovie() {
    this.movieService
      .getthebestmovie('false')
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        if (response) {
          this.worstMovie = response.name;
        }
      })
  }

  getTheBestCinema() {
    this.cinemaService
      .getthebestcinema('true')
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        if (response) {
          this.bestCinema = response.name;
        }
      })
  }

  getTheWorstCinema() {
    this.cinemaService
      .getthebestcinema('false')
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        if (response) {
          this.worstCinema = response.name;
        }
      })
  }

  getTheBestTime() {
    this.showtimesService
      .getthebesttime()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        if (response) {
          this.bestTime = response.name;
        }
      })
  }

  getTopCustomer(){
    this.accountService
      .getTopAccount()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        if (response) {
          this.topCustomer = response;
        }
      })
  }

  drop(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.topCustomer, event.previousIndex, event.currentIndex);
  }

  changeToMoney(value: any){
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'VND' }).format(value);
  }

  getRankCustomer(name: any ){
    return this.accounts.find(a => a.name == name)?.point;
  }
}
