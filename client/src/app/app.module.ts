import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoomComponent } from './routes/room/room.component';
import { NavbarComponent } from './routes/navbar/navbar.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MovieComponent } from './routes/movie/movie.component';
import { LoginComponent } from './routes/login/login.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
@NgModule({
  declarations: [
    AppComponent,
    RoomComponent,
    NavbarComponent,
    MovieComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NzButtonModule,
    NzLayoutModule,
    NzMenuModule,
    NzFormModule,
    FormsModule,
    ReactiveFormsModule,
    NzCardModule,
    NzPageHeaderModule,
    NzBreadCrumbModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
