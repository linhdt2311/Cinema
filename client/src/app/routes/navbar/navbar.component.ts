import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LoginComponent } from '../shared-module/login/login.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild('modalLogin', {static: true}) modalLogin!: LoginComponent;
  isVisible: boolean = false;
  isCollapsed = false;
  user: User;
  checkUser: boolean = true;
  constructor(
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
  }

  ngDoCheck() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.checkUser = Object.keys(this.user).length === 0
  }
  
  openLogin(){
    this.isVisible = true;
  }
  
  handleCancel(){
    this.isVisible = false;
  }

  handleSumit(){
    this.isVisible = false;
  }
  
  logout() {
    this.authenticationService.logout();
  }
}
