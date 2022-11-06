import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.baseUrl + 'account';

  constructor(private http: HttpClient) { }

  getAllAccount(payload?: any): Observable<any> {
    return this.http.get(this.baseUrl + '/getall?' + payload);
  }
  createAccount(payload: any): Observable<any> {
    return this.http.post(this.baseUrl + '/create', payload);
  }
  updateAccount(payload: any): Observable<any> {
    return this.http.put(this.baseUrl + '/update', payload);
  }
  deleteAccount(payload: any): Observable<any> {
    return this.http.delete(this.baseUrl + '/delete', payload);
  }
}
