import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket, IBasketItem } from '../../Models/Basket';

@Component({
  selector: 'app-basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrls: ['./basket-summary.component.scss']
})
export class BasketSummaryComponent implements OnInit {
  @Output() increment: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Output() decrement: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Output() remove: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Input() showButtons = true;
  @Input() basket;
  basket$: Observable<IBasket>
  constructor(private basketService: BasketService) { }

  ngOnInit(): void {
    if (!this.basket) {
      this.basket$ = this.basketService.basket$;
      this.basket$.subscribe((basket)=>{
        this.basket = basket;
      })
    }
  }
  decrementItem(item: IBasketItem) {
    this.decrement.emit(item)
  }
  incrementItem(item: IBasketItem) {
    this.increment.emit(item);
  }
  removeItemFromBasket(item: IBasketItem) {
    this.remove.emit(item);
  }

}
