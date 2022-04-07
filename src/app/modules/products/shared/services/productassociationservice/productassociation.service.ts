import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';
import { ProductAssociationFilterViewModel } from '../../filters/productassociationfilter';
import { ProductAssociationViewModel } from '../../view-models/productassociation';
import { ProductAssociationComponentViewModel } from '../../view-models/productassociationcomponent.viewmodel';
import { ProductAssociationDerivateViewModel } from '../../view-models/productassociationderivate.viewmodel';
import { ProductAssociationListViewModel } from '../../view-models/productassociationlistviewmodel';

@Injectable({
  providedIn: 'root'
})
export class ProductassociationService {

  public _ProductComponentList: ProductAssociationComponentViewModel[];

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService, private _AuthService: AuthService) { }

  getProductAssociationComponentsbyfilter(filters: ProductAssociationFilterViewModel = new ProductAssociationFilterViewModel()){
    return this._httpClient
      .get<ProductAssociationComponentViewModel[]>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/ProductAssociation/ProductAssociationComponent/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  getProductAssociationDerivatesbyfilter(filters: ProductAssociationFilterViewModel = new ProductAssociationFilterViewModel()){
    return this._httpClient
      .get<ProductAssociationDerivateViewModel[]>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/ProductAssociation/ProductAssociationDerivate/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  getProductAssociationsbyfilter(filters: ProductAssociationFilterViewModel = new ProductAssociationFilterViewModel()){
    return this._httpClient
      .get<ProductAssociationListViewModel[]>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/ProductAssociation/GetProductAssociation/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  postProductAssociation(productAssociationList: ProductAssociationViewModel[]){
    const { id } = this._AuthService.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/ProductAssociation/ProductAssociationPost/`+id, productAssociationList)
  }

  deleteProductAssociation(productAssociation: ProductAssociationViewModel){
    const { id } = this._AuthService.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/ProductAssociation/ProductAssociationDelete/`+id, productAssociation)
  }
}
