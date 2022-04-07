import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaxPayerType } from 'src/app/models/masters/taxpayertype';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { environment } from 'src/environments/environment';
import { TaxPayerTypeFilter } from '../filter/taxpayer-type-filter';

@Injectable({
  providedIn: 'root'
})
export class TaxpayertypeService {

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }

  getTaxPayerTypebyFilter(filters: TaxPayerTypeFilter = new TaxPayerTypeFilter()) {
    return this._httpClient
      .get<TaxPayerType[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/TaxPayerType/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }
}
