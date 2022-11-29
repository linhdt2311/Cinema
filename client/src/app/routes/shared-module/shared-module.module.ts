import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { ModalRoomComponent } from './modal-room/modal-room.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { FoodComponent } from './food/food.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { SettingComponent } from './setting/setting.component';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ViewAndEditMovieComponent } from './view-and-edit-movie/view-and-edit-movie.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
import { ViewAndEditShowtimesComponent } from './view-and-edit-showtimes/view-and-edit-showtimes.component';
import { ViewAndEditCustomerComponent } from './view-and-edit-customer/view-and-edit-customer.component';
import { ViewAndEditPromotionComponent } from './view-and-edit-promotion/view-and-edit-promotion.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { ViewAndEditFoodComponent } from './view-and-edit-food/view-and-edit-food.component';
registerLocaleData(en);

@NgModule({
  declarations: [
    ModalRoomComponent,
    LoginComponent,
    FoodComponent,
    SettingComponent,
    ViewAndEditMovieComponent,
    ViewAndEditShowtimesComponent,
    ViewAndEditCustomerComponent,
    ViewAndEditPromotionComponent,
    ViewAndEditFoodComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzModalModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzGridModule,
    NzButtonModule,
    NzTableModule,
    NzInputNumberModule,
    NzToolTipModule,
    NzTabsModule,
    NzSelectModule,
    NzSliderModule,
    NzSwitchModule,
    NzDrawerModule,
    NzDatePickerModule,
    NzSpaceModule,
    NzInputModule,
    NzCardModule,
  ],
  exports:[
    ModalRoomComponent,
    LoginComponent,
    FoodComponent,
    SettingComponent,
    ViewAndEditMovieComponent,
    ViewAndEditShowtimesComponent,
    ViewAndEditCustomerComponent,
    ViewAndEditPromotionComponent,
    ViewAndEditFoodComponent,
  ],
  providers: [
    DatePipe,
    { provide: NZ_I18N, useValue: en_US },
  ],
})
export class SharedModuleModule { }
