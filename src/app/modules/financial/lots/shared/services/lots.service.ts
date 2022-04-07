import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { Lots } from 'src/app/models/financial/lots';
import { LotsFilter } from '../../../../../models/financial/lotsFilter';
import { ModuleLot } from '../../../../../models/financial/moduleLot';
import { Module } from '../../../../../models/financial/Module';

import { StateLot } from 'src/app/models/financial/StateLot';
import { UpdateLots } from '../../../../../models/financial/UpdateLots';

@Injectable({
  providedIn: 'root'
})
export class LotsService {

 
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getLotsList(filters: LotsFilter = new LotsFilter()) {
   
    return this._httpClient
      .get<ModuleLot[]>(`${environment.API_BASE_URL_FINANCIAL_MASTER}/Lot/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }


  getModules(idBusiness: number = 1) {
    return this._httpClient
      .get<Module[]>(`${environment.API_BASE_URL_FINANCIAL_MASTER}/Module?idBusiness=${idBusiness}`);
  }

  getStateLot() {
    return this._httpClient
      .get<StateLot[]>(`${environment.API_BASE_URL_FINANCIAL_MASTER}/StateLot/`);
  }

 
  saveLots(model: Lots, idEmpresa: number = 1) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient.post(`${environment.API_BASE_URL_FINANCIAL_MASTER}/Lot/?idUser=${id}&idBusiness=${idEmpresa}`, model)

  }

  
  updateLots(model: UpdateLots,idEmpresa: number = 1) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient.post(`${environment.API_BASE_URL_FINANCIAL_MASTER}/Lot/edit/${id}`, model)
  }


}
