import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { IOrder } from 'src/app/shared/Models/Order';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  orders: IOrder[];
  constructor(private orderService: OrderService, private router: Router) { }

  ngOnInit(): void {
    this.orderService.getOrders().subscribe((orders)=> {
      this.orders = orders;
    });
  }
  viewOrder(order: IOrder) {
    const navigationExtras:NavigationExtras={state:order}
    this.router.navigate([`order/${order.id}`], navigationExtras)
  }
}
