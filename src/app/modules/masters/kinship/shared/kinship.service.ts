import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Kinship } from 'src/app/models/masters/kinship';
import { KinshipFilter } from 'src/app/models/masters/kinship-filter';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';

@Injectable({
  providedIn: 'root'
})

export class KinshipService {
  public _kinshipList:Kinship[];
  private readonly USER_STATE = '_USER_STATE';
  
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);
  
  getKinshipList(filters: KinshipFilter = new KinshipFilter()) {
    return this._httpClient
      .get<Kinship[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Kinship`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }
  

  }
