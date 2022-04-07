import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentCondition } from 'src/app/models/masters/payment-condition';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { environment } from 'src/environments/environment';
import { PaymentConditionFilter } from '../../shared/filters/payment-condition-filter';
import { AuthService } from 'src/app/modules/login/shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentconditionService {
 authService = new AuthService(this._httpClient);
 
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }

  getPaymentconditionbyFilter(filters: PaymentConditionFilter = new PaymentConditionFilter()) {
    return this._httpClient
      .get<PaymentCondition[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/PaymentConditions/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }



    savePaymentConditions(paymentConditions: PaymentCondition) 
    {  
      const { id } = this.authService.storeUser;
       return this._httpClient
      .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/PaymentConditions/`+id, paymentConditions);
     
    }

}
