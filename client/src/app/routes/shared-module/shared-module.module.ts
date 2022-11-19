import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
@NgModule({
  declarations: [
    ModalRoomComponent,
    LoginComponent,
    FoodComponent,
    SettingComponent,
  ],
  imports: [
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
  ],
  exports:[
    ModalRoomComponent,
    LoginComponent,
    FoodComponent,
    SettingComponent,
  ],
})
export class SharedModuleModule { }
