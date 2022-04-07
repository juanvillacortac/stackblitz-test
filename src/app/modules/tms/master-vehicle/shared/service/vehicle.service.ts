import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { DatabaseResult } from 'src/app/models/common/databaseresult';
import { Vehicle } from 'src/app/models/tms/vehicle';
import { VehicleFilter } from '../filter/vehicle-filter';
import { VehicleTypeFilter } from '../filter/vehicle-type-filter';
import { VehicleType } from 'src/app/models/tms/vehicletype';
import { VehicleMoldel } from 'src/app/models/tms/vehiclemoldel';
import { VehicleModelFilter } from '../filter/vehicle-model-filter';

@Injectable({
    providedIn: 'root'
  })
export class VehicleService {
    public _vehicleList: Vehicle[];

    constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getVehiclesList(filters: VehicleFilter = new VehicleFilter()) {    
    return this._httpClient
      .get<Vehicle[]>(`${environment.API_BASE_URL_OSM_TMSMasters}/Vehicle/Get/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  getVehicleTypeList(filters: VehicleTypeFilter = new VehicleTypeFilter()) {
    return this._httpClient
      .get<VehicleType[]>(`${environment.API_BASE_URL_OSM_TMSMasters}/VehicleType/Get/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  getVehicleModelList(filters: VehicleModelFilter = new VehicleModelFilter()) {
    return this._httpClient
      .get<VehicleMoldel[]>(`${environment.API_BASE_URL_OSM_TMSMasters}/VehicleModel/Get/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  InsertUpdateVehicle(Vehicle :Vehicle) 
  {  
    const { id } = this._Authservice.storeUser;
     return this._httpClient
    .post<DatabaseResult>(`${environment.API_BASE_URL_OSM_TMSMasters}/Vehicle/Post/`+id, Vehicle);
  }
    
}
