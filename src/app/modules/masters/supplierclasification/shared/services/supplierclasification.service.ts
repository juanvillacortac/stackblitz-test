import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SupplierClasification } from 'src/app/models/masters/supplier-clasification';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';
import { SupplierClasificationFilter } from '../filters/supplier-clasification-filter';

@Injectable({
  providedIn: 'root'
})
export class SupplierclasificationService {

  supplierClafisicationList: SupplierClasification[] = [];
  
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getSupplierClasificationList(filters: SupplierClasificationFilter = new SupplierClasificationFilter()) {
    return this._httpClient
      .get<SupplierClasification[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/SupplierClasification/GetSupplierClasification`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  postSupplierClasification(supplierclasification: SupplierClasification) {
    const userId = this._Authservice.storeUser.id;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/SupplierClasification/PostSupplierClasification?userId=${userId}`, supplierclasification);
  }
}
