import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { PayrollClassFilter } from '../filters/laborRelationship/payroll-class-filter';
import { PayrollClass } from '../models/laborRelationship/payroll-class';

@Injectable({
    providedIn: 'root'
  })
  export class PayrollClassService {
    _PayrollClassList: PayrollClass[];
    private readonly USER_STATE = '_USER_STATE';
    constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
    _Authservice : AuthService = new AuthService(this._httpClient);
  
    GetPayrollClasses(filters: PayrollClassFilter = new PayrollClassFilter()) {
        return this._httpClient
            .get<PayrollClass[]>(`${environment.API_BASE_URL_HCM_MASTERS}/PayrollClass/`, {
            params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
    }

    PostPayrollClass(PayrollClass: PayrollClass){
        const { id } = this._Authservice.storeUser;
        return this._httpClient
            .post<number>(`${environment.API_BASE_URL_HCM_MASTERS}/PayrollClass/`+id,PayrollClass);
    }

  }