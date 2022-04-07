import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { Observable } from 'rxjs';
import { BankTransaction, BankTransactionFilter } from 'src/app/models/financial/bank-transactions';
import type { Page } from 'src/app/models/common/page'
import { BankAdjustmentType } from 'src/app/models/financial/BankAdjustmentType';
import { FiltersPanelComponentMultimediaUse } from 'src/app/modules/masters-mpc/multimedia-use/filters-panel/filters-panel.component';

@Injectable({
  providedIn: 'root'
})
export class BankTransactionService {

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice: AuthService = new AuthService(this._httpClient);

  getTransactions(filters: BankTransactionFilter = new BankTransactionFilter()): Observable<Page<BankTransaction>> {
    const apiUrl = `${environment.API_BASE_URL_BANK_TRANSACTIONS}/BankTransaction`
    return this._httpClient.get<Page<BankTransaction>>(apiUrl, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  getTransactionsDetail(filters: BankTransactionFilter = new BankTransactionFilter()){
    return this._httpClient
    .get<BankTransaction>(`${environment.API_BASE_URL_BANK_TRANSACTIONS}/BankTransaction/${filters.bankTransactionId}?idBusiness=${filters.businessId}`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    })
  }


  getAdjustmentType(filters: BankAdjustmentType = new BankAdjustmentType()) {

    return this._httpClient
      .get<BankAdjustmentType[]>(`${environment.API_BASE_URL_FINANCIAL_MASTER}/BankAdjustmentType/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  postTransaction(model: BankTransaction ,idEmpresa: number = 1) {
    debugger

    const { id } = this._Authservice.storeUser;
    return this._httpClient.post(`${environment.API_BASE_URL_BANK_TRANSACTIONS}/BankTransaction/?idUser=${id}&idBusiness=${idEmpresa}`,model)
     
  }

  PostTransactionsDetailCancel(model: BankTransaction= new BankTransaction(), idTransaction: number){
    const { id } = this._Authservice.storeUser;

    return this._httpClient.post<number>(`${environment.API_BASE_URL_BANK_TRANSACTIONS}/BankTransaction/${idTransaction}?idUser=${id}`,model)
  }

  PostTransactionsDetailRevoke(model: BankTransaction= new BankTransaction(), idTransaction: number){
    const { id } = this._Authservice.storeUser;

    return this._httpClient.post<number>(`${environment.API_BASE_URL_BANK_TRANSACTIONS}/BankTransaction/${idTransaction}/revoke?idUser=${id}`,model)
  }


  PostTransactionsDetailToRecord(model: BankTransaction= new BankTransaction(), idTransaction: number){
    const { id } = this._Authservice.storeUser;

    return this._httpClient.post<number>(`${environment.API_BASE_URL_BANK_TRANSACTIONS}/BankTransaction/${idTransaction}/PostBankAdjustment?idUser=${id}`,model)
  }

  

  // removetaxable(deductibleAndTaxable: PurchaseOrdertaxableDetail= new PurchaseOrdertaxableDetail()){
  //   const { id } = this._AuthService.storeUserdele;
  //   return this._httpClient
  //     .post<number>(`${environment.API_BASE_URL_PURSCHASE_ORDER}/PurchaseOrder/Removetaxabledeductible/`+id, deductibleAndTaxable)
  //   }

}
