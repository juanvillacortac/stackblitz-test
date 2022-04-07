import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConsingmentInvoice, ConsingmentInvoiceFilters, InvoiceUpdateStatus } from 'src/app/models/srm/consingmentinvoice/consingmentinvoices';
import { InvoiceTimeLine } from 'src/app/models/srm/consingmentinvoice/invoice-timeline';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { environment } from 'src/environments/environment';
import { ConsingmentInvoiceFilter } from '../../filters/consigment-invoice/consigmentinvoicefilter';
import { ConsingmentInvoiceList } from '../../filters/consigment-invoice/consigmentinvoicelis';

@Injectable({
  providedIn: 'root'
})
export class ConsigmentinvoiceService {

  public _list: ConsingmentInvoiceList[];
  constructor(private _httpClient: HttpClient, private _httpHelpersService: HttpHelpersService, private _AuthService: AuthService) { }
  _Authservice : AuthService = new AuthService(this._httpClient);

  getinvoicelist(filters: ConsingmentInvoiceFilter = new ConsingmentInvoiceFilter()){
    debugger
    return this._httpClient
      .get<ConsingmentInvoiceList[]>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/ConsignmentInvoice/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }
 createInvoice(invoice:ConsingmentInvoice ) {
    const { id } = this._AuthService.storeUser;
    return this._httpClient
        .post<number>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/ConsignmentInvoice/CreateInvoice/`+id, invoice)
  }
  getinvoice(filters: ConsingmentInvoiceFilters = new ConsingmentInvoiceFilters ()){
    return this._httpClient
      .get<ConsingmentInvoice>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/ConsignmentInvoice/GetInvoice/`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }
  getTimeline( filters:ConsingmentInvoiceFilters){
    return this._httpClient
      .get<InvoiceTimeLine[]>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/ConsignmentInvoice/GetTimeLine`, {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(filters)
      })
  }
  changeStatus(invoice: InvoiceUpdateStatus){
    const { id } = this._AuthService.storeUser;
    return this._httpClient
      .put<number>(`${environment.API_BASE_URL_SRM_MERCHANDISE_RECEPTION}/ConsignmentInvoice//UpdateStatus/${id}`, invoice)
  }
  
}
