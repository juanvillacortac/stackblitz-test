import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PurchaseOrdertaxableDetail, PurchasetaxableDetailfilter } from 'src/app/models/srm/purchase-order-taxable-detail';
import { FilterProductMasivo } from 'src/app/models/srm/reception/filterproductmasivo';
import { FilterxProdODC } from 'src/app/models/srm/reception/filtertaxprododc';
import { Productdetailvalidation } from 'src/app/models/srm/reception/productdetailvalidation';
import { PurchaseValidation } from 'src/app/models/srm/reception/purchasevalidation';
import { TaxableRep } from 'src/app/models/srm/reception/taxable-rep';
import { ValidationProduct } from 'src/app/models/srm/validation-product';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';
import { TaxableDeductiblePurchase } from '../../view-models/taxabledeductiblepurchase';

@Injectable({
  providedIn: 'root'
})
export class ValidationProductService {
  private apiUrl = `${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/ValidationProduct`;
  public _ValidationProductList:ValidationProduct[];
  public _taxdedpurcharseHeader:TaxableDeductiblePurchase= new TaxableDeductiblePurchase();
  constructor(private httpClient: HttpClient, private httpHelpersService: HttpHelpersService, private authService: AuthService) { }

  async getValidationProcucts(purchaseId: number) {
    return this.httpClient.get<ValidationProduct[]>(`${this.apiUrl}/${purchaseId}/validationProducts`).toPromise();
  }

  
  async getDetailValidation(idValidationDetail: number) {
    return this.httpClient.get<Productdetailvalidation>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/ValidationProduct/${idValidationDetail}`
    ).toPromise();
  }

  getProductTaxesbyODC(filters: FilterxProdODC = new FilterxProdODC()){
    
    return this.httpClient
      .get<TaxableRep[]>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/ValidationProduct/GetTaxableProductOrder/`, {
        params: this.httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  // GetTaxablesDeductibles(filterPurchase:TaxableDeductibleFilter= new TaxableDeductibleFilter() ){
  //   return this._httpClient
  //   .get<Taxabledeductible>(`${environment.API_BASE_URL_PURSCHASE_ORDER}/PurchaseOrder/GetTaxablesDeductibles/`, {
  //     params: this._httpHelpersService.getHttpParamsFromPlainObject(filterPurchase)
  //   })
  // }

  getPurchaseValidate(purchaseId: number) {
    return this.httpClient.get<PurchaseValidation>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/ValidationProduct/ValidationHeader/${purchaseId}`
    );
  }

  savedetail(purchasedetail: Productdetailvalidation[]){
    debugger;
    const { id } = this.authService.storeUser;
    return this.httpClient
      .post<number>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/ValidationProduct/SaveDetail/`+id, purchasedetail)
  }

  getProductsTaxable( masivoDetail: FilterProductMasivo[]){
    return this.httpClient
      .post<Productdetailvalidation[]>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/ValidationProduct/GetProductsMassive/`,masivoDetail)
    }

    //#region taxables deductibles header
    getTaxablesDeductiblesPurchase(filters: FilterxProdODC = new FilterxProdODC()) {

        return this.httpClient
            .get<TaxableDeductiblePurchase>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/ValidationProduct/GetTaxablesDeductiblesPurchase/`, {
                params: this.httpHelpersService.getHttpParamsFromPlainObject(filters)
            })
    }

    addTaxDedPurchase(model: TaxableDeductiblePurchase) {
        const { id } = this.authService.storeUser;
        return this.httpClient
            .post<number>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/ValidationProduct/AddTaxableDeductiblePurchase/` + id, model)
    }

    removetaxable(deductibleAndTaxable: PurchasetaxableDetailfilter = new PurchasetaxableDetailfilter()) {
        const { id } = this.authService.storeUser;
        return this.httpClient
            .post<number>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/ValidationProduct/Removetaxabledeductible/` + id, deductibleAndTaxable)
    }
  //#endregion
}
