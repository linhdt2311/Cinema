import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {
  baseUrl = environment.baseUrl + 'cinema';

  constructor(private http: HttpClient) { }

  getAllCinema():Observable<any>{
    return this.http.get(this.baseUrl + '/getall');
  }
  searchCinema(payload: any):Observable<any>{
    if(!payload){
      payload='';
    }
    return this.http.get(this.baseUrl + '/search?search='+ payload);
  }
}
