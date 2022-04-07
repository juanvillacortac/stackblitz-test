import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { PoliticCalc } from '../../models/Payroll-Policies/payroll-politic-calc';
import { PoliticalCalcFilter } from '../../filters/Concepts/politic-calc-filter';
import { PayrollPoliticVariables } from '../../models/Payroll-Policies/payrroll-politic-vars';

@Injectable({
    providedIn: 'root'
  })
  export class PoliticalCalcService {
    _PoliticalCalcList: PoliticCalc[];
    private readonly USER_STATE = '_USER_STATE';
    constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
    _Authservice : AuthService = new AuthService(this._httpClient);
  
    GetPoliticCalc(filters: PoliticalCalcFilter = new PoliticalCalcFilter()) {
        return this._httpClient
            .get<PoliticCalc>(`${environment.API_BASE_URL_HCM_PAYROLL}/PoliticCalc/`, {
            params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
    }

    PostPoliticCalc(politicalCalc: PoliticCalc){
        const { id } = this._Authservice.storeUser;
        return this._httpClient
            .post<number>(`${environment.API_BASE_URL_HCM_PAYROLL}/PoliticCalc/`+id,politicalCalc);
    }

    insertVariablesCalc(policiesVar: PayrollPoliticVariables){
        const { id } = this._Authservice.storeUser;
        return this._httpClient
            .post<number>(`${environment.API_BASE_URL_HCM_PAYROLL}/PoliticCalc/Post?`+id,policiesVar);
    }

  }