import { Component, OnInit } from '@angular/core';
import { Setting } from 'src/app/models/setting';
import { User } from 'src/app/models/user';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BillService } from 'src/app/services/bill.service';
import { TicketService } from 'src/app/services/ticket.service';
import { catchError, of } from 'rxjs';
import { FoodService } from 'src/app/services/food.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  checkUser: boolean = true;
  user: User;
  setting: Setting;
  indeterminate = false;
  checked = false;
  listOfCurrentPageData: readonly any[] = [];
  setOfCheckedId = new Set<string>();
  transactionList: {history: string, date: Date, price: number}[] = [];
  bills: any[] = [];
  billDetails: any[] = [];
  tickets: any[] = [];
  foods: any[] = [];
  constructor(
    private billService: BillService,
    private ticketService: TicketService,
    private foodService: FoodService,
  ) { }

  ngOnInit(): void {
    this.setting = JSON.parse(localStorage.getItem('setting') || '{}');
    this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    this.checkUser = Object.keys(this.user).length === 0;
    this.billData();
    this.foodData();
  }

  drop(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.transactionList, event.previousIndex, event.currentIndex);
  }

  onCurrentPageDataChange($event: readonly any[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  billData() {
    this.billService
      .getAllBill('customerId=' + this.user.id)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        if (response) {
          this.bills = response;
          this.ticketData();
        }
      })
  }

  billFoodData() {
    this.billService
      .getAllBillDetail()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        if (response) {
          this.billDetails = response;
          this.getTicketForBill();
        }
      })
  }

  ticketData() {
    this.ticketService
      .getAllTicket()
      .pipe(catchError((err) => of(err)))
      .subscribe((response: any[]) => {
        if (response) {
          response.forEach((item) => {
            if(item.billId != null) {
              this.tickets.push(item);
            }
          })
          this.billFoodData();
        }
      })
  }

  foodData() {
    this.foodService
      .getAllFood()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        if (response) {
          this.foods = response;
        }
      })
  }

  getTicketForBill() {
    this.bills.forEach((data) => {
      let history = ''
      const countTicket = this.tickets.filter(t => t.billId === data.id).length;
      const findFoodBill = this.billDetails.filter(b => b.billId === data.id);
      if (countTicket > 1) {
        history = 'You have bought ' + countTicket + ' tickets';
      } else {
        history = 'You have bought 1 ticket';
      }
      if (findFoodBill.length > 0) {
        history += ' and ';
      }
      findFoodBill.forEach((item) => {
        const countFood = this.foods.find(f => f.id === item.foodId)?.name;
        history += item.quantity + ' ' + countFood;
        if (findFoodBill[findFoodBill.length-1] !== item) {
          history += ', ';
        }
      })
      const date: Date = data.creationTime;
      const price = data.cost;
      const item = {history, date, price};
      this.transactionList= [item, ...this.transactionList];
    });
  }

  changeToMoney(value: any) {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'VND' }).format(value);
  }

  getRankCustomer(point: any) {
    let rank = 'Unknown Rank';
    if (0 <= point && point <= 1000) {
      rank = 'Unknown Rank';
    } else if (1001 <= point && point <= 2000) {
      rank = 'Bronze';
    } else if (2001 <= point && point <= 3500) {
      rank = 'Silver';
    } else if (3501 <= point && point <= 5500) {
      rank = 'Gold';
    } else if (5501 <= point && point <= 8000) {
      rank = 'Platinum';
    } else if (8001 <= point && point <= 11000) {
      rank = 'Diamond';
    } else if (11001 <= point && point <= 14500) {
      rank = 'Master';
    } else {
      rank = 'Challenger';
    }
    return rank;
  }
}
