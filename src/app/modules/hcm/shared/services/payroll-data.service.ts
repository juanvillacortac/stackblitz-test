import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CompanySupervisor } from '../models/masters/company-supervisor';
import { CompanySupervisorFilter } from '../filters/companies-supervisor-filter';

@Injectable({
    providedIn: 'root'
  })
  export class PayrollDataService {
    _CompanySupervisorList: CompanySupervisor[];
    private readonly USER_STATE = '_USER_STATE';
    constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
    _Authservice : AuthService = new AuthService(this._httpClient);
  
    GetCompanySupervisors(filters: CompanySupervisorFilter = new CompanySupervisorFilter()) {
        return this._httpClient
            .get<CompanySupervisor[]>(`${environment.API_BASE_URL_HCM_HR}/PayrollData/GetCompanySupervisors`, {
            params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
    }

  }