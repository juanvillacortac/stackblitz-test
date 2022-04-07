import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Company } from 'src/app/models/masters/company';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CompaniesFilter } from '../filters/companies-filter';
import { CompanyType } from 'src/app/models/masters/company-type';
import { CompanyTypeFilter } from '../filters/company-type-filter';
import { CompanyClassificationFilter } from '../filters/company-classification-filter';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { CompanyGroupFilter } from '../filters/company-group-filter';
import { CompanyGroup } from 'src/app/models/masters/company-group';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { Coins } from 'src/app/models/masters/coin';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  _companiesList:Company[];
  private readonly USER_STATE = '_USER_STATE';
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);
  getCompaniesList(filters: CompaniesFilter = new CompaniesFilter()) {
    return this._httpClient
      .get<Company[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Company/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  getCompaniesByOrderName(filters: CompaniesFilter = new CompaniesFilter()) {
    return this._httpClient
      .get<Company[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Company/ByOrderName/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  getCompany(idCompany: number) {
    return this._httpClient
      .get<Company>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Company/${idCompany}`);
  }

  insertCompany(company: Company){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Company/`+id,company);
  }

  getCompanyTypesList(filters: CompanyTypeFilter = new CompanyTypeFilter()) {
    return this._httpClient
      .get<CompanyType[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Company/Types/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  getCompanyClassificationList(filters: CompanyClassificationFilter = new CompanyClassificationFilter()) {
    return this._httpClient
      .get<CompanyType[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Company/Classifications/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  getCompanyGroupList(filters: CompanyGroupFilter = new CompanyGroupFilter()) {
    return this._httpClient
      .get<CompanyGroup[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Company/Groups/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }
}
