import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountingAccount } from 'src/app/models/financial/AccountingAccount';
import { AccountingAccountFilter } from 'src/app/models/financial/AccountingAccountFilter';
import { Auxiliary } from 'src/app/models/financial/auxiliary';
import { AuxiliaryFilter } from 'src/app/models/financial/AuxiliaryFilter';
import { LedgerAccountCategory } from 'src/app/models/financial/LedgerAccountCategory';
import { LedgerAccountCategoryFilter } from 'src/app/models/financial/LedgerAccountCategoryFilter';
import { Module } from 'src/app/models/financial/Modules';
import { SelectAccountingAccountActiveModalFilter } from 'src/app/models/financial/SelectAccountingAccountActiveModalFilter';
import { SelectAccountingAccountModal } from 'src/app/models/financial/SelectAccountingAccountModal';
import { SelectAccountingAccountModalFilter } from 'src/app/models/financial/SelectAccountingAccountModalFilter';
import { TypeOfAccounting } from 'src/app/models/financial/TypeOfAccounting';
import { TypicalBalance } from 'src/app/models/financial/TypicalBalance';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountingAccountService {

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getAccountingAccountList(filters: AccountingAccountFilter = new AccountingAccountFilter()) {
    return this._httpClient
      .get<AccountingAccount[]>(`${environment.API_BASE_URL_FINANCIAL_MASTER}/AccountingAccounts/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }


  getTypeOfAccountingList() {
    return this._httpClient.get<TypeOfAccounting[]>(`${environment.API_BASE_URL_FINANCIAL_MASTER}/TypeOfAccounting/`);
  }

  getTypicalBalanceList() {
    return this._httpClient.get<TypicalBalance[]>(`${environment.API_BASE_URL_FINANCIAL_MASTER}/TypicalBalance/`);
  }


  
  getLedgerAccountCategoryList(filters: LedgerAccountCategoryFilter = new LedgerAccountCategoryFilter()) {
    return this._httpClient
      .get<LedgerAccountCategory[]>(`${environment.API_BASE_URL_FINANCIAL_MASTER}/LedgerAccountCategories/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  getAuxiliaryList(filters: AuxiliaryFilter = new AuxiliaryFilter()) {
    return this._httpClient
      .get<Auxiliary[]>(`${environment.API_BASE_URL_FINANCIAL_MASTER}/Auxiliary/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  getSelectAccountingAccountList(filters: (SelectAccountingAccountModalFilter ) = new SelectAccountingAccountModalFilter()){
    return this._httpClient
      .get<SelectAccountingAccountModal[]>(`${environment.API_BASE_URL_FINANCIAL_MASTER}/SelectAccountingAccount/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  getSelectAccountActivesList(filters: (SelectAccountingAccountActiveModalFilter) = new SelectAccountingAccountActiveModalFilter()){
    return this._httpClient
      .get<SelectAccountingAccountModal[]>(`${environment.API_BASE_URL_FINANCIAL_MASTER}/SelectAccountingAccountActive/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }



  getModuleList(idBusiness: number = 1) {
    return this._httpClient
      .get<Module[]>(`${environment.API_BASE_URL_FINANCIAL_MASTER}/Module?idBusiness=${idBusiness}`);
  }
 
  postAccountingAccount(model: AccountingAccount ,idEmpresa: number = 1) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient.post(`${environment.API_BASE_URL_FINANCIAL_MASTER}/AccountingAccounts/?idUser=${id}&idBusiness=${idEmpresa}`, model)
     
  }

}
