import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { WorkShift } from '../models/masters/work-shift';
import { WorkShiftFilter } from '../filters/work-shift-filter';

@Injectable({
    providedIn: 'root'
  })
  export class WorkShiftService {
    _WorkShiftList: WorkShift[];
    private readonly USER_STATE = '_USER_STATE';
    constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
    _Authservice : AuthService = new AuthService(this._httpClient);
  
    GetWorkShifts(filters: WorkShiftFilter = new WorkShiftFilter()) {
        return this._httpClient
            .get<WorkShift[]>(`${environment.API_BASE_URL_HCM_MASTERS}/WorkShift/`, {
            params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
    }

    InsertWorkShift(WorkShift: WorkShift){
        const { id } = this._Authservice.storeUser;
        return this._httpClient
            .post<number>(`${environment.API_BASE_URL_HCM_MASTERS}/WorkShift/`+id,WorkShift);
    }

  }