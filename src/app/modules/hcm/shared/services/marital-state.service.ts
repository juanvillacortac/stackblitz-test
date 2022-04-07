//Globals
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

//Masters
import { MaritalState } from '../models/masters/marital-state';
 
//Filters
import { CompaniesFilter } from '../filters/companies-filter';

//Services
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { MaritalStateFilter } from '../filters/marital-state-filter';


@Injectable({
  providedIn: 'root'
})

export class MaritalStateService {

  //Vars
  _maritalStateList: MaritalState[];
  _Authservice: AuthService = new AuthService(this._httpClient);

  //Const
  private readonly USER_STATE = '_USER_STATE';

  //Ctor
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }

  getMaritalStatesList(filters: MaritalStateFilter = new MaritalStateFilter()) {
    return this._httpClient
      .get<MaritalState[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/MaritalState`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  getMaritalStatesById(filters: MaritalStateFilter = new MaritalStateFilter()) {
    return this._httpClient
      .get<MaritalState[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/MaritalState/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  insertMaritalState(MaritalState: MaritalState){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/MaritalState/`+id, MaritalState);
  }

}
