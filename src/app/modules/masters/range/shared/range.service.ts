import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RangeResult } from 'src/app/models/masters/range';
import { RangeFilter } from 'src/app/models/masters/range-filter';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RangeService {

  authService = new AuthService(this.httpClient);

  constructor(private httpClient: HttpClient, private httpHelpersService: HttpHelpersService) {
  }


  getRangeFilter(filters: RangeFilter = new RangeFilter()) {
    return this.httpClient
      .get<RangeResult[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Ranges/`, {
        params: this.httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }
}
