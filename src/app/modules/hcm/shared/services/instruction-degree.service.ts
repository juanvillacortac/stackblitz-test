import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { InstructionDegree } from '../models/masters/instruction-degree';
import { InstructionDegreeFilter } from '../filters/instruction-degree-filter';

@Injectable({
    providedIn: 'root'
  })
  export class InstructionDegreeService {
    _InstructionDegreeList: InstructionDegree[];
    private readonly USER_STATE = '_USER_STATE';
    constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
    _Authservice : AuthService = new AuthService(this._httpClient);
  
    GetInstructionDegrees(filters: InstructionDegreeFilter = new InstructionDegreeFilter()) {
        return this._httpClient
            .get<InstructionDegree[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/InstructionDegree/`, {
            params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
    }

    PostInstructionDegree(InstructionDegree: InstructionDegree){
        const { id } = this._Authservice.storeUser;
        return this._httpClient
            .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/InstructionDegree/`+id,InstructionDegree);
    }

  }