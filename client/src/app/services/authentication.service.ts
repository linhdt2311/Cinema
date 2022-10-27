import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, ReplaySubject, subscribeOn } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  baseUrl = environment.baseUrl + 'account';
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(payload: any):Observable<any>{
    return this.http.post<User>(this.baseUrl + '/login', payload).pipe(
      map((response: User) => {
        const user = response;
        if(user) {
          this.setCurrentUser(user);
        }
      })
      );
    }
    setCurrentUser(user: User) {
      localStorage.setItem('user', JSON.stringify(user));
      //this.currentUserSource.next(user);
  }
  logout() {
    localStorage.removeItem('user');
    //this.currentUserSource.next(null);
  }
  register(payload:any):Observable<any>{
    return this.http.post(this.baseUrl + '/register', payload);
  }
}
