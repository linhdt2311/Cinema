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
@NgModule({
  declarations: [
    ModalRoomComponent,
    LoginComponent,
    FoodComponent,
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
  ],
  exports:[
    ModalRoomComponent,
    LoginComponent,
    FoodComponent,
  ],
})
export class SharedModuleModule { }