import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { FormatMovieScreen } from 'src/app/helpers/FormatMovieScreen';
import { GetAllShowtimes } from 'src/app/models/getallshowtimes';
import { CinemaService } from 'src/app/services/cinema.service';
import { MovieService } from 'src/app/services/movie.service';
import { ShowtimesService } from 'src/app/services/showtimes.service';
import { ModalRoomComponent } from '../../shared-module/modal-room/modal-room.component';

@Component({
  selector: 'app-movie-showtimes',
  templateUrl: './movie-showtimes.component.html',
  styleUrls: ['./movie-showtimes.component.css']
})
export class MovieShowtimesComponent implements OnInit {
  @ViewChild('modalRoom', {static: true}) modalRoom!: ModalRoomComponent;
  showtimes: any[] = [];
  cinemas: any[] = [];
  isVisible: boolean = false;
  movie: any;
  sId: string = '';
  getAllShowtimes: GetAllShowtimes = new GetAllShowtimes();
  date: any[] = [{ value: new Date() },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 2) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 3) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 4) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 5) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 6) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 7) }];
  formatMovieScreen: any[] = [{ value: FormatMovieScreen.IMAX, viewValue: 'IMAX' },
  { value: FormatMovieScreen.TwoD, viewValue: '2D' },
  { value: FormatMovieScreen.ThreeD, viewValue: '3D' },
  { value: FormatMovieScreen.FourD, viewValue: '4D' }];
  constructor(
    private showtimesService: ShowtimesService,
    private movieService: MovieService,
    private cinemaService: CinemaService,
    private router: Router,
    private route: ActivatedRoute,
    private datepipe: DatePipe
    ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.getAllShowtimes.movieId = params['id'];
    })
    this.showtimesData();
    this.movieData();
    this.cinemaData();
  }

  showtimesData() {
    this.showtimesService
      .getAllShowtimes(this.getAllShowtimes)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.showtimes = response;
      });
  }

  movieData() {
    this.movieService
      .getAllMovie()
      .pipe(catchError((err) => of(err)))
      .subscribe((response: any[]) => {
        this.movie = response.find(m => m.id == this.getAllShowtimes.movieId);
      });
  }

  cinemaData() {
    this.cinemaService
      .getAllCinema()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.cinemas = response;
      });
  }

  openViewBookSeat(showtimesId: string) {
    this.router.navigate(['movie/showtimes/', showtimesId]);
  }

  onFilterCinema(cinema: any){
    this.getAllShowtimes.cinemaId = cinema;
    this.showtimesData();
  }

  onFilterDate(date: any){
    date = this.datepipe.transform(date, 'YYYY-MM-dd')
    this.getAllShowtimes.timeStart = date;
    this.showtimesData();
  }
  
  onFilterScreen(format: any){
    this.getAllShowtimes.formatMovieScreen = format;
    this.showtimesData();
  }

  showModal(id: any): void {
    this.sId = id;
    this.isVisible = true;
  }

  handleSubmit(){
    this.isVisible = false;
  }

  handleCancel(){
    this.isVisible = false;
  }
}
