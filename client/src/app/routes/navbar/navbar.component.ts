import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isVisible: boolean = false;
  isCollapsed = false;
  user: User;
  checkUser: boolean = true;
  constructor(
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
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
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.checkUser = Object.keys(this.user).length === 0
    this.isVisible = false;
  }
  
  logout() {
    this.authenticationService.logout();
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.checkUser = Object.keys(this.user).length === 0
  }
}
