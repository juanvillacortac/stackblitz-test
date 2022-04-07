import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { HierarchicalLevel } from '../models/masters/hierarchical-level';
import { HierarchicalLevelFilter } from '../filters/hierarchical-level-filter';
import { HierarchicalLevelDeletedFilter } from '../filters/hierarchical-level-deleted-filter';

@Injectable({
    providedIn: 'root'
  })
  export class HierarchicalLevelService {
    _HierarchicalLevelList: HierarchicalLevel[];
    private readonly USER_STATE = '_USER_STATE';
    constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
    _Authservice : AuthService = new AuthService(this._httpClient);
  
    GetHierarchicalLevel(filters: HierarchicalLevelFilter = new HierarchicalLevelFilter()) {
        return this._httpClient
            .get<HierarchicalLevel[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/HierarchicalLevel/`, {
            params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
    }

    InsertHierarchicalLevel(HierarchicalLevel: HierarchicalLevel){
        const { id } = this._Authservice.storeUser;
        return this._httpClient
            .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/HierarchicalLevel/`+id,HierarchicalLevel);
    }
    
    deletedHierarchicalLevel(filters: HierarchicalLevelDeletedFilter){
        const { id }  = this._Authservice.storeUser;
        return this._httpClient
          .post<number>(`${environment.API_BASE_URL_HCM_HR}/HierarchicalLevel/deleted?`+id,filters);
      }
  }