import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { EqualityResult } from 'src/app/models/mrp/equality-result.enum';
import { ProcessingRoom } from 'src/app/models/mrp/processing-room';
import { ProductionOrder } from 'src/app/models/mrp/production-order';
import { OrderDetail } from 'src/app/models/mrp/production-order-detail';
import { ProductionOrderStatus } from 'src/app/models/mrp/production-order-status';
import { StatusView } from 'src/app/models/mrp/status-view';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductionOrdersService {

  private apiUrl = `${environment.API_BASE_URL_PRODUCTION_ORDER}/ProductionOrders`;
  private statusViews: StatusView[] = [];

  loadedProcessingRooms: ProcessingRoom[] = [];

  constructor(
    private httpClient: HttpClient,
    private httpHelpersService: HttpHelpersService
  ) {
    this.setupStatusView();
  }

  async loadProductionOrdersByRoom(idRoom: number) {
    const queryParams = { idRoom: idRoom };
    return this.httpClient.get<ProductionOrder[]>(this.apiUrl, this.convertToParams(queryParams)).toPromise();
  }

  async loadProductionOrder(idOrder: number) {
    const requestUrl = `${this.apiUrl}/${idOrder}`;
    return this.httpClient.get<ProductionOrder>(requestUrl).toPromise();
  }

  async startProductionOrder(idOrder: number, idRoom: number, ingredients: OrderDetail[]) {
    const requestUrl = `${this.apiUrl}/Start`;
    const body = { idOrder: idOrder, idRoom: idRoom, ingredientItems: ingredients };
    return this.httpClient.post<boolean>(requestUrl, body).toPromise();
  }

  async finishProductionOrder(idOrder: number, producedQty: number) {
    const requestUrl = `${this.apiUrl}/Finish`;
    const body = { idOrder: idOrder, producedQty: producedQty };
    return this.httpClient.post<boolean>(requestUrl, body).toPromise();
  }

  async cancelProductionOrder(idOrder: number, reason: string) {
    const requestUrl = `${this.apiUrl}/Cancel`;
    const body = { idOrder: idOrder, reason: reason };
    return this.httpClient.post<boolean>(requestUrl, body).toPromise();
  }

  getStatusView(status: string, actualStatus: ProductionOrderStatus): StatusView {
    const orderStatus: number = ProductionOrderStatus[status];
    const statusValue = this.getStatusValueOf(orderStatus, actualStatus);
    return this.findStatusValueByResult(statusValue);
  }

  findStatusValueByResult(result: EqualityResult) {
    return this.statusViews.find(value => value.statusResult === result );
  }

  private getStatusValueOf(status: number, actualStatus: ProductionOrderStatus): EqualityResult {
    if (actualStatus.valueOf() > status) { return EqualityResult.MAYOR; }
    if (actualStatus.valueOf() === status) { return EqualityResult.EQUAL; }
    return EqualityResult.MINOR;
  }

  private setupStatusView() {
    this.statusViews.push({
      statusResult: EqualityResult.MAYOR,
      color: '#28aa33',
      icon: PrimeIcons.CHECK
     });
     this.statusViews.push({
      statusResult: EqualityResult.EQUAL,
      color: '#076abb',
      icon: PrimeIcons.ELLIPSIS_H
     });
     this.statusViews.push({
      statusResult: EqualityResult.MINOR,
      color: '#9f9f9f',
      icon: PrimeIcons.MINUS
     });
  }

  private convertToParams(object) { return { params: this.httpHelpersService.getHttpParamsFromPlainObject(object) }; }
}

