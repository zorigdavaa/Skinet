import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IOrderToCreate } from 'src/app/shared/Models/Order';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit {
  @Input() checkOutForm: FormGroup;
  constructor(
    private basketService: BasketService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService,
    private router: Router
    ) { }

  ngOnInit(): void {

  }
  submitOrder() {
    const basket = this.basketService.getCurrentBasketValue();
    const orderToCreate: IOrderToCreate = this.getOrderToCreate(basket.id);
    this.checkoutService.createOrder(orderToCreate).subscribe((order) => {
      this.toastr.success('Order created successfully');
      this.basketService.deleteBasketLocal(basket.id);
      const navigationExtras: NavigationExtras = {state:order};
      this.router.navigate(['checkout/success'],navigationExtras)
    }, err => {
      this.toastr.error(err.message);
      console.log(err);
    })
  }
  getOrderToCreate(basketId): IOrderToCreate {
    return {
      basketId: basketId,
      deliveryMethodId: +this.checkOutForm.get('deliveryForm').get('deliveryMethod').value,
      shiptoAddress: this.checkOutForm.get('addressForm').value
    }
  }
}
