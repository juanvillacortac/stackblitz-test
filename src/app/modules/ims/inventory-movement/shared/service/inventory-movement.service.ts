import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetailInventoryMovement } from 'src/app/models/ims/detail-inventory-movement';
import { InventoryMovement } from 'src/app/models/ims/inventory-movement';
import { productInventoryMovement } from 'src/app/models/ims/product-inventory-movemnt';
import { TransitInventoryMovement } from 'src/app/models/ims/transit-inventory-movement';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';
import { DetailInventoryMovementFilter } from '../filter/detail-inventory-movement-filter';
import { InventoryMovementFilter } from '../filter/inventory-movement-filter';
import { ProductInventoryMovementFilter } from '../filter/product-inventory-movementr-filter';

@Injectable({
  providedIn: 'root'
})
export class InventoryMovementService {

  public _List: InventoryMovement[];
  public _DetailList: DetailInventoryMovement[];
  public _TransitList: TransitInventoryMovement[];
  public _ProductList: productInventoryMovement;

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService)  { }
  _Authservice : AuthService = new AuthService(this._httpClient);_
  
  getInventoryMovementList(filters: InventoryMovementFilter = new InventoryMovementFilter()) {
    return this._httpClient
      .get<InventoryMovement[]>(`${environment.API_BASE_URL_OSM_IMS}/InventoryMovement/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }
  getDetailInventoryMovementList(filters: DetailInventoryMovementFilter = new DetailInventoryMovementFilter()) {
    return this._httpClient
      .get<DetailInventoryMovement[]>(`${environment.API_BASE_URL_OSM_IMS}/InventoryMovement/DetailMovement`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }
  getTransitInventoryMovementList(filters: DetailInventoryMovementFilter = new DetailInventoryMovementFilter()) {
    return this._httpClient
      .get<TransitInventoryMovement[]>(`${environment.API_BASE_URL_OSM_IMS}/InventoryMovement/TransitMovement`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  getProducttInventoryMovementList(filters: ProductInventoryMovementFilter = new ProductInventoryMovementFilter()) { 
    return this._httpClient
      .get<productInventoryMovement>(`${environment.API_BASE_URL_OSM_IMS}/InventoryMovement/ProductMovement`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

}
