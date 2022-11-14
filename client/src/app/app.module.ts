import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './routes/navbar/navbar.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MovieComponent } from './routes/movie/movie.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { PageNotFoundComponent } from './routes/page-not-found/page-not-found.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { MovieShowtimesComponent } from './routes/movie/movie-showtimes/movie-showtimes.component';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { SharedModuleModule } from './routes/shared-module/shared-module.module';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { CinemaComponent } from './routes/cinema/cinema.component';
import { MembershipComponent } from './routes/membership/membership.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MovieComponent,
    PageNotFoundComponent,
    MovieShowtimesComponent,
    CinemaComponent,
    MembershipComponent,
  ],
  imports: [
    BrowserModule,
    SharedModuleModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
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
    NzGridModule,
    NzImageModule,
    NzModalModule,
    NzNotificationModule,
    NzTableModule,
    NzAffixModule,
    NzDividerModule,
    NzCarouselModule,
    NzDatePickerModule,
  ],
  providers: [
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
