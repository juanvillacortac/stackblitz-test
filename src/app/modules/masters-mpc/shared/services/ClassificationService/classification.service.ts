import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { classification } from 'src/app/models/masters-mpc/classification'
import { environment } from 'src/environments/environment';
import { ClassificationFilter } from '../../filters/classification-filter';
import { HttpHelpersService } from 'src/app/modules/shared/common-directive/services/http-helpers.service';
import {AuthService} from 'src/app/modules/login/shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClassificationService {
  private readonly USER_STATE = '_USER_STATE';
  public _classificationList: classification[];
  _Authservice : AuthService = new AuthService(this._httpClient);
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) {
   
   }

  getClassificationbyfilter(filters: ClassificationFilter = new ClassificationFilter()) {
    return this._httpClient
      .get<classification[]>(`${environment.API_BASE_URL_OSM_MASTERS}/Classification/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }
 
  postclassification(_classification: classification = new classification()) {
    const { id } = this._Authservice.storeUser;
    
    if(_classification.internalCode=="")
        _classification.internalCode="0"
       
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_OSM_MASTERS}/Classification/`+id, _classification)
  }
}
