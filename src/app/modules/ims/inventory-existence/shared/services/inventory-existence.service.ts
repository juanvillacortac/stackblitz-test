import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InventoryExistence } from 'src/app/models/ims/inventory-existence';
import { ProductExistenceDetails } from 'src/app/models/ims/product-existence-detail';
import { ProductExistenceFilters } from 'src/app/models/ims/product-existence-filters';
import { ProductExistenceTransactionDetails } from 'src/app/models/ims/product-existence-transaction-details';
import { ProductExistenceTransactionFilters } from 'src/app/models/ims/product-existence-transaction-filters';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';
import { InventoryExistenceFilter } from '../filters/inventory-existence-filter';
import { InventoryExistenceViewmodel } from '../view-models/inventory-existence-viewmodel';

@Injectable({
  providedIn: 'root'
})
export class InventoryExistenceService {
  public selectedProduct: InventoryExistenceViewmodel;
  _inventoryExistenceList: InventoryExistence[];
  private readonly USER_STATE = '_USER_STATE';
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice: AuthService = new AuthService(this._httpClient);

  getInventoryExistenceList(filters: InventoryExistenceFilter = new InventoryExistenceFilter()) {
    return this._httpClient
      .get<InventoryExistence[]>(`${environment.API_BASE_URL_OSM_IMS}/InventoryExistence/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      }).toPromise();
  }

  async getProductExistenceDetails(filters: ProductExistenceFilters) {
    return this._httpClient.get<ProductExistenceDetails[]>(`${environment.API_BASE_URL_OSM_IMS}/InventoryExistence/GetProductExistenceDetails/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    }).toPromise();
  }

  async getProductExistenceTransactionDetails(filters: ProductExistenceTransactionFilters) {
    return this._httpClient.get<ProductExistenceTransactionDetails[]>(`${environment.API_BASE_URL_OSM_IMS}/InventoryExistence/GetProductExistenceTransactionDetails/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    }).toPromise();
  }

}
