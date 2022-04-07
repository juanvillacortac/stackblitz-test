import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DatabaseResult } from "src/app/models/common/databaseresult";
import { FrequencyRequestSetup } from "src/app/models/tms/frequencyrequestsetup";
import { RequestSetup } from "src/app/models/tms/requestsetup";
import { HttpHelpersService } from "src/app/modules/common/services/http-helpers.service";
import { WeekDaysFilter } from "src/app/modules/hcm/shared/filters/week-days-filter";
import { WeekDays } from "src/app/modules/hcm/shared/models/masters/weekdays";
import { AuthService } from "src/app/modules/login/shared/auth.service";
import { environment } from "src/environments/environment";
import { RequestSetupFilter } from "../filter/request-setup-filter";

@Injectable({
    providedIn: 'root'
  })
export class RequestSetupService {
    public _weekDaysList: WeekDays[];
    public _requestSetupList: RequestSetup[];
    public _frequencyRequestSetupList: FrequencyRequestSetup[];
    
    constructor(private _httpClient:HttpClient, private _httpHelpersService:HttpHelpersService) {             
    }
    _Authservice :AuthService = new AuthService(this._httpClient);

    getDaysList(filters: WeekDaysFilter = new WeekDaysFilter()) {      
      return this._httpClient
        .get<WeekDays[]>(`${environment.API_BASE_URL_HCM_MASTERS}/Day/`, {
          params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
    }    

    getRequestSetupList(filters:RequestSetupFilter = new RequestSetupFilter()) {    
      return this._httpClient
        .get<RequestSetup[]>(`${environment.API_BASE_URL_OSM_TMSMasters}/RequestSetup/Get/`, {
          params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
    }

    InsertRequestSetup(requestSetup :RequestSetup) 
    {  
      const { id } = this._Authservice.storeUser;
       return this._httpClient
      .post<DatabaseResult>(`${environment.API_BASE_URL_OSM_TMSMasters}/RequestSetup/Post/`+id, requestSetup);
    }

}
