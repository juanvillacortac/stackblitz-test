import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExchangeRateType } from 'src/app/models/masters/exchange-rate-type';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { environment } from 'src/environments/environment';
import { ExchangeRateTypeFilter } from '../filters/exchange-rate-type-filter';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateTypeService {

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }

  getExchangeRateTypebyFilter(filters: ExchangeRateTypeFilter = new ExchangeRateTypeFilter()) {
    return this._httpClient
      .get<ExchangeRateType[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/ExchangeRateType/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }
}
