import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NumbersOrder } from 'src/app/models/srm/common/numbers-order';
import { PurchaseOrderProduct } from 'src/app/models/srm/purchase-order-product';
import { PurchaseOrder } from 'src/app/models/srm/purchase-order';
import { Groupingpurchaseorders } from 'src/app/models/srm/groupingpurchaseorders';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { HttpHelpersService } from 'src/app/modules/shared/common-directive/services/http-helpers.service';
import { environment } from 'src/environments/environment';
import { NumbersordersFilter } from '../../filters/common/numbersorders-filter';
import { FilterPurchaseOrder } from '../../filters/filter-purchase-order';
import { PurchaseOrderFilter } from '../../filters/purchase-order-filter';
import { FilterPurchaseOrderModal } from '../../filters/filter-purchase-order-modal';
import { PurchaselistViewmodel } from '../../view-models/purchaselist-viewmodel';
import { PurchaseOrderModal } from 'src/app/models/srm/purchase-order-modal';
import { PurchaseOrderProductPrice } from 'src/app/models/srm/purchase-order-product-price';
import { Taxabledeductible } from 'src/app/models/srm/taxabledeductible';
import { PurchaseOrderdeductibleDetail } from 'src/app/models/srm/purchase-order-detail-deductible';
import { PurchaseOrdertaxableDetail } from 'src/app/models/srm/purchase-order-taxable-detail';
import { TaxableDeductibleFilter } from 'src/app/models/srm/taxable-deductible-filter';
import { TimeLinePurchaseOrderFilter } from 'src/app/models/srm/timeline-purchaseorder-filter';
import { TimeLinePurchaseOrder } from 'src/app/models/srm/timeline-purchaseorder';
import { DistributedProduct } from 'src/app/models/srm/distributed-product';
import { FilterDistributedPurchaseOrder } from '../../filters/filter-distributed-purchase-order';
import { PurchaseOrderProductFilter } from '../../filters/purchase-order-product';
import { PurchaseOrderUpdateStatus } from 'src/app/models/srm/purchase-order-status';
import { DistributedDocumentBase } from 'src/app/models/srm/distributed-document-base';
import { purchaseOrderReceivedFilters } from 'src/app/models/srm/common/purchase-order-received-filters';
import { purchaseOrderReceived } from 'src/app/models/srm/purchase-order-received';

@Injectable({
  providedIn: 'root'
})
export class PurchaseorderService {

