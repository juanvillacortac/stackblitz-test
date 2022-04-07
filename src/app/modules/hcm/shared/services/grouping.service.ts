import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Grouping } from 'src/app/modules/hcm/shared/models/laborRelationship/grouping';
import { GroupingFilter } from 'src/app/modules/hcm/shared/filters/grouping-filter';
import { GroupingType } from 'src/app/modules/hcm/shared/models/laborRelationship/grouping-type';
import { GroupingTypeFilter } from 'src/app/modules/hcm/shared/filters/grouping-type-filter';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GroupingService {
  _grouping: Grouping;
  private readonly USER_STATE = '_USER_STATE';

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getGrouping(filters: GroupingFilter = new GroupingFilter()) {
    return this._httpClient
    .get<Grouping[]>(`${environment.API_BASE_URL_HCM_HR}/Grouping/GetGrouping`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    })
  }

  getGroupingById(idGrouping: number) {
    return this._httpClient
    .get<Grouping>(`${environment.API_BASE_URL_HCM_HR}/Grouping/${idGrouping}`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(idGrouping)
    })
    .toPromise()
    .then(result => result)
    .catch( error => {
          return error;
      });
  }

  insertGrouping(grouping: Grouping){
    const { id }  = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_HCM_HR}/Grouping/`+id,grouping);
  }

  getGroupingType(filters: GroupingTypeFilter = new GroupingTypeFilter()) {
    return this._httpClient
    .get<GroupingType[]>(`${environment.API_BASE_URL_HCM_HR}/Grouping/GetGroupingType`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    })
    .toPromise()
    .then(result => result)
    .catch( error => {
          return error;
      });
  }
}
