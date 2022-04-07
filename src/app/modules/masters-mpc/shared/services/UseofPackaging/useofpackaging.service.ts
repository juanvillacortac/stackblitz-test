import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UseofpackagingFilter } from '../../filters/useofpackaging-filter';
import { HttpHelpersService } from 'src/app/modules/shared/common-directive/services/http-helpers.service';
import {AuthService} from 'src/app/modules/login/shared/auth.service';
import { Useofpackaging } from 'src/app/models/masters-mpc/useofpackaging';

@Injectable({
  providedIn: 'root'
})
export class UseofpackagingService {

  public _UseofpackagingList: Useofpackaging[];

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getUseofpackagingbyfilter(filters: UseofpackagingFilter = new UseofpackagingFilter()){
    return this._httpClient
      .get<Useofpackaging[]>(`${environment.API_BASE_URL_OSM_MASTERS}/UseofPackaging/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }
  postUseofpackaging(_useofpackaging: Useofpackaging = new Useofpackaging()){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_OSM_MASTERS}/UseofPackaging/`+id, _useofpackaging)
  }
}
