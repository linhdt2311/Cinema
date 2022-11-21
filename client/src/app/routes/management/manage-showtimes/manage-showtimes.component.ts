import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, of } from 'rxjs';
import { Setting } from 'src/app/models/setting';
import { ShowtimesDataItem } from 'src/app/models/showtimesDataItem';
import { User } from 'src/app/models/user';
import { ShowtimesService } from 'src/app/services/showtimes.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ViewAndEditShowtimesComponent } from '../../shared-module/view-and-edit-showtimes/view-and-edit-showtimes.component';
import { MovieService } from 'src/app/services/movie.service';
import { CinemaService } from 'src/app/services/cinema.service';
import { RoomService } from 'src/app/services/room.service';
import { FormatMovieScreen } from 'src/app/helpers/FormatMovieScreen';

@Component({
  selector: 'app-manage-showtimes',
  templateUrl: './manage-showtimes.component.html',
  styleUrls: ['./manage-showtimes.component.css']
})
export class ManageShowtimesComponent implements OnInit {
  @ViewChild('showtimes', { static: true }) showtime: ViewAndEditShowtimesComponent;
  title: string = 'create';
  user: User;
  showtimes: any[] = [];
  movies: any[] = [];
  cinemas: any[] = [];
  rooms: any[] = [];
  visible: boolean = false
  setting: Setting;
  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly ShowtimesDataItem[] = [];
  setOfCheckedId = new Set<string>();
  confirmModal?: NzModalRef;
  mode: string = 'create';
  data: any;
  isEdit: boolean = true;
  formatMovieScreen: any[] = [{ value: FormatMovieScreen.IMAX, viewValue: 'IMAX' },
  { value: FormatMovieScreen.TwoD, viewValue: '2D' },
  { value: FormatMovieScreen.ThreeD, viewValue: '3D' },
  { value: FormatMovieScreen.FourD, viewValue: '4D' }];
  constructor(
    private showtimesService: ShowtimesService,
    private movieService: MovieService,
    private cinemaService: CinemaService,
    private roomService: RoomService,
    private modal: NzModalService,
    private notification: NzNotificationService,
  ) { }

  ngOnInit(): void {
    this.setting = JSON.parse(localStorage.getItem('setting') || '{}');
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.showtimesData();
    this.movieData();
    this.cinemaData();
    this.roomData();
  }

  showtimesData() {
    this.showtimesService
      .getAllShowtimes()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.showtimes = response;
      })
  }

  movieData() {
    this.movieService
      .getAllMovie()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.movies = response;
      })
  }

  cinemaData() {
    this.cinemaService
      .getAllCinema()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.cinemas = response;
      })
  }

  roomData() {
    this.roomService
      .getAllRoom()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.rooms = response;
      })
  }

  getMovieName(id: any){
    return this.movies.find(m => m.id === id)?.name;
  }

  getCinemaName(id: any){
    return this.cinemas.find(c => c.id === id)?.name;
  }

  getRoomName(id: any){
    return this.rooms.find(r => r.id === id)?.name;
  }

  getFormatName(value: any){
    return this.formatMovieScreen.find(f => f.value === value).viewValue
  }

  drop(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.showtimes, event.previousIndex, event.currentIndex);
  }

  onCurrentPageDataChange($event: readonly ShowtimesDataItem[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  changeEdit() {
    this.isEdit = !this.isEdit;
    if (this.isEdit) {
      this.title = 'Update: ' + this.getMovieName(this.data.movieId);
    } else {
      this.title = 'View: ' + this.getMovieName(this.data.movieId);
    }
  }

  open(mode: string, data: any) {
    this.mode = mode;
    this.data = data;
    if (mode == 'create') {
      this.title = 'Create Movie';
    } else {
      this.changeEdit()
    }
    this.visible = true;
  }

  close(): void {
    this.isEdit = true;
    this.visible = false;
  }

  submit(data: any) {
    this.isEdit = true;
    this.visible = false;
    if (data.id) {
      this.showtimes.splice(this.showtimes.findIndex((item) => item.id === data.id), 1, data);
      this.showtimes = [...this.showtimes];
    } else {
      this.showtimes = [data, ...this.showtimes];
    }
  }

  showConfirm(movieId: any): void {
    const payload = {
      id: movieId,
      deleterUserId: this.user.id,
    }
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete this movie?',
      nzContent: 'When clicked the OK button, this movie will be deleted system-wide!!!',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.showtimesService
            .deleteShowtimes(payload)
            .pipe(catchError((err) => of(err)))
            .subscribe((response) => {
              if (response) {
                this.notification.create('success', 'Successfully!', '');
              } else {
                this.notification.create('error', 'Failed!', '');
              }
            })
          const index = this.showtimes.findIndex((item) => item.id == movieId);
          this.showtimes.splice(index, 1);
          this.showtimes = [...this.showtimes];
          setTimeout(null ? resolve : reject, 1000);
        }).catch(() => console.log('Oops errors!'))
    });
  }
}
