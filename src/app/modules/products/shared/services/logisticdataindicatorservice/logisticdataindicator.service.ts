import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from 'src/app/modules/shared/common-directive/services/http-helpers.service';
import {AuthService} from 'src/app/modules/login/shared/auth.service';
import { LogisticDataIndicator } from 'src/app/models/products/logisticDataIndicator';
import { LogisticdataindicatorFilter } from 'src/app/modules/products/shared/filters/logisticdataindicator-filter';

@Injectable({
  providedIn: 'root'
})
export class LogisticdataindicatorService {

  public _LogisticDataIndicator: LogisticDataIndicator;

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService, private _AuthService: AuthService) { }

  getLogisticDataIndicatorbyfilter(filters: LogisticdataindicatorFilter = new LogisticdataindicatorFilter()){
    const { id } = this._AuthService.storeUser;
    return this._httpClient
      .get<LogisticDataIndicator>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/LogisticDataIndicator/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  postLogisticDataIndicator(logisticDataIndicator: LogisticDataIndicator = new LogisticDataIndicator()){
    const { id } = this._AuthService.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/LogisticDataIndicator/`+id, logisticDataIndicator)
  }
}
