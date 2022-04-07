import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PackagingpresentationFilter } from '../../filters/packagingpresentation-filter';
import { HttpHelpersService } from 'src/app/modules/shared/common-directive/services/http-helpers.service';
import { Packagingpresentation } from 'src/app/models/masters-mpc/packagingpresentation';
import {AuthService} from 'src/app/modules/login/shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PackagingpresentationService {

  public _PackagingPresentationList: Packagingpresentation[];

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getPackagingpresentationbyfilter(filters: PackagingpresentationFilter = new PackagingpresentationFilter()){
    return this._httpClient
      .get<Packagingpresentation[]>(`${environment.API_BASE_URL_OSM_MASTERS}/PackagingPresentation/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }
  postPackagingpresentation(_packagingpresentation: Packagingpresentation = new Packagingpresentation()){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_OSM_MASTERS}/PackagingPresentation/`+id, _packagingpresentation)
  }
}
