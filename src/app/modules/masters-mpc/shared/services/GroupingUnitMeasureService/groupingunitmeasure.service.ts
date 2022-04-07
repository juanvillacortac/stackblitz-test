import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { groupingunitmeasure } from 'src/app/models/masters-mpc/groupingunitmeasure'
import { environment } from 'src/environments/environment';
import { GroupingunitmeasureFilter } from '../../filters/groupingunitmeasure-filter';
import { HttpHelpersService } from 'src/app/modules/shared/common-directive/services/http-helpers.service';
import { GroupingUnitMeasure } from '../../view-models/grouping-unit-measure.viewmodel'
import {AuthService} from 'src/app/modules/login/shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GroupingunitmeasureService {

  public _groupingUnitMeasureList: groupingunitmeasure[];
  private readonly USER_STATE = '_USER_STATE';
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);


  getGroupingUnitMeasureList(filters: GroupingunitmeasureFilter = new GroupingunitmeasureFilter(), order: number = 0) {
    return this._httpClient
      .get<groupingunitmeasure[]>(`${environment.API_BASE_URL_OSM_MASTERS}/GroupingUnitMeasure/${order}`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
        
      }).toPromise().then(res => this._groupingUnitMeasureList = res as groupingunitmeasure[]);
  }
  getGroupingUnitMeasurebyfilter(filters: GroupingunitmeasureFilter = new GroupingunitmeasureFilter(), order: number = 0) {
    return this._httpClient
      .get<groupingunitmeasure[]>(`${environment.API_BASE_URL_OSM_MASTERS}/GroupingUnitMeasure/${order}`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }
  postGroupingUnitMeasure(_groupingunitmeasure: GroupingUnitMeasure = new GroupingUnitMeasure()) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_OSM_MASTERS}/GroupingUnitMeasure/`+id, _groupingunitmeasure)
  }
}
