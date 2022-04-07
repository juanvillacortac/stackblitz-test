import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeviceType } from 'src/app/models/masters/device-type';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';
import { DeviceTypeFilter } from '../filters/device-type-filter';

@Injectable({
  providedIn: 'root'
})
export class DeviceTypeService {
  _deviceTypeList:DeviceType[];
  private readonly USER_STATE = '_USER_STATE';
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getdeviceTypeList(filters: DeviceTypeFilter = new DeviceTypeFilter()) {
    return this._httpClient
      .get<DeviceType[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/DeviceType/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  //Update
  UpdateDeviceType(devicetype: DeviceType) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient
    .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/devicetype/`+id, devicetype);
}
}
