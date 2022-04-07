import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Country } from 'src/app/models/masters/country';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { environment } from 'src/environments/environment';
import { CountryFilter } from '../filters/country-filter';
import { AuthService } from 'src/app/modules/login/shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  public _countriesList: Country[];
  private readonly USER_STATE = '_USER_STATE'

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getCountriesList(filters: CountryFilter = new CountryFilter()) {
    return this._httpClient
      .get<Country[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Country/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }
  
  UpdateCountry(country :Country) { 
    const { id } = this._Authservice.storeUser;
       return this._httpClient
      .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Country/`+id, country);
  }

  getCountriesPromise(filters: CountryFilter) {
    return this._httpClient
      .get<Country[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Country/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      }).toPromise()
      .then(result => result)
      .catch( error => {
        return error;
      });
  }
}

