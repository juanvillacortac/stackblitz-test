import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { environment } from 'src/environments/environment';
import { IdentifierType } from 'src/app/modules/hcm/shared/models/masters/IdentifierType';
import { IdentifierTypeFilter } from '../filters/identifier-type-filter';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public httpClient: HttpClient) { }

  getIdentifierTypes(idIdentifierType: number, idEntityType: number ): Observable<IdentifierType[]> {
    return this.httpClient.get<IdentifierType[]>(`${environment.API_BASE_URL_AUTHENTICATION}/User/GetIdentifierTypes?idIdentifierType=${idIdentifierType}&idEntityType=${idEntityType}`);
  }
  
  getIdentifierTypesByCountry(filter: IdentifierTypeFilter) {
    return this.httpClient.get<IdentifierType[]>(`${environment.API_BASE_URL_AUTHENTICATION}/User/GetIdentifierTypes?idIdentifierType=${filter.idDocumentType}&idEntityType=${filter.idEntityType}&idCountry=${filter.idCountry}`);
  }

}
