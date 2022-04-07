import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { RateType } from 'src/app/models/masters/rate-type';
import { TaxRate } from 'src/app/models/masters/tax-rate';
import { TaxRateFilters } from 'src/app/models/masters/tax-rate-filters';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';

import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TaxRateService {

  constructor(public httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this.httpClient)

  getRatesType(filters: number = -1){
    return this.httpClient
      .get<RateType[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/TaxRate/GetRateType/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      }) 
      .toPromise()
      .then(result => result)
      .catch( error => {
            return error;
        });
  }

  getTaxRates(filters: TaxRateFilters){
    return this.httpClient
      .get<TaxRate[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/TaxRate/Get/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      }) 
      .toPromise()
      .then(result => result)
      .catch( error => {
            return error;
        });
  }

  addTaxRate(taxRate: TaxRate) {
    const { id } = this._Authservice.storeUser;
    return this.httpClient
      .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/TaxRate/Post?userId=${id}`, taxRate)
      .pipe(map((res: number) => res));
  }

  getTaxRatesByCountry(filters: number  = -1){
    return this.httpClient
      .get<TaxRate[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/TaxRate/GetTaxRateByCountry/`+filters);
  }
}
