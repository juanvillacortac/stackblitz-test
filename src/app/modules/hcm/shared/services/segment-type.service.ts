import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SegmentType } from 'src/app/modules/hcm/shared/models/masters/segment-type';
import { SegmentTypeFilter } from 'src/app/modules/hcm/shared/filters/segment-type-filter';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';

@Injectable({
  providedIn: 'root'
})

export class SegmentTypeService {
  public _segmentsTypeList:SegmentType[];
  private readonly USER_STATE = '_USER_STATE';
  
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);
  
  getSegmentTypeList(filters: SegmentTypeFilter = new SegmentTypeFilter()) {
    return this._httpClient
      .get<SegmentType[]>(`${environment.API_BASE_URL_HCM_HR}/SegmentType`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }
  

  }



