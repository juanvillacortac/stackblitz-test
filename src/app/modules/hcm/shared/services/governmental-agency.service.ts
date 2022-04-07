import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Company } from 'src/app/models/masters/company';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { GovernmentalAgency } from '../models/masters/governmental-agency';
import { GovernmentalAgencyFilter } from '../filters/governmental-agency-filter';

@Injectable({
  providedIn: 'root'
})
export class GovernmentalAgencyService {

  _GovernmentalAgencyList: GovernmentalAgency[];
  private readonly USER_STATE = '_USER_STATE';
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  GetGovernmentalAgencies(filters: GovernmentalAgencyFilter = new GovernmentalAgencyFilter()) {
    return this._httpClient
      .get<GovernmentalAgency[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/GovernmentalAgency/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  PostGovernmentalAgency(GovernmentalAgency: GovernmentalAgency){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/GovernmentalAgency/`+id,GovernmentalAgency);
  }

}
