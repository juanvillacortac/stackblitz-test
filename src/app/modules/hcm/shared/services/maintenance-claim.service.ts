import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MaintenanceClaim } from 'src/app/modules/hcm/shared/models/laborRelationship/maintenance-claim';
import { MaintenanceClaimFilter } from 'src/app/modules/hcm/shared/filters/laborRelationship/maintenance-claim-filter';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { MaintenanceClaimDeletedFilter } from '../filters/laborRelationship/maintenance-claim-deleted-filter';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceClaimService {
  _maintenanceClaim: MaintenanceClaim[];
  private readonly USER_STATE = '_USER_STATE';

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getMaintenanceClaim(filters: MaintenanceClaimFilter = new MaintenanceClaimFilter()) {
    return this._httpClient
    .get<MaintenanceClaim[]>(`${environment.API_BASE_URL_HCM_HR}/MaintenanceClaim/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  insertMaintenanceClaim(maintenanceClaim: MaintenanceClaim){
    const { id }  = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_HCM_HR}/MaintenanceClaim/`+id,maintenanceClaim);
  }

  getMaintenanceClaimById(idMaintenanceClaim: number) {
    return this._httpClient
    .get<MaintenanceClaim>(`${environment.API_BASE_URL_HCM_HR}/MaintenanceClaim/${idMaintenanceClaim}`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(idMaintenanceClaim)
    })
    .toPromise()
    .then(result => result)
    .catch( error => {
          return error;
      });
  }

  deletedMaintenanceClaim(filters: MaintenanceClaimDeletedFilter){
    const { id }  = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_HCM_HR}/MaintenanceClaim/deleted?`+id,filters);
  }
}
