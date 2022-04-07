import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PatologyType } from 'src/app/modules/hcm/shared/models/masters/patology-type';
import { PatologyTypeFilter } from 'src/app/modules/hcm/shared/filters/patology-type-filter';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PatologyTypeService {
  _PatologyType: PatologyType[];
  private readonly USER_STATE = '_USER_STATE';

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getPatologyType(filters: PatologyTypeFilter = new PatologyTypeFilter()) {
    return this._httpClient
    .get<PatologyType[]>(`${environment.API_BASE_URL_HCM_MASTERS}/PatologyType/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  insertPatologyType(patologyType: PatologyType){
    const { id }  = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_HCM_MASTERS}/PatologyType/`+id,patologyType);
  }
}