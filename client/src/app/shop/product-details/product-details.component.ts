import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasketService } from 'src/app/basket/basket.service';
import { IProduct } from 'src/app/shared/Models/products';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: IProduct;
  quantity = 1;
  constructor(private shopService: ShopService,
              private activatedRoute: ActivatedRoute, // ene bol Query parametert handdag service
              private bcService: BreadcrumbService,
              private basketService: BasketService) {
                this.bcService.set('@productDetails', ' ');
  }

  ngOnInit(): void {
    this.loadProduct(+this.activatedRoute.snapshot.paramMap.get('id'));
  }
  loadProduct(id: number): void{
    this.shopService.getProduct(id).subscribe(product => {
      this.product = product;
      // BreadCrumb's route become productName
      this.bcService.set('@productDetails', product.name);
    }, error => {
      console.error(error);
    });
  }
  incrementQuantity(): void {
    this.quantity++;
  }
  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  addToCart(): void{
    this.basketService.addItemToBasket(this.product, this.quantity);
  }

}
