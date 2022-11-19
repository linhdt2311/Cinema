import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Setting } from 'src/app/models/setting';
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
  checkSetting: boolean = true;
  setting: Setting;
  isVisible: boolean = false;
  visible = false;
  isCollapsed = false;
  user: User;
  checkUser: boolean = true;
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
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
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    if(this.user.role == 2){
      this.router.navigate(['statistics']);
    }
  }
  
  logout() {
    this.authenticationService.logout();
  }

  refresh(){
    document.location.href = ""
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
}
