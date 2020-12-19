import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from './account/account.service';
import { BasketService } from './basket/basket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Skinet';
  constructor(
    private basketService: BasketService,
    private accountService: AccountService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loadBasket();
    this.loadUser();
  }
  loadUser(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.accountService.loadCurrentUser(token).subscribe(
        (user) => {
          console.log('user loaded ' + user);
          this.router.navigateByUrl('/shop');
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      // herev token baihgui bol accountService iin replaySubject iig null bolgoj baigaa
      this.accountService.loadCurrentUser(null).subscribe((user) => {
        console.log(user);
      }, (error) => {
        console.log(error);
      });
    }
  }
  loadBasket(): void {
    const basketId = localStorage.getItem('basket_id');
    if (basketId) {
      this.basketService.getBasket(basketId).subscribe(
        () => {
          console.log('basket initialized');
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
}
