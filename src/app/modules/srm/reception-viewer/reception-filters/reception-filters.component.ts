import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { OperationdocumentFilters } from 'src/app/models/common/operationdocument-filters';
import { Status } from 'src/app/models/masters-mpc/common/status';
import { Area } from 'src/app/models/masters/area';
import { Operationdocument } from 'src/app/models/masters/operationdocument';
import { Typedocumentoperation } from 'src/app/models/masters/typedocumentoperation';
import { TypedocumentoperationFilter } from 'src/app/models/masters/typedocumentoperation-filter';
import { DocumentType } from 'src/app/models/srm/common/document-type';
import { TypeNegotiation } from 'src/app/models/srm/common/type-negotiation';
import { TypesReception } from 'src/app/models/srm/common/types-reception';
import { ReceptionFilters } from 'src/app/models/srm/reception-filters';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { InventoryExistenceFilter } from 'src/app/modules/ims/inventory-existence/shared/filters/inventory-existence-filter';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { StatusFilter } from 'src/app/modules/masters-mpc/shared/filters/common/status-filter';
import { CategoryService } from 'src/app/modules/masters-mpc/shared/services/CategoryService/category.service';
import { CommonService } from 'src/app/modules/masters-mpc/shared/services/Common/common.service';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { AreaFilter } from 'src/app/modules/masters/area/shared/filters/area-filter';
import { AreaService } from 'src/app/modules/masters/area/shared/services/area.service';
import { OperationMastersService } from 'src/app/modules/masters/operation-master/shared/operationmasters.service';
import { DocumentTypeFilter } from '../../shared/filters/common/document-type-filter';
import { TypeNegotiationFilter } from '../../shared/filters/common/type-negotiation-filter';
import { TypesReceptionFilter } from '../../shared/filters/common/types-reception-filter';
import { CommonsrmService } from '../../shared/services/common/commonsrm.service';
import { EnumReceptionStatus } from '../../shared/Utils/enum-reception-status.enum';
import { OperatorModal } from '../../shared/view-models/common/operatormodal';

@Component({
  selector: 'app-reception-filters',
  templateUrl: './reception-filters.component.html',
  styleUrls: ['./reception-filters.component.scss'],
  providers: [DatePipe]
})
export class ReceptionFiltersComponent implements OnInit {
  @Input() supplierViewer = false;
  @Input() expanded = false;
  @Input() filters:  ReceptionFilters;
  @Input() loading  = false;
  @Input() cboactive: number;
  @Input() dataUnavailable = true;
  @Output() search = new EventEmitter<ReceptionFilters>();
  @Output() exportExcel = new EventEmitter();
  @Output() exportPDF = new EventEmitter();
  supplierBrandFilters: InventoryExistenceFilter =  new InventoryExistenceFilter();
  valid: RegExp = /^[a-zA-Z0-9Á-ú.-]*$/;
  statuslist: SelectItem<Status[]> = {value: null};
  negotiationType: SelectItem<TypeNegotiation[]> = {value: null};
  receptionType: SelectItem<TypesReception[]> = {value: null};
  ocDocumentType: SelectItem<Operationdocument[]> = {value: null};
  documentRelatedTypes: SelectItem<DocumentType[]> = {value: null};
  // documentRelatedTypes: SelectItem<Typedocumentoperation[]> = {value: null};
  areaList: SelectItem<Area[]> = {value: null};
  receptionAreaSelected = null;
  receptionNumber: string[];
  invoiceNumber: string[];
  documentNumberRelated: string[];
  purchasedocumentNumber: string[];
  documentNumber: string[];
  supplierString = '';
  selectedSuppliers: any[] = [];
  supplierDialogVisible = false;
  dateTypes: SelectItem[];
  startDateFilter: Date = new Date();
  finalDateFilter: Date = new Date();
  maxDate: Date = new Date();
  operatorDialogVisible = false;
  operatorAuthDialogVisible = false;
  operatormodal: OperatorModal = new OperatorModal();
  operatorAuthmodal: OperatorModal = new OperatorModal();
  receptionModalShow = false;
  receptionStatus = EnumReceptionStatus.pending;
  receptionStatusOptions: MenuItem[];
  exportOptions: MenuItem[];
  validations: Validations = new Validations();
  userType:number=1;//interno

