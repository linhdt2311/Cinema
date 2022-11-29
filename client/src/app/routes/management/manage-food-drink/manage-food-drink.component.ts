import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, of } from 'rxjs';
import { Setting } from 'src/app/models/setting';
import { User } from 'src/app/models/user';
import { FoodService } from 'src/app/services/food.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FoodDataItem } from 'src/app/models/foodDataItem';
import { CinemaService } from 'src/app/services/cinema.service';
import { Size } from 'src/app/helpers/Size';
import { ViewAndEditFoodComponent } from '../../shared-module/view-and-edit-food/view-and-edit-food.component';

@Component({
  selector: 'app-manage-food-drink',
  templateUrl: './manage-food-drink.component.html',
  styleUrls: ['./manage-food-drink.component.css']
})
export class ManageFoodDrinkComponent implements OnInit {
  @ViewChild('food', { static: true }) movie: ViewAndEditFoodComponent;
  title: string = 'create';
  user: User;
  foods: any[] = [];
  cinemas: any[] = [];
  visible: boolean = false
  setting: Setting;
  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly FoodDataItem[] = [];
  setOfCheckedId = new Set<string>();
  confirmModal?: NzModalRef;
  mode: string = 'create';
  data: any;
  isEdit: boolean = true;
  size: any[] = [
    { value: Size.S, viewValue: 'S' },
    { value: Size.M, viewValue: 'M' },
    { value: Size.L, viewValue: 'L' }];
  constructor(
    private foodService: FoodService,
    private cinemaService: CinemaService,
    private modal: NzModalService,
    private notification: NzNotificationService,
  ) { }

  ngOnInit(): void {
    this.setting = JSON.parse(localStorage.getItem('setting') || '{}');
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.foodData();
    this.cinemaData();
  }

  foodData() {
    this.foodService
      .getAllFood()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.foods = response;
      })
  }

  cinemaData() {
    this.cinemaService
      .getAllCinema()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.cinemas = response;
      })
  }

  getCinemaName(id: any) {
    return this.cinemas.find(c => c.id == id)?.name
  }

  getSizeName(value: any) {
    return this.size.find(s => s.value == value)?.viewValue
  }

  getPriceName(price: any) {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'VND' }).format(price);
  }

  drop(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.foods, event.previousIndex, event.currentIndex);
  }

  onCurrentPageDataChange($event: readonly FoodDataItem[]): void {
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
      this.foods.splice(this.foods.findIndex((item) => item.id === data.id), 1, data);
      this.foods = [...this.foods];
    } else {
      this.foods = [data, ...this.foods];
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
          this.foodService
            .deleteFood(payload)
            .pipe(catchError((err) => of(err)))
            .subscribe((response) => {
              if (response) {
                this.notification.create('success', 'Successfully!', '');
              } else {
                this.notification.create('error', 'Failed!', '');
              }
            })
          const index = this.foods.findIndex((item) => item.id == movieId);
          this.foods.splice(index, 1);
          this.foods = [...this.foods];
          setTimeout(null ? resolve : reject, 1000);
        }).catch(() => console.log('Oops errors!'))
    });
  }
}
