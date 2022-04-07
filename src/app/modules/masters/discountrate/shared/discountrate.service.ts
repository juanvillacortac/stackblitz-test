import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DiscountRate } from 'src/app/models/masters/discountRate';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class DiscountRateService {
    
    private readonly USER_STATE = '_USER_STATE';
    constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
    _Authservice : AuthService = new AuthService(this._httpClient);
  
    getDiscountRateList(filters: DiscountRate = new DiscountRate()) {
       return this._httpClient
         .get<DiscountRate[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/DiscountRates/`, {
           params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
         });
     }

    
    }