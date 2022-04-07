import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from 'src/app/modules/shared/common-directive/services/http-helpers.service';
import {AuthService} from 'src/app/modules/login/shared/auth.service';
import { ProductTaxes } from 'src/app/models/products/producttaxes';
import { ProductTaxesFilter } from 'src/app/modules/products/shared/filters/productaxes-filter';
import { ProductTaxesAvailableFilter } from 'src/app/modules/products/shared/filters/producttaxesavailable-filter';
import { TaxRate } from 'src/app/models/masters/tax-rate';

@Injectable({
  providedIn: 'root'
})
export class ProducttaxesService {

  public _productTaxes: ProductTaxes[];

  public _taxRates: TaxRate[];

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService, private _AuthService: AuthService) { }

  getProductTaxesbyfilter(filters: ProductTaxesFilter = new ProductTaxesFilter()){
    const { id } = this._AuthService.storeUser;
    return this._httpClient
      .get<ProductTaxes[]>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/ProductTaxes/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  getProductTaxesAvailablebyfilter(filters: ProductTaxesAvailableFilter = new ProductTaxesAvailableFilter()){
    const { id } = this._AuthService.storeUser;
    return this._httpClient
      .get<TaxRate[]>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/ProductTaxes/Available/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  posttProductTaxes(productTaxes: ProductTaxes = new ProductTaxes()){
    const { id } = this._AuthService.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/ProductTaxes/`+id, productTaxes)
  }
}
