import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, of } from 'rxjs';
import { Setting } from 'src/app/models/setting';
import { User } from 'src/app/models/user';
import { PromotionService } from 'src/app/services/promotion.service';
import { ViewAndEditPromotionComponent } from '../../shared-module/view-and-edit-promotion/view-and-edit-promotion.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { PromotionDataItem, searchPromotion } from 'src/app/models/promotionDataItem';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-manage-promotion',
  templateUrl: './manage-promotion.component.html',
  styleUrls: ['./manage-promotion.component.css']
})
export class ManagePromotionComponent implements OnInit {
  @ViewChild('promotion', { static: true }) movie: ViewAndEditPromotionComponent;
  title: string = 'create';
  user: User;
  promotions: any[] = [];
  visible: boolean = false
  setting: Setting;
  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly PromotionDataItem[] = [];
  setOfCheckedId = new Set<string>();
  confirmModal?: NzModalRef;
  mode: string = 'create';
  data: any;
  date: any[] =[];
  search: searchPromotion = new searchPromotion();
  isEdit: boolean = true;
  discount:any;
  constructor(
    private promotionService: PromotionService,
    private modal: NzModalService,
    private notification: NzNotificationService,
    private datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.setting = JSON.parse(localStorage.getItem('setting') || '{}');
    this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    this.promotionData();
  }


  promotionData() {
    this.promotionService
      .getAllPromotion()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.promotions = response;
      })
  }
  searchpromotionData() {
    this.promotionService
      .searchPromotion(this.search)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.promotions = response;
      })
  }
  onFilterPromotion(id : any){
    this.search.id =  id;
    this.searchpromotionData();
  }
  onFilterDate(id : any){
    id[0] =  this.datepipe.transform(id[0], 'YYYY-MM-dd') ;
    this.search.startDate =  id[0];
    id[1] =  this.datepipe.transform(id[1], 'YYYY-MM-dd') ;
    this.search.endDate =  id[1];
    this.searchpromotionData();
  }
  onFilterdiscount(id : any){
    this.search.discount =  id;
    this.searchpromotionData();
  }

  checkStatus(endDate: Date){
    if(new Date(endDate) > new Date()) {
      return 'Unexpired';
    } else {
      return 'Expired';
    }
  }

  drop(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.promotions, event.previousIndex, event.currentIndex);
  }

  onCurrentPageDataChange($event: readonly PromotionDataItem[]): void {
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
      this.title = 'Update: ' + this.data.code;
    } else {
      this.title = 'View: ' + this.data.code;
    }
  }

  open(mode: string, data: any) {
    this.mode = mode;
    this.data = data;
    if (mode == 'create') {
      this.title = 'Create Promotion';
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
      this.promotions.splice(this.promotions.findIndex((item) => item.id === data.id), 1, data);
      this.promotions = [...this.promotions];
    } else {
      this.promotions = [data, ...this.promotions];
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
          this.promotionService
            .deletePromotion(payload)
            .pipe(catchError((err) => of(err)))
            .subscribe((response) => {
              if (response) {
                this.notification.create('success', 'Successfully!', '');
              } else {
                this.notification.create('error', 'Failed!', '');
              }
            })
          const index = this.promotions.findIndex((item) => item.id == movieId);
          this.promotions.splice(index, 1);
          this.promotions = [...this.promotions];
          setTimeout(null ? resolve : reject, 1000);
        }).catch(() => console.log('Oops errors!'))
    });
  }
}
