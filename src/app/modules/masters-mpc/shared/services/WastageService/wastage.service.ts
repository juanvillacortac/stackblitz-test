import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { WastageFilter } from '../../filters/wastage-filter';
import { HttpHelpersService } from 'src/app/modules/shared/common-directive/services/http-helpers.service';
// import { Typeofparts} from 'src/app/models/masters-mpc/typeofparts'
import {AuthService} from 'src/app/modules/login/shared/auth.service';
import { Wastage } from 'src/app/models/masters-mpc/wastage';

@Injectable({
  providedIn: 'root'
})
export class WastageService {

  public _wastageList: Wastage[];

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getWastagebyfilter(filters: WastageFilter = new WastageFilter()){
    return this._httpClient
      .get<Wastage[]>(`${environment.API_BASE_URL_OSM_MASTERS}/Wastage/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }
  postWastage(_wastage: Wastage = new Wastage()){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_OSM_MASTERS}/Wastage/`+id, _wastage)
  }
}

