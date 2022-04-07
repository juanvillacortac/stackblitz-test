import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InventoryOfficesComparative } from 'src/app/models/ims/inventory-offices-comparative';
import { InventoryOfficesComparativeFilters } from 'src/app/models/ims/inventory-offices-comparative-filters';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryOfficesComparativesService {

  private readonly USER_STATE = '_USER_STATE';
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice: AuthService = new AuthService(this._httpClient);


  async getInventoryOfficesComparativelist(filters: InventoryOfficesComparativeFilters) {
    return this._httpClient.get<InventoryOfficesComparative[]>(`${environment.API_BASE_URL_OSM_IMS_ANALYTICS}/Report/InventoryOfficesComparative`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    }).toPromise();
  }
}
