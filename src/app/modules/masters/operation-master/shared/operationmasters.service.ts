import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Operationdocument } from 'src/app/models/masters/operationdocument';
import { OperationdocumentFilters } from 'src/app/models/masters/operationdocument-filters';
import { Taskstatus } from 'src/app/models/masters/taskstatus';
import { TaskstatusFilters } from 'src/app/models/masters/taskstatus-filters';
import { Typedocumentoperation } from 'src/app/models/masters/typedocumentoperation';
import { TypedocumentoperationFilter } from 'src/app/models/masters/typedocumentoperation-filter';
import { Typetask } from 'src/app/models/masters/typetask';
import { TypetaskFilter } from 'src/app/models/masters/typetask-filter';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperationMastersService {

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService, private _AuthService: AuthService) { }
 
  _Authservice : AuthService = new AuthService(this._httpClient);
  getTypesDocumentsOperations(filters: TypedocumentoperationFilter){
    return this._httpClient
      .get<Typedocumentoperation[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/OperationalMaster/TypeDocumentOperational/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  getDocumentsOperations(filters: OperationdocumentFilters){
    return this._httpClient
      .get<Operationdocument[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/OperationalMaster/DocumentOperational/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  getTaskStatus(filters: TaskstatusFilters){
    return this._httpClient
      .get<Taskstatus[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/OperationalMaster/TaskStatus/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  getTypesTasks(filters: TypetaskFilter){
    return this._httpClient
      .get<Typetask[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/OperationalMaster/TypesTasks/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

}
