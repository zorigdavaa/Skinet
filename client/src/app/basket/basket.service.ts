import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotal } from '../shared/Models/Basket';
import { IProduct } from '../shared/Models/products';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.BaseUrlDevelopment;
  private basketSource = new BehaviorSubject<IBasket>(null);
  basket$ = this.basketSource.asObservable();
  private basketTotalSource = new BehaviorSubject<IBasketTotal>(null);
  basketTotal$ = this.basketTotalSource.asObservable();
  constructor(private http: HttpClient) { }

  getBasket(id: string): Observable<void> {
    return this.http.get(`${this.baseUrl}basket?id=${id}`)
    .pipe(
    map((basket: IBasket) => {
          this.basketSource.next(basket);
          this.calculateTotals();
        }
      )
    );
  }
  setBasket(basket: IBasket): Subscription {
    return this.http.post(`${this.baseUrl}basket`, basket).subscribe((response: IBasket) => {
      this.basketSource.next(response);
      this.calculateTotals();
    }, (err) => {
      console.log(err);
    });
  }
  getCurrentBasketValue(): IBasket {
    return this.basketSource.value;
  }
  addItemToBasket(item: IProduct, quantity = 1): void {
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
    this.setBasket(basket);
  }
  addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    const index = items.findIndex(x => x.id === itemToAdd.id);
    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      items[index].quantity += quantity;
    }
    return items;
  }
  incrementItemQuantity(item: IBasketItem): void{
    const basket = this.getCurrentBasketValue();
    const foundIndex = basket.items.findIndex(x => x.id === item.id);
    basket.items[foundIndex].quantity ++;
    this.setBasket(basket);
  }
  decrementItemQuantity(item: IBasketItem): void{
    const basket = this.getCurrentBasketValue();
    const foundIndex = basket.items.findIndex(x => x.id === item.id);

    if (basket.items[foundIndex].quantity > 1) {
      basket.items[foundIndex].quantity --;
      this.setBasket(basket);
    } else {
      this.removeItemFromBasket(item);
    }
  }
  removeItemFromBasket(item: IBasketItem): void {
    const basket = this.getCurrentBasketValue();
    if (basket.items.some(x => x.id === item.id)) {
      basket.items = basket.items.filter(x => x.id !== item.id);
      if (basket.items.length > 0) {
        this.setBasket(basket);
      } else {
        this.deleteBasket(basket);
      }
    }
  }
  deleteBasket(basket: IBasket): Subscription {
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe(() => {
      this.basketSource.next(null);
      this.basketTotalSource.next(null);
      localStorage.removeItem('basket_id');
    }, err => {
      console.log(err);
    });
  }

  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }
  private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
      id : item.id,
      productName: item.name,
      price: item.price,
      quantity,
      pictureUrl: item.pictureUrl,
      brand: item.productBrand,
      type: item.productType
    };
  }
  private calculateTotals(): void {
    const basket = this.getCurrentBasketValue();
    const shipping = 0;
    const subtotal = basket.items.reduce((a , b) => (b.price * b.quantity) + a , 0);
    const total = shipping + subtotal;
    this.basketTotalSource.next({
      shipping, subtotal, total
    });
  }

}
