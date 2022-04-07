import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnalyticFinancialFilter } from 'src/app/models/financial/AnalyticFinancial';
import { AnalyticSRM, AnalyticSRMFilter, IndicatorXModuleSRM, IndicatorXModuleSRMFilter } from 'src/app/models/srm/dashboard-srm';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardanalyticsService {

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);



  getIndicatorsSRM(filters: AnalyticSRMFilter) {
  //   filters.idEmpresa=this._Authservice.currentCompany;
  // filters.idSucursal=this._Authservice.currentOffice;
    const { id }=  this._Authservice.storeUser;
    filters.indicatorsString=JSON.stringify(filters.indicators);
    return this._httpClient.get<AnalyticSRM[]>(`${environment.API_BASE_URL_SRM_ANALYTICS}/SRMDashboard/GetSRMDashboard/?idUser=${id}`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)})
        
}

getIndicatorsPRV(filters: AnalyticSRMFilter) {
  debugger
  filters.idEmpresa=this._Authservice.currentCompany;
filters.idSucursal=this._Authservice.currentOffice;
  const { id }=  this._Authservice.storeUser;
  filters.indicatorsString=JSON.stringify(filters.indicators);
  return this._httpClient.get<AnalyticSRM[]>(`${environment.API_BASE_URL_SRM_ANALYTICS}/PRVDashboard/GetPRVDashboard/?idUser=${id}`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)})
      
}
getIndicatorsModuleSRM(filters: IndicatorXModuleSRMFilter) {
   
  filters.IdCompany=this._Authservice.currentCompany;
  filters.IdBranchOffice=this._Authservice.currentOffice;
  filters.IdUser=-1; 
  //filters.IdUser=this._Authservice.idUser;
    return this._httpClient.get<IndicatorXModuleSRM[]>(`${environment.API_BASE_URL_SRM_ANALYTICS}/SRMDashboard/GetIndicatorModuleSRM/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)})
  
}
}