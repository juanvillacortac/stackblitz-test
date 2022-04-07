import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DescriptionTypeFilter } from '../../filters/descriptionType-filter';
import { HttpHelpersService } from 'src/app/modules/shared/common-directive/services/http-helpers.service';
import {AuthService} from 'src/app/modules/login/shared/auth.service';
import { DescriptionType } from 'src/app/models/masters-mpc/description-type';

@Injectable({
  providedIn: 'root'
})
export class DescriptionTypeService {

  public _descriptionList: DescriptionType[];

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getDescriptionbyfilter(filters: DescriptionTypeFilter = new DescriptionTypeFilter()){
    return this._httpClient
      .get<DescriptionType[]>(`${environment.API_BASE_URL_OSM_MASTERS}/DescriptionType/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }
  postDescription(_description: DescriptionType = new DescriptionType()){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_OSM_MASTERS}/DescriptionType/`+id, _description)
  }
}
