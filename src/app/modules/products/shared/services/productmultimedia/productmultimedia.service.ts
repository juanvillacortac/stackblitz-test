import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductMultimediaUse } from 'src/app/models/products/productmultimediause';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductmultimediaService {

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

      // getMultimediaProductbyfilter(filters: MultimediaProductFilter = new MultimediaProductFilter(), order: number = 0){
      //   return this._httpClient
      //     .get<MultimediaProduct[]>(`${environment.API_BASE_URL_OSM_MULTIMEDIA}/MultimediaProduct/`, {
      //       params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      //     })
      // }
      postProductMultimediaUse(_productMultimediaUse: ProductMultimediaUse[]){
        const { id } = this._Authservice.storeUser;
        return this._httpClient
          .post<number>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/ProductMultimediaUse/`+id, _productMultimediaUse)
      }

      deleteProductMultimediaUse(_id: number){
        const { id } = this._Authservice.storeUser;
        return this._httpClient
          .delete<number>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/ProductMultimediaUse/`+_id+'/'+id)
      } 
}