  constructor(
    private _areaService: AreaService,
    public _categoryservice: CategoryService ,
    public datepipe: DatePipe ,
    public _commonService: CommonService,
    private readonly loadingService: LoadingService,
    private dialogService: DialogsService,
    private _commonSRMService: CommonsrmService,
    private _operationMastersService: OperationMastersService,
    private translateService: TranslateService,
    private _authService: AuthService) {
   }

  ngOnInit(): void {
    this.loadFilters();
    this.loadExportOptions();
  }

  loadFilters() {
    this.loadAreasList();
    this.loadStatusList();
    this.loadDateTypes();
    this.loadReceptionTypes();
    this.loadNegotiationTypes();
    this.loadOCDocumentTypes();
    this.loadDocumentRelatedTypes();
  }

  onToggleSupplier(visible: boolean) {
    this.supplierDialogVisible = visible;
  }

  onSearch() {
      this.completeFilterModel();
      this.search.emit(this.filters);
  }
  completeFilterModel() {
    this.filters.branchOfficeId = this._authService.currentOffice;
    this.filters.receptionNumber = this.extractStringArray(this.receptionNumber) ?? '';
    this.filters.invoiceNumber = this.extractStringArray(this.invoiceNumber) ?? '';
    this.filters.documentNumberRelated = this.extractStringArray(this.documentNumberRelated) ?? '';
    this.filters.documentNumber = this.extractStringArray(this.purchasedocumentNumber) ?? '';
    this.filters.externalDocumentNumber=this.extractStringArray(this.documentNumber) ?? '';
    this.filters.receptionOperator = this.operatormodal.idOpetator ?? -1;
    this.filters.validationOperator = this.operatorAuthmodal.idOpetator ?? -1;
    this.filters.receptionAreas = this.extractStringArray(this.receptionAreaSelected) ?? '';
    this.filters.initialDate = this.datepipe.transform(this.startDateFilter, 'yyyyMMdd');
    this.filters.finalDate = this.datepipe.transform(this.finalDateFilter, 'yyyyMMdd');
  }

  getSuppliersId(suppliersSelected: any[]) {
    this.supplierString = '';
    this.filters.suppliersId = '';
    this.selectedSuppliers =  suppliersSelected;
    this.supplierString  = suppliersSelected?.length >= 5 ? suppliersSelected?.length + ' ' + this.getTextByKey('srm.merchandise_receptions.suppliersSelected') : '';
    suppliersSelected?.forEach((item, i) => {
      if (suppliersSelected.length < 5) {
        this.supplierString += item.socialReason +  ( i < (suppliersSelected.length - 1)  ? ',' : '');
      }
      this.filters.suppliersId += item.id +  ( i < (suppliersSelected.length - 1)  ? ',' : '');
    });
  }
  extractStringArray(value: string[]) {
    let data = '';

    value?.forEach((item, i) => {
      data += item +  ( i < (value.length - 1) ? ',' : '');
    });
    return data;
  }

  onExportExcel() {
    this.exportExcel.emit();
  }
  onExportPDF() {
    this.exportPDF.emit();
  }

  clearFilters() {
    this.supplierString = '';
    this.receptionNumber = [];
    this.invoiceNumber = [];
    this.documentNumber = [];
    this.documentNumberRelated = [];
    this.purchasedocumentNumber= [];
    this.filters.ocDocumentType = -1;
    this.filters.documentNumberRelated = '';
    this.filters.suppliersId = '';
    this.filters.documentNumber = '';
    this.filters.documentType = -1;
    this.filters.documentStatus = -1;
    this.filters.receptionOperator = -1;
    this.filters.validationOperator = -1;
    this.filters.negotiationType = -1;
    this.filters.dateStatus = -1;
    this.filters.receptionAreas = '';
    this.receptionAreaSelected = null;
    if (!this.supplierViewer) {
      this.filters.receptionType = -1;
    }
    this.operatorAuthmodal = new OperatorModal();
    this.operatormodal = new OperatorModal();
    this.startDateFilter = new Date();
    this.finalDateFilter = new Date();
  }

