import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DocumentType } from 'src/app/models/srm/common/document-type';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { OperationMastersService } from 'src/app/modules/masters/operation-master/shared/operationmasters.service';
import { CommonsrmService } from '../../../services/common/commonsrm.service';
import { PurchaselistViewmodel } from '../../../view-models/purchaselist-viewmodel';
import { HttpErrorResponse } from '@angular/common/http';
import { DocumentTypeFilter } from '../../../filters/common/document-type-filter';
import { OperatorModal } from '../../../view-models/common/operatormodal';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { MerchandiseReceptionService } from '../../../services/merchandise-reception/merchandise-reception.service';
import { SimpleReception } from 'src/app/models/srm/simple-reception';
import { PurchaseOrderModal } from 'src/app/models/srm/purchase-order-modal';
import { OperationdocumentFilters } from 'src/app/models/common/operationdocument-filters';
import { Operationdocument } from 'src/app/models/masters/operationdocument';
import { AreaFilter } from 'src/app/modules/masters/area/shared/filters/area-filter';
import { AreaService } from 'src/app/modules/masters/area/shared/services/area.service';
import { Area } from 'src/app/models/masters/area';
import { TypesReceptionFilter } from '../../../filters/common/types-reception-filter';
import { TypesReception } from 'src/app/models/srm/common/types-reception';
import { DateHelperService } from 'src/app/modules/common/services/date-helper/date-helper.service';
import { StatusPurchase } from '../../../Utils/status-purchase';
import { ReceptionStatus } from 'src/app/models/srm/reception';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import * as moment from 'moment';

@Component({
  selector: 'app-modal-reception',
  templateUrl: './modal-reception.component.html',
  styleUrls: ['./modal-reception.component.scss']
})
export class ModalReceptionComponent implements OnInit {
  @Input() visible = false;
  @Input() purchaseOrder = new PurchaselistViewmodel;
  @Input() receptionStatus = ReceptionStatus.pending;
  @Output() hideDialogForm = new EventEmitter<number>();
  purchaseOrderModalShow = false;
  width:string="100%"

  validations: Validations = new Validations();
  documentRelatedTypes: SelectItem<DocumentType[]> = {value: null};
  receptionType: SelectItem<Operationdocument[]> = {value: null};
  rceptionType2: SelectItem<TypesReception[]> = {value: null};
  areaList: SelectItem<Area[]> = {value: null};
  invoiceNumber: string;
  externalDocumentNumberRelated: string;
  documentTypeSelected: number;
  receptionTypeSelected: number = 2;
  supplierString = '';
  purchaseOrderNumber = '';
  observation = '';
  selectedSuppliers: any[] = [];
  supplierId = -1;
  supplierDialogVisible = false;
  startDateFilter: Date = new Date();
  maxDate: Date = new Date();
  operatorDialogVisible = false;
  operatorAuthDialogVisible = false;
  operator: OperatorModal = new OperatorModal();
  operatorAuthmodal: OperatorModal = new OperatorModal();
  purchaseOrderSelected = new PurchaseOrderModal;
  receptionIsFromOd = false;
  isPurchaseOrderSelected = false;
  submitted = false;
  receptionAreaSelected: number;
  userType:number=1;
  orderStatus = [StatusPurchase.Authorized];

  constructor(
    private _areaService: AreaService,
    public datepipe: DatePipe,
    private readonly loadingService: LoadingService,
    private dialogService: DialogsService,
    private _commonSRMService: CommonsrmService,
    private _operationMastersService: OperationMastersService,
    private _authService: AuthService,
    private _merchandiseReceptionService: MerchandiseReceptionService,
    private readonly dateHelper: DateHelperService,
    public userPermissions: UserPermissions) { }

  ngOnInit(): void {

  }
  onShow() {
    this.loadSaveMode();
    this.loadReceptionTypes();
    this.loadReceptionTypes2();
    this.loadDocumentRelatedTypes();
    this.loadCurrentOperator();
    this.loadAreasList();
  }

  loadSaveMode() {
   if ( this.purchaseOrder?.idOrderPurchase !== -1) {
     this.loadFieldsFromPurchaseOrder();
   }
  }

  loadFieldsFromPurchaseOrder() {
    this.receptionIsFromOd = true;
    this.isPurchaseOrderSelected = true;
    this.supplierString = this.purchaseOrder.supReasonCommercial;
    this.supplierId = this.purchaseOrder.supplierId;
    this.purchaseOrderNumber = this.purchaseOrder.numOC;
    this.completePurchaseOrderModel();
  }

