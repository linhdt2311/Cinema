import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MovieService {
  baseUrl = environment.baseUrl + 'movie';
  constructor(private http: HttpClient) { }

  getAllMovie(payload?: any):Observable<any>{
    if(payload){
      let todate, fromdate, country,director, name
      name = payload.name ? 'name=' + payload.name : ''
      country = payload.country ? '&country=' + payload.country : ''
      director = payload.director ? '&director=' + payload.director : ''
      todate = payload.todate ? '&toDate=' + payload.todate :   ''
      fromdate = payload.fromdate ? '&fromDate=' + payload.fromdate :  ''
      return this.http.get(this.baseUrl + '/getall?' + name + country + director + todate +fromdate);
    } else {
      return this.http.get(this.baseUrl + '/getall');
    }
  }
  searchMovie(payload?: any):Observable<any>{
    if(!payload.id){
      payload.id = ['00000000-0000-0000-0000-000000000000'];
    }
    return this.http.post(this.baseUrl + '/search',payload);
  }
  getTheBestMovie(payload: any):Observable<any>{
    return this.http.get(this.baseUrl + '/getthebestmovie?bestOrWorst='+ payload);
  }
  createMovie(payload:any):Observable<any>{
    return this.http.post(this.baseUrl + '/create', payload);
  }
  updateMovie(payload:any):Observable<any>{
    return this.http.put(this.baseUrl + '/update', payload);
  }
  deleteMovie(payload:any):Observable<any>{
    return this.http.delete(this.baseUrl + '/delete?deleterUserId=' + payload.deleterUserId + '&id=' + payload.id);
  }
}
