
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Branchoffice } from 'src/app/models/masters/branchoffice';
import { BranchofficeType } from 'src/app/models/masters/branchoffice-type';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { environment } from 'src/environments/environment';
import { BranchofficeFilter } from '../filters/branchoffice-filter';
import { BranchofficeTypeFilter } from '../filters/branchoffice-type-filter';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CompaniesFilter } from '../../../companies/shared/filters/companies-filter';
import { Company } from 'src/app/models/masters/company';

@Injectable({
  providedIn: 'root'
})
export class BranchofficeService {

  public _branchOfficeList: Branchoffice[];

    constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }

    _Authservice : AuthService = new AuthService(this._httpClient);

    getBranchOfficeList(filters: BranchofficeFilter = new BranchofficeFilter()) {
        return this._httpClient
          .get<Branchoffice[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/BranchOffice/`, {
            params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
          });
      }

    getBranchOffice(idBranchOffice: number) {
        return this._httpClient
            .get<Branchoffice>(`${environment.API_BASE_URL_GENERAL_MASTERS}/BranchOffice/${idBranchOffice}`);
    }

    postBranchOffice(branchOffice: Branchoffice){      
      const { id } = this._Authservice.storeUser;
        return this._httpClient
          .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/BranchOffice/`+id,branchOffice);
      }

    getBranchOfficeTypeList(filters: BranchofficeTypeFilter = new BranchofficeTypeFilter()) {
        return this._httpClient
            .get<BranchofficeType[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/BranchOffice/TypesByOrderName/`, {
            params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
            });
    }

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
}
