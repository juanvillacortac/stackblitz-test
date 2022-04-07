import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseModel } from 'src/app/models/common/BaseModel';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlaceTypesServiceService {

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }

  getCountriesList() {
    return this._httpClient
      .get<BaseModel[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Common/PlacesTypes/`);
  }
}
