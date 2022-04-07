import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PriceType } from 'src/app/models/masters/price-type';
import { PriceTypeFilters } from 'src/app/models/masters/price-type-filters';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';

import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PriceTypeService {

  constructor(public httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this.httpClient)


  getPriceTypes(filters: PriceTypeFilters){
    return this.httpClient
      .get<PriceType[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/PriceType/Get/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      }) 
      .toPromise()
      .then(result => result)
      .catch( error => {
            return error;
        });
  }

  addPriceType(priceType: PriceType) {
    const { id } = this._Authservice.storeUser;
    return this.httpClient
      .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/PriceType/Post?userId=${id}`, priceType)
      .pipe(map((res: number) => res));
  }

}
