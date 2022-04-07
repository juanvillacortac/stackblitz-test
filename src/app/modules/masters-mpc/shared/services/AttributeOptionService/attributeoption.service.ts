import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AttributeoptionFilter } from '../../filters/attributeoption-filter';
import { HttpHelpersService } from 'src/app/modules/shared/common-directive/services/http-helpers.service';
import { Attributeoption } from 'src/app/models/masters-mpc/attributeoption';
import {AuthService} from 'src/app/modules/login/shared/auth.service';
import { OptionxAttribute } from '../../filters/optionxattribute';

@Injectable({
  providedIn: 'root'
})
export class AttributeoptionService {

  public _AttributeoptionList : Attributeoption[];

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getAttributeoptionbyfilter(filters: AttributeoptionFilter = new AttributeoptionFilter(), order: number = 0){
    return this._httpClient
      .get<Attributeoption[]>(`${environment.API_BASE_URL_OSM_MASTERS}/AttributeOption/${order}`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  postAttributeoption(_attributeoption: Attributeoption = new Attributeoption()){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_OSM_MASTERS}/AttributeOption/`+id, _attributeoption)
  }

  getOptionsxAttributebyfilter(filters: OptionxAttribute = new OptionxAttribute()){
    return this._httpClient
      .get<Attributeoption[]>(`${environment.API_BASE_URL_OSM_MASTERS}/AttributeOption/GetOptionxAttribute`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

}
