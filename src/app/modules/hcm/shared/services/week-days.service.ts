import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpHelpersService } from "src/app/modules/common/services/http-helpers.service";
import { environment } from "src/environments/environment";
import { WeekDaysFilter } from "../filters/week-days-filter";
import { WeekDays } from "../models/masters/weekdays";

@Injectable({
    providedIn: 'root'
  })
export class WeekDaysService {

    constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }

    getDaysList(filters: WeekDaysFilter = new WeekDaysFilter()) {
        return this._httpClient
          .get<WeekDays[]>(`${environment.API_BASE_URL_HCM_MASTERS}/Day/`, {
            params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
          });
      }
}
