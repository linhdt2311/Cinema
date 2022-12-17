import { searchPromotion } from './../../../models/promotionDataItem';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, of } from 'rxjs';
import { AccountsDataItem } from 'src/app/models/accountDataItem';
import { Setting } from 'src/app/models/setting';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { ViewAndEditCustomerComponent } from '../../shared-module/view-and-edit-customer/view-and-edit-customer.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-manage-accounts',
  templateUrl: './manage-accounts.component.html',
  styleUrls: ['./manage-accounts.component.css']
})
export class ManageAccountsComponent implements OnInit {
  @ViewChild('account', { static: true }) account: ViewAndEditCustomerComponent;
  title: string = 'create';
  user: User;
  accounts: any[] = [];
  date: any[] =[];
  visible: boolean = false
  setting: Setting;
  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly AccountsDataItem[] = [];
  setOfCheckedId = new Set<string>();
  confirmModal?: NzModalRef;
  mode: string = 'create';
  data: any;
  isEdit: boolean = true;
  search: searchPromotion = new searchPromotion();
  constructor(
    private accountService: AccountService,
    private modal: NzModalService,
    private notification: NzNotificationService,
    private datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.setting = JSON.parse(localStorage.getItem('setting') || '{}');
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.movieData();
  }

  movieData() {
    this.accountService
      .getAllAccount()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.accounts = response;
      })
  }
  onFilterDate(id : any){
    id[0] =  this.datepipe.transform(id[0], 'YYYY-MM-dd') ;
    this.search.startDate =  id[0];
    id[1] =  this.datepipe.transform(id[1], 'YYYY-MM-dd') ;
    this.search.endDate =  id[1];
    this.movieData();
  }

  drop(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.accounts, event.previousIndex, event.currentIndex);
  }

  onCurrentPageDataChange($event: readonly AccountsDataItem[]): void {
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
      this.accounts.splice(this.accounts.findIndex((item) => item.id === data.id), 1, data);
      this.accounts = [...this.accounts];
    } else {
      this.accounts = [data, ...this.accounts];
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
          this.accountService
            .deleteAccount(payload)
            .pipe(catchError((err) => of(err)))
            .subscribe((response) => {
              if (response) {
                this.notification.create('success', 'Successfully!', '');
              } else {
                this.notification.create('error', 'Failed!', '');
              }
            })
          const index = this.accounts.findIndex((item) => item.id == movieId);
          this.accounts.splice(index, 1);
          this.accounts = [...this.accounts];
          setTimeout(null ? resolve : reject, 1000);
        }).catch(() => console.log('Oops errors!'))
    });
  }
}
