import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { FormatMovieScreen } from 'src/app/helpers/FormatMovieScreen';
import { GetAllShowtimes } from 'src/app/models/getallshowtimes';
import { CinemaService } from 'src/app/services/cinema.service';
import { MovieService } from 'src/app/services/movie.service';
import { ShowtimesService } from 'src/app/services/showtimes.service';

@Component({
  selector: 'app-movie-showtimes',
  templateUrl: './movie-showtimes.component.html',
  styleUrls: ['./movie-showtimes.component.css']
})
export class MovieShowtimesComponent implements OnInit {
  showtimes: any[] = [];
  movies: any[] = [];
  cinemas: any[] = [];
  m: any;
  getAllShowtimes: GetAllShowtimes = new GetAllShowtimes();
  date: any[] = [{ value: new Date() },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 2) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 3) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 4) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 5) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 6) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 7) }];
  formatMovieScreen: any[] = [{ value: FormatMovieScreen.IMax, viewValue: 'IMAX' },
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
      this.getAllShowtimes.movieName = params['m'];
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
      .subscribe((response) => {
        this.movies = response;
        this.m = this.movies.find(m => m.name == this.getAllShowtimes.movieName)
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
}
