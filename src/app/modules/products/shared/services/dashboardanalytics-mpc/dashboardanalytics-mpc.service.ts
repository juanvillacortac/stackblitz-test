import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnalyticFinancialFilter } from 'src/app/models/financial/AnalyticFinancial';
import { Analytics } from 'src/app/models/ims/dashboard/analytics';
import { AnalyticsFilter } from 'src/app/models/ims/dashboard/analytics-filter';
import { AnalyticSRM, AnalyticSRMFilter, IndicatorXModuleSRM, IndicatorXModuleSRMFilter } from 'src/app/models/srm/dashboard-srm';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment, hosts } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardanalyticsMPCService {

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);



/*   getIndicatorsMPC(filters: AnalyticsFilter) {
     filters.idEmpresa=this._Authservice.currentCompany;
   filters.idSucursal=this._Authservice.currentOffice;
     const { id }=  this._Authservice.storeUser;
     filters.indicatorsString=JSON.stringify(filters.indicators);
     return this._httpClient.get<AnalyticSRM[]>(`${environment.API_BASE_URL_SRM_ANALYTICS}/MPCDashboard/PostAnalyticsMPC/?idUser=${id}`, {
         params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)})
        
 } */

 getIndicatorsMPC(filter: AnalyticsFilter) {
debugger
    const { id }=  this._Authservice.storeUser;
    filter.idCompany=this._Authservice.currentCompany;
    filter.idBranchOffice=this._Authservice.currentOffice;        
   //filter.indicatorsString=JSON.stringify(filter.indicators);
    return this._httpClient.post<Analytics[]>(`${environment.API_BASE_URL_OSM_MPC_ANALYTICS}/MPCDashboard/Post/?idUser=${id}`, filter)            
}
 getIndicatorsModuleMPC(filters: IndicatorXModuleSRMFilter) {
   
   filters.IdCompany=this._Authservice.currentCompany;
   filters.IdBranchOffice=this._Authservice.currentOffice;
   filters.IdUser=-1; 
   //filters.IdUser=this._Authservice.idUser;
     return this._httpClient.get<IndicatorXModuleSRM[]>(`${environment.API_BASE_URL_OSM_MPC_ANALYTICS}/MPCDashboard/GetListIndicatorAnalyticsMPC/`, {
         params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)})
  
 }

}