import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { BillService } from 'src/app/services/bill.service';
import { FoodService } from 'src/app/services/food.service';
import { MovieService } from 'src/app/services/movie.service';
import { SeatService } from 'src/app/services/seat.service';
import { ShowtimesService } from 'src/app/services/showtimes.service';
import { TicketService } from 'src/app/services/ticket.service';
import { ColumnItem } from 'src/app/models/columnItem'
import { DataItem } from 'src/app/models/dataitem';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  bills: any[] = [];
  foods: any[] = [];
  tickets: DataItem[] = [];
  listOfColumns: ColumnItem[] = [
    {
      name: 'Id',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.id.localeCompare(b.id),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [
        { text: 'Joe', value: 'Joe' },
        { text: 'Jim', value: 'Jim' }
      ],
      filterFn: (list: string[], item: DataItem) => list.some(id => item.id.indexOf(id) !== -1)
    },
    {
      name: 'SeatId',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: DataItem, b: DataItem) => a.seatId.localeCompare(b.id),
      filterMultiple: false,
      listOfFilter: [
        { text: 'London', value: 'London' },
        { text: 'Sidney', value: 'Sidney' }
      ],
      filterFn: (seatId: string, item: DataItem) => item.seatId.indexOf(seatId) !== -1
    },
    {
      name: 'Price',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.price - b.price,
      sortDirections: ['ascend', 'descend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
      
    },
  ];
  constructor(
    private billService: BillService,
    private ticketService: TicketService,
    private foodService: FoodService,
    private movieService: MovieService,
    private seatService: SeatService,
    private showtimesService: ShowtimesService,
  ) { }

  ngOnInit(): void {
    this.billData();
    this.billDetailData();
    this.ticketData();
  }

  billData(){
    this.billService
      .getAllBill()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        if(response){
          this.bills = response
        }
      })
  }

  billDetailData(){
    this.billService
      .getAllBillDetail()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        if(response){
          this.foods = response
        }
      })
  }

  ticketData(){
    this.ticketService
      .getAllTicket()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        if(response){
          this.tickets = response
        }
      })
  }
}
