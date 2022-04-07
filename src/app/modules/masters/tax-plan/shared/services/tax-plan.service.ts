import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { FiscalYear } from 'src/app/models/financial/fiscalYear/FiscalYear';
import { FISCAL_YEAR_FILTER_LIST_DEFAULT } from 'src/app/models/financial/fiscalYear/filters/fiscalYearFilter';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TaxPlan, TaxPlanApplicationType, TaxPlanFilter, TaxPlanRawTax, TaxPlanRawTaxFilter } from 'src/app/models/masters/tax-plan';

@Injectable({
  providedIn: 'root'
})
export class TaxPlanService {

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice: AuthService = new AuthService(this._httpClient);

  getList(filters = new TaxPlanFilter()): Observable<TaxPlan[]> {
    return this._httpClient
      .get<TaxPlan[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/TaxPlan/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  getRawTaxes(filters = new TaxPlanRawTaxFilter()): Observable<TaxPlanRawTax[]> {
    return this._httpClient
      .get<TaxPlanRawTax[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/TaxPlan/RawTaxes`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  getApplicationTypes(): Observable<TaxPlanApplicationType[]> {
    return this._httpClient
      .get<TaxPlanApplicationType[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/TaxPlanApplicationType`)
  }

  get(id: number) {
    return this._httpClient
      .get<TaxPlan>(`${environment.API_BASE_URL_GENERAL_MASTERS}/TaxPlan/${id}`)
      .pipe(
        map((year) => ({ ...year, ...new FiscalYear() }))
      )
  }

  post(model: TaxPlan, idEmpresa: number = 1) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient.post(`${environment.API_BASE_URL_GENERAL_MASTERS}/TaxPlan/?idUser=${id}&idBusiness=${idEmpresa}`, model)
  }
}
