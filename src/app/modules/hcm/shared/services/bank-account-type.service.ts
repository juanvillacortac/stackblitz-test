import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { BankAccountType, BankAccountTypeFMS, BankAccountTypeFMSFilter } from '../models/masters/bank-account-type';
import { BankAccountTypeFilter } from '../filters/bank-account-type-filter';
import { ExchangeRateByCurrency } from 'src/app/models/masters/exchangeRateByCurrency';

@Injectable({
    providedIn: 'root'
  })
  export class BankAccountTypeService {
    _BankAccountTypeList: BankAccountType[];
    private readonly USER_STATE = '_USER_STATE';
    constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
    _Authservice : AuthService = new AuthService(this._httpClient);
  
    GetBankAccountTypes(filters: BankAccountTypeFilter = new BankAccountTypeFilter()) {
        return this._httpClient
            .get<BankAccountType[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/BankAccountType/`, {
            params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
    }



    GetBankAccountTypeFMS(filters: BankAccountTypeFMSFilter = new BankAccountTypeFMSFilter()) {
        return this._httpClient
            .get<BankAccountTypeFMS[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/BankAccountTypeFMS/`, {
            params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
    }

    
    PostBankAccountType(BankAccountType: BankAccountType){
        const { id } = this._Authservice.storeUser;
        return this._httpClient
            .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/BankAccountType/`+id,BankAccountType);
    }

  }