import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  constructor(private shopService: ShopService,
              private activatedRoute: ActivatedRoute, // ene bol Query parametert handdag service
              private bcService: BreadcrumbService) {
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

}
