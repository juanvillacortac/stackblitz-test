import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ProductcatalogFilter } from '../../filters/productcatalog-filter';
import { HttpHelpersService } from 'src/app/modules/shared/common-directive/services/http-helpers.service';
import { ProductCatalog } from '../../view-models/product-catalog.viewmodel';
import {AuthService} from 'src/app/modules/login/shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductcatalogService {

  public _ProductCatalogList: ProductCatalog[];

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService, private _AuthService: AuthService) { }

  getProductCatalogbyfilter(filters: ProductcatalogFilter = new ProductcatalogFilter()){
    return this._httpClient
      .get<ProductCatalog[]>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/ProductCatalog/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  getProductCatalogbyfilterverified (filters: ProductCatalog [], id: number){
      return this._httpClient
      .post<ProductCatalog[]>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/ProductCatalog/Getcatalogverified/`+id, filters)
  }
}
