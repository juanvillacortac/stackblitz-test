import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { ProfessionalArea } from '../models/masters/professional-area';
import { ProfessionalAreaFilter } from '../filters/professional-area-filter';

@Injectable({
    providedIn: 'root'
  })
  export class ProfessionalAreaService {
    _ProfessionalAreaList: ProfessionalArea[];
    private readonly USER_STATE = '_USER_STATE';
    constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
    _Authservice : AuthService = new AuthService(this._httpClient);
  
    GetProfessionalAreas(filters: ProfessionalAreaFilter = new ProfessionalAreaFilter()) {
        return this._httpClient
            .get<ProfessionalArea[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/ProfessionalArea/`, {
            params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
    }

    PostProfessionalArea(ProfessionalArea: ProfessionalArea){
        const { id } = this._Authservice.storeUser;
        return this._httpClient
            .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/ProfessionalArea/`+id,ProfessionalArea);
    }

  }