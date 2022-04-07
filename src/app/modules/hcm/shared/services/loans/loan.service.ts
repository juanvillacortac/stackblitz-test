import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Loan } from 'src/app/modules/hcm/shared/models/loans/loan';
import { LoanList } from 'src/app/modules/hcm/shared/models/loans/loan-list';
import { LoanFilter } from 'src/app/modules/hcm/shared/filters/loans/loan-filter';
import { LoanListFilter } from '../../filters/loans/loan-list-filter';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { LoanTypeFilter } from '../../filters/loans/loan-type-filter';
import { LoanType } from '../../models/loans/loan-type';
import { ConversionRateFilter } from '../../filters/loans/conversion-rate-filter';
import { ConversionRateList } from '../../models/loans/conversion-rate-list';
import { PaymentScheduleListFilter } from '../../filters/loans/payment-schedule-list-filter';
import { LoanInstallment } from '../../models/loans/loan-installment';
//import { LoanDeleteFilter } from '../../filters/Concepts/global-variables-delete-filter';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
    _Loan: Loan[];
  private readonly USER_STATE = '_USER_STATE';

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getLoan(filters: LoanFilter = new LoanFilter()) {
    return this._httpClient
    .get<Loan>(`${environment.API_BASE_URL_HCM_PAYROLL}/Loan/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    })
  }

  insertLoan(Loan: Loan){
    const { id }  = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_HCM_PAYROLL}/Loan/`+id,Loan);
  }

  getLoanList(filters: LoanListFilter = new LoanListFilter()) {
    return this._httpClient
    .get<LoanList[]>(`${environment.API_BASE_URL_HCM_PAYROLL}/Loan/Listado/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    })
  }

  getLoanType(filters: LoanTypeFilter = new LoanTypeFilter()) {
    return this._httpClient
    .get<LoanType[]>(`${environment.API_BASE_URL_HCM_MASTERS}/LoanType/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    })
  }

  getConversionRate(filters: ConversionRateFilter = new ConversionRateFilter()) {
    return this._httpClient
    .get<ConversionRateList[]>(`${environment.API_BASE_URL_HCM_PAYROLL}/Loan/Tasa/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    })
  }

  getPaymentSchedule(filters: PaymentScheduleListFilter = new PaymentScheduleListFilter()) {
    return this._httpClient
    .get<LoanInstallment[]>(`${environment.API_BASE_URL_HCM_PAYROLL}/Loan/PlanPago/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    })
  }

  insertPaymentPlan(Loan: Loan){
    const { id }  = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_HCM_PAYROLL}/Loan/PlanPago/`+id,Loan);
  }
}