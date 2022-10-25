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

  getAllShowtimes():Observable<any>{
    return this.http.get(this.baseUrl + '/getall');
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
