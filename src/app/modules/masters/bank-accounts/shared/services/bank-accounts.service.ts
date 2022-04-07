import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { bankAccounts, bankAccountsFilter } from 'src/app/models/masters/bankAccounts';
import { ExchangeRateByCurrency } from 'src/app/models/masters/exchangeRateByCurrency';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BankAccountsService {

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getbankAccountsList(filters: bankAccountsFilter = new bankAccountsFilter()) {
    return this._httpClient
      .get<bankAccounts[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/BankAccount/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  GetBankAccountExchangeRateByCurrency(currencyId: number) {
    debugger
    return this._httpClient
        .get<ExchangeRateByCurrency[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/ExchangeRateByCurrency/${currencyId}`)
}

  postBankAccount(model: bankAccounts, idEmpresa: number = 1) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient.post(`${environment.API_BASE_URL_GENERAL_MASTERS}/BankAccount/?idUser=${id}&idBusiness=${idEmpresa}`, model)
  }

}
