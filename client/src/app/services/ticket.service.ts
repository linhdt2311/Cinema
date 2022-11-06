import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  baseUrl = environment.baseUrl + 'ticket';

  constructor(private http: HttpClient) { }

  getAllTicket(payload?: any): Observable<any> {
    return this.http.get(this.baseUrl + '/getall?' + payload);
  }
  createTicket(payload: any): Observable<any> {
    return this.http.post(this.baseUrl + '/create', payload);
  }
  updateTicket(payload: any): Observable<any> {
    return this.http.put(this.baseUrl + '/update', payload);
  }
  deleteTicket(payload: any): Observable<any> {
    return this.http.delete(this.baseUrl + '/delete', payload);
  }
}
