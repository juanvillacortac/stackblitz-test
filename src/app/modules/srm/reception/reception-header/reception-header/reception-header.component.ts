import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { CdTimerComponent } from 'angular-cd-timer';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TimerStatus } from 'src/app/models/common/timer-status';
import { Motives } from 'src/app/models/masters/motives';
import { Reason } from 'src/app/models/srm/common/reason';
import { Reception, ReceptionStatus } from 'src/app/models/srm/reception';
import { ReceptionFilters } from 'src/app/models/srm/reception-filters';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from '../../../../security/users/shared/user-const-permissions';
import { FilterPurchaseOrder } from '../../../shared/filters/filter-purchase-order';

@Component({
  selector: 'app-reception-header',
  templateUrl: './reception-header.component.html',
  styleUrls: ['./reception-header.component.scss']
})
export class ReceptionHeaderComponent implements OnInit {

  @Input() indInitTime: boolean = false;
  @Input() documentIsSaved: boolean = true;
  @Input() reception: Reception = new Reception();
  @Input('haveproducts') haveproducts: boolean=false ;
  @Input() legalCurrencyId: number;

  @Output() saveEvent = new EventEmitter();
  @Output() voidEvent = new EventEmitter<{reception:Reception}>()
  @Output() startEvent = new EventEmitter();

  showDialog: boolean = false;

  @Output() finalizeEvent = new EventEmitter();
  @Output() rejectEvent = new EventEmitter<{reception:Reception}>();


  showReason: boolean = false;
  reason: Motives = new Motives();
  dirToComeBack = '';
  iscanceled:boolean=false;
  motiveTypeId: number = 26;

  filters:  ReceptionFilters;
  listpurchaseFiltersFilters: FilterPurchaseOrder[] = [];

  @ViewChild('basicTimer', { static: false }) cdTimer: CdTimerComponent;
  permissionsIDs = {...Permissions};
  showDialogReason:boolean=false;

  timerStatus: TimerStatus = TimerStatus.noStarted;
  chieldReceptionModalShow = false;
  receptionIdSelected: number = 0;
 

  constructor(public userPermissions: UserPermissions, private router: Router,private confirmationService: ConfirmationService,
    private readonly dialogService: DialogsService, private readonly authService: AuthService,    private messageService: MessageService) { }

  ngOnInit(): void {
    this.getFilters();
  }

  save() {
    this.saveEvent.emit();
  }
  voidaux() {
    this.confirmationService.confirm({
      key:'confirmBack',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea anular el documento?.',
      accept: () => {
     this.iscanceled=true;
     this.showReason=true;
    },
  });
 }

  void() {
    this.dialogService.confirmDialog('confirmBack','¿Está seguro que desea anular el documento?,Se anularán tambien las recepciones hijas asociadas', () => {
      this.showDialogReason = true;   
    });
   
  }
  savereason(reason)
  {
    this.reception.description = reason.observation;
    this.reception.idReason = reason.motiveId;
    this.voidEvent.emit({reception: this.reception});
  }
  hideDialogReason() {
    this.showDialogReason = false;
 }

  start(){
    this.startEvent.emit();
  }
  finalized(){
    if(this.reception.cantItems <=0 && this.haveproducts==false)
       this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "No existen productos agregados a la recepción" });
    else
     this.finalizeEvent.emit();
  }
  rejectaux(){
    this.dialogService.confirmDialog('confirmBack','¿Está seguro que desea anular el documento?,Se anulara tambien las recepciones hijas asociadas', () => {
      this.showDialogReason = true;   
    });
  }
  reject(){
    this.rejectEvent.emit({reception: this.reception});
  }

  onToggleReason(visible: boolean) {
    this.showReason = visible;
    this.reception.idReason = this.reason.id;
    this.reception.description = this.reason.name;
    if (this.reception.idReason > 0)
    {
      if(this.iscanceled)
          this.void()
      else
         this. reject();
    }
        
  }

  taskButtonsDisabled() {
    return this.reception.receivingOperator.id !== this.authService.idUser;
  }

  PlayTask() {
    if (this.timerStatus === TimerStatus.noStarted) {
      this.cdTimer.start();
    } else {
      this.cdTimer.resume();
    }

    this.timerStatus = TimerStatus.started;
  }

  PauseTask() {
    this.cdTimer.stop();
    this.timerStatus = TimerStatus.paused;
  }

  showPlayButton() {
    const isPaused = this.timerStatus === TimerStatus.noStarted || this.timerStatus === TimerStatus.paused; //we can show the starter butto nonly when this is not started or is in pause
    return isPaused;
  }

  showStopButton() {
    const isStared = this.timerStatus === TimerStatus.started; //we can paused the timer only when this is started
    return isStared;
  }

  getPlayButtonTooltip() {
    if (this.timerStatus == TimerStatus.noStarted) {
      return 'srm.reception.header.start_task';
    } else {
      return 'srm.reception.header.continue_task';
    }
  }

  back() {
    if(!this.documentIsSaved) {
      this.dialogService.confirmDialog('confirmBack', 'Existen cambios sin guardar, si regresa se perderán los cambios!.', () => {
        this.backConfirm();
      } );
    } else {
      this.backConfirm();
    }

  }

  backConfirm() {
    this.router.navigate([this.dirToComeBack], {state: this.setQueryParamsFilters() });
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
      case 61:
        status = "srm.reception.document.reject";
      break;
      case 74:
        status = "srm.reception.document.voided";
      default:
        break;
    }

    return status;
  }

  btnStartIsDisabled() {
    return this.reception?.estatus >ReceptionStatus.pending  || this.authUserIsRespoinsible();
  }
  btncreateIsDisabled() {
    return this.reception?.estatus >ReceptionStatus.started  || this.authUserIsRespoinsible();
  }

  saveButtonDisabled() {
    return  this.reception?.estatus > ReceptionStatus.started || this.authUserIsRespoinsible();
  }

  voidButtonDisabled() {
    return this.reception?.estatus >= ReceptionStatus.validated || this.authUserIsRespoinsible();
  }

  private authUserIsRespoinsible() {
    return this.reception?.receivingOperator?.id != this.authService.idUser;
  }

  btnfinalized() {
    return this.reception?.estatus != ReceptionStatus.started || this.authUserIsRespoinsible();
  }

  btnreject(){
    return this.reception?.estatus >= ReceptionStatus.validated || this.authUserIsRespoinsible();
  }

  btnTimeLineDisabled(){
    return this.reception.id == 0;
  }
  
  private setQueryParamsFilters() {
    const queryParams: any = {};
    queryParams.receptionFilters = this.filters;
    queryParams.purchasefilters = this.listpurchaseFiltersFilters;
    const navigationExtras: NavigationExtras = {
      queryParams
    };
  
    return navigationExtras;
  }

  private getFilters() {
    const receptionfilters = history.state.queryParams?.receptionFilters;
    const purchasefilters = history.state.queryParams?.purchasefilters;

    const dir = history.state.queryParams.dir;
    this.dirToComeBack = dir.toString();

    if (receptionfilters) {
      this.filters = JSON.parse(receptionfilters); 
    }

    if (purchasefilters) {
      this.listpurchaseFiltersFilters = JSON.parse(purchasefilters); 
    }
  }

  childReceptionCallBack(result: number) {
    this.chieldReceptionModalShow = false;
  }
  onShowchildReceptionDetail(reception) {
    this.receptionIdSelected = reception.id;
    this.chieldReceptionModalShow = true;
  }

}
