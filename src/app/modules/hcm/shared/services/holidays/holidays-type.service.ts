import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpHelpersService } from "src/app/modules/common/services/http-helpers.service";
import { AuthService } from "src/app/modules/login/shared/auth.service";
import { environment } from "src/environments/environment";
import { HolidaysTypeFilter } from "../../filters/holidays/holidays-type-filter";
import { HolidaysType } from "../../models/holidays/holidays-type";

@Injectable({
    providedIn: 'root'
  })
 export class HolidaysTypeService {
    _holidaysType: HolidaysType;
    private readonly USER_STATE = '_USER_STATE';
    
    constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  GetHolidaysType(filters: HolidaysTypeFilter = new HolidaysTypeFilter()) {
    return this._httpClient
      .get<HolidaysType[]>(`${environment.API_BASE_URL_HCM_PAYROLL}/HolidaysType/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  InsertHolidaysType(HolidaysType: HolidaysType){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
        .post<number>(`${environment.API_BASE_URL_HCM_PAYROLL}/HolidaysType/`+id,HolidaysType);
    }
}