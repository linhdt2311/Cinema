import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  baseUrl = environment.baseUrl + 'account';

  constructor(private http: HttpClient) { }

  login(payload: any): Observable<any> {
    return this.http.post<User>(this.baseUrl + '/login', payload).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
      })
    );
  }
  logout() {
    localStorage.removeItem('user');
    localStorage.clear();
  }
  register(payload: any): Observable<any> {
    return this.http.post(this.baseUrl + '/register', payload);
  }
}
