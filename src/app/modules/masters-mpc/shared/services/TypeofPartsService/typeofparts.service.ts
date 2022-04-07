import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TypeofpartsFilter } from '../../filters/typeofparts-filter';
import { HttpHelpersService } from 'src/app/modules/shared/common-directive/services/http-helpers.service';
import { Typeofparts} from 'src/app/models/masters-mpc/typeofparts'
import {AuthService} from 'src/app/modules/login/shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TypeofpartsService {

  public _typeofPartsList: Typeofparts[];

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getTypeofpartsbyfilter(filters: TypeofpartsFilter = new TypeofpartsFilter()){
    return this._httpClient
      .get<Typeofparts[]>(`${environment.API_BASE_URL_OSM_MASTERS}/TypeofParts/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }
  postTypeofparts(_typeofparts: Typeofparts = new Typeofparts()){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_OSM_MASTERS}/TypeofParts/`+id, _typeofparts)
  }
}
