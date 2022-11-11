import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, of } from 'rxjs';
import { GetAllFood } from 'src/app/models/getallfood';
import { User } from 'src/app/models/user';
import { BillService } from 'src/app/services/bill.service';
import { FoodService } from 'src/app/services/food.service';
import { PromotionService } from 'src/app/services/promotion.service';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.css']
})
export class FoodComponent implements OnInit {
  @Input() isVisible: boolean | undefined;
  @Input() createDate: any;
  @Input() booking: any[] = [];
  @Input() cinemaId: string;
  @Input() money: any;
  @Output() submit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  isLoading: boolean = false;
  getAllFood: GetAllFood = new GetAllFood();
  foods: any[] = [];
  user: User;
  billId: any;
  billDetail: any[] = [];
  size: number = 1;
  promotion: any[] = [];
  total: number = 0;
  isPromotion: boolean = false;
  warningCode: string = '';
  discount: number = 0;
  promotionId: string;
  constructor(
    private billService: BillService,
    private promotionService: PromotionService,
    private notification: NzNotificationService,
    private foodService: FoodService,
    private ticketService: TicketService,
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.isVisible == true) {
      this.user = JSON.parse(localStorage.getItem('user') || '{}');
      this.foodData();
      this.money;
      this.total = this.money
      if (this.createDate !== undefined) {
        this.billData();
      }
    }
  }

  billData() {
    this.billService
      .getBill(this.createDate)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.billId = response.id
      })
  }

  foodData() {
    this.getAllFood.cinemaId = this.cinemaId;
    this.foodService
      .getAllFood(this.getAllFood)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) =>
        this.foods = response,
      )
  }

  handleCancel() {
    this.isPromotion = false;
    this.total = 0;
    this.money = 0;
    this.discount = 0;
    this.billDetail = [];
    this.getAllFood.size = null;
    this.billService
      .delete(this.billId)
      .pipe(
        catchError((err) => {
          return of(err);
        }),
      )
      .subscribe((response) => {
        if (response) {
          console.log("delete bill successfully!")
        } else {
          console.log("delete bill failed!")
        }
      });
    this.cancel.emit();
  }

  ok() {
    for (let i = 0; i < this.booking.length; i++) {
    this.isLoading = true;
      const payload = {
        billId: this.billId,
        creatorUserId: this.user.id,
        seatId: this.booking[i].seatId,
        price: this.booking[i].price,
        promotionId: this.isPromotion ? this.promotionId : null,
      }
      this.ticketService
        .createTicket(payload)
        .pipe(catchError((err) => of(err)))
        .subscribe((response) => {
          if (response) {
            setTimeout(() => {
              console.log("Add ticket success" + payload.seatId)
              this.isLoading = false;
            }, 1000);
          } else {
            setTimeout(() => {
              console.log("Add ticket fail" + payload.seatId)
              this.isLoading = false;
            }, 1000);
          }
        })
    }
    for (let i = 0; i < this.billDetail.length; i++) {
      this.isLoading = true;
      const payload = {
        billId: this.billId,
        creatorUserId: this.user.id,
        foodId: this.billDetail[i].foodId,
        quantity: this.billDetail[i].quantity,
      }
      this.billService
        .createBillDetail(payload)
        .pipe(catchError((err) => of(err)))
        .subscribe((response) => {
          if (response) {
            setTimeout(() => {
              console.log("Add food success" + payload.foodId)
              this.isLoading = false;
            }, 1000);
          } else {
            setTimeout(() => {
              console.log("Add food fail" + payload.foodId)
              this.isLoading = false;
            }, 1000);
          }
        })
    }
    this.isLoading = true;
    const payload = {
      lastModifierUserId: this.user.id,
      id: this.billId,
      cost: this.total
    }
    this.billService
      .updateBill(payload)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        if (response) {
          setTimeout(() => {
            this.notification.create(
              'success',
              'SuccessFully!',
              ''
            );
            this.isLoading = false;
          }, 1000);
        } else {
          setTimeout(() => {
            this.notification.create(
              'error',
              'Failed!',
              ''
            );
            this.isLoading = false;
          }, 1000);
        }
      })
    this.billDetail = [];
    this.getAllFood.size = null;
    this.isPromotion = false;
    this.discount = 0;
    this.submit.emit();
  }

  onFilterSize(size: any) {
    this.getAllFood.size = size;
    this.foodData();
  }

  creaseSize(crease: string) {
    if (crease === 'dec' && this.size <= 3 && this.size > 1) {
      this.size -= 1;
    } else if (crease === 'inc' && this.size < 3 && this.size >= 1) {
      this.size += 1;
    } else if (crease === 'dec' && this.size == 1) {
      this.size = 3;
    } else if (crease === 'inc' && this.size == 3) {
      this.size = 1;
    }
    this.onFilterSize(this.size);
    for (let i = 0; i < this.foods.length; i++) {
      if (this.billDetail.find(b => b.foodId == this.foods[i].id)) {
        (<HTMLInputElement>document.getElementById(this.foods[i].id)).value = this.billDetail.find(b => b.foodId == this.foods[i].id).quantity
      } else {
        (<HTMLInputElement>document.getElementById(this.foods[i].id)).value = '0'
      }
    }
  }

  changeToVND(price: any) {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'VND' }).format(price)
  }

  addBill(value: string, id: any) {
    const quantity = parseInt(value, 10);
    if (quantity >= 0) {
      if (this.billDetail.find(b => b.foodId === id)) {
        const b = this.billDetail.find(b => b.foodId === id)
        this.money = this.money - (this.foods.find(f => f.id == b.foodId).price * b.quantity)
        this.total = this.total - (this.foods.find(f => f.id == b.foodId).price * b.quantity)
        this.billDetail.splice(this.billDetail.indexOf(b), 1)
        this.billDetail.push({ foodId: id, quantity: quantity })
        this.money = this.money + (this.foods.find(f => f.id == id).price * quantity)
        this.total = this.total + (this.foods.find(f => f.id == id).price * quantity)
      } else {
        this.billDetail.push({ foodId: id, quantity: quantity })
        this.money = this.money + (this.foods.find(f => f.id == id).price * quantity)
        this.total = this.total + (this.foods.find(f => f.id == id).price * quantity)
      }
    } else if (quantity == 0) {
      const b = this.billDetail.find(b => b.foodId === id)
      this.money = this.money - (this.foods.find(f => f.id == b.foodId).price * b.quantity)
      this.total = this.total - (this.foods.find(f => f.id == b.foodId).price * b.quantity)
      this.billDetail.splice(this.billDetail.indexOf(b), 1)
    }
  }

  checkPromotion() {
    this.isLoading = true;
    const code = (<HTMLInputElement>document.getElementById('codePromotion')).value
    this.promotionService
      .getAllPromotion()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.promotion = response
        if (this.promotion.find(p => p.code == code)) {
          const p = this.promotion.find(p => p.code == code)
          if (new Date(p.startDate) < new Date() && new Date() < new Date(p.endDate)) {
            this.total = this.total - p.discount;
            this.promotionId = p.id;
            this.discount = p.discount;
            setTimeout(() => {
              this.isPromotion = true;
              this.isLoading = false;
            }, 1000);
          }
        } else {
          setTimeout(() => {
            this.isLoading = false;
            this.isPromotion = false;
            this.warningCode = "*The discount code is incorrect or has expired!*"
          }, 1000);
        }
      })
  }
}