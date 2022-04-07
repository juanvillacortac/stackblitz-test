import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Normative } from 'src/app/models/masters-mpc/normative';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';
import { NormativeFilter } from '../../filters/normative-filter';

@Injectable({
  providedIn: 'root'
})
export class NormativeService {

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getNormativesbyfilter(filters: NormativeFilter = new NormativeFilter()){
    return this._httpClient
      .get<Normative[]>(`${environment.API_BASE_URL_OSM_MASTERS}/Regulation/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  postNormative(_normative: Normative = new Normative()){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_OSM_MASTERS}/Regulation/`+id, _normative)
  }
}
