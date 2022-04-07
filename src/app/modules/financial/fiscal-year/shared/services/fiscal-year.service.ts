import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { FiscalYear } from 'src/app/models/financial/fiscalYear/FiscalYear';
import { FISCAL_YEAR_FILTER_LIST_DEFAULT } from 'src/app/models/financial/fiscalYear/filters/fiscalYearFilter';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FiscalPeriodModule } from 'src/app/models/financial/fiscalYear/fiscalPeriodModule';

@Injectable({
  providedIn: 'root'
})
export class FiscalYearService {

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice: AuthService = new AuthService(this._httpClient);

  getList(filters = FISCAL_YEAR_FILTER_LIST_DEFAULT): Observable<FiscalYear[]> {
    return this._httpClient
      .get<FiscalYear[]>(`${environment.API_BASE_URL_FINANCIAL_MASTER}/FiscalYear/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  get(id: number) {
    return this._httpClient
      .get<FiscalYear>(`${environment.API_BASE_URL_FINANCIAL_MASTER}/FiscalYear/${id}`)
      .pipe(
        map((year) => ({ ...year, ...new FiscalYear() }))
      )
  }

  post(model: any, idEmpresa: number = 1) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient.post(`${environment.API_BASE_URL_FINANCIAL_MASTER}/FiscalYear/?idUser=${id}&idBusiness=${idEmpresa}`, model)
  }

  getModuleList(idBusiness: number = 1): Observable<FiscalPeriodModule[]> {
    return this._httpClient
      .get<any[]>(`${environment.API_BASE_URL_FINANCIAL_MASTER}/Module?idBusiness=${idBusiness}`)
      .pipe(map(data => data.map(v => ({
        ...new FiscalPeriodModule(),
        id: v.id,
        name: v.moduleContent,
      }))))
  }
}
