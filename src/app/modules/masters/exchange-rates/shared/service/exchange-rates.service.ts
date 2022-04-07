import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExchangeRates } from 'src/app/models/masters/exchange-rates';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';
import { ExchangeRatesFilter } from '../filters/exchange-rates-filter';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRatesService {

  private apiUrl = `${environment.API_BASE_URL_GENERAL_MASTERS}/ExchangeRates`;

  constructor(private httpClient: HttpClient, private httpHelpersService: HttpHelpersService, private authService: AuthService) { }

  getExchangeRatesbyFilter(filters: ExchangeRatesFilter = new ExchangeRatesFilter()) {
    return this.httpClient
      .get<ExchangeRates[]>(this.apiUrl, {
        params: this.httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  saveExchangeRate(model: ExchangeRates) {
    const userId = this.authService.storeUser.id;

    return this.httpClient
      .post<number>(`${this.apiUrl}/saveExchangeRate?userId=${userId}`, model).toPromise();
  }

}
