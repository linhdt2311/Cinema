import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SearchShowTime } from '../models/getallshowtimes';

@Injectable({
  providedIn: 'root'
})
export class ShowtimesService {
  baseUrl = environment.baseUrl + 'showtimes';

  constructor(private http: HttpClient) { }

  getAllShowtimes(payload?: any): Observable<any> {
    if(payload){
      let id, movieId, timeStart, formatMovieScreen, cinemaId
      id = payload.id ? 'showtimesId=' + payload.id : ''
      movieId = payload.movieId ? '&movieId=' + payload.movieId : ''
      timeStart = payload.timeStart ? '&timeStart=' + payload.timeStart : ''
      formatMovieScreen = payload.formatMovieScreen ? '&formatMovieScreen=' + payload.formatMovieScreen : ''
      cinemaId = payload.cinemaId ? '&cinemaId=' + payload.cinemaId : ''
      return this.http.get(this.baseUrl + '/getall?' + id + movieId + timeStart + formatMovieScreen + cinemaId);
    } else {
      return this.http.get(this.baseUrl + '/getall');
    }
  }
  searchShowTime(payload: any): Observable<any> {
      if(!payload.cinemaId){
        payload.cinemaId = ['00000000-0000-0000-0000-000000000000'];
      }
      if(!payload.roomId){
        payload.roomId = ['00000000-0000-0000-0000-000000000000'];
      }
      return this.http.post('https://localhost:5001/api/showtimes/search?' ,payload );
  }
  getTheBestTime():Observable<any>{
    return this.http.get(this.baseUrl + '/getthebesttime');
  }
  createShowtimes(payload: any): Observable<any> {
    return this.http.post(this.baseUrl + '/create', payload);
  }
  updateShowtimes(payload: any): Observable<any> {
    return this.http.put(this.baseUrl + '/update', payload);
  }
  deleteShowtimes(payload: any): Observable<any> {
    return this.http.delete(this.baseUrl + '/delete', payload);
  }
}
