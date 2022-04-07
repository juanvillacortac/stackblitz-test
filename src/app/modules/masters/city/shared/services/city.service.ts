import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { City } from 'src/app/models/masters/city';
import { CityFilters } from 'src/app/models/masters/city-filters';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getCityList(filters: CityFilters = new CityFilters()) {
    return this._httpClient
      .get<City[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/City/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  getCityListPromise(filters: CityFilters) {
    return this._httpClient
      .get<City[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/City`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      }).toPromise()
      .then(result => result)
      .catch( error => {
        return error;
      });
  }

  addCity(district: City) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/City/Post?userId=${Number(id)}`, district)
      .pipe(map((res: number) => res));
  }


}
