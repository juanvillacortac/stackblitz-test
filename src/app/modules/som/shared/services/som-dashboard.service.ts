import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnalyticPointOfSale, AnalyticPointOfSaleFilter, IndicatorAnalyticsFilter, IndicatorsVTAxModulesFilter } from 'src/app/models/som/AnalyticPointOfSale';
import { SalesReport } from 'src/app/models/som/reports/reportsales';
import { SalesReportFilter } from 'src/app/models/som/reports/reportsalesfilter';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SomDashboardService {
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getIndicatorsVTA(filters: AnalyticPointOfSaleFilter = new AnalyticPointOfSaleFilter()) {
   debugger
    // return this._httpClient.get('/assets/demo/data/article.json',{
    //      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    //     });
    const { id } = this._Authservice.storeUser;
    
    return this._httpClient.post<AnalyticPointOfSale[]>(`${environment.API_BASE_URL_SOM_ANALYTICS}/AnalyticPointOfSale/?idUser=${id}`, filters)
  }

  getIndicatorsVTAxModules(filters: IndicatorsVTAxModulesFilter = new IndicatorsVTAxModulesFilter()) {
   debugger
   return this._httpClient
   .get<IndicatorAnalyticsFilter[]>(`${environment.API_BASE_URL_SOM_ANALYTICS}/AnalyticPointOfSale/`, {
     params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
   });

   
  }
  
}