  loadCurrentOperator() {
    const operator = new OperatorModal();
          operator.idOpetator = this._authService.idUser;
          operator.namesoperators = this._authService.entityName;
     this.operator = operator;
   }

  onHidePurchaseOrderModal(visible: boolean) {
    this.purchaseOrderModalShow = visible;
  }
  onSubmitPurchaseOrderModal(data) {
    this.purchaseOrderSelected = data ?? new PurchaseOrderModal;
    this.purchaseOrderNumber = data?.numOC ?? '';
    this.supplierId = Number(data?.idSupplier) ?? -1;
    this.supplierString = data?.supplier ?? '';
  }

  onToggleSupplier(visible: boolean) {
    this.supplierDialogVisible = visible;
  }
  onSave() {
      this.submitted = true;
      this.loadingService.startLoading('wait_saving');
      if (this.invalidFields()) {this.loadingService.stopLoading(); return; }
      this.saveReception();
  }

  getSuppliersId(suppliersSelected: any) {
    this.supplierString = '';
    this.selectedSuppliers.push(suppliersSelected);
    this.supplierString  = suppliersSelected ? suppliersSelected?.socialReason : '';
    this.supplierId =  this.selectedSuppliers[0]?.id ?? -1;
  }

  onToggleOperator(visible: boolean, operatorAuthDialogVisible) {
    this.operatorDialogVisible = !operatorAuthDialogVisible ? visible : false;
    this.operatorAuthDialogVisible = operatorAuthDialogVisible ? visible : false;
  }

  onSubmitOperator(data) {
    if (this.operatorAuthDialogVisible) {
        this.operatorAuthmodal.idOpetator = data.operator.id;
        this.operatorAuthmodal.namesoperators = data.operator.name;
    } else {
      this.operator.idOpetator = data.operator.id;
      this.operator.namesoperators = data.operator.name;
    }
  }

  onChangeDocumentType() {
    this.purchaseOrderSelected = null;
    this.purchaseOrderNumber = '';
    this.selectedSuppliers = [];
    this.supplierString = '';
    this.supplierId = -1;
    this.verifyDocumentTypeSelection();
  }

  onEmitHideForm(idResult: number): void {
    this.visible = false;
    this.clearFields();
    this.hideDialogForm.emit(idResult);
  }

  clearFields() {
    this.invoiceNumber = '';
    this.externalDocumentNumberRelated = '';
    this.selectedSuppliers = [];
    this.supplierString = '';
    this.supplierId = -1;
    this.purchaseOrderNumber = '';
    this.startDateFilter = new Date;
    this.operator = new OperatorModal();
    this.operatorAuthmodal = new OperatorModal();
    this.documentTypeSelected = -1;
    this.receptionTypeSelected = -1;
    this.receptionAreaSelected = -1;
    this.observation = '';
    this.purchaseOrderSelected = null;
    this.submitted = false;
  }

  private loadAreasList() {
    this.loadingService.startLoading();
    const filter: AreaFilter = new AreaFilter();
          filter.idAreaType = 3; // Reception
          filter.idBranchOffice = this._authService.currentOffice;
    this._areaService
        .getareaListPromise(filter)
        .then(data => {this.areaList.value = data.sort((a, b) => a.name.localeCompare(b.name)); })
        .then(() => this.loadingService.stopLoading())
        .catch(error => this.handleError(error));
  }
  private loadDocumentRelatedTypes() {
    this.loadingService.startLoading();
    const filter = new DocumentTypeFilter();
          filter.id = 3;
          filter.active = 1;
    this._commonSRMService.getDocumentTypes({...filter})
        .then(data => { this.completeDocumentType(data); })
        .then(() => this.loadingService.stopLoading())
        .catch(error => this.handleError(error));
  }
  private loadReceptionTypes() {
    this.loadingService.startLoading();
    const filter = new OperationdocumentFilters();
          filter.id = -1;
          filter.idTypeDocumentOperation = 3;
          filter.active=1
    this._operationMastersService.getDocumentsOperations({...filter}).toPromise()
          .then(data => this.receptionType.value = data)
          .then(() => this.loadingService.stopLoading())
          .catch(error => this.handleError(error));
  }

  private loadReceptionTypes2() {
    const filter = new OperationdocumentFilters();
    filter.id = -1;
    filter.idTypeDocumentOperation = 3; // VDR documents
    filter.active=1
    this._operationMastersService.getDocumentsOperations({...filter}).toPromise()
    .then(data => this.loadDocumentTypesSuccesed(data))
    .catch(error => this.handleError(error));
  }

  private loadDocumentTypesSuccesed(data) {
    this.rceptionType2.value = data;
  }