  private loadAreasList() {
    const filter: AreaFilter = new AreaFilter();
    filter.idAreaType = 3 //Reception
    filter.idBranchOffice = this._authService.currentOffice;
    this.loadingService.startLoading();
    this._areaService
    .getareaListPromise(filter)
    .then(data => {this.areaList.value = data.sort((a, b) => a.name.localeCompare(b.name)); })
    .then(() => this.loadingService.stopLoading())
    .catch(error => this.handleError(error));
  }
  private loadStatusList() {
    this.loadingService.startLoading();
    const filter: StatusFilter = new StatusFilter();
    filter.IdStatusType = 14 ;
    this._commonService
    .getStatusPromise({...filter})
    .then(data => this.statuslist.value = data)
    .then(() => this.loadingService.stopLoading())
    .catch(error => this.handleError(error));
  }

  private handleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.dialogService.errorMessage('srm.merchandise_receptions.viewer', error?.error?.message ?? 'error_service');
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
      this.operatormodal.idOpetator = data.operator.id;
      this.operatormodal.namesoperators = data.operator.name;
    }
  }
 loadDateTypes() {
  this.dateTypes = [
    { label: 'Creada', value:  '1' },
    { label: 'Finalizada', value: '3'},
    { label: 'Iniciada', value: '2'},
    ];
}

 loadNegotiationTypes() {
  this.loadingService.startLoading();
      const filter = new TypeNegotiationFilter();
      filter.id = -1;
    this._commonSRMService.gettypeNegotiation
      ({...filter}).toPromise()
      .then(data => this.negotiationType.value = data.sort((a, b) => a.name.localeCompare(b.name)))
      .then(() => this.loadingService.stopLoading())
      .catch(error => this.handleError(error));
}

loadReceptionTypes() {
  this.loadingService.startLoading();
  const filter = new TypesReceptionFilter();
  filter.id = -1;
this._commonSRMService.getTypesReception
  ({...filter}).toPromise()
  .then(data => this.completeReceptionType(data))
  .then(() => this.loadingService.stopLoading())
  .catch(error => this.handleError(error));
}
completeReceptionType(data: TypesReception[]) {
  this.receptionType.value = data;
  if (this.supplierViewer) {
    this.filters.receptionType = this.receptionType?.value?.find(p => p.name === 'Recepcion-Validación').id;
  }

}
loadDocumentRelatedTypes() {
  this.loadingService.startLoading();
  const filter = new DocumentTypeFilter();
  filter.id = 3;
  filter.active = 1;
this._commonSRMService.getDocumentTypes
  ({...filter})
  .then(data => {
    let def=new DocumentType()
    def.id=3;
    def.name='Recepcion-validacion-compra'
    def.documentTypeRelatedId=0
    def.documentTypeRelated='Sin documento'
    data.push(def);
    this.documentRelatedTypes.value = data})
  .then(() => this.loadingService.stopLoading())
  .catch(error => this.handleError(error));
}

loadOCDocumentTypes() {
  this.loadingService.startLoading();
  const filter = new OperationdocumentFilters();
  filter.id = -1;
  filter.idTypeDocumentOperation = 3;
  filter.active=1
this._operationMastersService.getDocumentsOperations
  ({...filter}).toPromise()
  .then(data => this.ocDocumentType.value = data)
  .then(() => this.loadingService.stopLoading())
  .catch(error => this.handleError(error));
}

private getTextByKey(key: string) {
  return this.translateService.instant(key);
}


get validateReceptionNumberLenght() {
  return this.receptionNumber?.length > 0 ?? false;
}
get validateInvoiceNumberLenght() {
  return this.invoiceNumber?.length > 0 ?? false;
}
get validateDocumentNumberRelatedLenght() {
  return this.documentNumberRelated?.length > 0 ?? false;
}
get validateDocumentNumberLenght() {
  return this.documentNumber?.length > 0 ?? false;
}
get validatpurchasedocumentNumberLenght(){
  return this.purchasedocumentNumber?.length > 0 ?? false;
}
get disabledDateFields() {
  return  this.filters.dateStatus === -1 ?? true;
}

loadExportOptions() {
  this.exportOptions = [];
  this.exportOptions.push(
    {label: 'Excel', icon: 'pi pi-file-excel', command: () => {
        this.onExportExcel();
    }},
    {label: 'PDF', icon: 'pi pi-file-pdf', command: () => {
        this.onExportPDF();
    }}
  );
}
}


