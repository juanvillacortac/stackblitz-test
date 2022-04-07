import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Licenselevel } from "src/app/models/tms/licenselevel";
import { Typedriver } from "src/app/models/tms/typedriver";
import { VehicleDriverReport } from "src/app/models/tms/vehicle-driver-report";
import { VehicleDriverReportFilter } from "src/app/models/tms/vehicle-driver-report-filter";
import { VehicleMoldel } from "src/app/models/tms/vehiclemoldel";
import { VehicleType } from "src/app/models/tms/vehicletype";
import { HttpHelpersService } from "src/app/modules/common/services/http-helpers.service";
import { AuthService } from "src/app/modules/login/shared/auth.service";
import { environment } from "src/environments/environment";
import { LicenseLevelFilter } from "../../master-driver/shared/filter/license-level-filter";
import { TypeDriverFilter } from "../../master-driver/shared/filter/type-driver-filter";
import { VehicleModelFilter } from "../../master-vehicle/shared/filter/vehicle-model-filter";
import { VehicleTypeFilter } from "../../master-vehicle/shared/filter/vehicle-type-filter";

@Injectable({
    providedIn: 'root'
  })
  export class VehicleDriversReportService {
    public _VehicleDriverReport: VehicleDriverReport[];
    private readonly USER_STATE = '_USER_STATE';
    constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
    _Authservice: AuthService = new AuthService(this._httpClient);
  
  
    GetVehicleDriverReport(filters: VehicleDriverReportFilter = new VehicleDriverReportFilter()) {   
      debugger
      return this._httpClient
        .get<VehicleDriverReport[]>(`${environment.API_BASE_URL_OSM_TMSMasters}/VehicleDriverReport/Get`, {
          params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
        
    }

    getVehicleTypeList(filters: VehicleTypeFilter = new VehicleTypeFilter()) {
      return this._httpClient
        .get<VehicleType[]>(`${environment.API_BASE_URL_OSM_TMSMasters}/VehicleType/Get/`, {
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
  
    getVehicleModelList(filters: VehicleModelFilter = new VehicleModelFilter()) {
      return this._httpClient
        .get<VehicleMoldel[]>(`${environment.API_BASE_URL_OSM_TMSMasters}/VehicleModel/Get/`, {
          params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
        });
    }
  }

  