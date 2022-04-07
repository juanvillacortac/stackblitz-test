import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { Auxiliary } from 'src/app/models/financial/auxiliary';
import { AuxiliaryFilter } from 'src/app/models/financial/AuxiliaryFilter';

@Injectable({
  providedIn: 'root'
})
export class AuxiliaryService {

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getAuxiliariesList(filters: AuxiliaryFilter = new AuxiliaryFilter()) {
    console.log(environment)
    return this._httpClient
      .get<Auxiliary[]>(`${environment.API_BASE_URL_FINANCIAL_MASTER}/Auxiliary/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  postAuxiliary(model: Auxiliary, idEmpresa: number = 1) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient.post(`${environment.API_BASE_URL_FINANCIAL_MASTER}/Auxiliary/?idUser=${id}&idBusiness=${idEmpresa}`, model)
  }

}
