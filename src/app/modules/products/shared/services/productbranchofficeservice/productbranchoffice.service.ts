import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';
import { PointOrderFilter } from '../../filters/pointorderfilter';
import { ValidationFactorFilter } from '../../filters/validationfactorfilter';
import { ValidationFactor } from '../../../../../models/products/validationfactor';
import { PointOrder } from 'src/app/models/products/pointorder';
import { PackingByBranchOfficeFilter } from '../../filters/packingbybranchoffice-filter';
import { PackingByBranchOffice } from 'src/app/models/products/packingbybranchoffice';
import { InventoryFilter } from '../../filters/inventory-filter';
import { InventoryProductBranchOffice } from 'src/app/models/products/inventory';
import { ProductBranchFilter } from '../../filters/productbranch-filter';
import { AuditFilter } from '../../filters/audit-filter';
import { AuditViewerProductBranch } from 'src/app/models/products/audit';
import { ValidateProductActiveFilter } from '../../filters/validate-product-active-filter';
import { ValidateProductActive } from 'src/app/models/products/validate-product-active';

@Injectable({
  providedIn: 'root'
})
export class ProductbranchofficeService {

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService, private _AuthService: AuthService) { }

  postValidationFactor(validationFactor: ValidationFactor[]){
    const { id } = this._AuthService.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_BRANCH_OFFICE_PRODUCT}/ProductBranchOffice/ValidationFactorPost/`+id, validationFactor)
  }

  getValidationFactorbyfilter(filters: ValidationFactorFilter= new ValidationFactorFilter()){
    return this._httpClient
      .get<ValidationFactor[]>(`${environment.API_BASE_URL_BRANCH_OFFICE_PRODUCT}/ProductBranchOffice/GetValidationFactor/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  getPointOrderbyfilter(filters: PointOrderFilter= new PointOrderFilter()){
    return this._httpClient
      .get<PointOrder[]>(`${environment.API_BASE_URL_BRANCH_OFFICE_PRODUCT}/ProductBranchOffice/GetPointOrder/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }
  
  postPointOrder(pointOrder: PointOrder[]){
    const { id } = this._AuthService.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_BRANCH_OFFICE_PRODUCT}/ProductBranchOffice/PointOrderPost/`+id, pointOrder)
  }

  getPackingBranchOfficebyfilter(filters: PackingByBranchOfficeFilter= new PackingByBranchOfficeFilter()){
    return this._httpClient
      .get<PackingByBranchOffice[]>(`${environment.API_BASE_URL_BRANCH_OFFICE_PRODUCT}/ProductBranchOffice/GetPackingBranchOffice/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }
  
  postPackingBranchOffice(packingBranchOffice: PackingByBranchOffice[]){
    const { id } = this._AuthService.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_BRANCH_OFFICE_PRODUCT}/ProductBranchOffice/PackingBranchOfficePost/`+id, packingBranchOffice)
  }

  getInventorybyfilter(filters: InventoryFilter= new InventoryFilter()){
    return this._httpClient
      .get<InventoryProductBranchOffice[]>(`${environment.API_BASE_URL_BRANCH_OFFICE_PRODUCT}/ProductBranchOffice/GetInventory/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  getProductBranchOfficebyfilter(filters: ProductBranchFilter= new ProductBranchFilter()){
    return this._httpClient
      .get<PackingByBranchOffice[]>(`${environment.API_BASE_URL_BRANCH_OFFICE_PRODUCT}/ProductBranchOffice/GetProductsBranch/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  getAuditbyFilter(filters: AuditFilter = new AuditFilter()){
    return this._httpClient
    .get<AuditViewerProductBranch[]>(`${environment.API_BASE_URL_BRANCH_OFFICE_PRODUCT}/ProductBranchOffice/GetAudit/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    })
  }

  getvalidateProductActive(filters: ValidateProductActiveFilter= new ValidateProductActiveFilter()){
    return this._httpClient
      .get<ValidateProductActive[]>(`${environment.API_BASE_URL_BRANCH_OFFICE_PRODUCT}/ProductBranchOffice/GetValidateProductActive/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }
}
