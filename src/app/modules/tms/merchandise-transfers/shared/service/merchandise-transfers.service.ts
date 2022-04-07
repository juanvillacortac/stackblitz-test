import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatabaseResult } from 'src/app/models/common/databaseresult';
import { Product } from 'src/app/models/products/product';
import { Lot } from 'src/app/models/tms/lot';
import { MerchandiseBranchTransfers } from 'src/app/models/tms/merchandisebranchtransfers';
import { MerchandiseBranchTransfersDetail } from 'src/app/models/tms/merchandisebranchtransfersdetail';
import { MerchandiseBranchTransfersDetailLot } from 'src/app/models/tms/merchandisebranchtransfersdetaillot';
import { MerchandiseBranchTransfersPalette } from 'src/app/models/tms/merchandisebranchtransferspalette';
import { MerchandiseTransfers } from 'src/app/models/tms/merchandisetransfers';
import { ReasonReturnPallette } from 'src/app/models/tms/reasonReturnPallette';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';
import { LotFilter } from '../../../shared/filters/lot-filter';
import { MerchandiseTransfersFilter } from '../filters/merchandise-transfers-filters';
import { TagPallette } from '../view-models/tagpallette';

@Injectable({
  providedIn: 'root'
})
export class MerchandiseTransfersService {

