import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';
import { PaymentMethodFilter } from '../filters/laborRelationship/payment-method-filter';
import { PaymentMethod } from '../models/laborRelationship/payment-method';

@Injectable({
  providedIn: 'root'
})

export class PaymentMethodService {

  authService = new AuthService(this.httpClient);
  constructor(private httpClient: HttpClient, private httpHelpersService: HttpHelpersService) { }

  getPaymentMethods(filters: PaymentMethodFilter = new PaymentMethodFilter()): Observable<PaymentMethod[]> {
    const apiUrl = `${environment.API_BASE_URL_HCM_MASTERS}/PaymentMethod`;
    return this.httpClient.get<PaymentMethod[]>(apiUrl, {
        params: this.httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  postPaymentMethod(paymentMethod: PaymentMethod) {
    paymentMethod.createdByUserId = this.authService.storeUser.id;
      return this.httpClient
        .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/PaymentMethod`, paymentMethod);
    }
}
