import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ProductcatalogFilter } from '../../filters/productcatalog-filter';
import { HttpHelpersService } from 'src/app/modules/shared/common-directive/services/http-helpers.service';
import { ProductCatalog } from '../../view-models/product-catalog.viewmodel';
import {AuthService} from 'src/app/modules/login/shared/auth.service';
import { Wastage } from '../../view-models/wastage.viewmodel';
import { Generalsection } from '../../view-models/generalsection.viewmodel';
import { ProductFilter } from '../../filters/product-filter';
import { Product } from 'src/app/models/products/product';
import { GenerateBarFilter } from '../../filters/generatebar-filter';
import { GenerateBar } from '../../view-models/generatebarcode.viewmodel';
import { ProductcomFilter } from '../../filters/productcom-filter';
import { ListproductscomViewmodel } from '../../view-models/listproductscom.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public _WastageList: Wastage[];
  public _Productscom: ListproductscomViewmodel[];

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService, private _AuthService: AuthService) { }

  //Generar barras del producto
  getGenerateBarbyfilter(filters: GenerateBarFilter = new GenerateBarFilter()){
    const { id } = this._AuthService.storeUser;
    filters.idUser = id;
    return this._httpClient
      .get<GenerateBar>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/Product/GenerateBar/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  //Generar barras del empaque
  getGenerateBarPackingbyfilter(filters: GenerateBarFilter = new GenerateBarFilter()){
    const { id } = this._AuthService.storeUser;
    filters.idUser = id;
    return this._httpClient
      .get<GenerateBar>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/Product/GetGenerateBarPacking/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  postGeneralSection(product: Product = new Product()){
    const { id } = this._AuthService.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/Product/GeneralSectionPost/`+id, product)
  }

  getProductbyfilter(filters: ProductFilter = new ProductFilter()){
    return this._httpClient
      .get<Product>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/Product/GetProduct/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  //Productos por empresa y otros filters
  getProductsCompany(filters:  ProductcomFilter = new ProductcomFilter()){
    return this._httpClient
      .get<ListproductscomViewmodel[]>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/Product/Getproductscom/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  //Productos por empresa y otros filters
  getVerifyBarCode(barcode:  string = ""){
    return this._httpClient
      .get<Boolean>(`${environment.API_BASE_URL_PRODUCT_MANAGEMENT}/Product/VerifyBarCode/`+barcode)
  }
}
