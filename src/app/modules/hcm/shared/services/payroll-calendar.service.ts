import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { PayrollCalendar } from '../models/masters/payroll-calendar';
import { PayrollCalendarFilter } from '../filters/payroll-calendar-filter';

@Injectable({
    providedIn: 'root'
  })
 export class PayrollCalendarService {
    _payrollCalendar: PayrollCalendar;
    private readonly USER_STATE = '_USER_STATE';

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  GetPayrollCalendarList(filters: PayrollCalendarFilter = new PayrollCalendarFilter()) {
    return this._httpClient
      .get<PayrollCalendar>(`${environment.API_BASE_URL_HCM_PAYROLL}/PayrollCalendar/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  PostPayrollCalendar(PayrollCalendar: PayrollCalendar){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
        .post<number>(`${environment.API_BASE_URL_HCM_PAYROLL}/PayrollCalendar/`+id,PayrollCalendar);
    }   
 }