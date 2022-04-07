import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CuttingOrder } from 'src/app/models/mrp/cutting-order';
import { ProcessingRoom } from 'src/app/models/mrp/processing-room';
import { ProcessingRoomFilters } from 'src/app/models/mrp/processing-room-filters';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { ProcessingRoomService } from '../../processing-room/shared/processing-room.service';
import { CuttingRequirementService } from '../shared/cutting-requirement.service';
import * as Permissions from '../../../security/users/shared/user-const-permissions';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { CuttingDetail } from 'src/app/models/mrp/cutting-detail';
import { ProductionOrderStatus } from 'src/app/models/mrp/production-order-status';
import * as AllowedPercentagesProgressBar from '../shared/allowed-values-const';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cutting-work-orders',
  templateUrl: './cutting-work-orders.component.html',
  styleUrls: ['./cutting-work-orders.component.scss']
})
export class CuttingWorkOrdersComponent implements OnInit {

  rooms: ProcessingRoom[] = [];
  displayAddWeight = false;
  expandedRows = {};
  isExpanded = false;
  addedWeight: number;
  groupedRooms = [];
  selectedItem: number;
  orders: CuttingOrder[] = [];
  cuttingOrder = new CuttingOrder();
  cutting = new CuttingDetail();
  permissionsIDs = {...Permissions};
  align = 'center';

  allowedPercentagesProgressBarIDs = {...AllowedPercentagesProgressBar};
  displayedColumns = [];

  constructor(private readonly cuttingRequirementService: CuttingRequirementService,
    private readonly processingRoomService: ProcessingRoomService, 
    public userPermissions: UserPermissions,
    private readonly translateService: TranslateService,
    private readonly dialogService: DialogsService, 
    private readonly loadingService: LoadingService, 
    private breadcrumbService: BreadcrumbService) { }

  ngOnInit(): void {
    this.getRooms();
    this.setCollumns();
    this.setBreadcrumb();
  }

  getOrders() {
    if (this.selectedItem && this.selectedItem > 0) {
      this.loadingService.startLoading();
      this.cuttingRequirementService.getCuttingOrdersByanimalTypeId(Number(this.selectedItem))
      .then(data => this.getOrdersSucceded(data))
      .catch(error => this.loadingHandleError(error));
    }
  }

  getRooms() {
    this.processingRoomService.getProcessingRoom(new ProcessingRoomFilters())
    .then((data: ProcessingRoom[]) => {
      if (data && data.length > 0) {
        this.getRoomsSucceded(data);
      }
    })
    .catch(error => this.handleError(error));
  }

  getRoomsSucceded(data: ProcessingRoom[]) {
    this.getgroupedRooms(data.filter(x => x.isDerived));
    if (this.rooms?.length > 0) {
      this.selectedItem = this.rooms[0].idAnimalType;
    }
  }

  editDetail(item: CuttingOrder, detail: CuttingDetail) {
    this.displayAddWeight = true;
    this.cutting = detail;
    this.cuttingOrder = item;
  }

  addWeight() {
    if (this.cuttingOrder && this.cutting) {
      if (this.isValidAddedWeight()) {
        this.loadingService.startLoading('wait_saving');
        const orderToSave = this.getValuesForOrder();
        this.cuttingRequirementService.saveCuttingOrder(orderToSave)
        .then(() => this.saveCuttingOrderSucceded())
        .catch(error => this.loadingHandleError(error));
      }
    }
  }

  saveCuttingOrderSucceded() {
    this.loadingService.stopLoading();
    this.setValuesForCuttingDetail();
    this.setValuesForCuttingOrderUpated();
    this.displayAddWeight = false;
  }

  finishCuttingOrder(cuttingOrder: CuttingOrder) {
    cuttingOrder.status = ProductionOrderStatus.FINISHED;
    this.loadingService.startLoading('wait_saving');
    this.cuttingRequirementService.saveCuttingOrder(cuttingOrder)
    .then(() => this.finishedCuttingOrderSucceded())
    .catch(error => this.loadingHandleError(error));
  }

  finishedCuttingOrderSucceded() {
    this.loadingService.stopLoading();
    this.getOrders();
    this.dialogService.successMessage('mrp.cutting_order.cutting_order', 'saved');
  }

  setValuesForCuttingDetail() {
    const detail =  this.cuttingOrder.cuttings.find(x => x.id === this.cutting.id);
    detail.realWeight = this.cutting.realWeight + this.addedWeight;
    detail.performance = this.getPerformanceOfCuttingDetailAdded(detail.realWeight);
  }

  setValuesForCuttingOrderUpated() {
    const order = this.orders.find(x => x.id = this.cuttingOrder.id);

    order.performance = Math.round(this.getTotalPerformanceUpdated() * 100) / 100;
    order.status = ProductionOrderStatus.STARTED;
  }

  getPerformanceOfCuttingDetailAdded(realWeightDetail: number) {
    return (realWeightDetail / this.cuttingOrder.realWeight) * 100;
  }

