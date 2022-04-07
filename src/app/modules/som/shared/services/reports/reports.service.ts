import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SalesReport } from 'src/app/models/som/reports/reportsales';
import { SalesReportFilter } from 'src/app/models/som/reports/reportsalesfilter';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient) 


  getsalesReport(filters: SalesReportFilter = new SalesReportFilter()) {
    return this._httpClient
    .get<SalesReport[]>(`${environment.API_BASE_URL_SOM_ANALYTICS}/Reports/GetReportSales/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
 
    
   }
}
