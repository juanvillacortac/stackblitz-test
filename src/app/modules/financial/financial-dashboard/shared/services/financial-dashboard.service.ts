import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnalyticFinancial, AnalyticFinancialFilter, IndicatorAnalyticsFilter, IndicatorsFMSxModulesFilter, ResultAnalytics } from 'src/app/models/financial/AnalyticFinancial';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FinancialDashboardService {

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getIndicatorsFMS(filters: AnalyticFinancialFilter = new AnalyticFinancialFilter()) {
   
    // return this._httpClient.get('/assets/demo/data/article.json',{
    //      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    //     });
    const { id } = this._Authservice.storeUser;
    return this._httpClient.post<AnalyticFinancial[]>(`${environment.API_BASE_URL_FINANCIAL_ANALYTICS}/AnalyticFinancial/?idUser=${id}`, filters)
  }

  getBalanceSheet(filters: ResultAnalytics = new ResultAnalytics()) {
   
    return this._httpClient.get('/assets/demo/data/DataBalanceSheet.json',{
          params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
        });
   
  }


  getIndicatorsFMSxModules(filters: IndicatorsFMSxModulesFilter = new IndicatorsFMSxModulesFilter()) {
   
   return this._httpClient
   .get<IndicatorAnalyticsFilter[]>(`${environment.API_BASE_URL_FINANCIAL_ANALYTICS}/AnalyticFinancial/`, {
     params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
   });
  
  }
  
  
}
