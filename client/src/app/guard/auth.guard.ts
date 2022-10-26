import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authenticationService: AuthenticationService, 
    private notification: NzNotificationService,
    private router: Router) {}
  canActivate(): Observable<boolean> {
    return this.authenticationService.currentUser.pipe(
      map(user => {
        if(user) {
          return true;
        }
        else {
            this.notification.create('warning', 'Login success!', '');
          this.router.navigateByUrl('login');
          return false;
        }
      })
    );
  }

}

