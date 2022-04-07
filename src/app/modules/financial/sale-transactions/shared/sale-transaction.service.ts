import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/models/common/page';
import { CollectionTransactionCharges, CollectionTransactionDocument, CollectionTransactionDocumentFilter, CollectionTransactionDocumentModal } from 'src/app/models/financial/collectiontransactions';
import { DocumentTypes, DocumentTypesFilter } from 'src/app/models/financial/DocumentTypes';
import { PaymentMethodByCurrency, PaymentMethodByCurrencyFilter } from 'src/app/models/financial/paymentMethodByCurrency';
import { SalesTransactionResult, SalesType, SalesTypeFilter, SaleTransaction,  SaleTransactionFilter } from 'src/app/models/financial/sale-transactions';
import { TransactionStatus, TransactionStatusFilter } from 'src/app/models/financial/TransactionStatus';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SaleTransactionService {

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice: AuthService = new AuthService(this._httpClient);

  getTransactions(filters: SaleTransactionFilter = new SaleTransactionFilter(), isDirect:boolean): Observable<Page<SalesTransactionResult>> {
    filters.indSaleTransactionDirect = isDirect;
    const apiUrl = `${environment.API_BASE_URL_RECEIVABLE_ACCOUNTS}/SalesTransaction`;
    console.log("Desde el servicio " ,isDirect);
    return this._httpClient.get<Page<SalesTransactionResult>>(apiUrl, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  getTypes(filters: SalesTypeFilter = new SalesTypeFilter()) {
    const apiUrl = `${environment.API_BASE_URL_RECEIVABLE_ACCOUNTS}/TypeSale`;
    return this._httpClient.get<SalesType[]>(apiUrl, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  getTransactionDetail(filters: SaleTransactionFilter = new SaleTransactionFilter(), indSaleTransactionDirect: boolean  = false): Observable<SaleTransaction> {
    return this._httpClient.get<SaleTransaction>(`${environment.API_BASE_URL_RECEIVABLE_ACCOUNTS}/SalesTransaction/${filters.saleTransactionId}?indSaleTransactionDirect=${indSaleTransactionDirect}`)
    //  {
    //   params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    // });
  }

  getTransactionStatus(filters: TransactionStatusFilter = new TransactionStatusFilter()) {
    return this._httpClient
      .get<TransactionStatus[]>(`${environment.API_BASE_URL_RECEIVABLE_ACCOUNTS}/TransactionStatus`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  getPaymentMethodByCurrency(filters: PaymentMethodByCurrencyFilter = new PaymentMethodByCurrencyFilter()) {
    return this._httpClient
      .get<PaymentMethodByCurrency[]>(`${environment.API_BASE_URL_FINANCIAL_MASTER}/PaymentMethodByCurrency`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  getDocumentTypes(filters: DocumentTypesFilter = new DocumentTypesFilter()) {
    return this._httpClient
      .get<DocumentTypes[]>(`${environment.API_BASE_URL_RECEIVABLE_ACCOUNTS}/DocumentTypes`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  } 

  getTransactionsCharge(filters: CollectionTransactionDocumentFilter = new CollectionTransactionDocumentFilter()): Observable<CollectionTransactionDocumentModal[]> {
    const apiUrl = `${environment.API_BASE_URL_RECEIVABLE_ACCOUNTS}/SalesTransaction/Charge`;
    return this._httpClient.get<CollectionTransactionDocumentModal[]>(apiUrl, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  postTransaction(model: SaleTransaction , idEmpresa: number = 1) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient.post<number>(`${environment.API_BASE_URL_RECEIVABLE_ACCOUNTS}/SalesTransaction/?idUser=${id}&idBusiness=${idEmpresa}`, model);
  }

  PostTransactionsDetailCancel(model: SaleTransaction= new SaleTransaction(), idTransaction: number) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient.post<number>(`${environment.API_BASE_URL_RECEIVABLE_ACCOUNTS}/SalesTransaction/${idTransaction}?idUser=${id}`, model);
  }

  PostTransactionsDetailRevoke(model: SaleTransaction= new SaleTransaction(), idTransaction: number) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient.post<number>(`${environment.API_BASE_URL_RECEIVABLE_ACCOUNTS}/SalesTransaction/${idTransaction}/revoke?idUser=${id}`, model);
  }

  PostTransactionsDetailRecord(model: SaleTransaction= new SaleTransaction(), idTransaction: number) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient.post<number>(`${environment.API_BASE_URL_RECEIVABLE_ACCOUNTS}/SalesTransaction/${idTransaction}/record?idUser=${id}`, model);
  }
}
