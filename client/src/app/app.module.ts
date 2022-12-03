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
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { StatisticsComponent } from './routes/statistics/statistics.component';
import { ManagementComponent } from './routes/management/management.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ManageMovieComponent } from './routes/management/manage-movie/manage-movie.component';
import { ManageShowtimesComponent } from './routes/management/manage-showtimes/manage-showtimes.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { registerLocaleData } from '@angular/common';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { DragDropModule } from '@angular/cdk/drag-drop';
import en from '@angular/common/locales/en';
import { NZ_I18N, en_US, NzI18nService } from 'ng-zorro-antd/i18n';
import { SupportComponent } from './routes/support/support.component';
import { ManageAccountsComponent } from './routes/management/manage-accounts/manage-accounts.component';
import { ManageFoodDrinkComponent } from './routes/management/manage-food-drink/manage-food-drink.component';
import { ManagePromotionComponent } from './routes/management/manage-promotion/manage-promotion.component';
import { ManageCinemaComponent } from './routes/management/manage-cinema/manage-cinema.component';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
registerLocaleData(en);
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MovieComponent,
    PageNotFoundComponent,
    MovieShowtimesComponent,
    CinemaComponent,
    MembershipComponent,
    StatisticsComponent,
    ManagementComponent,
    ManageMovieComponent,
    ManageShowtimesComponent,
    SupportComponent,
    ManageAccountsComponent,
    ManageFoodDrinkComponent,
    ManageCinemaComponent,
    ManagePromotionComponent,
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
    NzInputModule,
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
    NzSpaceModule,
    NzTabsModule,
    NzSelectModule,
    NzSliderModule,
    NzInputNumberModule,
    NzSwitchModule,
    NzDrawerModule,
    DragDropModule,
    NzStatisticModule,
    NzTypographyModule,
  ],
  providers: [
    DatePipe,
    { provide: NZ_I18N, useValue: en_US },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
