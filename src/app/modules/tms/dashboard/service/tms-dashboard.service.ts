import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnalyticsTMS } from 'src/app/models/tms/dashboard/analytics';
import { AnalyticsFilter } from 'src/app/models/tms/dashboard/analytics-filter';
import { AnalyticsIndicatorFilter } from 'src/app/models/tms/dashboard/analytics-indicator-filter';
import { IndicatorModuleFilter } from 'src/app/models/tms/dashboard/indicator-module-filter';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TmsDashboardService {

  constructor(private _httpClient: HttpClient, 
    private _httpHelpersService: HttpHelpersService){}

_Authservice : AuthService = new AuthService(this._httpClient);

getListIndicatorsModule(filter: IndicatorModuleFilter) {
//filter.idUser=this._Authservice.idUser; 
// filter.idCompany=this._Authservice.currentCompany;
// filter.idBranchOffice=this._Authservice.currentOffice;                
return this._httpClient.get<AnalyticsIndicatorFilter[]>(`${environment.API_BASE_URL_OSM_TMS_ANALYTICS}/Analytics/Get/`, {
params: this._httpHelpersService.getHttpParamsFromPlainObject(filter)
})
}



getAnalyticsIndicators(filter: AnalyticsFilter) {
  debugger
const { id }=  this._Authservice.storeUser
// filter.idCompany=this._Authservice.currentCompany;
// filter.idBranchOffice=this._Authservice.currentOffice;        
filter.indicatorsString=JSON.stringify(filter.indicators);
return this._httpClient.post<AnalyticsTMS[]>(`${environment.API_BASE_URL_OSM_TMS_ANALYTICS}/Analytics/Post/?idUser=${id}`, filter)            
}

}
