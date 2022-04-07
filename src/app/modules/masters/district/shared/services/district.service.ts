import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { District } from 'src/app/models/masters/district';
import { DistrictFilters } from 'src/app/models/masters/district-filters';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DistrictService {
  
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getDistrictList(filters: DistrictFilters = new DistrictFilters()) {
    return this._httpClient
      .get<District[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/District/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  getDistrictListPromise(filters: DistrictFilters) {
    return this._httpClient
      .get<District[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/District`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      }).toPromise()
      .then(result => result)
      .catch( error => {
        return error;
      });
  }

  addDistrict(district: District) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/District/Post?userId=${Number(id)}`, district)
      .pipe(map((res: number) => res));
  }





}
