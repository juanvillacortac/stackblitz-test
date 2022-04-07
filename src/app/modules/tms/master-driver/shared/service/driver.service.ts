import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { Driver } from "src/app/models/tms/driver";
import { DriverFilter } from "../filter/driver-filter";
import { TypeDriverFilter } from '../filter/type-driver-filter';
import { Typedriver } from 'src/app/models/tms/typedriver';
import { LicenseLevelFilter } from '../filter/license-level-filter';
import { Licenselevel } from 'src/app/models/tms/licenselevel';
import { DatabaseResult } from 'src/app/models/common/databaseresult';


@Injectable({
    providedIn: 'root'
  })
  
export class DriverService {

  public _driverList: Driver[];
    
    constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

    getDriversList(filters: DriverFilter = new DriverFilter()) {    
      return this._httpClient
        .get<Driver[]>(`${environment.API_BASE_URL_OSM_TMSMasters}/Driver/Get/`, {
          params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
    }

    getTypeDriversList(filters: TypeDriverFilter = new TypeDriverFilter()) {
      return this._httpClient
        .get<Typedriver[]>(`${environment.API_BASE_URL_OSM_TMSMasters}/TypeDriver/Get/`, {
          params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
    }

    getLevelLicenseList(filters: LicenseLevelFilter = new LicenseLevelFilter()) {
      return this._httpClient
        .get<Licenselevel[]>(`${environment.API_BASE_URL_OSM_TMSMasters}/LicenseLevel/Get/`, {
          params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
    }

    InsertUpdateDrivers(driver :Driver) 
    {  
      const { id } = this._Authservice.storeUser;
       return this._httpClient
      .post<DatabaseResult>(`${environment.API_BASE_URL_OSM_TMSMasters}/Driver/Post/`+id, driver);
    }
}
