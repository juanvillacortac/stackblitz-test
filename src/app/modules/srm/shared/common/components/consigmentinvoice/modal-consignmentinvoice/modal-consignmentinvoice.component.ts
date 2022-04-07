import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { OperationdocumentFilters } from 'src/app/models/common/operationdocument-filters';
import { Supplier } from 'src/app/models/masters/supplier';
import { TypesReception } from 'src/app/models/srm/common/types-reception';
import { ConsingmentInvoice } from 'src/app/models/srm/consingmentinvoice/consingmentinvoices';
import { InvoiceStatus } from 'src/app/models/srm/reception';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DateHelperService } from 'src/app/modules/common/services/date-helper/date-helper.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { OperationMastersService } from 'src/app/modules/masters/operation-master/shared/operationmasters.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { CommonsrmService } from '../../../../services/common/commonsrm.service';
import { ConsigmentinvoiceService } from '../../../../services/consignmnet-invoice/consigmentinvoice.service';
import { MerchandiseReceptionService } from '../../../../services/merchandise-reception/merchandise-reception.service';
import { OperatorModal } from '../../../../view-models/common/operatormodal';

@Component({
  selector: 'app-modal-consignmentinvoice',
  templateUrl: './modal-consignmentinvoice.component.html',
  styleUrls: ['./modal-consignmentinvoice.component.scss']
})
export class ModalConsignmentinvoiceComponent implements OnInit {


  @Input() visible = false;
  @Input() status = InvoiceStatus.pending;
  @Output() hideDialogForm = new EventEmitter<number>();
  purchaseOrderModalShow = false;
  width:string="100%"

  invoice: ConsingmentInvoice = new ConsingmentInvoice();
  validations: Validations = new Validations();
  fctype: SelectItem<TypesReception[]> = {value: null};
  invoiceNumber: string;
  externalDocumentNumberRelated: string;
  documentTypeSelected: number;
  fCTypeSelected: number ;
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
  receptionIsFromOd = false;
  typedocument=21//factura_consignacion

  submitted = false;
  userType:number=1;

  constructor(public datepipe: DatePipe,
    private readonly loadingService: LoadingService,
    private dialogService: DialogsService,
    private _operationMastersService: OperationMastersService,
    private _authService: AuthService,
    private _service: ConsigmentinvoiceService,
    private readonly dateHelper: DateHelperService,
    public userPermissions: UserPermissions) { }

  ngOnInit(): void {
  }
  onShow() {
    this.loadFCTypes()
    this.loadfcTypes2();
    this.loadCurrentOperator();
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
  
  onToggleSupplier(visible: boolean) {
    this.supplierDialogVisible = visible;
  }
  onSave() {
      this.submitted = true;
      this.loadingService.startLoading('wait_saving');
      if (this.invalidFields())
       {this.loadingService.stopLoading(); return; }
      this.save();
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
    this.selectedSuppliers = [];
    this.supplierString = '';
    this.supplierId = -1;
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
    this.fCTypeSelected = -1;
    this.observation = '';
    this.submitted = false;
  }
  private loadFCTypes() {
    this.loadingService.startLoading();
    const filter = new OperationdocumentFilters();
          filter.id = -1;
          filter.idTypeDocumentOperation = 21;
          filter.active=1
    this._operationMastersService.getDocumentsOperations({...filter}).toPromise()
          .then(data => this.fctype.value = data)
          .then(() => this.loadingService.stopLoading())
          .catch(error => this.handleError(error));
  }

  private loadfcTypes2() {
    const filter = new OperationdocumentFilters();
    filter.id = -1;
    filter.idTypeDocumentOperation = 21; // facturaconsignacion
    filter.active=1
    this._operationMastersService.getDocumentsOperations({...filter}).toPromise()
    .then(data => this.loadDocumentTypesSuccesed(data))
    .catch(error => this.handleError(error));
  }

  private loadDocumentTypesSuccesed(data) {
    this.fctype.value = data;
  }

  save() {
    const model =  this.completModel();
    debugger
    this._service
        .createInvoice(model).subscribe((data: number) => {
          if (data > 0) {
            this.onEmitHideForm(data)
            this.loadingService.stopLoading();
            this.dialogService.successMessage('srm.reception.reception', 'saved');
          } 
          else{
          this.loadingService.stopLoading();
          this.dialogService.errorMessage('error','Ha ocurrido un error al guardar los datos.');
        }
        }, (error: HttpErrorResponse) => {
          this.submitted = false;
          this.loadingService.stopLoading();
          this.dialogService.errorMessage('error','Ha ocurrido un error al guardar los datos.');
        });
  }

  private invalidFields() {
    return !this.validateFcType
        || !this.validateSupplierId
        || !this.validateReceivingOperatorId
        || !this.validateValidatorOperatorId
  }

  private completModel() {
    debugger
    let  consignmentinvoice = new ConsingmentInvoice();
         consignmentinvoice.branchOfficeId = this._authService.currentOffice;
         consignmentinvoice.idtypeFC = this.fCTypeSelected;
         consignmentinvoice.idtypedocument =this.typedocument;
         consignmentinvoice.idStatus = Number(this.status);
         consignmentinvoice.idResponsibleOperator = this.operator.idOpetator ?? -1;
         consignmentinvoice.idValidationOperator = this.operatorAuthmodal.idOpetator ?? -1;
         //consignmentinvoice.startDate = this.getDateTime();
         consignmentinvoice.supplier=new Supplier()
         consignmentinvoice.supplier.id = this.supplierId;
         consignmentinvoice.observations = this.observation;
        return consignmentinvoice;
  }
 
   private handleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.dialogService.errorMessage('srm.reception.reception', error?.error?.message ?? 'error_service');
 }

 private successCreating(result: number) {
     this.onEmitHideForm(result)
    this.loadingService.stopLoading();
    this.dialogService.successMessage('srm.reception.reception', 'saved');
  }

  get validateReceivingOperatorId() {
    return this.operator?.idOpetator > -1 ?? false;
  }
  get validateValidatorOperatorId() {
    return  this.operatorAuthmodal?.idOpetator > -1?? false;
  }
  get validateSupplierId() {
    return this.supplierId > -1 ?? false;
  }
  get validateFcType() {
    return this.fCTypeSelected  > -1;
  }
  get validateDocumentType() {
    return this.documentTypeSelected  > -1;
  }
  get receptionToStart() {
    return this.status === InvoiceStatus.started;
  }
  private getDateTime(): Date {
    return this.receptionToStart ? this.startDateFilter : new Date('1900-01-01');
  }

}
