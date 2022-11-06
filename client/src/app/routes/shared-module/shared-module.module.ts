import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalRoomComponent } from './modal-room/modal-room.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    ModalRoomComponent,
    LoginComponent,
  ],
  imports: [
    NzModalModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzGridModule,
    NzButtonModule,
  ],
  exports:[
    ModalRoomComponent,
    LoginComponent,
  ],
})
export class SharedModuleModule { }
