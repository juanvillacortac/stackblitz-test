import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ISLRDiscount } from 'src/app/modules/hcm/shared/models/laborRelationship/islr-discount';
import { ISLRDiscountFilter } from 'src/app/modules/hcm/shared/filters/islr-discount-filter';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';

@Injectable({
  providedIn: 'root'
})

export class ISLRDiscountService {
  public _ISLRDiscountList:ISLRDiscount[];
  private readonly USER_STATE = '_USER_STATE';
  
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);
  
  getISLRDiscountList(filters: ISLRDiscountFilter = new ISLRDiscountFilter()) {
    return this._httpClient
      .get<ISLRDiscount[]>(`${environment.API_BASE_URL_HCM_HR}/ISLRDiscount`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }
  

  }



