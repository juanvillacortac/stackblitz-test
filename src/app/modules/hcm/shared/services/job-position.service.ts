import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { JobPosition } from '../models/masters/job-position';
import { JobPositionFilter } from '../filters/job-position-filter';
import { JobPositionDeletedFilter } from '../filters/job-position-deleted-filter';

@Injectable({
    providedIn: 'root'
  })
  export class JobPositionService {
    _JobPositionList: JobPosition[];
    private readonly USER_STATE = '_USER_STATE';
    constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
    _Authservice : AuthService = new AuthService(this._httpClient);
  
    GetJobPosition(filters: JobPositionFilter = new JobPositionFilter()) {
        return this._httpClient
            .get<JobPosition[]>(`${environment.API_BASE_URL_HCM_HR}/JobPosition/`, {
            params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
    }

    InsertJobPosition(JobPosition: JobPosition){
        const { id } = this._Authservice.storeUser;
        return this._httpClient
            .post<number>(`${environment.API_BASE_URL_HCM_HR}/JobPosition/`+id,JobPosition);
    }

    deletedJobPosition(filters: JobPositionDeletedFilter){
        const { id }  = this._Authservice.storeUser;
        return this._httpClient
          .post<number>(`${environment.API_BASE_URL_HCM_HR}/JobPosition/deleted?`+id,filters);
      }

  }