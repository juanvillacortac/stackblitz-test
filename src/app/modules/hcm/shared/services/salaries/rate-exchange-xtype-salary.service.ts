import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpHelpersService } from "src/app/modules/common/services/http-helpers.service";
import { AuthService } from "src/app/modules/login/shared/auth.service";
import { environment } from "src/environments/environment";
import { RateExchangexTypeSalaryFilter } from "../../filters/salaries/rate-exchange-xtype-salary-filter";
import { RateExchangexTypeSalary } from "../../models/salaries/rate-exchange-xtype-salary";

@Injectable({
    providedIn: 'root'
  })
 export class RateExchangexTypeSalaryService {
    _salaryRange: RateExchangexTypeSalary;
    private readonly USER_STATE = '_USER_STATE';

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  GetRateExchangexTypeSalary(filters: RateExchangexTypeSalaryFilter = new RateExchangexTypeSalaryFilter()) {
    return this._httpClient
      .get<RateExchangexTypeSalary>(`${environment.API_BASE_URL_HCM_PAYROLL}/RateExchangexTypeSalary/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  PostRateExchangexTypeSalary(RateExchangexTypeSalary: RateExchangexTypeSalary){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
        .post<number>(`${environment.API_BASE_URL_HCM_PAYROLL}/RateExchangexTypeSalary/`+id,RateExchangexTypeSalary);
    }   
 }