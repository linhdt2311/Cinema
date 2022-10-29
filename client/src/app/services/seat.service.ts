import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeatService {
  baseUrl = environment.baseUrl + 'seat';

  constructor(private http: HttpClient) { }

  getAllSeat(payload: any):Observable<any>{
    return this.http.get(this.baseUrl + '/getall?showtimesId=' + payload);
  }
}
