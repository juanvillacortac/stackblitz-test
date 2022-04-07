import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { priceGrouping } from 'src/app/models/masters/price-grouping';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';
import { PriceGroupingFilter } from '../filters/pricegrouping-filter';

@Injectable({
  providedIn: 'root'
})
export class PriceGroupingService {

  public _pricegroupingList: priceGrouping[];
  private readonly USER_STATE = '_USER_STATE'

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);
  
     getPriceGroupingList(filters: PriceGroupingFilter = new PriceGroupingFilter()) {
      return this._httpClient
      .get<priceGrouping[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/PriceGrouping/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
    }
    
    InsertUpdatePriceGrouping(pricegrouping :priceGrouping) 
    {     
      const { id } = this._Authservice.storeUser;
       return this._httpClient
      .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/PriceGrouping/`+id, pricegrouping);
     
    }
    getPriceGroupingListPromise(filters: PriceGroupingFilter){
      return this._httpClient
        .get<priceGrouping[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/PriceGrouping/`, {
          params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
        }) 
        .toPromise()
        .then(result => result)
        .catch( error => {
              return error;
          });
    }
    
}
