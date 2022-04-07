import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MerchandiseRequestReportFilter } from 'src/app/models/tms/merchandise_request_report_filter';
import { MerchandiseTransfersReport } from 'src/app/models/tms/merchandise_transfers_report';
import { MerchandiseTransfersReportFilter } from 'src/app/models/tms/merchandise_transfers_report_filter';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MerchandiseTransfersReportService {

  private readonly USER_STATE = '_USER_STATE';
  public _MerchandiseTransfersReport: MerchandiseTransfersReport[];
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice: AuthService = new AuthService(this._httpClient);


  GetMerchandiseTransfersList(filters: MerchandiseTransfersReportFilter = new MerchandiseTransfersReportFilter()) {    
    return this._httpClient
      .get<MerchandiseTransfersReport[]>(`${environment.API_BASE_URL_OSM_TMSMasters}/Vehicle/Get/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }
}