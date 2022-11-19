import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { ShowtimesService } from 'src/app/services/showtimes.service';

@Component({
  selector: 'app-manage-showtimes',
  templateUrl: './manage-showtimes.component.html',
  styleUrls: ['./manage-showtimes.component.css']
})
export class ManageShowtimesComponent implements OnInit {
  showtimes: any[] = [];
  
  constructor(
    private showtimesService: ShowtimesService,
  ) { }

  ngOnInit(): void {
    this.showtimesData();
  }

  showtimesData(){
    this.showtimesService
      .getAllShowtimes()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.showtimes = response;
      })
  }
}
