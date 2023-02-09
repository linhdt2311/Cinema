import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { GetAllMovie } from 'src/app/models/getallmoive';
import { GetAllShowtimes } from 'src/app/models/getallshowtimes';
import { MovieService } from 'src/app/services/movie.service';
import { ShowtimesService } from 'src/app/services/showtimes.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {
  movies: any[] = [];
  showtimes: any[] = [];
  array = [1, 2, 3, 4];
  loading = false;
  toDate: any;
  fromDate: any;
  date: any[] = [{ value: new Date() },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 2) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 3) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 4) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 5) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 6) },
  { value: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 7) }];
  constructor(
    private movieService: MovieService,
    private router: Router,
    private datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.movieData("now");
  }

  movieData(value: string) {
    this.movies = [];
    if (value === "now") {
      this.toDate = this.datepipe.transform(new Date(), 'YYYY-MM-dd');
      this.fromDate = this.datepipe.transform(new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 8), 'YYYY-MM-dd');
    } else {
      this.toDate = this.datepipe.transform(new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 9), 'YYYY-MM-dd');
      this.fromDate = this.datepipe.transform(new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 18), 'YYYY-MM-dd');
    }
    this.movieService
      .getMovieByTime(this.toDate, this.fromDate)
      .pipe(catchError((err) => of(err)))
      .subscribe((response: any[]) => {
        response.forEach((item) => {
          if (!this.movies.find(m => m.id == item.id)) {
            this.movies.push(item);
          }
        })
      });
  }

  getPoster(id: any) {
    let url = this.movies.find(p => p.id == id)?.poster
    if (url == undefined || url == '') {
      url = 'https://picsum.photos/200/300';
    }
    return url;
  }

  onViewShowtimes(movieId: string): any {
    this.router.navigate(['movie/', movieId]);
  }
}
