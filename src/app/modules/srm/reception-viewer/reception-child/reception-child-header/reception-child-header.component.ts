import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { CdTimerComponent } from 'angular-cd-timer';
import { TimerStatus } from 'src/app/models/common/timer-status';
import { ChildReception, ReceptionStatus } from 'src/app/models/srm/reception';
import { ReceptionFilters } from 'src/app/models/srm/reception-filters';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from '../../../../security/users/shared/user-const-permissions';
import { FilterPurchaseOrder } from '../../../shared/filters/filter-purchase-order';

@Component({
  selector: 'app-reception-child-header',
  templateUrl: './reception-child-header.component.html',
  styleUrls: ['./reception-child-header.component.scss']
})
export class ReceptionChildHeaderComponent implements OnInit {

  constructor(private readonly authService: AuthService, public userPermissions: UserPermissions,
    private readonly dialogService: DialogsService, private router: Router) { }

  permissionsIDs = {...Permissions};
  dirToComeBack = '';
  filters:  ReceptionFilters;
  listpurchaseFiltersFilters: FilterPurchaseOrder[] = [];
  timerStatus: TimerStatus = TimerStatus.noStarted;
  @ViewChild('basicTimer', { static: false }) cdTimer: CdTimerComponent;

  @Input() childReception: ChildReception = new ChildReception();
  @Output() startEvent = new EventEmitter();
  @Output() saveEvent = new EventEmitter();
  @Output() finishEvent = new EventEmitter();
  @Output() voidEvent = new EventEmitter<{reception:ChildReception}>()
  showDialogReason:boolean=false;
  motiveTypeId: number = 26;

  ngOnInit(): void {
    this.getFilters();
  }

  taskButtonsDisabled() {
    return this.childReception.receivingOperatorId !== this.authService.idUser;
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

  getStatus() {
    let status = '';

    switch (this.childReception.statusId) {
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
    return this.childReception?.statusId != ReceptionStatus.pending  ||  this.authUserIsRespoinsible() ||  this.childReception?.statusReceptionParentId < ReceptionStatus.started;
  }

  btnfinalized() {
    return this.childReception?.statusId != ReceptionStatus.started || this.authUserIsRespoinsible();
  }


  saveButtonDisabled() {
    return this.authUserIsRespoinsible() ||  this.childReception?.statusReceptionParentId < ReceptionStatus.started ;
  }

  start() {
    this.startEvent.emit();
  }

  back() {
    this.router.navigate([this.dirToComeBack], {state: this.setQueryParamsFilters() });
  }

  save() {
     this.saveEvent.emit();
  }

  finish() {
    this.finishEvent.emit();
  }
  voidButtonDisabled() {
    return this.childReception?.statusId >= ReceptionStatus.validated || this.authUserIsRespoinsible();
  }
  void() {
    this.dialogService.confirmDialog('confirmBack','¿Está seguro que desea anular el documento?', () => {
      this.showDialogReason = true;   
    });
   
  }

  private authUserIsRespoinsible()
  {
    return this.childReception?.receivingOperatorId != this.authService.idUser;
    
  }

  private getFilters() {
    const receptionfilters = history.state.queryParams?.receptionFilters;
    const purchasefilters = history.state.queryParams?.purchasefilters;

    const dir = history.state.queryParams.dir;
    if(dir!=undefined)
       this.dirToComeBack = dir.toString();

    if (receptionfilters) {
      this.filters = JSON.parse(receptionfilters); 
    }

    if (purchasefilters) {
      this.listpurchaseFiltersFilters = JSON.parse(purchasefilters); 
    }
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
  hideDialogReason() {
    this.showDialogReason = false;
 }
 savereason(reason)
 {
   this.childReception.description = reason.observation;
   this.childReception.idReason = reason.motiveId;
   this.voidEvent.emit({reception: this.childReception});
 }

}
