import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ProductorigintypeFilter } from '../../filters/productorigintype-filter';
import { HttpHelpersService } from 'src/app/modules/shared/common-directive/services/http-helpers.service';
import { Productorigintype } from 'src/app/models/masters-mpc/productorigintype';
import {AuthService} from 'src/app/modules/login/shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductorigintypeService {

  public _ProductorigintypeList : Productorigintype[];

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getProductorigintypebyfilter(filters: ProductorigintypeFilter = new ProductorigintypeFilter()){
    return this._httpClient
      .get<Productorigintype[]>(`${environment.API_BASE_URL_OSM_MASTERS}/ProductOriginType/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  postProductorigintype(_productorigintype: Productorigintype = new Productorigintype()){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_OSM_MASTERS}/ProductOriginType/`+id, _productorigintype)
  }
}
