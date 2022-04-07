import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InventoryReasons } from 'src/app/models/ims/inventory-reasons';
import { InventoryReasonsConfiguration } from 'src/app/models/ims/inventory-reasons-configuration';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';
import { InventoryReasonConfigurationFilter } from '../filters/inventory-reason-configuration-filter';
import { InventoryReasonFilter } from '../filters/inventory-reason-filter';

@Injectable({
  providedIn: 'root'
})
export class InventoryReasonService {

  _inventoryReasonList:InventoryReasons[];
  private readonly USER_STATE = '_USER_STATE';
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

    //Update
    UpdateInventoryReason(inventoryreason: InventoryReasons) {
      const { id } = this._Authservice.storeUser;
      return this._httpClient
      .post<number>(`${environment.API_BASE_URL_OSM_IMS}/InventoryReason/`+id, inventoryreason);
  }

  getinventoryReasonList(filters: InventoryReasonFilter = new InventoryReasonFilter()) {
     return this._httpClient
       .get<InventoryReasons[]>(`${environment.API_BASE_URL_OSM_IMS}/InventoryReason/`, {
         params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
       });
   }

   getinventoryReasonConfigurationList(filters: InventoryReasonConfigurationFilter = new InventoryReasonConfigurationFilter()) {
    return this._httpClient
      .get<InventoryReasonsConfiguration[]>(`${environment.API_BASE_URL_OSM_IMS}/InventoryReason/InventoryReasonConfiguration/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }
}
