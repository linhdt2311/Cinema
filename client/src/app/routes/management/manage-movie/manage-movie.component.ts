import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, of } from 'rxjs';
import { MoviesDataItem } from 'src/app/models/moviesDataItem';
import { Setting } from 'src/app/models/setting';
import { User } from 'src/app/models/user';
import { MovieService } from 'src/app/services/movie.service';
import { ViewAndEditMovieComponent } from '../../shared-module/view-and-edit-movie/view-and-edit-movie.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { SearchMoive } from 'src/app/models/getallmoive';
@Component({
  selector: 'app-manage-movie',
  templateUrl: './manage-movie.component.html',
  styleUrls: ['./manage-movie.component.css']
})
export class ManageMovieComponent implements OnInit {
  @ViewChild('movie', { static: true }) movie: ViewAndEditMovieComponent;
  title: string = 'create';
  user: User;
  movies: any[] = [];
  movieName: any[] =[];
  date: any[] =[];

  visible: boolean = false
  setting: Setting;
  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly MoviesDataItem[] = [];
  setOfCheckedId = new Set<string>();
  confirmModal?: NzModalRef;
  mode: string = 'create';
  data: any;
  isEdit: boolean = true;
  searchMovie : SearchMoive = new SearchMoive();
  constructor(
    private movieService: MovieService,
    private modal: NzModalService,
    private notification: NzNotificationService,
    private datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.setting = JSON.parse(localStorage.getItem('setting') || '{}');
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.movieData();
  }

  movieData() {
    this.movieService
      .searchMovie(this.searchMovie)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.movies = response;
      })
    // this.movieService
    //   .getAllMovie()
    //   .pipe(catchError((err) => of(err)))
    //   .subscribe((response) => {
    //     this.movies = response;
    //   })
  }

  drop(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
  }

  onCurrentPageDataChange($event: readonly MoviesDataItem[]): void {
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
      this.title = 'Update: ' + this.data.name;
    } else {
      this.title = 'View: ' + this.data.name;
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
      this.movies.splice(this.movies.findIndex((item) => item.id === data.id), 1, data);
      this.movies = [...this.movies];
    } else {
      this.movies = [data, ...this.movies];
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
          this.movieService
            .deleteMovie(payload)
            .pipe(catchError((err) => of(err)))
            .subscribe((response) => {
              if (response) {
                this.notification.create('success', 'Successfully!', '');
              } else {
                this.notification.create('error', 'Failed!', '');
              }
            })
          const index = this.movies.findIndex((item) => item.id == movieId);
          this.movies.splice(index, 1);
          this.movies = [...this.movies];
          setTimeout(null ? resolve : reject, 1000);
        }).catch(() => console.log('Oops errors!'))
    });
  }
  onFilterMovie(id :any){
    this.searchMovie.id =  id;
    this.movieData();
  }
  onFilterDate(id : any){
    id[0] =  this.datepipe.transform(id[0], 'YYYY-MM-dd') ;
    this.searchMovie.startDate =  id[0];
    id[1] =  this.datepipe.transform(id[1], 'YYYY-MM-dd') ;
    this.searchMovie.endDate =  id[1];
    this.movieData();
  }
  Refresh(){
    this.searchMovie = new SearchMoive();
    this.date = [];
    this.movieData();
  }
}
