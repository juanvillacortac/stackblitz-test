import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tax } from 'src/app/models/masters/tax';
import { TaxFilters } from 'src/app/models/masters/tax-filters';
import { TypeTaxFilters } from 'src/app/models/masters/type-tax-filters';
import { TaxeBaseRatesApplicationFilters} from 'src/app/models/masters/taxe-base-rates-filter';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';
import { TaxType } from 'src/app/models/masters/tax-type';


@Injectable({
  providedIn: 'root'
})
export class TaxService {

  constructor(public httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this.httpClient)


  getTaxes(filters: TaxFilters){
    return this.httpClient
      .get<Tax[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Tax/Get/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      }) 
      .toPromise()
      .then(result => result)
      .catch( error => {
            return error;
        });
  }


 
  addTax(tax: Tax,idEmpresa: number = 1) {
    debugger;
    const { id } = this._Authservice.storeUser;
    tax.taxeTypeApplication.forEach(item =>{
      item.createdByUserId=id;
      item.updatedByUserId=id;
    })
    return this.httpClient
      .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Tax/Post?userId=${id}&idBusiness=${idEmpresa}`, tax)
      .pipe(map((res: number) => res));
  }

  getTaxesBaseRates(filters: TaxeBaseRatesApplicationFilters) {
    debugger;
    return this.httpClient
      .get<Tax[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/TaxBaseRates/Get`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
      .toPromise()
      .then(result => result)
      .catch(error => {
        return error;
      });

  }


  getTypetax(filters: TypeTaxFilters) {
    debugger;
    return this.httpClient
      .get<TaxType[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/TaxType/Get`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
      .toPromise()
      .then(result => result)
      .catch(error => {
        return error;
      });

  }

}
