import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReceptionViewer } from 'src/app/models/srm/reception-viewer';
import { ChildReceptionFilters, ReceptionFilters } from 'src/app/models/srm/reception-filters';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';
import { ChildReception, Reception, ReceptionUpdateStatus } from 'src/app/models/srm/reception';
import { SimpleReception } from 'src/app/models/srm/simple-reception';
import { FilterLot } from '../../filters/filter-lot';
import { Lot } from 'src/app/models/srm/lot';
import { Produclot } from 'src/app/models/srm/produclot';
import { DetailReception } from 'src/app/models/srm/detailreception';
import { ReceptionDetailFilter } from 'src/app/models/srm/reception-detail-filter';
import { DetailProductReception } from 'src/app/models/srm/detailproductreception';
import { DiferencesReception } from 'src/app/models/srm/diferencesreception';
import { PurchaseReceptionFilter } from 'src/app/models/srm/purchaserecpetionfilter';
import { PurchaseReception } from 'src/app/models/srm/purchasereception';
import { ReceptionDashboard } from 'src/app/models/srm/receptiondashboard';
import { ReceptionTimeLine } from 'src/app/models/srm/reception-timeline';
import { ReceptionTimelineFilters } from 'src/app/models/srm/reception/reception-timeline-filters';
import { Result } from '../../filters/common/result';

@Injectable({
  providedIn: 'root'
})
export class MerchandiseReceptionService {

  private readonly USER_STATE = '_USER_STATE';
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService, 
    private readonly _AuthService: AuthService) { }
  _detailLot : Lot[];

  getReceptionlist(filters: ReceptionFilters) {
    
    return this._httpClient.get<ReceptionViewer[]>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/Reception/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  getSimpleReceptions(purchaseId: number) {
    var reception=new ChildReceptionFilters();
    reception.purchaseId=purchaseId;
    return this._httpClient
    .get<ChildReception[]>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/SimpleReception/getSimpleReceptions/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(reception)
    });
    
  }
  
  getReceptionsimple(receptionId: number) {
    var reception=new ChildReceptionFilters();
    reception.receptionId=receptionId;
    return this._httpClient
    .get<ChildReception>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/SimpleReception/getSimpleReception/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(reception)
    });
    
  }

   getReceptionData(receptionId: number) {
    return this._httpClient.get<Reception>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/Reception/${receptionId}`
    )
  }
 
  async createReception(reception: Reception) {
    return this._httpClient.post<Boolean>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/Reception/`,
    reception).toPromise();
  }

  async createSimpleReception(reception: SimpleReception) {
    return this._httpClient.post<number>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/Reception/CreateSimpleReception/`,
    reception).toPromise();
  }

  //#region lot
  getLot(filters: FilterLot = new FilterLot()){
    return this._httpClient
      .get<Lot[]>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/Reception/GetLotProduct/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
    }

    getLotProductxPackagin(filters: FilterLot = new FilterLot()){
      return this._httpClient
        .get<Lot[]>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/Reception/GetLotProductxPackagin/`, {
          params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
        })
      }

    SaveLot(lot: Lot = new Lot()) {
      const { id } = this._AuthService.storeUser;
      return this._httpClient
          .post<number>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/Reception/SaveLot/` + id, lot)
  }

  removeLot(lots: Lot[]=[]){

    const { id } = this._AuthService.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/Reception/RemoveLot/`+id, lots)
  }


  //#endregion
//#region  DETALLES
SaveDetail(item: DetailReception = new DetailReception()) {
  const { id } = this._AuthService.storeUser;
  return this._httpClient
      .post<number>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/Reception/PostDetail/`+id, item)
}

getReceptionDetaillist(filters: ReceptionDetailFilter){
  return this._httpClient
    .get<DetailReception[]>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/Reception/GetReceptionProduct/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    });
  }

  getReceptiodetailnweigth(filters: ReceptionDetailFilter){
    return this._httpClient
      .get<DetailReception[]>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/Reception/GetReceptionWeight/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      });
    }

    removedetailweigth(purchaseorderdetail: DetailProductReception[]=[]){

      const { id } = this._AuthService.storeUser;
      return this._httpClient
        .post<number>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/Reception/RemoveWeight/`+id, purchaseorderdetail)
    }

//#endregion
 //#region  diferencias
 getdiferences(filters:DiferencesReception){
  return this._httpClient
    .get<DiferencesReception[]>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/Reception/GetDiferencesReception/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    })
  }

addDiferences(diferences: DiferencesReception[]=[]){

  const { id } = this._AuthService.storeUser;
  return this._httpClient
    .post<number>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/Reception/AddDiferences/`+id, diferences)
}

getpurchaserecepction(filters:PurchaseReceptionFilter){

  return this._httpClient
    .get<PurchaseReception[]>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/Reception/GetPurchaseReception/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    })
  }


  receptionaboutpurchaseOrder(order: Reception = new Reception()) {
    const { id } = this._AuthService.storeUser;
    return this._httpClient
        .post<number>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/Reception/RecepctionAboutpurchaseorder/` + id, order)}

 getDashboard(filters:Reception  = new Reception()){
 return this._httpClient
    .get<ReceptionDashboard[]>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/Reception/GetDashboard/`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
   });
}

updateStatus(item: ReceptionUpdateStatus = new ReceptionUpdateStatus()) {
  const { id } = this._AuthService.storeUser;
  return this._httpClient
      .post<Result>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/Reception/UpdateStatusReception/`+id, item)
}

 //#endregion

//#region timeline

getTimeline( filters: ReceptionTimelineFilters){
  return this._httpClient
    .get<ReceptionTimeLine[]>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/Reception/GetReceptionTimeLine`, {
      params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
    })
}
//#endregion


//#region child

UpdateChildReception(item: ChildReception = new ChildReception()) {
  const { id } = this._AuthService.storeUser;
  return this._httpClient
      .post<number>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/SimpleReception/UpdateSimpleReception/`+id, item)
}

//#endregion
}


