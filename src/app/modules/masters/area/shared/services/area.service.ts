import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Area } from 'src/app/models/masters/area';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';
import { AreaFilter } from '../filters/area-filter';
import { AreatypeFilter } from '../filters/areatype-filter';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  _areaList: Area[];
  private readonly USER_STATE = '_USER_STATE';
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice: AuthService = new AuthService(this._httpClient);

  getareaList(filters: AreaFilter = new AreaFilter()) {
    return this._httpClient
      .get<Area[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/areas/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  getareaTypeList(filters: AreatypeFilter = new AreatypeFilter()) {
     return this._httpClient
       .get<Area[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/areas/AreasType`, {
         params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
       });
   }

  // Update
  UpdateArea(area: Area) {
      const { id } = this._Authservice.storeUser;
      return this._httpClient
      .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Areas/` + id, area);
  }

  getareaListPromise(filters: AreaFilter = new AreaFilter()) {
    return this._httpClient
      .get<Area[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/areas/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      }).toPromise();
  }
}
