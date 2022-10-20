import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  baseUrl = environment.baseUrl + 'room';

  constructor(private http: HttpClient) { }

  getAllRoom():Observable<any>{
    return this.http.get(this.baseUrl + '/getall');
   }
  createRoom(payload:any):Observable<any>{
    return this.http.post(this.baseUrl + '/create', payload);
  }
}