  merchandiseTransfersList: MerchandiseTransfers[] = [];
  idMerchandiseRequestList : number[] = [];

  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService) { }
  _Authservice: AuthService = new AuthService(this._httpClient);

  getMerchandiseTransfersList(filters: MerchandiseTransfersFilter = new MerchandiseTransfersFilter()) {
    return this._httpClient
      .get<MerchandiseTransfers[]>(`${environment.API_BASE_URL_OSM_MERCHANDISE_TRANSFERS}/MerchandiseTransfers/Get/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  getTransferTransportList(idTransfer: number = 0, idBranchTranfer: number = 0) {
    return this._httpClient
      .get<MerchandiseBranchTransfers[]>(`${environment.API_BASE_URL_OSM_MERCHANDISE_TRANSFERS}/MerchandiseTransfers/GetTransferTransport/` + idTransfer + `/` + idBranchTranfer);
  }

  InsertMerchandiseTransfers(merchandiseTransfer: MerchandiseTransfers) {
    merchandiseTransfer.originBranch.id = this._Authservice.currentOffice;
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_OSM_MERCHANDISE_TRANSFERS}/MerchandiseTransfers/Insert/` + id, merchandiseTransfer);
  }

  InsertMerchandiseTransfersXRequest(stirngMerchandiseRequest: string) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<number>(`${environment.API_BASE_URL_OSM_MERCHANDISE_TRANSFERS}/MerchandiseTransfers/InsertMerchandiseTransferXRequest/` + stirngMerchandiseRequest + `/` + id, null);
  }

  UpdateMerchandiseTransfers(merchandiseTransfer: MerchandiseTransfers) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<DatabaseResult>(`${environment.API_BASE_URL_OSM_MERCHANDISE_TRANSFERS}/MerchandiseTransfers/Update/` + id, merchandiseTransfer);
  }

  SendMerchandiseTrasnfers(merchandiseTransfer: MerchandiseTransfers) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<MerchandiseBranchTransfers[]>(`${environment.API_BASE_URL_OSM_MERCHANDISE_TRANSFERS}/MerchandiseTransfers/Send/` + id, merchandiseTransfer);
  }

  DeleteMerchandiseTrasnferDetail(stirngDeleteBranchTransfer: string, idBranchTranfer: number) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .delete<DatabaseResult>(`${environment.API_BASE_URL_OSM_MERCHANDISE_TRANSFERS}/MerchandiseTransfers/Delete/` + stirngDeleteBranchTransfer + `/` + idBranchTranfer + `/` + id);
  }

  UpdateAdditionalData(merchandiseBranchTransfer: MerchandiseBranchTransfers) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<DatabaseResult>(`${environment.API_BASE_URL_OSM_MERCHANDISE_TRANSFERS}/MerchandiseTransfers/UpdateAdditionalData/` + id, merchandiseBranchTransfer);
  }

  DeleteMerchandiseTrasnferTransport(idTransferTransport: number) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .delete<DatabaseResult>(`${environment.API_BASE_URL_OSM_MERCHANDISE_TRANSFERS}/MerchandiseTransfers/DeleteTransferTransport/` + idTransferTransport + `/` + id);
  }

  getGenerateTagPallett(idBranchTransfer: number = 0){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .get<TagPallette>(`${environment.API_BASE_URL_OSM_MERCHANDISE_TRANSFERS}/MerchandiseTransfers/GenerateTagPallette/` + idBranchTransfer + `/` + id);
  }

  insertBranchTransferPallette(branchTransfer: MerchandiseBranchTransfers){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<MerchandiseBranchTransfersPalette[]>(`${environment.API_BASE_URL_OSM_MERCHANDISE_TRANSFERS}/MerchandiseTransfers/InsertBranchTrasferPallette/` + id, branchTransfer);
  }

  getMerchandiseTransfersPallette(idTransfer: number = 0, idBranchTranfer: number = 0){
    return this._httpClient
    .get<MerchandiseTransfers[]>(`${environment.API_BASE_URL_OSM_MERCHANDISE_TRANSFERS}/MerchandiseTransfers/GetMerchandiseTransferPallette/` + idTransfer + `/` + idBranchTranfer);
  }

  deleteBranchTransferPallette(idBranchTransferPallette: number) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .delete<boolean>(`${environment.API_BASE_URL_OSM_MERCHANDISE_TRANSFERS}/MerchandiseTransfers/DeleteBranchTransferPallette/` + idBranchTransferPallette);
  }

  finishBranchTransferPallette(idBranchTransfer: number) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<boolean>(`${environment.API_BASE_URL_OSM_MERCHANDISE_TRANSFERS}/MerchandiseTransfers/FinishBranchTranferPalletizing/` + idBranchTransfer + `/` + id, null);
  }

  updateMerchandiseBranchTransfersDetailLot(merchandiseBranchTransferDetailLot: MerchandiseBranchTransfersDetailLot) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<DatabaseResult>(`${environment.API_BASE_URL_OSM_MERCHANDISE_TRANSFERS}/MerchandiseTransfers/UpdateDetailLot/` + id, merchandiseBranchTransferDetailLot);
  }

  deleteMerchandiseTrasnferDetailLot(idBranchTransferDetail: number, IdBranchTransferDetailLot: number) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .delete<boolean>(`${environment.API_BASE_URL_OSM_MERCHANDISE_TRANSFERS}/MerchandiseTransfers/DeleteDetailLot/` + idBranchTransferDetail + `/` + IdBranchTransferDetailLot + `/` + id);
  }

  cancelBranchTransfer(idTransfer: number, idBranchTransfer: number) {
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<any>(`${environment.API_BASE_URL_OSM_MERCHANDISE_TRANSFERS}/MerchandiseTransfers/CancelBranchTransfer/` + idTransfer + `/` + idBranchTransfer + `/` + id, null);
  }

  getBranchTransferDetailLot(idBranchTransferDetail: number = 0){
    return this._httpClient
    .get<MerchandiseBranchTransfersDetailLot[]>(`${environment.API_BASE_URL_OSM_MERCHANDISE_TRANSFERS}/MerchandiseTransfers/GetBranchTransferDetailLot/` + idBranchTransferDetail);
  }

  getLotList(filters: LotFilter = new LotFilter()) {
    return this._httpClient
      .get<Lot[]>(`${environment.API_BASE_URL_OSM_MERCHANDISE_TRANSFERS}/MerchandiseTransfers/GetLots/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters, false)
      });
  }

  getImage(product: Product){
    return this._httpClient
      .get<string>(`${environment.API_BASE_URL_OSM_MERCHANDISE_TRANSFERS}/MerchandiseTransfers/GetImage/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(product, false)
      });
  }

  receiveMerchandiseBranchTransfer(branchTransfer: MerchandiseBranchTransfers, idDestinationArea: number){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<DatabaseResult>(`${environment.API_BASE_URL_OSM_MERCHANDISE_TRANSFERS}/MerchandiseTransfers/ReceiveBranchTransfer/` + idDestinationArea + `/` + id, branchTransfer);
  }

  finishMerchandiseBranchTransfer(branchTransfer: MerchandiseBranchTransfers){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<DatabaseResult>(`${environment.API_BASE_URL_OSM_MERCHANDISE_TRANSFERS}/MerchandiseTransfers/FinishBranchTransfer/` + id, branchTransfer);
  }

  receivePallette(idBranchTransfer: number, idBranchTransferPalette: number){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<boolean>(`${environment.API_BASE_URL_OSM_MERCHANDISE_TRANSFERS}/MerchandiseTransfers/ReceivePallette/` + idBranchTransfer+ `/` + idBranchTransferPalette + `/` + id, null);
  }

  returnPallette(reasonReturnPallette: ReasonReturnPallette){
    const { id } = this._Authservice.storeUser;
    return this._httpClient
      .post<DatabaseResult>(`${environment.API_BASE_URL_OSM_MERCHANDISE_TRANSFERS}/MerchandiseTransfers/ReturnPallette/` + id, reasonReturnPallette);
  }
}
