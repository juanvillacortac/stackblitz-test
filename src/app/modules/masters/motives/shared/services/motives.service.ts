import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Motives } from 'src/app/models/masters/motives';
import { MotivesFilters } from 'src/app/models/masters/motives-filters';
import { MotivesType } from 'src/app/models/masters/motives-type';
import { MotivesTypeFilters } from 'src/app/models/masters/motives-type-filters';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';

import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MotivesService {

  constructor(public httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this.httpClient)

  
  getMotivesTypes(filters: MotivesTypeFilters=new MotivesTypeFilters()){
    return this.httpClient
      .get<MotivesType[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Motives/GetType/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
      .toPromise()
      .then(result => result)
      .catch( error => {
            return error;
        });
  }

  getMotives(filters: MotivesFilters = new MotivesFilters()){
    return this.httpClient
      .get<Motives[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Motives/Get/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      }) 
      .toPromise()
      .then(result => result)
      .catch( error => {
            return error;
        });;
  }

  addMotiveType(motiveType: MotivesType) {
    const { id } = this._Authservice.storeUser;
    return this.httpClient
      .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Motives/PostType?userId=${Number(id)}`, motiveType)
      .pipe(map((res: number) => res));
  }

  addMotive(motive: Motives) {
    const { id } = this._Authservice.storeUser;
    return this.httpClient
      .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Motives/Post?userId=${id}`, motive)
      .pipe(map((res: number) => res));
  }

  //#region  motive combos
  getMotiveTypes(filters: MotivesTypeFilters){
    return this.httpClient
      .get<MotivesType[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Motives/GetType/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });    
  }
  gettMotives(filters: MotivesFilters){
    return this.httpClient
      .get<Motives[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Motives/Get/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }
 //#endregion
}
