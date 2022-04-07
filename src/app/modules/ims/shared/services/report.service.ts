import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductRotation, ProductRotationFilters } from 'src/app/models/ims/product-rotation';
import { InventoryOfficesComparativeFilters } from 'src/app/models/ims/inventory-offices-comparative-filters';
import { InventoryProductAbc } from 'src/app/models/ims/inventory-product-abc';
import { InventoryProductAbcFilters } from 'src/app/models/ims/inventory-product-abc-filters';
import { InventoryProductByOffice } from 'src/app/models/ims/inventory-product-by-office';
import { ValuedInventory, ValuedInventoryFilters } from 'src/app/models/ims/valued-inventory';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private httpClient: HttpClient, 
    private httpHelpersService: HttpHelpersService) { }


  async getInventoryProductHistorylist(filters: ValuedInventoryFilters) {
    return this.httpClient.get<ValuedInventory[]>(`${environment.API_BASE_URL_OSM_IMS}/Reports/GetValuedInventory/`, {
      params: this.httpHelpersService.getHttpParamsFromPlainObject(filters)
    }).toPromise();
  }

  async getProductRotationlist(filters: ProductRotationFilters) {
    return this.httpClient.get<ProductRotation[]>(`${environment.API_BASE_URL_OSM_IMS}/Reports/GetProductRotations/`, {
      params: this.httpHelpersService.getHttpParamsFromPlainObject(filters)
    }).toPromise();
  }

  async getInventoryOfficesComparativelist(filters: InventoryOfficesComparativeFilters) {
    return this.httpClient.get<InventoryProductByOffice[]>(`${environment.API_BASE_URL_OSM_IMS}/Reports/GetProductsInventoryByOffice`, {
      params: this.httpHelpersService.getHttpParamsFromPlainObject(filters)
    }).toPromise();
  }

  async getInventoryProductAbclist(filters: InventoryProductAbcFilters) {
    return this.httpClient.get<InventoryProductAbc[]>(`${environment.API_BASE_URL_OSM_IMS}/Reports/GetInventoryProductAbc`, {
      params: this.httpHelpersService.getHttpParamsFromPlainObject(filters)
    }).toPromise();
  }
  
}
