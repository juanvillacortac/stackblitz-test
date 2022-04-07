import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { HousingType } from '../models/laborRelationship/housing-type';
import { HousingTypeFilter } from '../filters/laborRelationship/housing-type-filter';

@Injectable({
    providedIn: 'root'
  })
  export class HousingTypeService {
    _HousingTypeList: HousingType[];
    private readonly USER_STATE = '_USER_STATE';
    constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
    _Authservice : AuthService = new AuthService(this._httpClient);
  
    GetHousingType(filters: HousingTypeFilter = new HousingTypeFilter()) {
        return this._httpClient
            .get<HousingType[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Common/HousingTypes/`);
    }

    InsertHousingType(HousingType: HousingType){
        const { id } = this._Authservice.storeUser;
        return this._httpClient
            .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Common/HousingTypes/`+id,HousingType);
    }

  }