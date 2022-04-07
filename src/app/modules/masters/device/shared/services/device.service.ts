import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from 'src/app/models/masters/device';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';
import { DeviceFilter } from '../filters/device-filter';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  _deviceList:Device[];
  private readonly USER_STATE = '_USER_STATE';
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getdeviceList(filters: DeviceFilter = new DeviceFilter()) {
   debugger;
    return this._httpClient
      .get<Device[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Device/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  //Update
  UpdateDevice(device: Device) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient
    .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/device/`+id, device);
}
}
