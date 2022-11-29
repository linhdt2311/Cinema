import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { User } from 'src/app/models/user';
import { Setting } from 'src/app/models/setting';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CinemaService } from 'src/app/services/cinema.service';
import { CinemaDataItem } from 'src/app/models/cinemaDataItem';

@Component({
  selector: 'app-manage-cinema',
  templateUrl: './manage-cinema.component.html',
  styleUrls: ['./manage-cinema.component.css']
})
export class ManageCinemaComponent implements OnInit {
  title: string = 'create';
  user: User;
  cinemas: any[] = [];
  visible: boolean = false
  setting: Setting;
  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly CinemaDataItem[] = [];
  setOfCheckedId = new Set<string>();
  confirmModal?: NzModalRef;
  mode: string = 'create';
  data: any;
  isEdit: boolean = true;
  constructor(
    private cinemaService: CinemaService,
    private modal: NzModalService,
    private notification: NzNotificationService,
  ) { }

  ngOnInit(): void {
    this.setting = JSON.parse(localStorage.getItem('setting') || '{}');
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.cinemaData();
  }

  cinemaData() {
    this.cinemaService
      .getAllCinema()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.cinemas = response;
      })
  }

  drop(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.cinemas, event.previousIndex, event.currentIndex);
  }

  onCurrentPageDataChange($event: readonly CinemaDataItem[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  changeEdit() {
    this.isEdit = !this.isEdit;
    if (this.isEdit) {
      this.title = 'Update: ' + this.data.name;
    } else {
      this.title = 'View: ' + this.data.name;
    }
  }

  open(mode: string, data: any) {
    this.mode = mode;
    this.data = data;
    if (mode == 'create') {
      this.title = 'Create Movie';
    } else {
      this.changeEdit()
    }
    this.visible = true;
  }

  close(): void {
    this.isEdit = true;
    this.visible = false;
  }

  submit(data: any) {
    this.isEdit = true;
    this.visible = false;
    if (data.id) {
      this.cinemas.splice(this.cinemas.findIndex((item) => item.id === data.id), 1, data);
      this.cinemas = [...this.cinemas];
    } else {
      this.cinemas = [data, ...this.cinemas];
    }
  }

  showConfirm(movieId: any): void {
    const payload = {
      id: movieId,
      deleterUserId: this.user.id,
    }
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete this movie?',
      nzContent: 'When clicked the OK button, this movie will be deleted system-wide!!!',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.cinemaService
            .deleteCinema(payload)
            .pipe(catchError((err) => of(err)))
            .subscribe((response) => {
              if (response) {
                this.notification.create('success', 'Successfully!', '');
              } else {
                this.notification.create('error', 'Failed!', '');
              }
            })
          const index = this.cinemas.findIndex((item) => item.id == movieId);
          this.cinemas.splice(index, 1);
          this.cinemas = [...this.cinemas];
          setTimeout(null ? resolve : reject, 1000);
        }).catch(() => console.log('Oops errors!'))
    });
  }
}
