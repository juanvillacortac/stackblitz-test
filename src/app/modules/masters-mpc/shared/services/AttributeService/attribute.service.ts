import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AttributeFilter } from '../../filters/attribute-filter';
import { HttpHelpersService } from 'src/app/modules/shared/common-directive/services/http-helpers.service';
import { Attribute } from 'src/app/models/masters-mpc/attribute';
import {AuthService} from 'src/app/modules/login/shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {

  public _AttributeList : Attribute[];

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getAttributebyfilter(filters: AttributeFilter = new AttributeFilter(), order: number = 0){
    return this._httpClient
      .get<Attribute[]>(`${environment.API_BASE_URL_OSM_MASTERS}/Attribute/${order}`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  postAttribute(_attribute: Attribute = new Attribute()){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_OSM_MASTERS}/Attribute/`+id, _attribute)
  }
}
