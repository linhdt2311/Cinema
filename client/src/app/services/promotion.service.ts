import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  baseUrl = environment.baseUrl + 'promotion';

  constructor(private http: HttpClient) { }

  getAllPromotion():Observable<any>{
    return this.http.get(this.baseUrl + '/getall');
   }
   searchPromotion():Observable<any>{
    return this.http.get(this.baseUrl + '/getall');
   }
  createPromotion(payload:any):Observable<any>{
    return this.http.post(this.baseUrl + '/create', payload);
  }
  updatePromotion(payload:any):Observable<any>{
    return this.http.put(this.baseUrl + '/update', payload);
  }
  deletePromotion(payload:any):Observable<any>{
    return this.http.delete(this.baseUrl + '/delete', payload);
  }
}
