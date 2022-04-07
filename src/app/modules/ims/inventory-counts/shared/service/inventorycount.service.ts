import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CountForCountdetail } from 'src/app/models/ims/count-for-detail-count';
import { DetailInventoryCount } from 'src/app/models/ims/detail-inventory-count';
import { InventoryCount } from 'src/app/models/ims/inventory-count';
import { InventoryCountReport } from 'src/app/models/ims/inventory-count-report';
import { InventoryCountReportFilter } from 'src/app/models/ims/inventory-count-report-filter';
import { OperatorInventoryCount } from 'src/app/models/ims/operator-count';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';
import { CountForCountDetailFilter } from '../filter/count-for-count-detail-filter';
import { DetailInventoryFilter } from '../filter/detail-inventory-count-filter';
import { InventoryCountFilter } from '../filter/inventory-count-filter';
import { ProductCountInventoryFilter } from '../filter/product-count-detail-filter';

@Injectable({
  providedIn: 'root'
})
export class InventorycountService {

  public _List: InventoryCount[];
  public _ProductList:DetailInventoryCount[];
  public _OperatorList: OperatorInventoryCount[];
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService)  { }
  _Authservice : AuthService = new AuthService(this._httpClient)

  getInventoryCountList(filters: InventoryCountFilter = new InventoryCountFilter()) {
    return this._httpClient
      .get<InventoryCount[]>(`${environment.API_BASE_URL_OSM_IMS}/InventoryCount/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  getInventoryCountListCalendar(filters: InventoryCountFilter = new InventoryCountFilter()) {
    return this._httpClient
      .get<InventoryCount[]>(`${environment.API_BASE_URL_OSM_IMS}/InventoryCount/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      }).toPromise();
  }

  getInventoryCountReportResult(filters: InventoryCountReportFilter) {
    return this._httpClient
    .get<InventoryCountReport[]>(`${environment.API_BASE_URL_OSM_IMS}/InventoryCount/CountReport/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
    }).toPromise();
  }

  getProductInventoryCountList(filters: ProductCountInventoryFilter = new ProductCountInventoryFilter()) {
    return this._httpClient
      .get<DetailInventoryCount[]>(`${environment.API_BASE_URL_OSM_IMS}/InventoryCount/ProductDetail`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }
  getDetailInventoryCountList(filters: DetailInventoryFilter = new DetailInventoryFilter()) {
    return this._httpClient
      .get<DetailInventoryCount[]>(`${environment.API_BASE_URL_OSM_IMS}/InventoryCount/DetailCount`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }
  InsertUpdateInventoryCount(count :InventoryCount) 
  {  
    const { id } = this._Authservice.storeUser;
     return this._httpClient
    .post<number>(`${environment.API_BASE_URL_OSM_IMS}/InventoryCount/`+id, count);
   
  }
  
  CanceledOrFinalizedInventoryCount(count :InventoryCount) 
  {  
    const { id } = this._Authservice.storeUser;
     return this._httpClient
    .post<number>(`${environment.API_BASE_URL_OSM_IMS}/InventoryCount/CanceledOrFinalized`+id, count);
   
  }
  InsertcountForInventoryCount(count :CountForCountdetail) 
  {  
    const { id } = this._Authservice.storeUser;
     return this._httpClient
    .post<number>(`${environment.API_BASE_URL_OSM_IMS}/InventoryCount/CountForDetail`+id, count); 
  }

  InactiveDetailInventoryCount(count:DetailInventoryCount) 
  {  
    const { id } = this._Authservice.storeUser;
     return this._httpClient
    .post<number>(`${environment.API_BASE_URL_OSM_IMS}/InventoryCount/InactiveDetail`+id,count); 
  }
  InactiveOperator(count :OperatorInventoryCount) 
  {  
    debugger
    const { id } = this._Authservice.storeUser;
     return this._httpClient
    .post<number>(`${environment.API_BASE_URL_OSM_IMS}/InventoryCount/InactiveOperator`+id,count); 
  }
  
}
