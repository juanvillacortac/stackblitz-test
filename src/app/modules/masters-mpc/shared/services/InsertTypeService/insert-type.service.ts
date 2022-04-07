import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { InsertTypeFilter } from '../../filters/insert-type-filter';
import { HttpHelpersService } from 'src/app/modules/shared/common-directive/services/http-helpers.service';
import {AuthService} from 'src/app/modules/login/shared/auth.service';
import { InsertType } from 'src/app/models/masters-mpc/insert-type';

@Injectable({
  providedIn: 'root'
})
export class InsertTypeService {

  public _insertTypeList: InsertType[];

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getInsertTypebyfilter(filters: InsertTypeFilter = new InsertTypeFilter()){
    return this._httpClient
      .get<InsertType[]>(`${environment.API_BASE_URL_OSM_MASTERS}/InsertType/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }
  postInsertType(_insertType: InsertType = new InsertType()){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_OSM_MASTERS}/InsertType/`+id, _insertType)
  }
}
