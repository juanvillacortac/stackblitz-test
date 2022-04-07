import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gtintype } from 'src/app/models/masters-mpc/gtintype'
import { environment } from 'src/environments/environment';
import { GtintypeFilter } from '../../filters/gtintype-filter';
import { HttpHelpersService } from 'src/app/modules/shared/common-directive/services/http-helpers.service';
import {AuthService} from 'src/app/modules/login/shared/auth.service';
@Injectable({
  providedIn: 'root'
})
export class GtintypeService {

  public _gtinTypeList: Gtintype[];
  private readonly USER_STATE = '_USER_STATE';

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getGtinTypeList(filters: GtintypeFilter = new GtintypeFilter()) {
    return this._httpClient
      .get<Gtintype[]>(`${environment.API_BASE_URL_OSM_MASTERS}/GtinType`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)

      }).toPromise().then(res => this._gtinTypeList = res as Gtintype[]);
  }
  getGtinTypebyfilter(filters: GtintypeFilter = new GtintypeFilter()) {
    return this._httpClient
      .get<Gtintype[]>(`${environment.API_BASE_URL_OSM_MASTERS}/GtinType`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }
  postGtinType(_gtintype: Gtintype = new Gtintype()) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_OSM_MASTERS}/GtinType/`+id, _gtintype)
  }
  getGtinGrouping(filters: any = { id: -1, name: '', active: 1 }) {
    return this._httpClient
      .get<any[]>(`${environment.API_BASE_URL_OSM_MASTERS}/Common/GtinGrouping/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }
}
