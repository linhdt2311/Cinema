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

  getAllMovie():Observable<any>{
    return this.http.get(this.baseUrl + '/getall');
  }
  getthebestmovie(payload: any):Observable<any>{
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
