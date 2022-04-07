import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { PayrollTypeFilter } from '../filters/payroll-type-filter';
import { PayrollType } from '../models/masters/payroll-type';

@Injectable({
    providedIn: 'root'
  })
  export class PayrollTypeService {
   private _PayrollTypeList: PayrollType[];
    private readonly USER_STATE = '_USER_STATE';
    constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
    _Authservice : AuthService = new AuthService(this._httpClient);
  
    GetPayrollTypes(filters: PayrollTypeFilter = new PayrollTypeFilter()) {
        return this._httpClient
            .get<PayrollType[]>(`${environment.API_BASE_URL_HCM_MASTERS}/PayrollType/`, {
            params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
    }

    PostPayrollType(PayrollType: PayrollType){
        const { id } = this._Authservice.storeUser;
        return this._httpClient
            .post<number>(`${environment.API_BASE_URL_HCM_MASTERS}/PayrollType/`+id,PayrollType);
    }

  }