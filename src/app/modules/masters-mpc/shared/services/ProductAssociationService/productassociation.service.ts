import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ProductassociationFilter } from '../../filters/productassociation-filter';
import { HttpHelpersService } from 'src/app/modules/shared/common-directive/services/http-helpers.service';
import { Productassociation } from 'src/app/models/masters-mpc/productassociation';
import {AuthService} from 'src/app/modules/login/shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductassociationService {

  public _ProductassociationList : Productassociation[];

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getProductassociationbyfilter(filters: ProductassociationFilter = new ProductassociationFilter(), order: number = 0){
    return this._httpClient
      .get<Productassociation[]>(`${environment.API_BASE_URL_OSM_MASTERS}/ProductAssociation/${order}`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  postProductassociation(_productassociation: Productassociation = new Productassociation()){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_OSM_MASTERS}/ProductAssociation/`+id, _productassociation)
  }
}
