import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IBasket, IBasketItem } from 'src/app/shared/Models/Basket';
import { IOrder } from 'src/app/shared/Models/Order';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  order: IOrder;
  basket: IBasket;
  constructor(private router: Router, private breadCrumb: BreadcrumbService) {
    const navigation = router.getCurrentNavigation();
    const extras = navigation && navigation.extras && navigation.extras.state;
    this.order = extras as IOrder;
    this.breadCrumb.set('@OrderDetailed','');
  }

  ngOnInit(): void {
    if (this.order) {
      this.mapOrderToBasket();
      this.breadCrumb.set('@OrderDetailed',`Order # ${this.order.id} -- ${this.order.status}`)
    }
  }


  private mapOrderToBasket() {
    const basketItems: IBasketItem[] = [];
    //Foreach
    this.order.orderItems.forEach(orderItem => {
      const basketItem: IBasketItem = {
        id: orderItem.productId,
        pictureUrl: orderItem.productUrl,
        price: orderItem.price,
        productName: orderItem.productName,
        quantity: orderItem.quantity,
        brand: null,
        type: null
      };

      basketItems.push(basketItem);
    });
    this.basket = {
      items: basketItems,
      id: null
    }
  }
}
