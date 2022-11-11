import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  baseUrl = environment.baseUrl + 'food';

  constructor(private http: HttpClient) { }

  getAllFood(payload: any): Observable<any> {
    let cinemaId, name, size
    cinemaId = payload.cinemaId ? 'cinemaId=' + payload.cinemaId : ''
    name = payload.name ? '&name=' + payload.name : ''
    size = payload.size ? '&size=' + payload.size : ''
    return this.http.get(this.baseUrl + '/getall?' + cinemaId + name + size);
  }
  createFood(payload: any): Observable<any> {
    return this.http.post(this.baseUrl + '/create', payload);
  }
  updateFood(payload: any): Observable<any> {
    return this.http.put(this.baseUrl + '/update', payload);
  }
  deleteFood(payload: any): Observable<any> {
    return this.http.delete(this.baseUrl + '/delete', payload);
  }
}
