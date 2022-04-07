import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { CostCenter } from '../../../../../models/masters/cost-center';
import { HttpHelpersService } from '../../../../common/services/http-helpers.service';
import { AuthService } from '../../../../login/shared/auth.service';
import { CostCenterFilters } from '../filters/cost-center-filters';

@Injectable({
  providedIn: 'root'
})
export class CostCenterService {

  private _Authservice: AuthService;

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { 
    this._Authservice = new AuthService(this._httpClient);
  }

  getCentersCostsList(filters: CostCenterFilters = new CostCenterFilters()) {
    return this._httpClient
      .get<CostCenter[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/CostCenter/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  postPort(model: CostCenter) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient
    .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/CostCenter/?userId=${id}`, model);
  }
}
