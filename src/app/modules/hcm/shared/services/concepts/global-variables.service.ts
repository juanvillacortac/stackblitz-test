import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GlobalVariable } from 'src/app/modules/hcm/shared/models/concepts/global-variable';
import { GlobalVariablesFilter } from 'src/app/modules/hcm/shared/filters/Concepts/global-variables-filter';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { FinancialAplicationFilter } from '../../filters/Concepts/financial-aplication-filter';
import { GlobalVariablesDeleteFilter } from '../../filters/Concepts/global-variables-delete-filter';

@Injectable({
  providedIn: 'root'
})
export class GlobalVariablesService {
    _GlobalVariables: GlobalVariable[];
  private readonly USER_STATE = '_USER_STATE';

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getGlobalVariables(filters: GlobalVariablesFilter = new GlobalVariablesFilter()) {
    return this._httpClient
    .get<GlobalVariable[]>(`${environment.API_BASE_URL_HCM_PAYROLL}/GlobalVariables/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    })
  }

  insertGlobalVariables(GlobalVariables: GlobalVariable){
    const { id }  = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_HCM_PAYROLL}/GlobalVariables/`+id,GlobalVariables);
  }

  deletedGlobalVariables(filters: GlobalVariablesDeleteFilter){
    const { id }  = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_HCM_PAYROLL}/GlobalVariables/deleted?`+id,filters);
  }
}
