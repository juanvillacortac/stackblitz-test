import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ProcessingRoom } from 'src/app/models/mrp/processing-room';
import { ProcessingRoomFilters } from 'src/app/models/mrp/processing-room-filters';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { ProcessingRoomService } from '../../processing-room/shared/processing-room.service';
import { CuttingRequirementService } from '../shared/cutting-requirement.service';
import * as Permissions from '../../../security/users/shared/user-const-permissions';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { ProductionOrderStatus } from 'src/app/models/mrp/production-order-status';
import { CuttingOrder } from 'src/app/models/mrp/cutting-order';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cutting-orders-list',
  templateUrl: './cutting-orders-list.component.html',
  styleUrls: ['./cutting-orders-list.component.scss']
})
export class CuttingOrdersListComponent implements OnInit {

  rooms: ProcessingRoom[] = [];
  selectedItem: any;
  selectedRoom: ProcessingRoom;
  groupedRooms = [];
  cuttingOrder = new CuttingOrder();
  showDialog = false;

  permissions: number[] = [];
  permissionsIDs = {...Permissions};

  orders: CuttingOrder[] = [];

  displayedColumns = [];

  constructor(private readonly cuttingRequirementService: CuttingRequirementService,
    private readonly processingRoomService: ProcessingRoomService, 
    private readonly translateService: TranslateService,
    private readonly dialogService: DialogsService, private readonly loadingService: LoadingService,
    private breadcrumbService: BreadcrumbService, public userPermissions: UserPermissions) {
      this.setCollumns();
      this.setBreadcrumb();
    }

  ngOnInit(): void {
    this.getRooms();
  }

  setCollumns() {
    this.displayedColumns = [
      { header: 'mrp.cutting_order.fields.id', display: 'table-cell', field: 'orderNumber' },
      { header: 'mrp.cutting_order.fields.name', display: 'table-cell', field: 'name'},
      { header: 'mrp.cutting_order.fields.tb_inventory', display: 'table-cell', field: 'inventory', type: 'decimal' },
      { header: 'mrp.cutting_order.fields.tb_expected_performance', display: 'table-cell', field: 'expectedPerformance', type: 'decimal'  }
    ];
  }

  setBreadcrumb() {
    this.breadcrumbService.setItems([
      { label: 'MRP' },
      { label: 'Producción' },
      { label: this.translateService.instant('mrp.derivatives.derivatives'), routerLink: ['/mrp/cutting_orders'] }
  ]);
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
    this.rooms = data;
  }

  private getAnymalTypeIdSinceSelectedItem(item: string) {
    const itemArray = item.split('-');
    return itemArray[1];
  }

  private getRoomIdSinceSelectedItem(item: string) {
    const itemArray = item.split('-');
    return itemArray[0];
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
          { label: item.animalType, value: item.id + '-' + item.idAnimalType }
      ],
      id: item.idAnimalType
  };
  }

  openNew() {
    if (!this.selectedItem) {
      this.dialogService.errorMessage('mrp.cutting_order.cutting_order', 'mrp.cutting_order.room_unselected');
    } else {
      this.setCuttingOrderProperties();
      this.showDialog = true;
    }
  }

  editDetail(item: CuttingOrder) {
    if (!this.selectedItem) {
      this.dialogService.errorMessage('mrp.cutting_order.cutting_order', 'mrp.cutting_order.room_unselected');
    } else {
      this.showDialog = true;
      this.cuttingOrder =  JSON.parse(JSON.stringify(item));
    }
  }

  setCuttingOrderProperties() {
    this.cuttingOrder = new CuttingOrder();
    this.cuttingOrder.cuttings = [];
    this.cuttingOrder.id = -1;
    this.cuttingOrder.name = '';
  }

  getOrders() {
    if (this.selectedItem) {
      const animalTypeId = this.getAnymalTypeIdSinceSelectedItem(this.selectedItem);
      this.cuttingRequirementService.getCuttingOrdersByanimalTypeId(Number(animalTypeId))
      .then(data => this.getOrdersSucceded(data))
      .catch(error => this.getOrdersHandleError(error));
    }
  }

  getOrdersSucceded(result: CuttingOrder[]) {
    this.loadingService.stopLoading();
    this.orders = result.filter(x => x.status !== ProductionOrderStatus.FINISHED);
  }

  getOrdersHandleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.handleError(error);
  }

  onRoomChanged() {
    this.getOrders();
    this.getProcessingRoom();
  }

  getProcessingRoom() {
    const roomId = this.getRoomIdSinceSelectedItem(this.selectedItem);
    this.selectedRoom = this.rooms.find(x => x.id === Number(roomId));

  }


  private handleError(error: HttpErrorResponse) {
    this.dialogService.errorMessage('error', error?.message ?? 'error_service');
  }

  onHideDialog(result) {
    this.showDialog = false;
    if (result) {
      this.getOrders();
    }
  }
}
