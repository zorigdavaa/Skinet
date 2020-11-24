import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IBasket, IBasketItem } from 'src/app/shared/Models/Basket';
import { BasketService } from '../basket.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
  basket$: Observable<IBasket>;
  constructor(private basketService: BasketService) { }

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
  }
  incrementItem(item: IBasketItem): void {
    this.basketService.incrementItemQuantity(item);
  }
  decrementItem(item: IBasketItem): void {
    this.basketService.decrementItemQuantity(item);
  }
  removeItemFromBasket(item: IBasketItem): void {
    this.basketService.removeItemFromBasket(item);
  }

}
