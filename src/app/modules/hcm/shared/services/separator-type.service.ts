import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SeparatorType } from 'src/app/modules/hcm/shared/models/masters/separator-type';
import { SeparatorTypeFilter } from 'src/app/modules/hcm/shared/filters/separator-type-filter';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';

@Injectable({
  providedIn: 'root'
})

export class SeparatorTypeService {
  public _separatorTypeList:SeparatorType[];
  private readonly USER_STATE = '_USER_STATE';
  
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);
  
  getSeparatorTypeList(filters: SeparatorTypeFilter = new SeparatorTypeFilter()) {
    return this._httpClient
      .get<SeparatorType[]>(`${environment.API_BASE_URL_HCM_HR}/SeparatorType`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }
  

  }



