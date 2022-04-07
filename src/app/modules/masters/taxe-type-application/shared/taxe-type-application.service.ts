import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaxRateApp } from 'src/app/models/masters/tax-rate-app';
import { TaxRateAppFilter } from 'src/app/models/masters/tax-rate-app-filter';
import { TaxeTypeApplication } from 'src/app/models/masters/taxe-type-application';
import { TaxeTypeApplicationFilters } from 'src/app/models/masters/taxe-type-application-filters';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';

import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TaxeTypeApplicationService {

  constructor(public httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this.httpClient)


  getTaxeTypeApplications(filters: TaxeTypeApplicationFilters){
    return this.httpClient
      .get<TaxeTypeApplication[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/TaxeTypeApplication/Get/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      }) 
      .toPromise()
      .then(result => result)
      .catch( error => {
            return error;
        });
  }

  addTaxeTypeApplication(taxeTypeApplication: TaxeTypeApplication) {
    const { id } = this._Authservice.storeUser;
    return this.httpClient
      .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/TaxeTypeApplication/Post?userId=${id}`, taxeTypeApplication)
      .pipe(map((res: number) => res));
  }

  GetTaxRatexApplication(filters: TaxRateAppFilter = new TaxRateAppFilter){
    return this.httpClient                                                          
    .get<TaxRateApp[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/TaxeTypeApplication/GetTaxRatexApplication/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    })
  }

}
