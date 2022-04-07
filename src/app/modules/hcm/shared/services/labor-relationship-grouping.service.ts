import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LaborRelationshipxGrouping } from 'src/app/modules/hcm/shared/models/laborRelationship/labor-relationship-grouping';
import { LaborRelationshipxGroupingList } from 'src/app/modules/hcm/shared/models/laborRelationship/labor-relationship-grouping-list';
import { LaborRelationshipxGroupingFilter } from 'src/app/modules/hcm/shared/filters/laborRelationship/labor-relationship-grouping-filter';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LaborRelationshipxGroupingService {
    _laborRelationshipxGrouping: LaborRelationshipxGrouping;
  private readonly USER_STATE = '_USER_STATE';

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getLaborRelationshipxGrouping(filters: LaborRelationshipxGroupingFilter = new LaborRelationshipxGroupingFilter()) {
    return this._httpClient
    .get<LaborRelationshipxGrouping[]>(`${environment.API_BASE_URL_HCM_HR}/LaborRelationshipxGrouping/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    })
  }

  insertLaborRelationshipxGrouping(laborRelationshipxGrouping: LaborRelationshipxGroupingList){
    const { id }  = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_HCM_HR}/LaborRelationshipxGrouping/`+id,laborRelationshipxGrouping);
  }

  getLaborRelationshipxGroupingById(idLaborRelationshipxGrouping: number) {
    return this._httpClient
    .get<LaborRelationshipxGrouping>(`${environment.API_BASE_URL_HCM_HR}/LaborRelationshipxGrouping/${idLaborRelationshipxGrouping}`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(idLaborRelationshipxGrouping)
    })
    .toPromise()
    .then(result => result)
    .catch( error => {
          return error;
      });
  }
}
