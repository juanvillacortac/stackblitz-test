import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CuttingDetail } from 'src/app/models/mrp/cutting-detail';
import { CuttingOrder } from 'src/app/models/mrp/cutting-order';
import { CuttingType } from 'src/app/models/mrp/cutting-type';
import { ProcessingRoom } from 'src/app/models/mrp/processing-room';
import { RawMaterial } from 'src/app/models/mrp/raw-material';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { DerivateRoomService } from '../../derivates-room/shared/services/derivate-room.service';
import { CuttingRequirementService } from '../shared/cutting-requirement.service';
import { ProductionOrderStatus } from 'src/app/models/mrp/production-order-status';

@Component({
  selector: 'app-cutting-orders-detail',
  templateUrl: './cutting-orders-detail.component.html',
  styleUrls: ['./cutting-orders-detail.component.scss']
})
export class CuttingOrdersDetailComponent implements OnInit {

  @Input() showPanel = false;
  @Input() cuttingOrder = new CuttingOrder();
  @Input() processingRoom = new ProcessingRoom();

  @Output() hideDialogEvent = new EventEmitter<boolean>();

  rawMaterials: RawMaterial[] = [];
  selectedRawMaterial: RawMaterial;

  isEdit = false;
  submitted = false;

  displayedColumns = [
    { header: 'Id', display: 'none', field: 'id' },
    { header: 'name', display: 'table-cell', field: 'name' },
    { header: 'mrp.cutting_order.fields.tb_expected_performance', display: 'table-cell', field: 'expectedPerformance', type: 'decimal' },
    { header: 'mrp.cutting_order.fields.tb_real_weight', display: 'table-cell', field: 'realWeight', type: 'decimal'  }
  ];

  constructor(private readonly cuttingRequirementService: CuttingRequirementService,
    private readonly derivativeService: DerivateRoomService, private readonly dialogService: DialogsService,
    private readonly loadingService: LoadingService) { }

  ngOnInit(): void {
    if (this.cuttingOrder?.id > 0 && this.cuttingOrder?.rawMaterialId > 0) {
      this.isEdit = true;
    } else {
      this.isEdit = false;
    }

    this.getRawMaterials();
  }

  hideDialog() {
    this.showPanel = false;
    this.submitted = false;
    this.selectedRawMaterial = undefined;
    this.hideDialogEvent.emit(false);
  }

  getRawMaterials() {
    if (this.processingRoom?.id > 0) {
      this.derivativeService.getRawMaterials({ roomId: this.processingRoom.id, animalTypeId: this.processingRoom.idAnimalType, barcode: '', name: '' })
      .then((data: RawMaterial[]) => this.getRawMaterialsSucceded(data));
    }
  }

  getCuttingDetails() {
    if (this.selectedRawMaterial) {
      this.loadingService.startLoading();
      this.cuttingRequirementService.getCuttingDetails(this.cuttingOrder?.id, this.selectedRawMaterial?.id)
      .then(data => this.getCuttingDetailsSucceded(data))
      .catch(error => this.loadinghandleError(error));
    }
  }

  getCuttingDetailsSucceded(details: CuttingDetail[]) {
    this.loadingService.stopLoading();
    this.cuttingOrder.cuttings = details;
  }

  getRawMaterialsSucceded(data: RawMaterial[]) {
    this.rawMaterials = data;
    if (this.rawMaterials && this.rawMaterials.length > 0 && this.cuttingOrder?.id > 0)  {
      this.selectedRawMaterial = this.rawMaterials.find(x => x.id === this.cuttingOrder.rawMaterialId);
      this.getCuttingDetails();
    }
  }

  save() {
    this.submitted = true;
    const isValidForm = this.isValidForm();
    if (isValidForm) {
     this.loadingService.startLoading('wait_saving');
     this.setCuttingOrderProperties();
     this.cuttingRequirementService.saveCuttingOrder(this.cuttingOrder)
     .then(() => { this.saveSucceded(); })
     .catch(error => this.loadinghandleError(error));
    }
  }

  setCuttingOrderProperties() {
    this.cuttingOrder.rawMaterialId = this.selectedRawMaterial?.id;
    this.cuttingOrder.name = this.selectedRawMaterial?.name;
    this.cuttingOrder.productId = this.selectedRawMaterial?.productId;
    this.cuttingOrder.packageId = this.selectedRawMaterial?.packageId;
    this.cuttingOrder.status = ProductionOrderStatus.PENDING;
    this.cuttingOrder.startedDate = '1900-11-01T00:00:00';
    this.cuttingOrder.endDate = '1900-11-01T00:00:00';
    this.cuttingOrder.roomId = this.processingRoom?.id;
  }

  saveSucceded() {
    this.dialogService.successMessage('mrp.cutting_order.cutting_order', 'saved');
    this.showPanel = false;
    this.selectedRawMaterial = undefined;
    this.submitted = false;
    this.hideDialogEvent.emit(true);
  }

  validateForm(field = '') {
    if (this.submitted) {
      switch (field) {
        case 'quantity':
          return this.getResultErrorValues(this.validateQuantity(), 'mrp.cutting_order.validations.piece_quantity_required');
        case 'labeled_weight':
          return this.getResultErrorValues(this.validateLabeledWeight(), 'mrp.cutting_order.validations.labeled_weight_required');
        case 'real_weight':
          return this.getResultErrorValues(this.validateRealWeight(), 'mrp.cutting_order.validations.real_weight_required');
        default:
          return { isValid: true, error: '' };
      }
    }

    return { isValid: true, error: '' };
  }

  isValidForm() {
    return  this.submitted && this.selectedRawMaterial && this.validateQuantity()
    && this.validateLabeledWeight() && this.validateRealWeight();
  }

  getResultErrorValues(result, message) {
    return { isValid: result, error: message };
  }

  validateQuantity() {
    if (!this.cuttingOrder?.pieceQuantity || this.cuttingOrder.pieceQuantity <= 0) {
      return false;
    } else {
      return true;
    }
  }

  validateLabeledWeight() {
    if (!this.cuttingOrder?.labeledWeight || this.cuttingOrder?.labeledWeight <= 0) {
      return false;
    } else {
      return true;
    }
  }

  validateRealWeight() {
    if (!this.cuttingOrder?.realWeight || this.cuttingOrder?.realWeight <= 0) {
      return false;
    } else {
      return true;
    }
  }

  getTotalPerformance() {
    return this.cuttingOrder?.cuttings ? this.cuttingOrder.cuttings.reduce((t, { realWeight }) => t + realWeight, 0) : 0;
  }

  onRawMaterialChanged() {
    this.cuttingOrder.expectedPerformance = this.selectedRawMaterial?.performance;
    this.getCuttingDetails();
  }

  private loadinghandleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.handleError(error);
  }

  private handleError(error: HttpErrorResponse) {
    this.dialogService.errorMessage('mrp.cutting_order.cutting_order', error?.message ?? 'error_service');
  }

}
