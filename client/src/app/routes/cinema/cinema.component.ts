import { Component, OnInit } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { FormatMovieScreen } from 'src/app/helpers/FormatMovieScreen';
import { GetAllShowtimes } from 'src/app/models/getallshowtimes';
import { CinemaService } from 'src/app/services/cinema.service';
import { MovieService } from 'src/app/services/movie.service';
import { ShowtimesService } from 'src/app/services/showtimes.service';
import { DatePipe } from '@angular/common';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {
  isLoading = false;
  showtimes: any[] = [];
  movies: any[] = [];
  cinemas: any[] = [];
  seatInLocal: any[] = [];
  isVisible: boolean = false;
  sId: string = '';
  getAllShowtimes: GetAllShowtimes = new GetAllShowtimes();
  url: any;
  cinemaName: string = '';
  date: any[] = [{ value: new Date() },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 2) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 3) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 4) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 5) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 6) }];
  formatMovieScreen: any[] = [
    { value: FormatMovieScreen.IMAX, viewValue: 'IMAX' },
    { value: FormatMovieScreen.TwoD, viewValue: '2D' },
    { value: FormatMovieScreen.ThreeD, viewValue: '3D' },
    { value: FormatMovieScreen.FourD, viewValue: '4D' }];
  constructor(
    private cinemaService: CinemaService,
    private showtimesService: ShowtimesService,
    private movieService: MovieService,
    private datepipe: DatePipe,
    private ticketService: TicketService,
  ) { }

  ngOnInit(): void {
    this.seatInLocal = JSON.parse(localStorage.getItem('seat') || '[]');
    this.cinemaData();
    this.movieData();
    this.getAllShowtimes.timeStart = new Date();
    this.getAllShowtimes.formatMovieScreen = 1;
  }

  onFilterScreen(format: any) {
    this.isLoading = true;
    this.getAllShowtimes.formatMovieScreen = format;
    this.showtimesData();
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }
  cinemaData(name?: any) {
    this.cinemaName = name;
    this.cinemaService
      .getAllCinema(this.cinemaName)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.cinemas = response;
        this.onChangeSelectCinema(this.cinemas[1])
      })
  }
  onChangeSelectCinema(cinema: any) {
    this.cinemaName = cinema.name;
    this.getAllShowtimes.formatMovieScreen = 2;
    this.getAllShowtimes.cinemaId = cinema.id;
    this.onFilterDate(this.getAllShowtimes.timeStart);
  }

  showModal(id: any): void {
    let showtimeId = id;
    this.seatInLocal.forEach((item) => { showtimeId = item.showtimesId });
    if (showtimeId !== this.sId) {
      localStorage.removeItem('seat');
      const resetseat: any[] = JSON.parse(localStorage.getItem('seat') || '[]');
      resetseat.forEach((item) => {
        this.ticketService
          .deleteTicket(item.seatId)
          .pipe(catchError((err) => of(err)), finalize(() =>
            setTimeout(() => { this.isLoading = false }, 1000)))
          .subscribe()
    })}
    this.sId = id;
    this.isVisible = true;
  }

  onFilterDate(date: any) {
    date = this.datepipe.transform(date, 'YYYY-MM-dd')
    this.getAllShowtimes.timeStart = date;
    this.showtimesData();
  }

  getPoster(id: any) {
    this.url = this.movies.find(p => p.mId == id)?.poster
    if (this.url == '') {
      this.url = 'https://picsum.photos/200/300';
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
  showTimeMovie(movie: any) {
    return this.showtimes.filter(a => a.movieId == movie);
  }
  getDayName(value: Date) {
    return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(value);
  }

  handleSubmit() {
    this.isVisible = false;
  }

  handleCancel() {
    this.isVisible = false;
  }
}