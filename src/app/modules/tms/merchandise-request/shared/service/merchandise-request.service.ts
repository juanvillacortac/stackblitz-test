import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatabaseResult } from 'src/app/models/common/databaseresult';
import { Product } from 'src/app/models/products/product';
import { MerchandiseRequest } from 'src/app/models/tms/merchandiserequest';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';
import { MerchandiseRequestFilter } from '../filters/merchandise-request-filter';
import { MerchandiseRequestTransferFilter } from '../filters/merchandise-request-transfer-filter';

@Injectable({
  providedIn: 'root'
})
export class MerchandiseRequestService {

  merchandiseRequestList: MerchandiseRequest[] = [];

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice: AuthService = new AuthService(this._httpClient);

  getMerchandiseRequestList(filters: MerchandiseRequestFilter = new MerchandiseRequestFilter()) {
    return this._httpClient
      .get<MerchandiseRequest[]>(`${environment.API_BASE_URL_OSM_MERCHANDISE_REQUEST}/MerchandiseRequest/Get/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  getMerchandiseRequestTransfer(filters: MerchandiseRequestTransferFilter = new MerchandiseRequestTransferFilter()) {
    return this._httpClient
      .get<MerchandiseRequest[]>(`${environment.API_BASE_URL_OSM_MERCHANDISE_REQUEST}/MerchandiseRequest/GetMerchandiseRequestsTransfer/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  InsertMerchandiseRequests(merchandiseRequest: MerchandiseRequest) {
    merchandiseRequest.demandBranch.id = this._Authservice.currentOffice;
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_OSM_MERCHANDISE_REQUEST}/MerchandiseRequest/Insert/` + id, merchandiseRequest);
  }

  UpdateMerchandiseRequests(merchandiseRequest: MerchandiseRequest) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<DatabaseResult>(`${environment.API_BASE_URL_OSM_MERCHANDISE_REQUEST}/MerchandiseRequest/Update/` + id, merchandiseRequest);
  }

  DeleteMerchandiseRequestDetail(idMerchandiseRequestDetail: number, idMerchandiseRequest: number) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .delete<DatabaseResult>(`${environment.API_BASE_URL_OSM_MERCHANDISE_REQUEST}/MerchandiseRequest/Delete/` + idMerchandiseRequestDetail + `/` + idMerchandiseRequest + `/` + id);
  }

  getImage(product: Product){
    return this._httpClient
      .get<string>(`${environment.API_BASE_URL_OSM_MERCHANDISE_REQUEST}/MerchandiseRequest/GetImage/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(product, false)
      });
  }
}
