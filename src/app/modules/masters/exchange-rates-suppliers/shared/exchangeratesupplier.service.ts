import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExchangeRatesSupplier } from 'src/app/models/masters/exchange-rates-suppliers';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';
import { ExchangeRatesSupplierFilter } from '../filter/exchange-rates-supplier-filter';

@Injectable({
  providedIn: 'root'
})
export class ExchangeratesupplierService {
  public _RateSupplierList: ExchangeRatesSupplier [];
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);
  getExchangeRatesbyFilter(filters: ExchangeRatesSupplierFilter = new ExchangeRatesSupplierFilter()) {
    return this._httpClient
      .get<ExchangeRatesSupplier[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/ExchangeRateSupplier/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }
  InsertRateSupplier(supplieRate :ExchangeRatesSupplier) 
  {  
    const { id } = this._Authservice.storeUser;
     return this._httpClient
    .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/ExchangeRateSupplier/`+id, supplieRate);
   
  }

}
