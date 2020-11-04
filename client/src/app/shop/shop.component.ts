import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IBrand } from '../shared/Models/Brands';
import { IProduct } from '../shared/Models/products';
import { ShopParams } from '../shared/Models/shopParams';
import { IType } from '../shared/Models/Types';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  @ViewChild('search', {static: true}) searchTerm: ElementRef;
  products: IProduct[];
  brands: IBrand[];
  types: IType[];
  shopParams = new ShopParams();
  totalCount: number;
  sortOptions = [
    {name: 'Alphabetically', value : 'name'},
    {name: 'Price: Low to High', value : 'priceAsc'},
    {name: 'Price: High to Low', value : 'priceDesc'}
  ];
  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }


  private getProducts(): void {
    this.shopService.getProducts(this.shopParams).subscribe((response) => {
      this.products = response.data;
      this.shopParams.pageNumber = response.pageIndex;
      this.shopParams.pageSize = response.pageSize;
      this.totalCount = response.count;
    }, (error) => {
      console.error(error);
    });
  }
  private getBrands(): void {
    this.shopService.getBrands().subscribe((response) => {
      this.brands = [{id: 0, name: 'All'}, ...response];
    }, (error) => {
      console.error(error);
    });
  }
  private getTypes(): void {
    this.shopService.getTypes().subscribe((response) => {
      this.types = [{id: 0, name: 'All'}, ...response];
    }, (error) => {
      console.error(error);
    });
  }
  public onBrandSelected(brandId: number): void {
    this.shopParams.selectedBrandId = brandId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }
  public onTypeSelected(typeId: number): void {
    this.shopParams.selectedTypeId = typeId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }
  public onSortSelected(sort: string): void {
    this.shopParams.sortSelected = sort;
    this.getProducts();
  }
  public onPageChanged(event: any): void {
    if (this.shopParams.pageNumber !== event) {
      this.shopParams.pageNumber = event;
      this.getProducts();
    }
  }
  public onSearch(): void{
    this.shopParams.search = this.searchTerm.nativeElement.value;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }
  public onReset(): void {
    this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.getProducts();
  }
}
