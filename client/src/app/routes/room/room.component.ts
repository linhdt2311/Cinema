import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  rooms: any;
  constructor(
    private roomService: RoomService,
  ) { }

  ngOnInit(): void {
    this.roomData();
  }

  roomData() {
    this.roomService
      .getAllRoom()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.rooms = response;
      });
  }

}
