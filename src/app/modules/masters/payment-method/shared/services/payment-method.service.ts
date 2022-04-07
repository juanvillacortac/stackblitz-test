import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentMethod, PaymentMethodResult } from 'src/app/models/masters/payment-method';
import { PaymentMethodFilters } from 'src/app/models/masters/payment-method-filters';
import { PaymentMethodGroup } from 'src/app/models/masters/payment-method-group';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {

  authService = new AuthService(this.httpClient);
  constructor(private httpClient: HttpClient, private httpHelpersService: HttpHelpersService) { }

  getPaymentMethods(filters: PaymentMethodFilters = new PaymentMethodFilters()): Observable<PaymentMethodResult[]> {
    const apiUrl = `${environment.API_BASE_URL_GENERAL_MASTERS}/PaymentMethods`;
    return this.httpClient.get<PaymentMethodResult[]>(apiUrl, {
        params: this.httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  getPaymentMethodGroups(): Observable<PaymentMethodGroup[]> {
    const apiUrl = `${environment.API_BASE_URL_GENERAL_MASTERS}/PaymentMethods/GetPaymentMethodGroups`;
    return this.httpClient.get<PaymentMethodGroup[]>(apiUrl);
  }

  savePaymentMethod(paymentMethod: PaymentMethod) {
    paymentMethod.createdByUserId = this.authService.storeUser.id;
      return this.httpClient
        .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/PaymentMethods`, paymentMethod);
    }
}
