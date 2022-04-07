import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Repayment } from 'src/app/modules/hcm/shared/models/loans/repayment';
import { RepaymentFilter } from 'src/app/modules/hcm/shared/filters/loans/repayment-filter';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
//import { RepaymentDeleteFilter } from '../../filters/Concepts/global-variables-delete-filter';

@Injectable({
  providedIn: 'root'
})
export class RepaymentService {
    _Repayment: Repayment[];
  private readonly USER_STATE = '_USER_STATE';

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getRepayment(filters: RepaymentFilter = new RepaymentFilter()) {
    return this._httpClient
    .get<Repayment>(`${environment.API_BASE_URL_HCM_PAYROLL}/Repayment/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    })
  }

  insertRepayment(Repayment: Repayment){
    const { id }  = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_HCM_PAYROLL}/Repayment/`+id,Repayment);
  }
}