import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Company } from 'src/app/models/masters/company';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { GovernmentalRecord } from '../models/masters/governmental-record';
import { GovernmentalRecordType } from '../models/masters/governmental-record-type';
import { GovernmentalRecordFilter } from '../filters/governmental-record-filter';

@Injectable({
    providedIn: 'root'
  })
  export class GovernmentalRecordService {
    _GovernmentalRecordList: GovernmentalRecord[];
    private readonly USER_STATE = '_USER_STATE';
    constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
    _Authservice : AuthService = new AuthService(this._httpClient);
  
    GetGovernmentalRecords(filters: GovernmentalRecordFilter = new GovernmentalRecordFilter()) {
        return this._httpClient
            .get<GovernmentalRecord[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/GovernmentalRecord/`, {
            params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
    }

    InsertGovernmentalRecord(governmentalRecord: GovernmentalRecord){
        const { id } = this._Authservice.storeUser;
        return this._httpClient
            .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/GovernmentalRecord/`+id,governmentalRecord);
    }

  }