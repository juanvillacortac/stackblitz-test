import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpHelpersService } from 'src/app/modules/shared/common-directive/services/http-helpers.service';
import {AuthService} from 'src/app/modules/login/shared/auth.service';
import { ComplementaryFilter } from '../../filters/complementary-filter';
import { Complementary } from 'src/app/models/products/complementary';

@Injectable({
  providedIn: 'root'
})
export class ComplementaryService {

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }

  _Authservice : AuthService = new AuthService(this._httpClient);
  // Publication= new Publication()
  getComplementary(filter:ComplementaryFilter= new ComplementaryFilter()){
    return this._httpClient
      .get<Complementary>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/Product/GetComplementary/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filter)
      })
  }
  postComplementary(_complementary: Complementary = new Complementary(), idproducto: number = 0){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/Product/PostComplementary/`+id+"/"+idproducto, _complementary)
  }
}
