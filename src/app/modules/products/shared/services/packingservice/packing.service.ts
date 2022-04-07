import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from 'src/app/modules/shared/common-directive/services/http-helpers.service';
import {AuthService} from 'src/app/modules/login/shared/auth.service';
import { Packing } from 'src/app/models/products/packing';
import { PackingFilter } from 'src/app/modules/products/shared/filters/packing-filter';

@Injectable({
  providedIn: 'root'
})
export class PackingService {

  public _packingList: Packing[];

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService, private _AuthService: AuthService) { }

  getPackingbyfilter(filters: PackingFilter = new PackingFilter()){
    const { id } = this._AuthService.storeUser;
    return this._httpClient
      .get<Packing[]>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/Packing/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }
  
  postPacking(product: Packing[] = new Array<Packing>()){
    const { id } = this._AuthService.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/Packing/`+id, product)
  }
  
  getPackingPromise(filters: PackingFilter = new PackingFilter()){
    const { id } = this._AuthService.storeUser;
    return this._httpClient
      .get<Packing[]>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/Packing/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      }).toPromise();
  }
}
