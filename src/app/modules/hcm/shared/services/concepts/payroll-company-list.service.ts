import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PayrollCompany } from 'src/app/modules/hcm/shared/models/concepts/payroll-company';
import { PayrollCompanyList } from 'src/app/modules/hcm/shared/models/concepts/payroll-company-list';
import { PayrollAplicationFilter } from 'src/app/modules/hcm/shared/filters/Concepts/payroll-aplication-filter';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { FinancialAplicationFilter } from '../../filters/Concepts/financial-aplication-filter';

@Injectable({
  providedIn: 'root'
})
export class PayrollCompanyListService {
    _PayrollCompanyList: PayrollCompanyList;
  private readonly USER_STATE = '_USER_STATE';

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getPayrollCompanyLists(filters: PayrollAplicationFilter = new PayrollAplicationFilter()) {
    return this._httpClient
    .get<PayrollCompanyList>(`${environment.API_BASE_URL_HCM_PAYROLL}/PayrollCompanyList/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    })
  }

  insertPayrollCompanyList(PayrollCompanyList: PayrollCompanyList){
    const { id }  = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_HCM_PAYROLL}/PayrollCompanyList/`+id,PayrollCompanyList);
  }

  getPayrollCompanyListById(idPayrollCompanyList: number) {
    return this._httpClient
    .get<PayrollCompany>(`${environment.API_BASE_URL_HCM_PAYROLL}/PayrollCompanyList/${idPayrollCompanyList}`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(idPayrollCompanyList)
    })
    .toPromise()
    .then(result => result)
    .catch( error => {
          return error;
      });
  }

  getFinancialConfig(filters: FinancialAplicationFilter = new FinancialAplicationFilter()) {
    return this._httpClient
    .get<string>(`${environment.API_BASE_URL_HCM_PAYROLL}/PayrollCompanyList/FinancialAplication`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    })
  }
}
