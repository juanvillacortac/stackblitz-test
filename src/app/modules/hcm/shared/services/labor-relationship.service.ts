import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { LaborRelationship } from '../models/laborRelationship/labor-relationship';
import { LaborRelationshipFilter } from '../filters/laborRelationship/labor-relationship-filter';
import { LaborRelationshipMinimumFilter } from '../filters/laborRelationship/labor-relationship-minimum-filter';
import { LaborRelationshipMinimum } from '../models/laborRelationship/labor-relationship-minimum';
import { LaborRelationshipMinimumExcel } from '../models/laborRelationship/labor-relationship-minimumexcel';
import { LaborRelationshipMinimumExcelList } from '../models/laborRelationship/labor-relationship-minimumExcelList';

@Injectable({
  providedIn: 'root'
})
export class LaborRelationshipService {

  _laborRelationshipList: LaborRelationship[];
  _laborRelationshipMinimumList: LaborRelationshipMinimum[];

  private readonly USER_STATE = '_USER_STATE';
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  GetLaborRelationship(filters: LaborRelationshipFilter = new LaborRelationshipFilter()) {
    console.log(this._httpHelpersService.getHttpParamsFromPlainObject(filters, false));
    return this._httpClient
      .get<LaborRelationship>(`${environment.API_BASE_URL_HCM_HR}/LaborRelationship/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  InsertLaborRelationship(laborRelationship: LaborRelationship){
   //debugger;
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_HCM_HR}/laborRelationship/`+id,laborRelationship);
  }

  GetLaborRelationshipMinimum(filters: LaborRelationshipMinimumFilter = new LaborRelationshipMinimumFilter()){
    return this._httpClient
      .get<LaborRelationshipMinimum[]>(`${environment.API_BASE_URL_HCM_HR}/LaborRelationship/GetLaborRelationshipMinimum/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }
  //Inserts Miminum Employee data records
  ImportMinimunEmployeeData(LaborRelationshipMinimum: LaborRelationshipMinimumExcelList){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_HCM_HR}/LaborRelationship/PostLaborRelationshipMinimum?idUser=`+id,LaborRelationshipMinimum);
  }
  
  GetLaborRelationshipEmployeeId(LaborRelationshipId: number) {
    // console.log(this._httpHelpersService.getHttpParamsFromPlainObject(LaborRelationshipId, false));
    debugger;
    let params = new HttpParams();
    params = params.set("LaborRelationshipId", LaborRelationshipId.toString());

    return this._httpClient
      .get<number>(`${environment.API_BASE_URL_HCM_HR}/LaborRelationship/GetLaborRelationshipEmployeeId/`, {
        params: params
      });
  }

  async getLaborRelationshipPromise(filters: LaborRelationshipFilter = new LaborRelationshipFilter()) {
    return this._httpClient.get<LaborRelationship>(`${environment.API_BASE_URL_HCM_HR}/LaborRelationship/`,
    {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    }).toPromise();
  }

}
