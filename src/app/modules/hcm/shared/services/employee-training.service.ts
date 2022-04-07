import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EmployeeTraining } from 'src/app/modules/hcm/shared/models/laborRelationship/employee-training';
import { EmployeeTrainingFilter } from 'src/app/modules/hcm/shared/filters/laborRelationship/employee-training-filter';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { EmployeeTrainingList } from '../models/laborRelationship/employee-training-list';
import { Training } from '../models/laborRelationship/training';
import { EmployeeTrainingDetailViewModel } from '../view-models/employee-training-viewmodel';
import { EmployeeSkillsFocusImproving } from '../view-models/employee-Skills-FocusImproving';

@Injectable({
  providedIn: 'root'
})
export class EmployeeTrainingService {
    _EmployeeTraining: EmployeeTraining;
  private readonly USER_STATE = '_USER_STATE';

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getEmployeeTraining(filters: EmployeeTrainingFilter = new EmployeeTrainingFilter()) {
    return this._httpClient
    .get<EmployeeTraining>(`${environment.API_BASE_URL_HCM_HR}/EmployeeTraining/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    })
  }

  getTraining(filters: EmployeeTrainingFilter = new EmployeeTrainingFilter()) {
    return this._httpClient
    .get<Training[]>(`${environment.API_BASE_URL_HCM_HR}/EmployeeTraining/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    })
  }

  insertEmployeeTraining(employeeTraining: EmployeeTrainingDetailViewModel){
    const { id }  = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_HCM_HR}/EmployeeTraining/`+id,employeeTraining);
  }

  insertTraining(newTraining: Training){
    const { id }  = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_HCM_HR}/EmployeeTraining/`+id,newTraining);
  }

  insertEmployeeSkillsFocusImproving(newEmployeeSkillsFocusImproving: EmployeeSkillsFocusImproving){
    const { id }  = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_HCM_HR}/EmployeeTraining/EmployeeSkillsFocusImproving/`+id,newEmployeeSkillsFocusImproving);
  }

  deletedEmployeeTraining(filters: EmployeeTrainingDetailViewModel){
    const { id }  = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_HCM_HR}/EmployeeTraining/deleted?`+id,filters);
  }

 
}
