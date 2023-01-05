import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { GetAllMovie } from 'src/app/models/getallmoive';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {
  movies: any[] = [];
  array = [1, 2, 3, 4];
  url: any;
  loading = false;
  getAllMovie: GetAllMovie = new GetAllMovie();
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
    if (value === "now") {
      this.getAllMovie.todate = this.datepipe.transform(new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 7), 'YYYY-MM-dd');
      this.getAllMovie.fromdate = this.datepipe.transform(new Date(), 'YYYY-MM-dd');
    } else {
      this.getAllMovie.todate  = this.datepipe.transform(new Date(), 'YYYY-MM-dd');
      this.getAllMovie.fromdate = this.datepipe.transform(new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 7), 'YYYY-MM-dd');
    }
    this.movieService
      .getAllMovie(this.getAllMovie)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.movies = response;
      });
  }

  getPoster(id: any) {
    this.url = this.movies.find(p => p.mId == id)?.poster
    if (this.url == '') {
      this.url = 'https://picsum.photos/200/300';
    }
    return this.url
  }
  onViewShowtimes(movieId: string): any {
    this.router.navigate(['movie/', movieId]);
  }
}
