import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { HttpHelpersService } from '../../../../../modules/common/services/http-helpers.service';
import { AuthService } from '../../../../../modules/login/shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class VaryingGroupService {
    _VaryingGroup: VaryingGroup[];
  private readonly USER_STATE = '_USER_STATE';

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getTypesVaryings(filters: VaryingGroupFilter = new VaryingGroupFilter()) {
    return this._httpClient
    .get<VaryingGroup[]>(`${environment.API_BASE_URL_HCM_PAYROLL}/VaryingGroup/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    })
  }

  insertTypesVaryings(TypesVaryings: TypesVarying){
    const { id }  = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_HCM_PAYROLL}/VaryingGroup/`+id,TypesVaryings);
  }
}