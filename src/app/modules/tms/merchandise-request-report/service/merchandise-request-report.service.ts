import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MerchandiseRequestReport } from 'src/app/models/tms/merchandise_request_report';
import { MerchandiseRequestReportFilter } from 'src/app/models/tms/merchandise_request_report_filter';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MerchandiseRequestReportService {

  private readonly USER_STATE = '_USER_STATE';
  public _MerchandiseReport: MerchandiseRequestReport[];
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) 
  { 
    
  }
  _Authservice: AuthService = new AuthService(this._httpClient);


  GetMerchandiseRequestList(filters: MerchandiseRequestReportFilter = new MerchandiseRequestReportFilter()) {    
    return this._httpClient
      .get<MerchandiseRequestReport[]>(`${environment.API_BASE_URL_OSM_TMSMasters}/MerchandiseRequestReport/Get`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }
}
