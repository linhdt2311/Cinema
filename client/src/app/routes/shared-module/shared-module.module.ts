import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalRoomComponent } from './modal-room/modal-room.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ModalRoomComponent,
  ],
  imports: [
    NzModalModule,
    CommonModule,
    FormsModule,
    NzFormModule,
    NzGridModule,
    NzButtonModule,
  ],
  exports:[
    ModalRoomComponent,
  ],
})
export class SharedModuleModule { }
