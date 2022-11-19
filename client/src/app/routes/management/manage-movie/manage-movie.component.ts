import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { MoviesDataItem } from 'src/app/models/moviesDataItem';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-manage-movie',
  templateUrl: './manage-movie.component.html',
  styleUrls: ['./manage-movie.component.css']
})
export class ManageMovieComponent implements OnInit {
  movies: any[] = [];
  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly MoviesDataItem[] = [];
  setOfCheckedId = new Set<string>();
  constructor(
    private movieService: MovieService,
  ) { }

  ngOnInit(): void {
    this.movieData();
  }

  movieData(){
    this.movieService
      .getAllMovie()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.movies = response;
      })
  }

  onCurrentPageDataChange($event: readonly MoviesDataItem[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }
}
