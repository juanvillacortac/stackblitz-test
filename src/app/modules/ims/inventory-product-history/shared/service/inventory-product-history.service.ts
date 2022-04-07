import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InventoryProductHistory } from 'src/app/models/ims/inventory-product-history';
import { InventoryProductHistoryFilters } from 'src/app/models/ims/inventory-product-history-filters';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryProductHistoryService {

  private readonly USER_STATE = '_USER_STATE';
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice: AuthService = new AuthService(this._httpClient);


  async getInventoryProductHistorylist(filters: InventoryProductHistoryFilters) {
    return this._httpClient.get<InventoryProductHistory[]>(`${environment.API_BASE_URL_OSM_IMS}/InventoryProductHistory/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    }).toPromise();
  }
}
