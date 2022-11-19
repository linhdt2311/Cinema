import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { FormatMovieScreen } from 'src/app/helpers/FormatMovieScreen';
import { GetAllShowtimes } from 'src/app/models/getallshowtimes';
import { CinemaService } from 'src/app/services/cinema.service';
import { MovieService } from 'src/app/services/movie.service';
import { ShowtimesService } from 'src/app/services/showtimes.service';
import { ModalRoomComponent } from '../shared-module/modal-room/modal-room.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {
  @Input() dataList = [];
  @Input() techList: any[] = [];
  @ViewChild('modalRoom', { static: true }) modalRoom!: ModalRoomComponent;
  isLoadingOne = false;
  showtimes: any[] = [];
  txtSearchCinema: any;
  loading: boolean = false;
  showTime:boolean = false;
  movies: any[] = [];
  array = [1, 2, 3, 4];
  cinemas: any[] = [];
  isVisible: boolean = false;
  isCollapsed = false;
  m: any;
  sId: string = '';
  getAllShowtimes: GetAllShowtimes = new GetAllShowtimes();
  url: any;
  tenantList: { value: number, label: string }[] = [];
  date: any[] = [{ value: new Date() },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 2) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 3) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 4) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 5) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 6) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 7) }];
  dayName: { value: Date, label: string }[] = [];
  getTimeNow:any;
  formatMovieScreen: any[] = [{ value: FormatMovieScreen.IMAX, viewValue: 'IMAX' },

  { value: FormatMovieScreen.TwoD, viewValue: '2D' },
  { value: FormatMovieScreen.ThreeD, viewValue: '3D' },
  { value: FormatMovieScreen.FourD, viewValue: '4D' }];
  cinemaList: {id:any;name:string}[] = [];
  selectCinema: any;

  constructor(
    private cinemaService: CinemaService,
    protected router: Router,
    private showtimesService: ShowtimesService,
    private movieService: MovieService,
    private datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.getAllCinema();
    this.movieData();
    this.getDayName();

  }

  onFilterScreen(format: any) {
    this.isLoadingOne = true;
    if(format != null){
      this.getAllShowtimes.formatMovieScreen = format;
      this.showtimesData();
      setTimeout(() => {
        this.isLoadingOne = false;
      }, 1000);
    }
  }
  getTimeForMoive(){
    for(let i =0;i<this.movies.length;i++){
    }
  }
  getAllCinema() {
    this.cinemaList = [];
    this.cinemaService.searchCinema(this.txtSearchCinema).subscribe((res) => {
      //this.surveyTypeList.push(res[0].name);
      let i = res.length;
      if (i > 0) {
        for (let a = 0; a <= i; a++) {
          this.cinemaList=res;
        }
        //this.selectCinema = this.cinemaList[1].name;
        this.onChangeSelectCinema(this.cinemaList[1]);
      }
    })
  }
  onChangeSelectCinema(cinema: any) {
    this.selectCinema = cinema.name;
    this.getAllShowtimes.formatMovieScreen =2 ;
    this.getAllShowtimes.cinemaId = cinema.id;
    this.getTimeNow =new Date();
    this.onFilterDate(this.getTimeNow);
  }
  getDayName() {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = this.date;
    var count = this.date.length;
    for (let i = 0; i < count + 1; i++) {
      var day = d[i].value
      var name = days[day.getDay()];
      this.dayName.push({ value: day, label: name });
    }
    this.showtimesData();

  }
  showModal(id: any): void {
    this.sId = id;
    this.isVisible = true;
  }
  handleSubmit() {
    this.isVisible = false;
  }
  handleCancel() {
    this.isVisible = false;
  }
  onFilterDate(date: any) {
    date = this.datepipe.transform(date, 'yyyy-MM-dd')
    this.getAllShowtimes.timeStart = date;
    this.showtimesData();
  }


  onViewShowtimes(movieId: string): any {
    this.router.navigate(['movie/', movieId]);
  }
  onClick(): void {
  }
  clear() {
  }
  getPoster(id: any) {
    this.url = this.movies.find(p => p.mId == id)?.poster
    if (this.url == '') {
      this.url = 'https://i.pinimg.com/originals/85/9f/52/859f5219ba0b8d67f399c0db5a648694.jpg';
    }
    return this.url
  }
  movieData() {
    this.movieService
      .getAllMovie()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.movies = response;
      });
  }
  showtimesData() {
    this.showtimesService
      .getAllShowtimes(this.getAllShowtimes)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.showtimes = response;
      });

  }
  showTimeMoive(movie:any){
    return this.showtimes.filter(a => a.movieId == movie);
  }
}
