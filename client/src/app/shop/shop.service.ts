import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { IBrand } from '../shared/Models/Brands';
import {IPagination, Pagination} from '../shared/Models/pagination';
import { IType } from '../shared/Models/Types';
import { map } from 'rxjs/operators';
import { ShopParams } from '../shared/Models/shopParams';
import { IProduct } from '../shared/Models/products';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  products:IProduct[]=[];
  brands:IBrand[]=[];
  types:IType[]=[];
  pagination = new Pagination();
  private _shopParams = new ShopParams();

  baseUrl = 'https://localhost:5001/api/';
  constructor(private http: HttpClient) { }

  public get shopParams():ShopParams {
    return this._shopParams
  }

  public set shopParams(value : ShopParams) {
    this._shopParams = value;
  }

  getProduct(id: number): Observable<IProduct> {
    var product = this.products.find(p=>p.id === id);
    if (product) {
      return of(product);
    }
    return this.http.get<IProduct>(this.baseUrl + 'products/' + id.toString());
  }
  getProducts(useCache: boolean): Observable<IPagination> {
    if (!useCache) {
      this.products =[];
    }
    if (this.products.length > 0 && useCache) {
      const pagesRecieved = Math.ceil(this.products.length / this.shopParams.pageSize);
      if (this.shopParams.pageNumber <= pagesRecieved) {
        this.pagination.data = this.products
        .slice((this.shopParams.pageNumber-1)*this.shopParams.pageSize,
          this.shopParams.pageNumber*this._shopParams.pageSize)
        return of(this.pagination);
      }
    }
    let params = new HttpParams();
    if (this.shopParams.selectedBrandId) {
      params = params.append('BrandId', this.shopParams.selectedBrandId.toString());
    }
    if (this.shopParams.selectedTypeId) {
      params = params.append('TypeId', this.shopParams.selectedTypeId.toString());
    }
    if (this.shopParams.search) {
      params = params.append('search', this.shopParams.search);
    }
    params = params.append('sort', this.shopParams.sortSelected);
    params = params.append('pageIndex', this.shopParams.pageNumber.toString());
    params = params.append('pageSize', this.shopParams.pageSize.toString());
    return this.http.get<IPagination>(this.baseUrl + 'products', {observe: 'response', params})
      .pipe(
        map(response => {
          this.products = [...this.products,...response.body.data];
          this.pagination = response.body;
          return this.pagination;
        })
      );
  }
  getBrands(): Observable<IBrand[]> {
    if (this.brands.length > 0) {
      return of(this.brands);
    }
    return this.http.get<IBrand[]>(this.baseUrl + 'products/brands')
    .pipe(
      map((brands:IBrand[])=> {
        this.brands = brands;
        return brands;
      })
    );
  }
  getTypes(): Observable<IType[]> {
    if (this.types.length > 0) {
      return of(this.types);
    }
    return this.http.get<IType[]>(this.baseUrl + 'products/types')
    .pipe(
      map((types:IType[])=> {
        this.types = types;
        return types;
      })
    )
  }
}
