import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Adjustment } from 'src/app/models/ims/adjustment';
import { AdjustmentFilterReport } from 'src/app/models/ims/adjustment-filter-report';
import { AdjustmentReport } from 'src/app/models/ims/adjustment-report';
import { AdjustmentType } from 'src/app/models/ims/adjustment-type';
import { InventoryProduct } from 'src/app/models/ims/inventory-product';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';
import { AdjustmentDetailFilter } from '../filters/adjustment-detail-filter';
import { AdjustmentFilter } from '../filters/adjustment-filter';
import { AdjustmentTypeFilter } from '../filters/adjustment-type-filter';
import { InventoryProductFilter } from '../filters/inventory-product-filter';

@Injectable({
  providedIn: 'root'
})
export class InventoryAdjustmentService {

  _AdjustmentList:Adjustment[];
  private readonly USER_STATE = '_USER_STATE';
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);


  getAdjustmentList(filters: AdjustmentFilter = new AdjustmentFilter()) {
     return this._httpClient
       .get<Adjustment[]>(`${environment.API_BASE_URL_OSM_IMS}/InventoryAdjustment/GetAdjustment/`, {
         params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
       });
   }

   getAdjustmentDetail(filters: AdjustmentDetailFilter = new AdjustmentDetailFilter()) {
    return this._httpClient
      .get<Adjustment[]>(`${environment.API_BASE_URL_OSM_IMS}/InventoryAdjustment/GetAdjustmentDetail/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  
  getAdjustmentReport(filters: AdjustmentFilterReport = new AdjustmentFilterReport()) {
    return this._httpClient
      .get<AdjustmentReport[]>(`${environment.API_BASE_URL_OSM_IMS}/InventoryAdjustment/GetAdjustmentReport/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      }).toPromise();
  }

   getAdjustmentTypeList(filters: AdjustmentTypeFilter = new AdjustmentTypeFilter()) {
     return this._httpClient
       .get<AdjustmentType[]>(`${environment.API_BASE_URL_OSM_IMS}/InventoryAdjustment/GetAdjustmentType/`, {
         params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
       });
   }

   getInventoryProduct(filters: InventoryProductFilter = new InventoryProductFilter()) {
    return this._httpClient
      .get<InventoryProduct[]>(`${environment.API_BASE_URL_OSM_IMS}/InventoryAdjustment/GetInventoryProduct/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  UpdateInventoryAdjustment(adjustment: Adjustment) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient
    .post<Adjustment[]>(`${environment.API_BASE_URL_OSM_IMS}/InventoryAdjustment/`+id, adjustment);
}

 ChangeInventoryAdjustmentStatus(adjustment: Adjustment) {
  const { id } = this._Authservice.storeUser;
  return this._httpClient
  .post<Adjustment[]>(`${environment.API_BASE_URL_OSM_IMS}/InventoryAdjustment/ChangeStatus`+id, adjustment);
}

}
