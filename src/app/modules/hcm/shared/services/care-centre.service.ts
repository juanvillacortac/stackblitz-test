import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CareCentre } from 'src/app/modules/hcm/shared/models/masters/care-centre';
import { CareCentreFilter } from 'src/app/modules/hcm/shared/filters/care-centre';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CareCentreService {
  _CareCentre: CareCentre[];
  private readonly USER_STATE = '_USER_STATE';

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getCareCentres(filters: CareCentreFilter = new CareCentreFilter()) {
    return this._httpClient
    .get<CareCentre[]>(`${environment.API_BASE_URL_HCM_HR}/CareCentre`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  insertCareCentre(CareCentre: CareCentre){
    const { id }  = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_HCM_HR}/CareCentre/`+id,CareCentre);
  }

}
