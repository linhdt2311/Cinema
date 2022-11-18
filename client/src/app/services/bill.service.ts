import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  baseUrl = environment.baseUrl + 'bill';

  constructor(private http: HttpClient) { }

  getAllBill(payload?: any): Observable<any> {
    return this.http.get(this.baseUrl + '/getall?' + payload);
  }
  getBill(payload?: any): Observable<any> {
    return this.http.get(this.baseUrl + '/getbill?creationTime=' + payload);
  }
  getAllBillDetail(payload?: any): Observable<any> {
    payload !== undefined ? '?' + payload : ''
    return this.http.get(this.baseUrl + '/getbilldetail' + payload);
  }
  createBill(payload: any): Observable<any> {
    return this.http.post(this.baseUrl + '/create', payload);
  }
  createBillDetail(payload: any): Observable<any> {
    return this.http.post(this.baseUrl + '/create-billdetail', payload);
  }
  updateBill(payload: any): Observable<any> {
    return this.http.put(this.baseUrl + '/update', payload);
  }
  deleteBill(payload: any): Observable<any> {
    return this.http.delete(this.baseUrl + '/delete', payload);
  }
  delete(payload: any): Observable<any> {
    return this.http.delete(this.baseUrl + '/deletebill?id=' + payload);
  }
}
