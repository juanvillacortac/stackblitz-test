import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { AccountforPayrollData } from '../models/laborRelationship/accountforpayrolldata';
import { AccountforPayrollDataFilter } from '../filters/laborRelationship/accountforpayrolldata-filter';

@Injectable({
    providedIn: 'root'
  })
  export class AccountforPayrollDataService {
    _AccountforPayrollDataList: AccountforPayrollData[];
    private readonly USER_STATE = '_USER_STATE';
    constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
    _Authservice : AuthService = new AuthService(this._httpClient);
  
    GetAccountsforPayrollData(filters: AccountforPayrollDataFilter = new AccountforPayrollDataFilter()) {
        return this._httpClient
            .get<AccountforPayrollData[]>(`${environment.API_BASE_URL_HCM_HR}/AccountforPayrollData/`, {
            params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
    }

    PostAccountforPayrollData(AccountforPayrollData: AccountforPayrollData){
        const { id } = this._Authservice.storeUser;
        return this._httpClient
            .post<number>(`${environment.API_BASE_URL_HCM_HR}/AccountforPayrollData/`+id,AccountforPayrollData);
    }

  }