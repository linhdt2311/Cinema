import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, of } from 'rxjs';
import { RoomService } from 'src/app/services/room.service';
import { SeatService } from 'src/app/services/seat.service';
import { ShowtimesService } from 'src/app/services/showtimes.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  rooms: any[] = [];
  showtimes: any[] = [];
  seats: any[] = [];
  seat: any;
  showtimesId: string = '';
  cinemaId: string = '';
  constructor(
    private seatService: SeatService,
    private roomService: RoomService,
    private showtimesService: ShowtimesService,
    protected route: ActivatedRoute,
    ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.showtimesId = params['id'];
    })
    //this.roomData();
    this.seatData();
  }

  roomData() {
    this.roomService
      .getAllRoom('9ba19cad-c5ba-4a46-b4a6-125222e70ab5')
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.rooms = response;
      });
  }

  seatData(){
    this.seatService
      .getAllSeat(this.showtimesId)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.seats = response;
      });
  }

  seatInfo(id: any){
    this.seat = this.seats.find(s => s.seatId === id)
    console.log(this.seat)
    return this.seat
  }

  // showtimesData() {
  //   this.showtimesService
  //     .getAllShowtimes(showtimesId)
  //     .pipe(catchError((err) => of(err)))
  //     .subscribe((response) => {
  //       this.showtimes = response;
  //     });
  // }

}
