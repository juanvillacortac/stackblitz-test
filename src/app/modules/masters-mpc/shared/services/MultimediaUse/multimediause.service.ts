import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { multimediause } from 'src/app/models/masters-mpc/multimediause'
import { environment } from 'src/environments/environment';
import { MultimediauseFilter} from '../../filters/multimediause-filter';
import { HttpHelpersService } from 'src/app/modules/shared/common-directive/services/http-helpers.service';
import { MultimediaUse } from '../../view-models/multimedia-use.viewmodel'
import {AuthService} from 'src/app/modules/login/shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MultimediauseService {

  public _multimediaUseList: multimediause[];
  private readonly USER_STATE = '_USER_STATE';

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getMultimediaUseList(filters: MultimediauseFilter = new MultimediauseFilter()) {
    return this._httpClient
      .get<multimediause[]>(`${environment.API_BASE_URL_OSM_MASTERS}/MultimediaUse`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)

      }).toPromise().then(res => this._multimediaUseList = res as multimediause[]);
  }
  getMultimediaUsebyfilter(filters: MultimediauseFilter = new MultimediauseFilter()) {
    return this._httpClient
      .get<multimediause[]>(`${environment.API_BASE_URL_OSM_MASTERS}/MultimediaUse`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }
  postMultimediaUse(_multimediause: MultimediaUse = new MultimediaUse()) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_OSM_MASTERS}/MultimediaUse/`+id, _multimediause)
  }
}
