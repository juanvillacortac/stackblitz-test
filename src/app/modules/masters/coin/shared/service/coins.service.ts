import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { Coins } from 'src/app/models/masters/coin';
import { Cointype } from 'src/app/models/masters/coinType';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';
import { CoinFilter } from '../filters/CoinFilter';
import { CoinTypeFilter } from '../filters/CoinTypeFilter';
import { CoinxCompanyFilter } from '../filters/coinxcompany-filter';



@Injectable({
  providedIn: 'root'
})
export class CoinsService {

  public _coinsList: Coins[];
  private readonly USER_STATE = '_USER_STATE'

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);
  
  getCoinsList(filters: CoinFilter = new CoinFilter()) {
    return this._httpClient
      .get<Coins[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Coins/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  getCoinTypesList(filters: CoinTypeFilter = new CoinTypeFilter()) {
    return this._httpClient
      .get<Cointype[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Coins/CoinType/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }
  InsertUpdateCoin(coin :Coins) 
    {  
      const { id } = this._Authservice.storeUser;
       return this._httpClient
      .post<number>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Coins/`+id, coin);
     
    }

  getCoinxCompanyList(filters: CoinxCompanyFilter = new CoinxCompanyFilter()) {
    return this._httpClient
      .get<Coins[]>(`${environment.API_BASE_URL_GENERAL_MASTERS}/Coins/CoinxCompany/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
    });
  }
}
