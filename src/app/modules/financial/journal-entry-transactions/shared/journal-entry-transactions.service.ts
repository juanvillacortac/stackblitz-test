import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/models/common/page';
import { JournalEntryTransaction } from 'src/app/models/financial/journal-entry-transaction';
import { JournalEntryTransactionFilter } from 'src/app/models/financial/journal-entry-transaction-filter';
import { TypeJournalEntryTransaction } from 'src/app/models/financial/type-journal-entry-transaction';
import { TypeJournalEntryTransactionFilter } from 'src/app/models/financial/type-journal-entry-transaction-filter';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JournalEntryTransactionsService {

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice: AuthService = new AuthService(this._httpClient);

  getTypeEntryTransactions(filters: TypeJournalEntryTransactionFilter = new TypeJournalEntryTransactionFilter()): Observable<TypeJournalEntryTransaction[]> {
    const apiUrl = `${environment.API_BASE_URL_FINANCIAL}/JournalEntryTransaction/GetTypeJournalEntryTransaction`;
    return this._httpClient.get<TypeJournalEntryTransaction[]>(apiUrl, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  getEntryTransactions(filters: JournalEntryTransactionFilter = new JournalEntryTransactionFilter()): Observable<Page<JournalEntryTransaction>> {
    const apiUrl = `${environment.API_BASE_URL_FINANCIAL}/JournalEntryTransaction`;
    return this._httpClient.get<Page<JournalEntryTransaction>>(apiUrl, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  getEntryTransactionDetail(idEntryTransaction: number, idCompany: number): Observable<JournalEntryTransaction> {
    const apiUrl = `${environment.API_BASE_URL_FINANCIAL}/JournalEntryTransaction/GetEntryTransactionDetail/` + idEntryTransaction + `/` + idCompany;
    return this._httpClient.get<JournalEntryTransaction>(apiUrl);
  }

  postEntryTransaction(model: JournalEntryTransaction) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient.post<number>(`${environment.API_BASE_URL_FINANCIAL}/JournalEntryTransaction/?idUser=${id}`, model);
  }

  cancelEntryTransaction(idEntryTransaction: number) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient.post<boolean>(`${environment.API_BASE_URL_FINANCIAL}/JournalEntryTransaction/CancelEntryTransaction/` + idEntryTransaction + `/` + id, null);
  }

  anulledEntryTransaction(idEntryTransaction: number) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient.post<boolean>(`${environment.API_BASE_URL_FINANCIAL}/JournalEntryTransaction/AnulledEntryTransaction/` + idEntryTransaction + `/` + id, null);
  }

  accountedEntryTransaction(idEntryTransaction: number) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient.post<boolean>(`${environment.API_BASE_URL_FINANCIAL}/JournalEntryTransaction/AccountedEntryTransaction/` + idEntryTransaction + `/` + id, null);
  }

  deleteEntryTransactionDetail(idEntryTransaction: number, idEntryTransactionDetail: number) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .delete<boolean>(`${environment.API_BASE_URL_FINANCIAL}/JournalEntryTransaction/Delete/` + idEntryTransaction + `/` + idEntryTransactionDetail + `/` + id);
  }
}
