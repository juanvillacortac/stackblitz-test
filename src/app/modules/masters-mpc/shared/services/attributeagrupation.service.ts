import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Attributeagrupation } from 'src/app/models/masters-mpc/attributeagrupation'
import { environment } from 'src/environments/environment';
import { AttributesagrupationFilter } from '../filters/attributesagrupation-filter';
import { HttpHelpersService } from 'src/app/modules/shared/common-directive/services/http-helpers.service';
import { AttributeAgrupation} from '../view-models/attribute-agrupation.viewmodel'
import {AuthService} from 'src/app/modules/login/shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AttributeagrupationService {

  public _attributeAgrupationList: Attributeagrupation[];

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  
  getAttributesAgrupationbyfilter(filters: AttributesagrupationFilter = new AttributesagrupationFilter(), order: number = 0){
    return this._httpClient
      .get<Attributeagrupation[]>(`${environment.API_BASE_URL_OSM_MASTERS}/AttributeAgrupation/${order}`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }
  postAttributesAgrupation(_attributeagrupation: AttributeAgrupation = new AttributeAgrupation()){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_OSM_MASTERS}/AttributeAgrupation/`+id, _attributeagrupation)
  }
}
