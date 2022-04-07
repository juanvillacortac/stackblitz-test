import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { Parish } from '../models/masters/parish';
import { ParishFilter } from '../filters/parish-filter';

@Injectable({
    providedIn: 'root'
  })
  export class ParishService {
    _ParishList: Parish[];
    private readonly USER_STATE = '_USER_STATE';
    constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
    _Authservice : AuthService = new AuthService(this._httpClient);
  
    GetParish(filters: ParishFilter = new ParishFilter()) {
        return this._httpClient
            .get<Parish[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Parish/`, {
            params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
    }

    InsertParish(Parish: Parish){
        const { id } = this._Authservice.storeUser;
        return this._httpClient
            .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Parish/`+id,Parish);
    }

  }