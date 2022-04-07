
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { LedgerAccountCategory } from 'src/app/models/financial/LedgerAccountCategory';
import { LedgerAccountCategoryFilter } from 'src/app/models/financial/LedgerAccountCategoryFilter';

@Injectable({
  providedIn: 'root'
})
export class LedgerAccountCategoryService  {

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice: AuthService = new AuthService(this._httpClient);

  getLedgerAccountCategoriesList(filters: LedgerAccountCategoryFilter = new LedgerAccountCategoryFilter()) {
    debugger
    return this._httpClient
      .get<LedgerAccountCategory[]>(`${environment.API_BASE_URL_FINANCIAL_MASTER}/LedgerAccountCategories/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  postLedgerAccountCategory(model: LedgerAccountCategory ,idEmpresa: number = 1 ) {
   
    const { id } = this._Authservice.storeUser;
    return this._httpClient.post(`${environment.API_BASE_URL_FINANCIAL_MASTER}/LedgerAccountCategories/?idUser=${id}&idBusiness=${idEmpresa}`, model)
  
  }

}
