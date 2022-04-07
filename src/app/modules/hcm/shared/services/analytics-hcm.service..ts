import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnalyticHCMFilter, AnalyticsHCM, IndicatorAnalyticsFilter, IndicatorsHCMxModulesFilter } from 'src/app/models/hcm/analytics-hcm';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HCMDashboardService {

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getIndicatorsHCM(filters: AnalyticHCMFilter = new AnalyticHCMFilter()) {
   
    // return this._httpClient.get('/assets/demo/data/article.json',{
    //      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    //     });
    const { id } = this._Authservice.storeUser;
    return this._httpClient.post<AnalyticsHCM[]>(`${environment.API_BASE_URL_HCM_ANALYTICS}/AnalyticsHCM/?idUser=${id}`, filters)
  }


  getIndicatorsHCMxModules(filters: IndicatorsHCMxModulesFilter = new IndicatorsHCMxModulesFilter()) {
   
   return this._httpClient
   .get<IndicatorAnalyticsFilter[]>(`${environment.API_BASE_URL_HCM_ANALYTICS}/AnalyticsHCM/`, {
     params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
   });
  
  }
  
  
}