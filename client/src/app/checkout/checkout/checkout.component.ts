import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/account/account.service';
import { BasketService } from 'src/app/basket/basket.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkOutForm : FormGroup;
  constructor(
    private fb:FormBuilder,
    private accountService: AccountService,
    private basketService: BasketService) {}

  ngOnInit(): void {
    this.CreateCheckoutForm();
    this.getAddressFromValues();
    this.getDeliveryMethodFromValues();
  }
  CreateCheckoutForm(){
    this.checkOutForm = this.fb.group({
      addressForm : this.fb.group({
        firstName : [null, Validators.required],
        lastName : [null, Validators.required],
        street : [null, Validators.required],
        city : [null, Validators.required],
        state : [null, Validators.required],
        zipCode : [null, Validators.required],
      }),
      deliveryForm : this.fb.group({
        deliveryMethod: [null, Validators.required]
      }),
      paymentForm : this.fb.group({
        nameOnCard: [null, Validators.required]
      })
    })
  }
  getAddressFromValues() {
    this.accountService.getUserAddress().subscribe(address=> {
      if (address) {
        this.checkOutForm.get('addressForm').patchValue(address);
      }
    }, err => {
      console.log(err);
    })
  }
  getDeliveryMethodFromValues() {
    const basket = this.basketService.getCurrentBasketValue();
    if (basket.deliveryMethodId) {
      this.checkOutForm.get('deliveryForm').get('deliveryMethod').patchValue(basket.deliveryMethodId.toString());
    }
  }
}
