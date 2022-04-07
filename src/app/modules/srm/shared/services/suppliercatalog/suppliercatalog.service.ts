import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FilterService } from 'primeng/api';
import { SupplierCatalogModal } from 'src/app/models/common/supplier-catalog-modal';
import { Supplier } from 'src/app/models/masters/supplier';
import { Productsprovider } from 'src/app/models/srm/productsprovider';
import { Productsxsupplier } from 'src/app/models/srm/productsxsupplier';
import { Providertimeline } from 'src/app/models/srm/providertimeline';
import { SuppliersxPackingViewer } from 'src/app/models/srm/suppliersxpackingviewer';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';
import { BarFilter } from '../../filters/bar-filter';
import { ProductxsupplierFilter } from '../../filters/productxsupplier-filter';
import { ProviderTimelineFilter } from '../../filters/provider-timeline-filter';
import { SupplierFilter } from '../../filters/supplier-filter';
import { SuppliercatalogFilter } from '../../filters/suppliercatalog-filter';
import { SuppliersxPackingViewerFilter } from '../../filters/supplierxpackingviewer-filter';
import { ListproductsViewmodel } from '../../view-models/listproducts-viewmodel';
import { SupplierCatalog } from '../../view-models/supplier-catalog.viewmodel';
import { SupplierempViewmodel } from '../../view-models/suppliersemp-viewmodel';

@Injectable({
  providedIn: 'root'
})
export class SuppliercatalogService {
  
  public _SupplierCatalogList: SupplierCatalog[];
  public _SupplierCatalogExpressList: SupplierCatalogModal[];
  public _SupplierClassiList: SupplierempViewmodel[];
  public _ProductsxSuppliersList: Productsxsupplier[];
  public _PackagingAssociatesxSuppliersList: Productsxsupplier[];
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService, private authService: AuthService) { }

  getSupplierCatalogfilter(filters: SuppliercatalogFilter = new SuppliercatalogFilter()){
    filters.idCom=this.authService.currentCompany ;
    const { id } = this.authService.storeUser;
    filters.userId= id;
    return this._httpClient
      .get<SupplierCatalog[]>(`${environment.API_BASE_URL_SRM_SUPPLIER}/SupplierCatalog/GetProductxsupplier/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  getSupplierProductfilter(filters: BarFilter = new BarFilter()){
    return this._httpClient
      .get<Productsxsupplier>(`${environment.API_BASE_URL_SRM_SUPPLIER}/SupplierCatalog/GetProductsxbar/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  postSupplierProduct(_supplier: Productsxsupplier []){
     const userId = this.authService.idUser;
     return this._httpClient
       .post<number>(`${environment.API_BASE_URL_SRM_SUPPLIER}/SupplierCatalog/KnownPost/`+userId, _supplier)
   }

   getSupplierListclass(filters: SupplierFilter = new SupplierFilter()) {
    filters.idUser=this.authService.idUser;
    return this._httpClient
      .get<SupplierempViewmodel[]>(`${environment.API_BASE_URL_SRM_SUPPLIER}/SupplierCatalog/Getsuppliers/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
  }

  getSupplierProductTimeline(filters:  ProviderTimelineFilter = new ProviderTimelineFilter()){
    return this._httpClient
      .get<Providertimeline[]>(`${environment.API_BASE_URL_SRM_SUPPLIER}/SupplierCatalog/GetTimeLine/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }
  //Productos de acuerdo a una cadena de proveedores y otros filters
  getPackagingAssociatesxSuppliers(filters:  ProductxsupplierFilter = new ProductxsupplierFilter()){
    return this._httpClient
      .get<Productsxsupplier[]>(`${environment.API_BASE_URL_SRM_SUPPLIER}/SupplierCatalog/GetPackagingAssociatesxSuppliers/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }
  
  getSupplierCatalogExpressfilter(filters: SuppliercatalogFilter = new SuppliercatalogFilter()){
    debugger;
    filters.idCom=this.authService.currentCompany;
    filters.userId= this.authService.idUser;
    return this._httpClient
      .get<SupplierCatalogModal[]>(`${environment.API_BASE_URL_SRM_SUPPLIER}/SupplierCatalog/GetSupplierCatalogExpress/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  getSupplierCatalogExpressfilterverified(filters:SupplierCatalogModal[], id:number){
      return this._httpClient
      .post<SupplierCatalogModal[]>(`${environment.API_BASE_URL_SRM_SUPPLIER}/SupplierCatalog/GetSupplierCatalogExpressverified/`+id, filters);
  }

  getSuppliersxPackingViewer(filters: SuppliersxPackingViewerFilter = new SuppliersxPackingViewerFilter()){
    return this._httpClient
      .get<SuppliersxPackingViewer[]>(`${environment.API_BASE_URL_SRM_SUPPLIER}/SupplierCatalog/GetSuppliersxPackingViewer/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }
}
