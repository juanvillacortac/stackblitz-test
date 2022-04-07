import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { DocumentTypes } from 'src/app/models/masters/document-type';
import { DocumentTypeFilter } from 'src/app/models/masters/document-type-filters';
import { EntityType } from 'src/app/models/masters/entity-type';
import { EntityTypeFilters } from 'src/app/models/masters/entity-type-filters';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentTypeService {
  _documentTypeList:DocumentType[];
  private readonly USER_STATE = '_USER_STATE';
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getdocumentTypeList(filters: DocumentTypeFilter = new DocumentTypeFilter()) {
     return this._httpClient
       .get<DocumentTypes[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/DocumentType/Get/`, {
         params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
       });
   }


   getEntityTypeListPromise(filters: EntityTypeFilters){
    return this._httpClient
      .get<EntityType[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/DocumentType/GetEntityType/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      }) 
      .toPromise()
      .then(result => result)
      .catch( error => {
            return error;
        });
  }

   getDocumentTypeListPromise(filters: DocumentTypeFilter){
    return this._httpClient
      .get<DocumentTypes[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/DocumentType/Get/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      }) 
      .toPromise()
      .then(result => result)
      .catch( error => {
            return error;
        });
  }

  addDocumentType(documentType: DocumentTypes) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/DocumentType/Post?userId=${Number(id)}`, documentType)
      .pipe(map((res: number) => res));
  }


}
