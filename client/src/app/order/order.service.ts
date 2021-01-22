import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IOrder } from '../shared/Models/Order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  baseUrl = environment.BaseUrlDevelopment;
  constructor(private http: HttpClient) { }
  getOrders():Observable<IOrder[]> {
    return this.http.get<IOrder[]>(this.baseUrl+'orders');
  }
}
