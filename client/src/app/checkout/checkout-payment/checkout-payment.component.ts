import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/Models/Basket';
import { IOrder, IOrderToCreate } from 'src/app/shared/Models/Order';
import { CheckoutService } from '../checkout.service';
declare var Stripe
@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements AfterViewInit, OnDestroy {
  @Input() checkOutForm: FormGroup;
  @ViewChild('cardNumber', { static: true }) cardNumberElement: ElementRef;
  @ViewChild('cardExpiry', { static: true }) cardExpiryElement: ElementRef;
  @ViewChild('cardCvc', { static: true }) cardCvcElement: ElementRef;
  stripe: any;
  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;
  cardErrors: any;
  cardHandler = this.onChange.bind(this);
  loading = false;
  cardNumberValid = false;
  cardExpiryValid = false;
  cardCvcValid = false;

  constructor(
    private basketService: BasketService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngAfterViewInit(): void {
    this.stripe = Stripe('pk_test_51I9BMHITox5MobN3v64EStxH8RaUuOGpQz7Wi74I42xylnCjY8HZDQ6rxS8duLcxmAX9Aw8cfIc1W6VtlbHcZ94E00B7mrtdC5');
    const elements = this.stripe.elements();

    this.cardNumber = elements.create('cardNumber');
    this.cardNumber.mount(this.cardNumberElement.nativeElement)
    this.cardNumber.addEventListener('change', this.cardHandler);

    this.cardExpiry = elements.create('cardExpiry');
    this.cardExpiry.mount(this.cardExpiryElement.nativeElement)
    this.cardExpiry.addEventListener('change', this.cardHandler);


    this.cardCvc = elements.create('cardCvc');
    this.cardCvc.mount(this.cardCvcElement.nativeElement)
    this.cardCvc.addEventListener('change', this.cardHandler);
  }
  ngOnDestroy(): void {
    this.cardNumber.destroy();
    this.cardExpiry.destroy();
    this.cardCvc.destroy();
  }
  onChange(event) {
    console.log(event);
    if (event.error) {
      this.cardErrors = event.error.message;
    } else {
      this.cardErrors = null;
    }
    switch (event.elementType) {
      case 'cardNumber':
        this.cardNumberValid = event.complete
        break;
      case 'cardExpiry':
        this.cardExpiryValid = event.complete
        break;
      case 'cardCvc':
        this.cardCvcValid = event.complete
        break;

      default:
        break;
    }
  }

  async submitOrder() {
    try {
      this.loading = true;
      const basket = this.basketService.getCurrentBasketValue();
      const createdOrder: IOrder = await this.createOrder(basket);
      const paymentResult = await this.confirmPaymentWithStripe(basket);

      console.log(paymentResult)
      if (paymentResult.paymentIntent) {
        this.basketService.deleteBasket(basket);
        const navigationExtras: NavigationExtras = { state: createdOrder };
        this.router.navigate(['checkout/success'], navigationExtras)
      } else {
        this.toastr.error(paymentResult.error.message);
      }
      this.loading = false;
    } catch (error) {
      this.loading = false;
      console.log(error);
    }
  };

  //   const orderToCreate: IOrderToCreate = this.getOrderToCreate(basket.id);//used
  //   this.checkoutService.createOrder(orderToCreate).subscribe((order) => {
  //     this.toastr.success('Order created successfully');

  //     //Ene method stripRuu mungu shiljuulegdej baigaa
  //     this.stripe.confirmCardPayment(basket.clientSecret, {
  //       payment_method: {
  //         card: this.cardNumber,
  //         billing_details: {
  //           name: this.checkOutForm.get('paymentForm').get('nameOnCard').value,
  //         },
  //       },
  //     }).then((result)=> {
  //         // Handle result.error or result.paymentIntent
  //         console.log(result)
  //         if (result.paymentIntent) {
  //           //this become null
  //           this.basketService.deleteBasketLocal(basket.id);
  //           const navigationExtras: NavigationExtras = {state:order};
  //           this.router.navigate(['checkout/success'],navigationExtras)
  //         } else {
  //           this.toastr.error(result.error.message);
  //         }
  //       });

  //   }, err => {
  //     this.toastr.error(err.message);
  //     console.log(err);
  //   })
  // }
  private async confirmPaymentWithStripe(basket: IBasket) {
    //Ene method stripRuu mungu shiljuulegdej baigaa
    return this.stripe.confirmCardPayment(basket.clientSecret, {
      payment_method: {
        card: this.cardNumber,
        billing_details: {
          name: this.checkOutForm.get('paymentForm').get('nameOnCard').value,
        },
      },
    })
  }
  private async createOrder(basket: IBasket): Promise<IOrder> {
    const orderToCreate: IOrderToCreate = this.getOrderToCreate(basket.id);
    return this.checkoutService.createOrder(orderToCreate).toPromise();
  }

  getOrderToCreate(basketId): IOrderToCreate {
    return {
      basketId: basketId,
      deliveryMethodId: +this.checkOutForm.get('deliveryForm').get('deliveryMethod').value,
      shiptoAddress: this.checkOutForm.get('addressForm').value
    }
  }
}
