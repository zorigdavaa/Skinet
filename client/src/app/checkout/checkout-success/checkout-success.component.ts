import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { IOrder } from 'src/app/shared/Models/Order';

@Component({
  selector: 'app-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.scss']
})
export class CheckoutSuccessComponent implements OnInit {
  order: IOrder;
  constructor(private router: Router) {
    const navigation= this.router.getCurrentNavigation();
    const state = navigation && navigation.extras && navigation.extras.state;
    this.order = state as IOrder;
   }

  ngOnInit(): void {
  }
  ViewOrder() {
    const navigationExtras:NavigationExtras = {state: this.order}
    this.router.navigate([`order/${this.order.id}`], navigationExtras)
  }

}
