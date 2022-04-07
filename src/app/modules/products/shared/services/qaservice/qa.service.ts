import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Qaproduct } from 'src/app/models/products/qaproduct';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';
import { QaFilter } from '../../filters/qa-filter';
import { RegulationFilter } from '../../filters/regulation-filter';
import { Regulations } from '../../view-models/regulation.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class QaService {

  public _productregulationList: Qaproduct= new Qaproduct();

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getProductRegulations(_prodRegulation:QaFilter= new QaFilter()){
    return this._httpClient
      .get<Qaproduct>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/Product/GetRegulations`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(_prodRegulation)
      })
  }
  
  postProductRegulations(_prodRegulation: Qaproduct = new Qaproduct(), idproduct: number){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/Product/RegulationPost/`+id+"/"+idproduct, _prodRegulation)
  }

  deleteProductRegulations(_prodRegulation: Qaproduct = new Qaproduct()){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/Product/RegulationDelete/`+id, _prodRegulation)
  }

  getProductRegulationsAvailable(_prodRegulation:RegulationFilter= new RegulationFilter()){
    return this._httpClient
      .get<Qaproduct>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/Product/GetRegulationsAvailable`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(_prodRegulation)
      })
  }
}
