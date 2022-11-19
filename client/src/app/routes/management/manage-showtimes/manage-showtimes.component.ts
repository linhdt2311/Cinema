import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { ShowtimesDataItem } from 'src/app/models/showtimesDataItem';
import { ShowtimesService } from 'src/app/services/showtimes.service';

@Component({
  selector: 'app-manage-showtimes',
  templateUrl: './manage-showtimes.component.html',
  styleUrls: ['./manage-showtimes.component.css']
})
export class ManageShowtimesComponent implements OnInit {
  showtimes: any[] = [];
  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly ShowtimesDataItem[] = [];
  setOfCheckedId = new Set<string>();
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

  onCurrentPageDataChange($event: readonly ShowtimesDataItem[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }
}
