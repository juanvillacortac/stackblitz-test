import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bank } from 'src/app/models/masters/bank';
import { BankFilters } from 'src/app/models/masters/bank-filters';
import { BankType } from 'src/app/models/masters/bank-type';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BankService {

authService = new AuthService(this.httpClient);

constructor(private httpClient: HttpClient, private httpHelpersService: HttpHelpersService) {}

getBanks(filters: BankFilters = new BankFilters()): Observable<Bank[]> {
    const apiUrl = `${environment.API_BASE_URL_GENERAL_MASTERS}/Banks`;
    return this.httpClient.get<Bank[]>(apiUrl, {
        params: this.httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
}

getBankTypes(): Observable<BankType[]> {
  const apiUrl = `${environment.API_BASE_URL_GENERAL_MASTERS}/Banks/GetBankTypes`;
  return this.httpClient.get<BankType[]>(apiUrl);
}

getBankById(id: number): Observable<Bank> {
    const apiUrl = `${environment.API_BASE_URL_GENERAL_MASTERS}/Banks/${id}`;
    return this.httpClient.get<Bank>(apiUrl);
}

saveBank(bank: Bank) {
    bank.createdByUserId = this.authService.storeUser.id;
      return this.httpClient
        .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Banks`, bank).toPromise();
  }

  getImageBanse64ByBankId(bankId: number) {
      const apiUrl = `${environment.API_BASE_URL_GENERAL_MASTERS}/Banks/${bankId}/imageBase64`;
      return this.httpClient.get<string>(apiUrl).toPromise();
  }

}
