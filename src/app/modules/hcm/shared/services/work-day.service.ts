import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { WorkDay } from '../models/masters/work-day';
import { WorkDayFilter } from '../filters/work-day-filter';

@Injectable({
  providedIn: 'root'
})
export class WorkDayService {

  _WorkDayList: WorkDay[];
  private readonly USER_STATE = '_USER_STATE';
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  GetWorkDays(filters: WorkDayFilter = new WorkDayFilter()) {
    return this._httpClient
      .get<WorkDay[]>(`${environment.API_BASE_URL_HCM_MASTERS}/WorkDay/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  PostWorkDay(WorkDay: WorkDay){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_HCM_MASTERS}/WorkDay/`+id,WorkDay);
  }

}
