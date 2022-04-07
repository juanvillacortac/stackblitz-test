import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/models/common/page';
import { CollectionTransaction, CollectionTransactionCharges, CollectionTransactionFilter, TypeApplicationCollection, TypeApplicationCollectionFilter } from 'src/app/models/financial/collectiontransactions';

import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';
import { CollectionTransactionPost } from '../collection-transactions-details/models';

@Injectable({
  providedIn: 'root'
})
export class CollectionTransactionsService {

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice: AuthService = new AuthService(this._httpClient);

  getTransactions(filters: CollectionTransactionFilter = new CollectionTransactionFilter()): Observable<Page<CollectionTransaction>> {
    const apiUrl = `${environment.API_BASE_URL_RECEIVABLE_ACCOUNTS}/CollectionTransaction`;
    return this._httpClient.get<Page<CollectionTransaction>>(apiUrl, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  getTransactionDetail(filters: CollectionTransactionFilter = new CollectionTransactionFilter()): Observable<CollectionTransaction> {
    return this._httpClient.get<CollectionTransaction>(`${environment.API_BASE_URL_RECEIVABLE_ACCOUNTS}/CollectionTransaction/${filters.collectionTransactionId}`);
  }

  postTransaction(model: CollectionTransactionPost , idEmpresa: number = 1) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient.post(`${environment.API_BASE_URL_RECEIVABLE_ACCOUNTS}/CollectionTransaction/?idUser=${id}&idBusiness=${idEmpresa}`, model);
  }

  PostTransactionsDetailCancel(model: CollectionTransaction = new CollectionTransaction(), idTransaction: number) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient.post<number>(`${environment.API_BASE_URL_RECEIVABLE_ACCOUNTS}/CollectionTransaction/${idTransaction}?idUser=${id}`, model);
  }

  PostTransactionsDetailRevoke(model: CollectionTransaction = new CollectionTransaction(), idTransaction: number) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient.post<number>(`${environment.API_BASE_URL_RECEIVABLE_ACCOUNTS}/CollectionTransaction/${idTransaction}/revoke?idUser=${id}`, model);
  }

  getTypes(filters: TypeApplicationCollectionFilter = new TypeApplicationCollectionFilter()) {
    const apiUrl = `${environment.API_BASE_URL_RECEIVABLE_ACCOUNTS}/TypeApplicationCollection`;
    return this._httpClient.get<TypeApplicationCollection[]>(apiUrl, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  
}
