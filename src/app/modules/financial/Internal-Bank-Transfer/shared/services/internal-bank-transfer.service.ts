import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/models/common/page';
import { InternalBankTransfer, InternalBankTransferFilter } from 'src/app/models/financial/Internal-bank-transfer';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InternalBankTransferService {

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice: AuthService = new AuthService(this._httpClient);



  getInternalBankTransfer(filters: InternalBankTransferFilter = new InternalBankTransferFilter()): Observable<Page<InternalBankTransfer>> {
    const apiUrl = `${environment.API_BASE_URL_RECEIVABLE_ACCOUNTS}/InternalBankTransfer`;
    return this._httpClient.get<Page<InternalBankTransfer>>(apiUrl, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  getTransactionsDetail(filters: InternalBankTransferFilter = new InternalBankTransferFilter()){
    return this._httpClient
    .get<InternalBankTransfer>(`${environment.API_BASE_URL_RECEIVABLE_ACCOUNTS}/InternalBankTransfer/${filters.bankTransferId}?idBusiness=${filters.businessId}`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    })
  }


  // getAdjustmentType(filters: BankAdjustmentType = new BankAdjustmentType()) {

  //   return this._httpClient
  //     .get<BankAdjustmentType[]>(`${environment.API_BASE_URL_FINANCIAL_MASTER}/BankAdjustmentType/`, {
  //       params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
  //     })
  // }

  postTransfer(model: InternalBankTransfer ,idEmpresa: number = 1) {
    debugger
    const { id } = this._Authservice.storeUser;
    return this._httpClient.post(`${environment.API_BASE_URL_RECEIVABLE_ACCOUNTS}/InternalBankTransfer/?idUser=${id}&idBusiness=${idEmpresa}`, model)

  }

  PostTransferDetailCancel(model: InternalBankTransfer= new InternalBankTransfer(), idTransfer: number){
    const { id } = this._Authservice.storeUser;

    return this._httpClient.post<number>(`${environment.API_BASE_URL_RECEIVABLE_ACCOUNTS}/InternalBankTransfer/${idTransfer}?idUser=${id}`,model)
  }

  PostTransferDetailRevoke(model: InternalBankTransfer= new InternalBankTransfer(), idTransfer: number){
    const { id } = this._Authservice.storeUser;

    return this._httpClient.post<number>(`${environment.API_BASE_URL_RECEIVABLE_ACCOUNTS}/InternalBankTransfer/${idTransfer}/revoke?idUser=${id}`,model)
  }


  PostTransferDetailToRecord(model: InternalBankTransfer= new InternalBankTransfer(), idTransfer: number){
    const { id } = this._Authservice.storeUser;

    return this._httpClient.post<number>(`${environment.API_BASE_URL_RECEIVABLE_ACCOUNTS}/InternalBankTransfer/${idTransfer}/PostInternalBankTransfer?idUser=${id}`,model)
  }

}
