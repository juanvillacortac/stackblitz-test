import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { WeightInstrument, WeightInstrumentFilters, WeightInstrumentType } from 'src/app/models/srm/weight-instrument';

@Injectable({
  providedIn: 'root'
})
export class WeightInstrumentService {

  private apiUrl = `${environment.API_BASE_URL_SRM_MASTERS}/WeightInstrument`;
  authService = new AuthService(this.httpClient);

  constructor(private httpClient: HttpClient, private httpHelpersService: HttpHelpersService) { }

  getWeightInstruments(filters: WeightInstrumentFilters) {
    return this.httpClient
      .get<WeightInstrument[]>(`${this.apiUrl}/getWeightInstruments`, this.convertToParams(filters)).toPromise();
  }

  getWeightInstrumentTypes() {
    return this.httpClient
      .get<WeightInstrumentType[]>(`${this.apiUrl}/getWeightInstrumentTypes`).toPromise();
  }

    getWeightMeassureUnitId() {
    return this.httpClient
      .get<number>(`${this.apiUrl}/getWeightUnitMeassure`).toPromise();
  }

  saveWeightInstrument(model: WeightInstrument) {
    const userId = this.authService.storeUser.id;

    return this.httpClient
      .post<number>(`${this.apiUrl}/saveWeightInstrument?userId=${userId}`, model);
  }

  private convertToParams(object) { return { params: this.httpHelpersService.getHttpParamsFromPlainObject(object) }; }
}
