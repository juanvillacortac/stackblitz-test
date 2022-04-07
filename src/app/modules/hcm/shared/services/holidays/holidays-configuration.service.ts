import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpHelpersService } from "src/app/modules/common/services/http-helpers.service";
import { AuthService } from "src/app/modules/login/shared/auth.service";
import { environment } from "src/environments/environment";
import { HolidaysConfigurationFilter } from "../../filters/holidays/holidays-configuration-filter";
import { HolidaysConfiguration } from "../../models/holidays/holidays-configuration";

@Injectable({
    providedIn: 'root'
  })
 export class HolidaysConfigurationService {
    _holidaysConfiguration: HolidaysConfiguration;
    private readonly USER_STATE = '_USER_STATE';
    
    constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  GetHolidaysConfiguration(filters: HolidaysConfigurationFilter = new HolidaysConfigurationFilter()) {
    return this._httpClient
      .get<HolidaysConfiguration[]>(`${environment.API_BASE_URL_HCM_PAYROLL}/HolidaysConfiguration/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  InsertHolidaysConfiguration(HolidaysConfiguration: HolidaysConfiguration){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
        .post<number>(`${environment.API_BASE_URL_HCM_PAYROLL}/HolidaysConfiguration/`+id,HolidaysConfiguration);
    }
}