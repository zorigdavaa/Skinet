import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { IBrand } from '../shared/Models/Brands';
import {IPagination} from '../shared/Models/pagination';
import { IType } from '../shared/Models/Types';
import { map } from 'rxjs/operators';
import { ShopParams } from '../shared/Models/shopParams';
import { IProduct } from '../shared/Models/products';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = 'https://localhost:5001/api/';
  constructor(private http: HttpClient) { }

  getProduct(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(this.baseUrl + 'products/' + id.toString());
  }
  getProducts(shopParam: ShopParams): Observable<IPagination> {
    let params = new HttpParams();
    if (shopParam.selectedBrandId) {
      params = params.append('BrandId', shopParam.selectedBrandId.toString());
    }
    if (shopParam.selectedTypeId) {
      params = params.append('TypeId', shopParam.selectedTypeId.toString());
    }
    if (shopParam.search) {
      params = params.append('search', shopParam.search);
    }
    params = params.append('sort', shopParam.sortSelected);
    params = params.append('pageIndex', shopParam.pageNumber.toString());
    params = params.append('pageSize', shopParam.pageSize.toString());
    return this.http.get<IPagination>(this.baseUrl + 'products', {observe: 'response', params})
      .pipe(
        map(response => {
          return response.body;
        })
      );
  }
  getBrands(): any {
    return this.http.get<IBrand[]>(this.baseUrl + 'products/brands');
  }
  getTypes(): any {
    return this.http.get<IType[]>(this.baseUrl + 'products/types');
  }
}
