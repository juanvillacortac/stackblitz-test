import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ProcessingRoom } from 'src/app/models/mrp/processing-room';
import { ProcessingRoomFilters } from 'src/app/models/mrp/processing-room-filters';
import { ProductionOrder } from 'src/app/models/mrp/production-order';
import { ProductionOrderStatus } from 'src/app/models/mrp/production-order-status';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { ProcessingRoomService } from '../../processing-room/shared/processing-room.service';
import { ProductionOrdersService } from '../shared/production-orders.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { DateHelperService } from 'src/app/modules/common/services/date-helper/date-helper.service';

@Component({
  selector: 'app-production-orders-list',
  templateUrl: './production-orders-list.component.html',
  styleUrls: ['./production-orders-list.component.scss']
})
export class ProductionOrdersListComponent implements OnInit {
  showDialog = false;
  loadingRooms = false;
  cols: any[];
  permissionsIDs = {...Permissions};

  productionOrders: ProductionOrder[] = [];
  selectedOrder: ProductionOrder;

  processingRooms: ProcessingRoom [] = [];
  selectedRoom: ProcessingRoom;

  constructor(
    public userPermissions: UserPermissions,
    private readonly dateHelper: DateHelperService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly service: ProductionOrdersService,
    private readonly roomService: ProcessingRoomService,
    private readonly dialogService: DialogsService,
    private readonly loadingSerivce: LoadingService,
    private readonly breadcrumbService: BreadcrumbService
  ) {
    this.breadcrumbService.setItems([
      { label: 'MRP' },
      { label: 'Producción' },
      { label: 'Órdenes de producción', routerLink: ['/mrp/production-orders'] }
    ]);
  }

  ngOnInit() {
    this.setupColumns();
    this.loadRooms();
    this.loadOrderIfReceivedByRoute();
  }

  processingRoomSelected(_event) {
    this.refresh();
  }

  refresh() {
    this.loadProductionOrders();
  }

  getValidDate(date: Date) {
    const defaultDate: Date = new Date(1900, 1, 1);
    const gmtDate = this.dateHelper.utcToGMT(new Date(date));
    return moment(date).isAfter(moment(defaultDate)) ? gmtDate : '';
  }

  orderDetail(order: ProductionOrder) {
    this.selectedOrder = order;
    this.showDialog = true;
  }

  isDateCell(cell: string) {
    return ['startDate', 'endDate', 'estimatedStartDate', 'deliveryDate'].includes(cell);
  }

  productionOrdersStatus(orderStatus: number) {
    switch (orderStatus) {
        case ProductionOrderStatus.PENDING: return 'pending';
        case ProductionOrderStatus.STARTED: return 'started';
        case ProductionOrderStatus.FINISHED: return 'finished';
        case ProductionOrderStatus.DELIVERED: return 'delivered';
        case ProductionOrderStatus.CANCELLED: return 'cancelled';
    }
  }

  getLocalDate(date) {
    
  }

  private loadOrderIfReceivedByRoute() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.idOrder > 0) { this.loadProductionOrder(params.idOrder); }
    });
  }

  private loadRooms() {
    this.loadingRooms = true;
    this.roomService.getProcessingRoom(new ProcessingRoomFilters())
      .then((processingRooms) => this.processingRoomsLoaded(processingRooms))
      .catch(error => this.handleError(error));
  }

  private loadProductionOrder(idOrder) {
    this.loadingSerivce.startLoading('wait_loading');
    this.service.loadProductionOrder(idOrder)
      .then((productionOrder) => this.selectedOrder = productionOrder)
      .then(_ => this.loadingSerivce.stopLoading())
      .then(_ => this.showDialog = true)
      .catch(error => this.handleError(error));
  }

  private loadProductionOrders() {
    this.loadingSerivce.startLoading('wait_loading');
    this.service.loadProductionOrdersByRoom(this.selectedRoom.id)
      .then((productionOrders) => this.productionOrdersLoaded(productionOrders))
      .catch(error => this.handleError(error));
  }

  private processingRoomsLoaded(processingRooms: ProcessingRoom[]) {
    this.loadingRooms = false;
    this.processingRooms = processingRooms;
    if (processingRooms.length > 0) {
      this.service.loadedProcessingRooms = processingRooms;
      this.selectedRoom = processingRooms[0];
      this.refresh();
    }
  }

  private productionOrdersLoaded(productionOrders: ProductionOrder[]) {
    this.loadingSerivce.stopLoading();
    this.productionOrders = productionOrders.sort((x, y) => x.status - y.status);
  }

  private handleError(error: HttpErrorResponse) {
    this.loadingRooms = false;
    this.loadingSerivce.stopLoading();
    this.dialogService.errorMessage('mrp.production_order.production_orders', error?.error?.message ?? 'error_service');
  }

  private setupColumns() {
    this.cols = [
      { field: 'id', display: 'table-cell', header: 'ID' },
      { field: 'name', display: 'table-cell', header: 'description' },
      { field: 'quantity', display: 'table-cell', header: 'amount' },
      { field: 'estimatedStartDate', display: 'table-cell', header: 'mrp.production_order.estimated_start' },
      { field: 'deliveryDate', display: 'table-cell', header: 'mrp.production_order.program_delivery_date' },
      { field: 'startDate', display: 'table-cell', header: 'mrp.production_order.real_start' },
      { field: 'endDate', display: 'table-cell', header: 'mrp.production_order.real_end' },
      { field: 'status', display: 'table-cell', header: 'status' },
      { field: 'detail', display: 'table-cell', header: '' }
    ];
  }
}
