import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpHelpersService } from "src/app/modules/common/services/http-helpers.service";
import { AuthService } from "src/app/modules/login/shared/auth.service";
import { environment } from "src/environments/environment";
import { IncidentsFilter } from "../../filters/incidents/incidents-filter";
import { IncidentsIntegrationFilter } from "../../filters/incidents/incidents-integration-filter";
import { Incidents } from "../../models/incidents/incidents";
import { IncidentsDetail } from "../../models/incidents/incidents-detail";

@Injectable({
    providedIn: 'root'
  })
 export class IncidentsService {
    _Incidents: Incidents;
    _IncidentsDetail: IncidentsDetail[] = [];
    private readonly USER_STATE = '_USER_STATE';
    
    constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  GetIncidents(filters: IncidentsFilter = new IncidentsFilter()) {
    return this._httpClient
      .get<IncidentsDetail[]>(`${environment.API_BASE_URL_HCM_PAYROLL}/Incidents/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  GetIncidentsIntegration(filters: IncidentsIntegrationFilter = new IncidentsIntegrationFilter()) {
    return this._httpClient
      .get<IncidentsDetail[]>(`${environment.API_BASE_URL_HCM_PAYROLL}/Incidents/Integration`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  InsertIncidents(Incidents: Incidents){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
        .post<number>(`${environment.API_BASE_URL_HCM_PAYROLL}/Incidents/`+id,Incidents);
  }

  DeleteIncidents(Incidents: IncidentsDetail){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
        .post<number>(`${environment.API_BASE_URL_HCM_PAYROLL}/Incidents/Delete/`+id,Incidents);
  }

}