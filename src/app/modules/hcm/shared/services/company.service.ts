//Globals
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

//Masters
import { Company } from 'src/app/models/masters/company';
import { CompanyType } from 'src/app/models/masters/company-type';
import { companylevel } from '../../shared/models/masters/company-level';
import { companyjobposition } from '../../shared/models/masters/company-jobposition';
import { companyhierachical } from '../../shared/models/masters/company-hierachical';
import { companymtjobposition } from '../../shared/models/masters/company-mtjobposition';

//Filters
import { CompaniesFilter } from '../filters/companies-filter';
import { CompanyTypeFilter } from '../filters/company-type-filter';
import { companylevelsfilter } from '../filters/company-levels-filter';
import { companyjobpositionsfilter } from '../filters/company-jobpositions-filter'; 
import { companymtjobpositionsfilter } from '../filters/company-mtjobpositions-filter';
import { CompanyClassificationFilter } from '../filters/company-classification-filter';
import { companyhierarchicalfilter } from '../filters/company-hierarchical-filter';

//Services
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';


@Injectable({
  providedIn: 'root'
})

export class CompanyService {

  //Vars
  _companiesList:Company[];
  _companyhierachicalList: companyhierachical[];
  _companylevelsList: companylevel[];
  _companyjobpositionList: companyjobposition[];
  _Authservice: AuthService = new AuthService(this._httpClient);

  //Const
  private readonly USER_STATE = '_USER_STATE';

  //Ctor
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }

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

  // gets Job Positions Data From API Method
  getCompanyJobPositions(filters: companyjobpositionsfilter = new companyjobpositionsfilter()) {
    return this._httpClient
      .get<companyjobposition[]>(`${environment.API_BASE_URL_HCM_HR}/JobPosition/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  // gets Levels Data From API Method
  getCompanyLevels(filters: companylevelsfilter = new companylevelsfilter()) {
    return this._httpClient
      .get<companylevel[]>(`${environment.API_BASE_URL_HCM_HR}/HierarchicalLevel/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  // gets Levels Data From API Method
  getCompanyMainPosition(filters: companymtjobpositionsfilter = new companymtjobpositionsfilter()) {
    return this._httpClient
      .get<companymtjobposition[]>(`${environment.API_BASE_URL_HCM_HR}/MTJobPosition/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  //gets Organizational Structure Data From API Method
  getCompanyHierarchicalOrg(filters: companyhierarchicalfilter = new companyhierarchicalfilter()) {
    return this._httpClient
      .get<string>(`${environment.API_BASE_URL_HCM_HR}/OrganizationalChart/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  //Inserts a Hierarchical Level entry trought API Method
  postCompanyLevel(_level: companylevel = new companylevel()) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_HCM_HR}/HierarchicalLevel/` + id, _level)
  }

  //Inserts a JobPosition Level entry trought API Method
  postCompanyJobPositions(_job: companyjobposition = new companyjobposition()) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_HCM_HR}/JobPosition/` + id, _job)
  }
}
