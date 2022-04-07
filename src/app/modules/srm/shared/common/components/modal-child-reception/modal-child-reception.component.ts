import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseModel } from 'src/app/models/common/BaseModel';
import { Area } from 'src/app/models/masters/area';
import { Supplier } from 'src/app/models/masters/supplier';
import { ChildReception, Reception, ReceptionStatus, ReceptionUpdateStatus } from 'src/app/models/srm/reception';
import { UpdaterButtonService } from 'src/app/modules/common/components/updater-button/service/updater-button.service';
import { DateHelperService } from 'src/app/modules/common/services/date-helper/date-helper.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { AreaFilter } from 'src/app/modules/masters/area/shared/filters/area-filter';
import { AreaService } from 'src/app/modules/masters/area/shared/services/area.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { MerchandiseReceptionService } from '../../../services/merchandise-reception/merchandise-reception.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { SimpleReception } from 'src/app/models/srm/simple-reception';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { Reason } from 'src/app/models/srm/common/reason';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';

@Component({
  selector: 'app-modal-child-reception',
  templateUrl: './modal-child-reception.component.html',
  styleUrls: ['./modal-child-reception.component.scss']
})
export class ModalChildReceptionComponent implements OnInit {

  @Input() visible: boolean = false;
  @Input() receptionId: number = 0;
  @Output() hideDialogForm = new EventEmitter<number>();
  userType:number=1;

  motiveTypeId: number = 26;

  showDialogReason: boolean = false;

  cols: any[];

  expanded: boolean;

  simpleReception: ChildReception = new ChildReception();
  simpleReceptionSelected: ChildReception = new ChildReception();
  simpleReceptions: ChildReception[] = [];

  adjunctOperator: string;
  operatorDialogVisible: boolean = false;
  receptionAreaSelected: number;
  submitted = false;
  startDate: Date = new Date();

  permissionsIDs = {...Permissions};

  getReceptionsByIdReceptionFinished = true;

  areaList: Area[] = [];

  reception: Reception = this.getReceptionInstancesDefault();

  constructor(private readonly receptionService: MerchandiseReceptionService,
    private readonly areaService: AreaService,
    private readonly authService: AuthService,
    private readonly updaterButtonService: UpdaterButtonService,
    private readonly dateHelper: DateHelperService,
    private readonly loadingService: LoadingService,
    public userPermissions: UserPermissions,
    private messageService: MessageService,
    private readonly dialogService: DialogsService) { }

  ngOnInit(): void {
    this.getCollumns();
    this.getReceptionData();
    this.loadAreasList();
  }

  onShow() {
    this.ngOnInit();
  }

  getReceptionData() {
    this.receptionService.getReceptionData(this.receptionId)
    .subscribe(data =>{ this.getReceptionDataSuccess(data)}
     ,(error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al cargar los datos." });
    });
  }

  getReceptionDataSuccess(reception: Reception) {
  
    this.reception = reception;
    this.reception.receivingOperator = this.reception.receivingOperator ?? new BaseModel();

    this.getReceptions();
  }

  save() {
    this.loadingService.startLoading();
    const model = this.completeReceptionModel();
    this.receptionService
        .createSimpleReception(model)
        .then(() => this.saveSuccess())
        .catch(error => this.handlerError(error));
  }

  success() {
    this.loadingService.stopLoading();
    this.dialogService.successMessage('srm.reception.child_create', 'saved');
    this.getReceptions();
  }

  saveSuccess() {
    this.success();
    this.expanded = false;
   
  }

  cancel() {
    this.expanded = false;
  }

  onEmitHideForm(idResult: number) {
    this.clearFields();
    this.visible = false;
    this.hideDialogForm.emit(idResult);
  }

  onSubmitOperator(data) {
    this.adjunctOperator = data?.operator?.name;
    this.simpleReception.receivingOperatorId = data?.operator?.id;
  }

  onToggleOperator(visible: boolean) {
    this.operatorDialogVisible = visible;
  }

  getReceptions() {
    this.receptionService.getSimpleReceptions(this.reception.purchaseId).subscribe((data: ChildReception[]) => {
      if (data.length >0) {
        this.simpleReceptions = data.filter(x => x.statusId !== ReceptionStatus.canceled);
       }
      }, (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando el producto" });
      });
  }

  getReceptionsByIdReceptionSuccess(data: ChildReception[]) {
    //this.updaterButtonService.setUpdaterIsActive(false);
    
    
  }

  getStatus() {
    let status = '';

    switch (this.reception.estatus) {
      case 55:
        status = "srm.reception.document.pending_by_reception";
      break;
      case 56:
        status = "srm.reception.document.in_reception";
      break;
      case 57:
        status = "srm.reception.document.finalized";
      break;
      case 58:
        status = "srm.reception.document.voided";
      break;
      case 59:
        status = "srm.reception.document.reject";
      default:
        break;
    }

    return status;
  }

