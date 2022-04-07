import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Specification } from 'src/app/models/products/specification';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { HttpHelpersService } from 'src/app/modules/shared/common-directive/services/http-helpers.service';
import { environment } from 'src/environments/environment';
import { SpecificationFilter } from '../../filters/specification-filter';

@Injectable({
  providedIn: 'root'
})
export class SpecificationService {

  public _specificationList: Specification[];

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getSpecifications(_specificationId:SpecificationFilter= new SpecificationFilter()){
    return this._httpClient
      .get<Specification[]>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/Product/GetSpecifications`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(_specificationId)
      })
  }
  postSpecifications(_specification: Specification[]){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/Product/SpecificationsPost/`+id, _specification)
  }

  deleteSpecification(_specification: Specification = new Specification()){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/Product/DeleteSpecification/`+id, _specification)
  }
}
