import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Company } from 'src/app/models/masters/company';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CompanyGovernmentalAgency } from '../models/masters/company-governmental-agency';
import { CompanyGovernmentalAgencyFilter } from '../filters/company-governmental-agency-filter';

@Injectable({
  providedIn: 'root'
})
export class CompanyGovernmentalAgencyService {

  _companyGovernmentalAgencyList:CompanyGovernmentalAgency[];
  private readonly USER_STATE = '_USER_STATE';
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getCompanyGovernmentalAgency(filters: CompanyGovernmentalAgencyFilter = new CompanyGovernmentalAgencyFilter()) {
    return this._httpClient
      .get<CompanyGovernmentalAgency[]>(`${environment.API_BASE_URL_HCM_HR}/companyGovernmentalAgency/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  insertCompanyGovernmentalAgency(companyGovernmentalAgency: CompanyGovernmentalAgency){
    debugger;
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_HCM_HR}/companyGovernmentalAgency/`+id, companyGovernmentalAgency);
  }

}
