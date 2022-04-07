import { Component, Input, OnInit } from '@angular/core';
import * as status from '../../../ims/inventory-counts/shared/service/count-status-const';

@Component({
  selector: 'app-status-count-label',
  templateUrl: './status-count-label.component.html',
  styleUrls: ['./status-count-label.component.scss']
  
})
export class StatusCountLabelComponent implements OnInit {

  status: number[] = [];
  statusIDs = {...status};
  get optionList() { return (this.isYesOrNoMode) ? this.yesOrNoModeTitlesList : this.statusTitlesList; }
  statusTitlesList = [
  { 'value': this.statusIDs.NO_ASSIGNED_STATUS_ID, 'name': ' No asignado'} ,
  { 'value': this.statusIDs.IN_DRAFT_STATUS_ID , 'name': ' Planificado'} ,
  {'value': this.statusIDs.IN_ACTION_STATUS_ID, 'name': ' En proceso'},
  {'value': this.statusIDs.WAITING_FOR_ADJUSTMENT_STATUS_ID, 'name': ' Pendiente por ajuste'},
  {'value': this.statusIDs.FINALIZED_STATUS_ID, 'name': 'Finalizado'},
  {'value': this.statusIDs.CANCELED_STATUS_ID, 'name': ' Anulado/Cancelado'},
  {'value': this.statusIDs.DELAYED_STATUS_ID, 'name': ' Retrasado'},
  {'value': this.statusIDs.FINALIZED_ADJUSTEMENT_STATUS_ID, 'name': ' Finalizado por ajuste'}];
  yesOrNoModeTitlesList = [
  { 'value': this.statusIDs.NO_ASSIGNED_STATUS_ID, 'name': ' No asignado'} ,
  { 'value': this.statusIDs.IN_DRAFT_STATUS_ID , 'name': ' Planificado'} ,
  {'value': this.statusIDs.IN_ACTION_STATUS_ID, 'name': ' En proceso'},
  {'value': this.statusIDs.WAITING_FOR_ADJUSTMENT_STATUS_ID, 'name': ' Pendiente por ajuste'},
  {'value': this.statusIDs.FINALIZED_STATUS_ID, 'name': ' Finalizado'},
  {'value': this.statusIDs.CANCELED_STATUS_ID, 'name': ' Anulado/Cancelado'},
  {'value': this.statusIDs.DELAYED_STATUS_ID, 'name': ' Retrasado'},
  {'value': this.statusIDs.FINALIZED_ADJUSTEMENT_STATUS_ID, 'name': ' Finalizado por ajuste'}];
  title: string;
 
  @Input() idstatus: number;
  @Input() isYesOrNoMode:number=this.statusIDs.NO_ASSIGNED_STATUS_ID;
  constructor() { }

  ngOnInit(): void {
    this.title = this.optionList.find(p => p.value==this.idstatus).name;
  }
}
