import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, filter, count } from 'rxjs/operators';
import {Port} from '../../../../../models/masters/port';
import { environment } from '../../../../../../environments/environment';
import { HttpHelpersService } from '../../../../common/services/http-helpers.service';
import { PortFilter } from '../filters/port-filter';
import { Result } from '../../../../../models/common/Result';
import { PortViewmodel } from '../view-models/port-viewmodel';
import {AuthService} from 'src/app/modules/login/shared/auth.service';

@Injectable({
  providedIn: 'root'
})

export class PortService {
  public _portsList:Port[];
  private readonly USER_STATE = '_USER_STATE';
  
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);
  
  getPortsList(filters: PortFilter = new PortFilter()) {
    return this._httpClient
      .get<Port[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Port/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }
  
  UpdatePorts(port: Port) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient
    .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Port/`+id, port);

      
     
  }


}
