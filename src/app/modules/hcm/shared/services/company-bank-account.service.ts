import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CompanyBankAccount } from '../models/masters/company-bank-account';
import { CompanyBankAccountFilter } from '../filters/company-bank-account-filter';

@Injectable({
    providedIn: 'root'
  })
  export class CompanyBankAccountService {
    _CompanyBankAccountList: CompanyBankAccount[];
    private readonly USER_STATE = '_USER_STATE';
    constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
    _Authservice : AuthService = new AuthService(this._httpClient);
  
    GetAccountsforPayrollData(filters: CompanyBankAccountFilter = new CompanyBankAccountFilter()) {
        return this._httpClient
            .get<CompanyBankAccount[]>(`${environment.API_BASE_URL_HCM_MASTERS}/CompanyBankAccount/`, {
            params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
    }

    PostCompanyBankAccount(CompanyBankAccount: CompanyBankAccount){
        const { id } = this._Authservice.storeUser;
        return this._httpClient
            .post<number>(`${environment.API_BASE_URL_HCM_MASTERS}/CompanyBankAccount/`+id,CompanyBankAccount);
    }

  }