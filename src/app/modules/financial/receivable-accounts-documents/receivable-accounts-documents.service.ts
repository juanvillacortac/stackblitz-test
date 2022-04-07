import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentTypes } from 'src/app/models/financial/DocumentTypes';
import { AuthService } from '../../login/shared/auth.service';
import { environment } from 'src/environments/environment';
import { CollectionTransactionApplicacion } from './receivable-accounts-documents-application/receivable-accounts-documents-application.component';
import { CollectionTransactionPostChargesDocumentDetail } from '../collection-transactions/collection-transactions-details/models';

@Injectable({
  providedIn: 'root'
})
export class ReceivableAccountsDocumentsService {

  _Authservice: AuthService = new AuthService(this._httpClient)
  constructor(private _httpClient: HttpClient  ){ }
  

  getDocumentTypes(): Observable<DocumentTypes[]>{
    const apiUrl = `${environment.API_BASE_URL_RECEIVABLE_ACCOUNTS}/DocumentTypes?id=-1&active=-1`;
    return this._httpClient.get<DocumentTypes[]>(apiUrl);
  } 
  

  getCollectionTransactions(clientId :number,documentTypeId: number): Observable<CollectionTransactionApplicacion[]>{
    const apiUrl = `${environment.API_BASE_URL_RECEIVABLE_ACCOUNTS}/CollectionTransactionApplication?ClientSupplierId=${clientId}&BussinessId=-1&DocumentNumber=%20&DocumentTypeId=${documentTypeId}`;
    return this._httpClient.get<CollectionTransactionApplicacion[]>(apiUrl);
  }

  postApplication(collectionTransactionId :number, idUser:number, model :CollectionTransactionPostChargesDocumentDetail[]){ 
    const apiUrl = `${environment.API_BASE_URL_RECEIVABLE_ACCOUNTS}/CollectionTransaction/AplicateDocument?collectionTransactionId=${collectionTransactionId}&idUser=${idUser}`;
    return this._httpClient.post<CollectionTransactionPostChargesDocumentDetail[]>(apiUrl, model);
  }
}