    get validateArea() {
    return this.receptionAreaSelected > -1 ?? false;
  }

  isMinimumDateTimeValue(date: Date): Boolean {
    return new Date(date).getDate() === new Date('1/1/0001').getDate();
  }

  getValidDate(date: Date) {
    const gmtDate = this.dateHelper.utcToGMT(new Date(date));
    return gmtDate;
  }


  private getCollumns() {
    this.cols = [
      { header: 'srm.reception.child.receptor', display: 'table-cell', field: 'responsible', dataType: 'string' },
      { header: 'srm.reception.child.number_task', display: 'table-cell', field: 'numberTask', dataType: 'string' },
      { header: 'srm.reception.child.startDate', display: 'table-cell', field: 'startTime', dataType: 'date' },
      { header: 'srm.reception.child.status', display: 'table-cell', field: 'status', dataType: 'string'  },
      { header: 'srm.reception.child.document', display: 'table-cell', field: 'childReceptionNumber', dataType: 'string'  },
      { header: 'srm.reception.child.items', display: 'table-cell', field: 'receptionCountItems', dataType: 'string'  }
    ];
  }

  edit(childReception: ChildReception) {

  }

  void(childReception: ChildReception) {

    this.dialogService.confirmDialog('confirm','Se anulará la recepción, ¿desea continuar?', () => {
    this.showDialogReason = true;
    this.simpleReceptionSelected = childReception;
    });
  }

  openNew() {
    this.expanded = true;
    this.clearProperties();
  }

  saveReason(reason: Reason) {
    const model =  this.completeReceptionUpdateStatusModel();
    model.observation = reason.observation;
    model.motiveId = reason.motiveId;

    this.updateStatus(model);
  }

  hideDialogReason() {
    this.showDialogReason = false;
 }

  private updateStatus(item: ReceptionUpdateStatus) {
    this.loadingService.startLoading();
    this.receptionService.updateStatus(item).toPromise()
    .then(() => this.success())
    .catch(error => this.handlerErrorLoading(error));
  }


  private completeReceptionUpdateStatusModel() {
    const receptionUpdateStatus = new ReceptionUpdateStatus();

    receptionUpdateStatus.receptionId = this.simpleReceptionSelected.id;
    receptionUpdateStatus.statusId = ReceptionStatus.canceled;

    return receptionUpdateStatus;
  }

  private completeReceptionModel() {
    const reception = new SimpleReception();
    reception.purchaseId=this.reception.purchaseId;
    reception.branchOfficeId = this.authService.currentOffice;
    reception.documentTypeId = this.reception?.documentTypeRelatedId ?? -1;
    reception.documentId = this.reception?.purchaseOrderRelatedId ?? -1;
    reception.estatusId = ReceptionStatus.pending;
    reception.status="Pendiente por recepción"
    reception.invoiceNumber = this.reception?.invoiceNumber ?? '';
    reception.externalDocument = this.reception?.externalDocumentNumber ?? '';
    reception.receivingOperatorId = this.simpleReception.receivingOperatorId
    reception.validatorOperatorId = -1;
    reception.receptionTypeId = 1;//Child reception
    reception.startTime = new Date('1900-01-01')//this.getDateTime();
    reception.arrivalTime = this.dateHelper.utcToGMT(moment(this.simpleReception.arrivalTime).toDate())//new Date(this.simpleReception.arrivalTime);
    reception.supplierId = -1;
    reception.observation = this.simpleReception.observation;
    reception.areaId = this.receptionAreaSelected;
    return reception;
  }

  private getDateTime(): Date {
    return this.startDate ? this.startDate : new Date('1900-01-01');
  }

  private clearProperties() {
    this.adjunctOperator = this.reception?.receivingOperator?.name;
    this.receptionAreaSelected = this.reception?.receptionAreaId;
    this.simpleReception = new ChildReception();
    this.simpleReception.receivingOperatorId = this.reception?.receivingOperator?.id;
  }

  private loadAreasList() {
    const filter: AreaFilter = new AreaFilter();
          filter.idAreaType = 3; // Areas for Reception
          filter.idBranchOffice = this.authService.currentOffice;
    this.areaService
        .getareaListPromise(filter)
        .then(data => {this.areaList = data.sort((a, b) => a.name.localeCompare(b.name)); })
        .catch(error => this.handlerError(error));
  }

  private getReceptionInstancesDefault() {
    const reception = new Reception();
    reception.supplier = new Supplier();
    reception.receivingOperator = new BaseModel();

    return reception;
  }

  private clearFields() {

  }

  private handlerErrorLoading(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.handlerError(error);
  }

  private handlerError(error: HttpErrorResponse) {
    this.dialogService.errorMessage('error', error?.error?.message ?? 'error_service');
  }

}