  private saveReception() {
    const model =  this.completeReceptionModel();
    this._merchandiseReceptionService
        .createSimpleReception(model)
        .then(result => this.successCreatingReception(result))
        .catch(error => this.handleError(error));
  }

  private invalidFields() {
    return !this.validateReceptionType
        || !this.validateSupplierId
        || !this.validateReceivingOperatorId
        || !this.validateValidatorOperatorId
        || !this.validatePurchaseOrderId
        || !this.validateDocumentType
        || !this.validateArea;
  }

  private completeReceptionModel() {
   const reception = new SimpleReception();
         reception.branchOfficeId = this._authService.currentOffice;
         reception.documentTypeId = this.documentTypeSelected;
         reception.documentId = this.purchaseOrderSelected?.idOrderPurchase ?? -1;
         reception.estatusId = Number(this.receptionStatus);
         reception.invoiceNumber = this.invoiceNumber ?? '';
         reception.externalDocument = this.externalDocumentNumberRelated ?? '';
         reception.receivingOperatorId = this.operator.idOpetator ?? -1;
         reception.validatorOperatorId = this.operatorAuthmodal.idOpetator ?? -1;
         reception.receptionTypeId = 2;//parent reception
         reception.startTime = this.getDateTime();
         reception.arrivalTime = this.dateHelper.utcToGMT(moment(this.startDateFilter).toDate());
         reception.supplierId = this.supplierId;
         reception.observation = this.observation;
         reception.areaId = this.receptionAreaSelected;
         reception.operationDocumentTypeId = this.receptionTypeSelected;

        return reception;
  }
 
  private completePurchaseOrderModel() {
    const model = new PurchaseOrderModal();
          model.idOrderPurchase = this.purchaseOrder.idOrderPurchase;
          model.numOC = this.purchaseOrder.numOC;
          model.supplier = this.purchaseOrder.supReasonCommercial;
          model.idSupplier = this.purchaseOrder.supplierId;
     this.purchaseOrderSelected = model;
  }
  private handleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.dialogService.errorMessage('srm.reception.reception', error?.error?.message ?? 'error_service');
  }

  private successCreatingReception(result: number) {
    this.onEmitHideForm(result)
    this.loadingService.stopLoading();
    this.dialogService.successMessage('srm.reception.reception', 'saved');
  }

  private completeDocumentType(data: DocumentType[]) {
    let def=new DocumentType()
    def.id=3;
    def.name='Recepcion-validacion-compra'
    def.documentTypeRelatedId=0
    def.documentTypeRelated='Sin documento'
    data.push(def);
    this.documentRelatedTypes.value = data;
    if (this.receptionIsFromOd) {
      this.documentTypeSelected = this.getPurchaseOrderTypeId();
    }
  }

  private getPurchaseOrderTypeId() {
    return this.documentRelatedTypes?.value?.
                                  find(p => p.documentTypeRelated.toLowerCase() === 'orden de compra').documentTypeRelatedId ?? 2;
  }

  private verifyDocumentTypeSelection() {
    return this.isPurchaseOrderSelected = (this.documentTypeSelected === this.getPurchaseOrderTypeId());
  }

  private extractStringArray(value: string[]) {
    let data = '';
    value?.forEach((item, i) => {
      data += item +  ( i < (value.length - 1) ? ',' : '');
    });
    return data;
  }

  private getDateTime(): Date {
    return this.receptionToStart ? this.startDateFilter : new Date('1900-01-01');
  }

  get validateInvoiceNumberLenght() {
    return this.invoiceNumber?.length > 0 ?? false;
  }
  get validateExternalDocumentNumberLenght() {
    return this.externalDocumentNumberRelated?.length > 0 ?? false;
  }
  get validatePurchaseOrderId() {
    if (this.verifyDocumentTypeSelection()) {
      return this.purchaseOrderSelected?.idOrderPurchase > -1;
    }
    return true;
  }
  get validateReceivingOperatorId() {
    return this.operator?.idOpetator > -1 ?? false;
  }
  get validateValidatorOperatorId() {
    return (this.receptionStatus === ReceptionStatus.started && this.operatorAuthmodal?.idOpetator > -1)
            || this.receptionStatus === ReceptionStatus.pending;
  }
  get validateSupplierId() {
    return this.supplierId > -1 ?? false;
  }
  get validateReceptionType() {
    return this.receptionTypeSelected  > -1;
  }
  get validateDocumentType() {
    return this.documentTypeSelected  > -1;
  }
  get validateArea() {
    return this.receptionAreaSelected > -1 ?? false;
  }

  get receptionToStart() {
    return this.receptionStatus === ReceptionStatus.started;
  }
}
