import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AccountingItem } from 'src/app/modules/hcm/shared/models/masters/accounting-item';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccountinItemService {
  _accountingItem:AccountingItem;
  private readonly USER_STATE = '_USER_STATE';

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getaccountingItemByCompany(idCompany: number) {
    return this._httpClient
    .get<AccountingItem>(`${environment.API_BASE_URL_HCM_HR}/accountingItem/${idCompany}`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(idCompany)
    })
    .toPromise()
    .then(result => result)
    .catch( error => {
          return error;
      });
  }

  insertaccountingItem(accountingitem: AccountingItem){
    const { id }  = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_HCM_HR}/AccountingItem/`+id,accountingitem);
  }
}
