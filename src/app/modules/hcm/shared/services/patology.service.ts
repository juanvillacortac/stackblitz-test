import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Patology } from 'src/app/modules/hcm/shared/models/masters/patology';
import { PatologyFilter } from 'src/app/modules/hcm/shared/filters/patology-filter';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PatologyService {
  _patology: Patology[];
  private readonly USER_STATE = '_USER_STATE';

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getPatology(filters: PatologyFilter = new PatologyFilter()) {
    return this._httpClient
    .get<Patology[]>(`${environment.API_BASE_URL_HCM_MASTERS}/Patology/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  insertPatology(patology: Patology){
    const { id }  = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_HCM_MASTERS}/Patology/`+id,patology);
  }
}