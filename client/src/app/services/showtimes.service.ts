import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShowtimesService {
  baseUrl = environment.baseUrl + 'showtimes';

  constructor(private http: HttpClient) { }

  getAllShowtimes(payload: any):Observable<any>{
    let movieName, timeStart, formatMovieScreen, cinemaId
    movieName = payload.movieName ? 'movieName=' + payload.movieName : ''
    timeStart = payload.timeStart ? '&timeStart=' + payload.timeStart : ''
    formatMovieScreen = payload.formatMovieScreen ? '&formatMovieScreen=' + payload.formatMovieScreen : ''
    cinemaId = payload.cinemaId ? '&cinemaId=' + payload.cinemaId : ''
    return this.http.get(this.baseUrl + '/getall?' + movieName + timeStart + formatMovieScreen + cinemaId);
   }
  createShowtimes(payload:any):Observable<any>{
    return this.http.post(this.baseUrl + '/create', payload);
  }
  updateShowtimes(payload:any):Observable<any>{
    return this.http.put(this.baseUrl + '/update', payload);
  }
  deleteShowtimes(payload:any):Observable<any>{
    return this.http.delete(this.baseUrl + '/delete', payload);
  }
}
