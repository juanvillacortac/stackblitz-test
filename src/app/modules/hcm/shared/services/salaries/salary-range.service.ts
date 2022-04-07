import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { SalaryRange } from '../../models/salaries/salary-range';
import { SalaryRangeFilter } from '../../filters/salaries/salary-range-filter';

@Injectable({
    providedIn: 'root'
  })
 export class SalaryRangeService {
    _salaryRange: SalaryRange;
    private readonly USER_STATE = '_USER_STATE';

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  GetSalaryRangeList(filters: SalaryRangeFilter = new SalaryRangeFilter()) {
    return this._httpClient
      .get<SalaryRange[]>(`${environment.API_BASE_URL_HCM_PAYROLL}/SalaryRange/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  PostSalaryRange(SalaryRange: SalaryRange){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
        .post<number>(`${environment.API_BASE_URL_HCM_PAYROLL}/SalaryRange/`+id,SalaryRange);
    }   
 }