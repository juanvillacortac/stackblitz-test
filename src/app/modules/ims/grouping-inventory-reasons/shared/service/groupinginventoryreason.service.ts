import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { groupingInventoryReason } from 'src/app/models/ims/grouping-inventory-reasons';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';
import { groupingInventoryReasonFilter } from '../filter/grouping-inventory-reason-filter';

@Injectable({
  providedIn: 'root'
})
export class GroupinginventoryreasonService {

  public _groupingList: groupingInventoryReason[];
  private readonly USER_STATE = '_USER_STATE'

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);
  
  getgroupingInventoryReasonsList(filters: groupingInventoryReasonFilter = new groupingInventoryReasonFilter()) {
    return this._httpClient
      .get<groupingInventoryReason[]>(`${environment.API_BASE_URL_OSM_IMS}/GroupingInventoryReasons/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

   InsertUpdategroupingInventoryReasons(grouping :groupingInventoryReason) 
    {  
      const { id } = this._Authservice.storeUser;
       return this._httpClient
      .post<number>(`${environment.API_BASE_URL_OSM_IMS}/GroupingInventoryReasons/`+id, grouping);
     
    }
}
