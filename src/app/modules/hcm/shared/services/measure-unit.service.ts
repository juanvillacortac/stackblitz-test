import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { MeasureUnit } from '../models/masters/measure-unit';
import { MeasureUnitFilter } from '../filters/measure-unit-filter';

@Injectable({
    providedIn: 'root'
  })
  export class MeasureUnitService {
    _MeasureUnitList: MeasureUnit[];
    private readonly USER_STATE = '_USER_STATE';
    constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
    _Authservice : AuthService = new AuthService(this._httpClient);
  
    GetMeasureUnits(filters: MeasureUnitFilter = new MeasureUnitFilter()) {
        return this._httpClient
            .get<MeasureUnit[]>(`${environment.API_BASE_URL_HCM_MASTERS}/MeasureUnit/`, {
            params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
    }

    PostMeasureUnit(MeasureUnit: MeasureUnit){
        const { id } = this._Authservice.storeUser;
        return this._httpClient
            .post<number>(`${environment.API_BASE_URL_HCM_MASTERS}/MeasureUnit/`+id,MeasureUnit);
    }

  }