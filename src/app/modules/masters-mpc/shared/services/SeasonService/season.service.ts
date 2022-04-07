import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Season } from 'src/app/models/masters-mpc/season';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';
import { SeasonFilter } from '../../filters/season-filter';

@Injectable({
  providedIn: 'root'
})
export class SeasonService {

  public _ProductorigintypeList : Season[];

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getSeasonbyfilter(filters: SeasonFilter = new SeasonFilter()){
    return this._httpClient
      .get<Season[]>(`${environment.API_BASE_URL_OSM_MASTERS}/Season/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }
}