  getCuttingOrderStatus(status) {
    switch (status) {
      case ProductionOrderStatus.PENDING: return 'pending';
      case ProductionOrderStatus.STARTED: return 'started';
      case ProductionOrderStatus.FINISHED: return 'finished';
    }
  }

  getTotalPerformanceUpdated() {
    return this.cuttingOrder ? this.cuttingOrder.cuttings?.reduce((t, { performance }) => t + performance, 0) : 0;
  }

  getValuesForOrder() {
    const order = JSON.parse(JSON.stringify(this.cuttingOrder)) as CuttingOrder;
    const cutting = JSON.parse(JSON.stringify(this.cutting)) as CuttingDetail;

    cutting.realWeight = cutting.realWeight + this.addedWeight;
    order.cuttings.find(x => x.id === cutting.id).realWeight = cutting.realWeight;

    const realWeightAdded = order.cuttings.reduce((t, { realWeight }) => t + realWeight, 0);
    const calculatedPerformance = (realWeightAdded * 100) / order.realWeight;
    order.performance = Math.round(calculatedPerformance * 100) / 100;
    order.status = ProductionOrderStatus.STARTED;
    return order;
  }

  itemExpanded(item: CuttingOrder, expanded) {
    this.isExpanded = expanded;
    if (!expanded) {
      if (item.cuttings?.length === 0) {
        this.loadingService.startLoading();
        this.getCuttings(item);
      }
    }
  }

  getCuttings(item: CuttingOrder) {
    this.cuttingRequirementService.getCuttingDetails(item.id, item.rawMaterialId)
    .then(data => this.getCuttingSucceded(item, data))
    .catch(error => this.handleError(error));
  }

  getCuttingSucceded(item: CuttingOrder, data) {
    this.loadingService.stopLoading();
    item.cuttings.length = 0;
    item.cuttings = [...data];
  }
  setCollumns() {
    this.displayedColumns = [
      { header: 'mrp.cutting_order.fields.id', display: 'table-cell', field: 'orderNumber' },
      { header: 'mrp.cutting_order.fields.name', display: 'table-cell', field: 'name'},
      { header: 'mrp.cutting_order.fields.tb_real_weight', display: 'table-cell', field: 'realWeight' },
      { header: 'status', display: 'table-cell', field: 'status' }
    ];
  }
  getTotalRawMaterial(cuttingOrder) {
    return cuttingOrder?.cuttings && cuttingOrder?.cuttings.length !== 0 ?
    cuttingOrder?.cuttings?.reduce((t, { realWeight }) => t + realWeight, 0) : cuttingOrder.realWeight;
  }

  isValidAddedWeight() {
    const totalWeightAdded = this.getTotalRawMaterial(this.cuttingOrder);
    const isValid = this.cuttingOrder.realWeight > (totalWeightAdded + this.addedWeight);


    if (!isValid) {
      this.dialogService.errorMessage('error', 'mrp.cutting_order.validations.weight_exceded');
    }

    return isValid;
  }

  getPerformanceProgress(detail: CuttingDetail, order: CuttingOrder) {
    const performance = (detail.realWeight / order.realWeight) * 100;
    return Math.round(performance * 100) / 100;
  }

  getPerformanceProgressColor(detail: CuttingDetail, order: CuttingOrder) {
    const actualPerformance = this.getPerformanceProgress(detail, order);
    const calculated = (actualPerformance / detail.expectedPerformance) * 100;
    return Math.round(calculated * 100) / 100;
  }

  onRoomChanged() {
    this.getOrders();
    this.collapseAll();
  }

  onHideDisplayAddWeight() {
    this.addedWeight = undefined;
  }

  private setBreadcrumb() {
    this.breadcrumbService.setItems([
      { label: 'MRP' },
      { label: 'Producción' },
      { label: this.translateService.instant('mrp.cutting_order.cutting_order'), routerLink: ['/mrp/cutting-work-orders'] }
  ]);
  }

  private loadingHandleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.handleError(error);
  }

  private handleError(error: HttpErrorResponse) {
    this.dialogService.errorMessage('mrp.cutting_work_orders.cutting_work_orders', error?.message ?? 'error_service');
  }

  private collapseAll() {
    this.expandedRows = {};
    this.isExpanded = !this.isExpanded;
  }

  private getgroupedRooms(data: ProcessingRoom[]) {
    this.groupedRooms.length = 0;
    data.forEach(x => this.groupedRooms.push(this.getGroupedRoomItem(x)));
    this.groupedRooms = [...this.groupedRooms];
  }

  private getGroupedRoomItem(item: ProcessingRoom) {
    return {
      label: item.name, value: item.id,
      items: [
          { label: item.animalType, value: item.idAnimalType }
      ]
  };
  }

  private getOrdersSucceded(result: CuttingOrder[]) {
    this.loadingService.stopLoading();
    this.orders = result.filter(x => x.status !== ProductionOrderStatus.FINISHED);
  }

}
