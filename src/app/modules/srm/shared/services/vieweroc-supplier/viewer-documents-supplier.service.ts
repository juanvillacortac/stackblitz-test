import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { FilterViewerocSupplier } from '../../filters/filter-vieweroc-supplier';
import { PurchaselistViewmodel } from '../../view-models/purchaselist-viewmodel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ViewerDocumentsSupplierService {

  public _PurchaseOrderList: PurchaselistViewmodel[];
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService, private _AuthService: AuthService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);


  getPurchasefilter(filters: FilterViewerocSupplier = new FilterViewerocSupplier()){
    return this._httpClient
      .get<PurchaselistViewmodel[]>(`${environment.API_BASE_URL_PURSCHASE_ORDER}/SupplierDocuments/GetPurchaseOrdersSupplier/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }
}