  public _PurchaseOrderList: PurchaselistViewmodel[];
  public _PurchaseOrderDetailList: PurchaseOrderModal[];
  public _purchaseOrderDetail: PurchaseOrderProduct[];
  public _taxdedpurcharseHeader:Taxabledeductible= new Taxabledeductible();
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService, private _AuthService: AuthService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);


  getPurchasefilter(filters: FilterPurchaseOrder = new FilterPurchaseOrder()){
    return this._httpClient
      .get<PurchaselistViewmodel[]>(`${environment.API_BASE_URL_PURSCHASE_ORDER}/PurchaseOrder/GetPurchaseOrders/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  getnumbersOrdersfilter(filters: NumbersordersFilter = new NumbersordersFilter()){
    return this._httpClient
      .get<NumbersOrder[]>(`${environment.API_BASE_URL_PURSCHASE_ORDER}/Common/NumbersIdentificator/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  //#region purchaseorderHeader
  postPurchase(purchaseorderHeader: Groupingpurchaseorders = new Groupingpurchaseorders()){
    const { id } = this._AuthService.storeUser;
    purchaseorderHeader.purchase.responsibleId=id;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_PURSCHASE_ORDER}/PurchaseOrder/`+id, purchaseorderHeader)
  }

  getPurchase(filters: PurchaseOrderFilter = new PurchaseOrderFilter()){
    debugger
    return this._httpClient
      .get<Groupingpurchaseorders>(`${environment.API_BASE_URL_PURSCHASE_ORDER}/PurchaseOrder/GetOrderPurchase/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }

  UpdatePurchase(purchaseOrder: PurchaseOrderUpdateStatus){
    const { id } = this._AuthService.storeUser;
    return this._httpClient
      .put<number>(`${environment.API_BASE_URL_PURSCHASE_ORDER}/PurchaseOrder/UpdateStatusOrder/${id}`, purchaseOrder)
  }
  //#endregion

  getPurchaseOrderDetail(filters: FilterPurchaseOrderModal = new FilterPurchaseOrderModal()){
    return this._httpClient
      .get<PurchaseOrderModal[]>(`${environment.API_BASE_URL_PURSCHASE_ORDER}/PurchaseOrder/GetPurchaseOrderDetail/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }
  getPurchaseOrderDetailVerified(filters: PurchaseOrderProduct[],id :number){
    return this._httpClient
    .post<PurchaseOrderProduct[]>(`${environment.API_BASE_URL_PURSCHASE_ORDER}/PurchaseOrder/GetPurchaseOrderDetailverified/`+id, filters);
  }

  getPurchaseOrderProduct(filters: PurchaseOrderFilter = new PurchaseOrderFilter()){
    return this._httpClient
      .get<PurchaseOrderProduct[]>(`${environment.API_BASE_URL_PURSCHASE_ORDER}/PurchaseOrder/GetPurchaseOrderProduct/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
    }

    getPurchaseOrderProductExpress(filters: PurchaseOrderProductFilter = new PurchaseOrderProductFilter()){
      return this._httpClient
        .get<PurchaseOrderProduct[]>(`${environment.API_BASE_URL_PURSCHASE_ORDER}/PurchaseOrder/GetPurchaseOrderProductExpress/`, {
          params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
        })
      }

  savedetail(purchaseorderdetail: PurchaseOrderProduct[],boolEdit : boolean){
    const { id } = this._AuthService.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_PURSCHASE_ORDER}/PurchaseOrder/SaveDetail/`+id+'/'+boolEdit, purchaseorderdetail)
  }

    removedetail(purchaseorderdetail: PurchaseOrderProduct[]=[]){

      const { id } = this._AuthService.storeUser;
      return this._httpClient
        .post<number>(`${environment.API_BASE_URL_PURSCHASE_ORDER}/PurchaseOrder/RemoveDetail/`+id, purchaseorderdetail)
    }

    SaveTaxables(deductibleAndTaxable: Taxabledeductible = new Taxabledeductible()) {
        const { id } = this._AuthService.storeUser;
        return this._httpClient
            .post<number>(`${environment.API_BASE_URL_PURSCHASE_ORDER}/PurchaseOrder/SaveTaxable/` + id, deductibleAndTaxable)
    }

    //#region  eliminacion taxables yand deductibles
     removetaxable(deductibleAndTaxable: PurchaseOrdertaxableDetail= new PurchaseOrdertaxableDetail()){
      const { id } = this._AuthService.storeUser;
      return this._httpClient
        .post<number>(`${environment.API_BASE_URL_PURSCHASE_ORDER}/PurchaseOrder/Removetaxabledeductible/`+id, deductibleAndTaxable)
      }

    GetTaxablesDeductibles(filterPurchase:TaxableDeductibleFilter= new TaxableDeductibleFilter() ){
      return this._httpClient
      .get<Taxabledeductible>(`${environment.API_BASE_URL_PURSCHASE_ORDER}/PurchaseOrder/GetTaxablesDeductibles/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filterPurchase)
      })
    }

      removedeductible(deductibleAndTaxable: PurchaseOrderdeductibleDetail = new PurchaseOrderdeductibleDetail()){
        const { id } = this._AuthService.storeUser;
        return this._httpClient
          .post<number>(`${environment.API_BASE_URL_PURSCHASE_ORDER}/PurchaseOrder/Removetaxabledeductible/`+id, deductibleAndTaxable)
        }

        getTimeline(filters: TimeLinePurchaseOrderFilter = new TimeLinePurchaseOrderFilter()){
          return this._httpClient
            .get<TimeLinePurchaseOrder[]>(`${environment.API_BASE_URL_PURSCHASE_ORDER}/PurchaseOrder/GetTimeLine/`, {
              params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
            })
        }
      //#endregion



      //REGION ORDEN DISTRIBUIDA
      GetDistributedPurchaseOrder(filters: FilterDistributedPurchaseOrder = new FilterDistributedPurchaseOrder()){
        return this._httpClient
          .get<DistributedProduct[]>(`${environment.API_BASE_URL_PURSCHASE_ORDER}/PurchaseOrder/GetDistributedPurchaseOrder/`, {
            params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
          })
      }

      RemoveDistributedProducts(distributedProduct: DistributedProduct[],isFromHeader: boolean){
        const { id } = this._AuthService.storeUser;
        return this._httpClient
          .post<number>(`${environment.API_BASE_URL_PURSCHASE_ORDER}/PurchaseOrder/RemoveDistributedProducts/`+id+'/'+isFromHeader, distributedProduct)
       }



       SaveProductDistributedOrder(distributedProduct: DistributedProduct[],boolEdit : boolean){
        const { id } = this._AuthService.storeUser;
        return this._httpClient
          .post<number>(`${environment.API_BASE_URL_PURSCHASE_ORDER}/PurchaseOrder/SaveProductDistributedOrder/`+id+'/'+boolEdit, distributedProduct)
      }

       DistributePurchaseOrder(filters: FilterPurchaseOrder = new FilterPurchaseOrder()){
         const { id } = this._AuthService.storeUser;
         return this._httpClient
           .post<DistributedDocumentBase[]>(`${environment.API_BASE_URL_PURSCHASE_ORDER}/PurchaseOrder/DistributePurchaseOrder/`+id,filters)
       }

       CentralizedOrConsolidatedPurchaseOrder(filters: FilterPurchaseOrder = new FilterPurchaseOrder()){
        const { id } = this._AuthService.storeUser;
        return this._httpClient
          .post<DistributedDocumentBase[]>(`${environment.API_BASE_URL_PURSCHASE_ORDER}/PurchaseOrder/CentralizedOrConsolidatedPurchaseOrder/`+id,filters)
      }

       ConsolidatedPurchaseOrder(filters: FilterPurchaseOrder = new FilterPurchaseOrder()){
        const { id } = this._AuthService.storeUser;
        return this._httpClient
          .post<DistributedDocumentBase[]>(`${environment.API_BASE_URL_PURSCHASE_ORDER}/PurchaseOrder/ConsolidatedPurchaseOrder/`+id,filters)
      }

      GetDistributedDocuments(filters: FilterDistributedPurchaseOrder = new FilterDistributedPurchaseOrder()){
        return this._httpClient
          .get<DistributedDocumentBase[]>(`${environment.API_BASE_URL_PURSCHASE_ORDER}/PurchaseOrder/GetDistributedDocuments/`, {
            params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
          })
      }

      //#endregion

      GetTaxDedProd(filters: PurchaseOrderProduct[],id :number){
        return this._httpClient
        .post<PurchaseOrderProduct[]>(`${environment.API_BASE_URL_PURSCHASE_ORDER}/PurchaseOrder/GetTaxDedDetail/`+id, filters);
      }

      //#region purchase order received
      getPurchaseOrderReceived(filters: purchaseOrderReceivedFilters = new purchaseOrderReceivedFilters()){
        return this._httpClient
          .get<purchaseOrderReceived[]>(`${environment.API_BASE_URL_PURSCHASE_ORDER}/PurchaseOrder/GetPurchaseOrderReceived`, {
            params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
          })
      }
      //#endregion



}


