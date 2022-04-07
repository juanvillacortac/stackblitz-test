import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestType } from 'src/app/models/tms/requesttype';
import { UseType } from 'src/app/models/tms/usetype';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { environment } from 'src/environments/environment';
import { RequestTypeFilter } from '../filters/requesttype-filter';
import { UseTypeFilter } from '../filters/usetype-filter';
import { DetailUseTypeFilter } from '../filters/detailusetype-filter';
import { DetailUseType } from 'src/app/models/tms/detailusetype';
import { PriorityFilter } from '../filters/priority-filter';
import { Priority } from 'src/app/models/tms/priority';
import { TransferTypeFilter } from '../filters/transfertype-filter';
import { TransferType } from 'src/app/models/tms/transfertype';

@Injectable({
  providedIn: 'root'
})
export class CommontmsService {

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }

  getRequestTypesList(filters: RequestTypeFilter = new RequestTypeFilter()) {    
    return this._httpClient
      .get<RequestType[]>(`${environment.API_BASE_URL_OSM_TMSMasters}/RequestType/Get/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  getPriorityList(filters:PriorityFilter = new PriorityFilter()) {    
    return this._httpClient
      .get<Priority[]>(`${environment.API_BASE_URL_OSM_TMSMasters}/Priority/Get/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  getUseTypesList(filters: UseTypeFilter = new UseTypeFilter()) {    
    return this._httpClient
      .get<UseType[]>(`${environment.API_BASE_URL_OSM_TMSMasters}/UseType/GetUseType/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  getDetailUseTypesList(filters: DetailUseTypeFilter = new DetailUseTypeFilter()) {    
    return this._httpClient
      .get<DetailUseType[]>(`${environment.API_BASE_URL_OSM_TMSMasters}/UseType/GetDetailUseType/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  getTransferTypesList(filters: TransferTypeFilter = new TransferTypeFilter()) {    
    return this._httpClient
      .get<TransferType[]>(`${environment.API_BASE_URL_OSM_TMSMasters}/TransferType/Get/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }
}
