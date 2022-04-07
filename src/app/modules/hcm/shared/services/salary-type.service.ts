import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { SalaryType } from '../models/masters/salary-type';
import { SalaryTypeFilter } from '../filters/salary-type-filter';

@Injectable({
    providedIn: 'root'
  })
  export class SalaryTypeService {
    _SalaryTypeList: SalaryType[];
    private readonly USER_STATE = '_USER_STATE';
    constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
    _Authservice : AuthService = new AuthService(this._httpClient);
  
    GetSalaryType(filters: SalaryTypeFilter = new SalaryTypeFilter()) {
        return this._httpClient
            .get<SalaryType[]>(`${environment.API_BASE_URL_HCM_MASTERS}/SalaryType/`, {
            params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
    }

    PostSalaryType(SalaryType: SalaryType){
        const { id } = this._Authservice.storeUser;
        return this._httpClient
            .post<number>(`${environment.API_BASE_URL_HCM_MASTERS}/SalaryType/`+id,SalaryType);
    }

  }