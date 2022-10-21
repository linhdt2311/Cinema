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
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

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
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzLayoutModule,
    NzMenuModule,
    NzFormModule,
    NzCardModule,
    NzPageHeaderModule,
    NzBreadCrumbModule,
    NzPaginationModule,
    NzToolTipModule,
    NzAvatarModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
