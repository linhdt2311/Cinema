import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {
  movies:any[]=[];
  url: any;
  loading = false;
  constructor(
    private movieService: MovieService,
    protected router: Router,
    ) { }

  ngOnInit(): void {
    this.movieData();
  }

  movieData() {
    this.movieService
      .getAllMovie()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.movies = response;
      });
  }
  onClick(): void {
  }
  clear(){
  }
  getPoster(id: any){
    this.url = this.movies.find(p => p.mId == id )?.poster
    if(this.url == ''){
      this.url = 'https://i.pinimg.com/originals/85/9f/52/859f5219ba0b8d67f399c0db5a648694.jpg';
    }
    return this.url
  }
  onViewShowtimes(movieName: string): any {
    this.router.navigate(['movie/', movieName]);
  }
}
