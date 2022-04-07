import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MedicalCondition } from 'src/app/modules/hcm/shared/models/laborRelationship/medical-condition';
import { MedicalConditionFilter } from 'src/app/modules/hcm/shared/filters/laborRelationship/medical-condition-filter';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { MedicalConditionDeletedFilter } from '../filters/laborRelationship/medical-condition-deleted-filter';

@Injectable({
  providedIn: 'root'
})
export class MedicalConditionService {
  _medicalCondition: MedicalCondition[];
  private readonly USER_STATE = '_USER_STATE';

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getMedicalCondition(filters: MedicalConditionFilter = new MedicalConditionFilter()) {
    return this._httpClient
    .get<MedicalCondition[]>(`${environment.API_BASE_URL_HCM_HR}/MedicalCondition/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  insertMedicalCondition(medicalCondition: MedicalCondition){
    const { id }  = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_HCM_HR}/MedicalCondition/`+id,medicalCondition);
  }

  getMedicalConditionById(idMedicalCondition: number) {
    return this._httpClient
    .get<MedicalCondition>(`${environment.API_BASE_URL_HCM_HR}/MedicalCondition/${idMedicalCondition}`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(idMedicalCondition)
    })
    .toPromise()
    .then(result => result)
    .catch( error => {
          return error;
      });
  }

  deletedMedicalCondition(filters: MedicalConditionDeletedFilter){
    const { id }  = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_HCM_HR}/MedicalCondition/deleted?`+id,filters);
  }
}
