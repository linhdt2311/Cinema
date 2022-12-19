import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  baseUrl = environment.baseUrl + 'account';

  constructor(private http: HttpClient) { }

  login(payload: any, checkRemember: boolean): Observable<any> {
    return this.http.post<User>(this.baseUrl + '/login', payload).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          if (checkRemember) {
            localStorage.setItem('user', JSON.stringify(user));
          } else {
            sessionStorage.setItem('user', JSON.stringify(user));
          }
        }
      })
    );
  }
  logout() {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
  }
  register(payload: any): Observable<any> {
    return this.http.post(this.baseUrl + '/register', payload);
  }
}
