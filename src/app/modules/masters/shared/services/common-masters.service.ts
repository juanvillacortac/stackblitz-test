import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseModel } from 'src/app/models/common/BaseModel';
import { ContactNumberType } from 'src/app/models/common/contact-number-type';
import { Typedate } from 'src/app/models/common/typedate';
import { TypedateFilter } from 'src/app/models/common/typedate-filter';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { environment } from 'src/environments/environment';
import { AddressTypeFilter } from '../filters/address-type-filter';
import { ContactNumberTypeFilter } from '../filters/contact-number-type-filter';

@Injectable({
  providedIn: 'root'
})
export class CommonMastersService {

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }

  getContactNumberTypes(filters: ContactNumberTypeFilter) {
    return this._httpClient
      .get<ContactNumberType[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Common/ContactNumberTypes/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  getAddressTypes(filters: AddressTypeFilter) {
    return this._httpClient
      .get<ContactNumberType[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Common/AddressTypes/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  getHousingTypes() {
    return this._httpClient
      .get<BaseModel[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Common/HousingTypes/`);
  }

  getTypesDate(filters: TypedateFilter) {
    return this._httpClient
      .get<Typedate[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Common/GetTypes/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

}
