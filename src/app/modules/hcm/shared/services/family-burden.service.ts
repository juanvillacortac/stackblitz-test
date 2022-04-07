import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FamilyBurden } from 'src/app/modules/hcm/shared/models/laborRelationship/family-burden';
import { FamilyBurdenFilter } from 'src/app/modules/hcm/shared/filters/laborRelationship/family-burden-filter';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FamilyBurdenService {
  _familyBurden: FamilyBurden[];
  private readonly USER_STATE = '_USER_STATE';

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getFamilyBurden(filters: FamilyBurdenFilter = new FamilyBurdenFilter()) {
    return this._httpClient
    .get<FamilyBurden[]>(`${environment.API_BASE_URL_HCM_HR}/FamilyBurden/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  insertFamilyBurden(familyBurden: FamilyBurden){
    const { id }  = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_HCM_HR}/FamilyBurden/`+id,familyBurden);
  }

  getFamilyBurdenById(idFamilyBurden: number) {
    return this._httpClient
    .get<FamilyBurden>(`${environment.API_BASE_URL_HCM_HR}/FamilyBurden/${idFamilyBurden}`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(idFamilyBurden)
    })
    .toPromise()
    .then(result => result)
    .catch( error => {
          return error;
      });
  }
}
