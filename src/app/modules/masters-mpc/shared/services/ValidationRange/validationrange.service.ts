import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Validationrange } from 'src/app/models/masters-mpc/validationrange';
import { environment } from 'src/environments/environment';
import { ValidationrangeFilter } from '../../filters/validationrange-filter';
import { HttpHelpersService } from 'src/app/modules/shared/common-directive/services/http-helpers.service';
import {AuthService} from 'src/app/modules/login/shared/auth.service';
@Injectable({
  providedIn: 'root'
})
export class ValidationrangeService {

  public _validationRangeList: Validationrange[];
  private readonly USER_STATE = '_USER_STATE';

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getValidationRangeList(filters: ValidationrangeFilter = new ValidationrangeFilter()) {
    return this._httpClient
      .get<Validationrange[]>(`${environment.API_BASE_URL_OSM_MASTERS}/ValidationRange`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)

      }).toPromise().then(res => this._validationRangeList = res as Validationrange[]);
  }
  geValidationRangebyfilter(filters: ValidationrangeFilter = new ValidationrangeFilter()) {
    return this._httpClient
      .get<Validationrange[]>(`${environment.API_BASE_URL_OSM_MASTERS}/ValidationRange`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }
  postValidationRange(_validationrange: Validationrange = new Validationrange()) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_OSM_MASTERS}/ValidationRange/`+id, _validationrange)
  }
  getTypeValidationRange(filters: any = { id: -1, name: '', active: 1 }) {
    return this._httpClient
      .get<any[]>(`${environment.API_BASE_URL_OSM_MASTERS}/Common/TypeValidationRange/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }
}
