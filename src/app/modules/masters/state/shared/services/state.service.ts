import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { State } from 'src/app/models/masters/state';
import { StateFilters } from 'src/app/models/masters/state-filters';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  authService = new AuthService(this.httpClient);

  constructor(private httpClient: HttpClient, private httpHelpersService: HttpHelpersService) {
  }


  getStates(filters: StateFilters = new StateFilters()) {
    return this.httpClient
      .get<State[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/States/`, {
        params: this.httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  getStatesPromise(filters: StateFilters) {
    return this.httpClient
      .get<State[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/States/`, {
        params: this.httpHelpersService.getHttpParamsFromPlainObject(filters)
      }).toPromise()
      .then(result => result)
      .catch( error => {
        return error;
      });
  }

  saveState(state: State) {
    const userId = this.authService.storeUser.id;
    return this.httpClient
      .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/States?userId=${userId}`, state);
  }
}
