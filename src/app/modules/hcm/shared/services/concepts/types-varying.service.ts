import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TypesVarying } from 'src/app/modules/hcm/shared/models/concepts/types-varying';
import { TypesVaryingFilter } from 'src/app/modules/hcm/shared/filters/Concepts/types-varying-filter';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { FinancialAplicationFilter } from '../../filters/Concepts/financial-aplication-filter';

@Injectable({
  providedIn: 'root'
})
export class TypesVaryingsService {
    _TypesVaryings: TypesVarying[];
  private readonly USER_STATE = '_USER_STATE';

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getTypesVaryings(filters: TypesVaryingFilter = new TypesVaryingFilter()) {
    return this._httpClient
    .get<TypesVarying[]>(`${environment.API_BASE_URL_HCM_PAYROLL}/TypesVarying/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    })
  }

  insertTypesVaryings(TypesVaryings: TypesVarying){
    const { id }  = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_HCM_PAYROLL}/TypesVarying/`+id,TypesVaryings);
  }
}