import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasketTotal } from '../../Models/Basket';
import { IOrder } from '../../Models/Order';

@Component({
  selector: 'app-order-totals',
  templateUrl: './order-totals.component.html',
  styleUrls: ['./order-totals.component.scss']
})
export class OrderTotalsComponent implements OnInit {
  @Input() order:IOrder;
  basketTotal$: Observable<IBasketTotal>;
  basketTotal:IBasketTotal;
  constructor(private basketService: BasketService) { }

  ngOnInit(): void {
    if (this.order) {
      this.basketTotal = {
        shipping: this.order.shippingPrice,
        subtotal: this.order.subtotal,
        total: this.order.total
      }
    } else {
      this.basketTotal$ = this.basketService.basketTotal$;
      this.basketTotal$.subscribe((basketTotal)=> {
        this.basketTotal = basketTotal;
      })
    }

  }

}
