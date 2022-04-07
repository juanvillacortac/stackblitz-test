import { Component, Input, OnInit } from '@angular/core';
import * as Status from '../../../ims/inventory-adjustment/shared/services/adjustment-status-const';
@Component({
  selector: 'app-status-adjustment-label',
  templateUrl: './status-adjustment-label.component.html',
  styleUrls: ['./status-adjustment-label.component.scss']
})
export class StatusAdjustmentLabelComponent implements OnInit {
debugger;
  status: number[] = [];
  statusIDs = {...Status};
  get optionList() { return (this.isYesOrNoMode) ? this.yesOrNoModeTitlesList : this.statusTitlesList; }
  statusTitlesList = 
  [{'value': this.statusIDs.IN_PROGRESS_STATUS_ID, 'name': ' En proceso'},
  {'value': this.statusIDs.FINALIZED_STATUS_ID, 'name': 'Finalizado'},
  {'value': this.statusIDs.CANCELED_STATUS_ID, 'name': ' Anulado/Cancelado'},
  {'value': this.statusIDs.WAITING_FOR_ADJUSTMENT_STATUS_ID, 'name': ' Pendiente por ajuste'},
  {'value': this.statusIDs.NO_ASIGNED_STATUS, 'name': ' No asignado'}];
  yesOrNoModeTitlesList =[
  {'value': this.statusIDs.IN_PROGRESS_STATUS_ID, 'name': ' En proceso'},
  {'value': this.statusIDs.FINALIZED_STATUS_ID, 'name': 'Finalizado'},
  {'value': this.statusIDs.CANCELED_STATUS_ID, 'name': ' Anulado/Cancelado'},
  {'value': this.statusIDs.WAITING_FOR_ADJUSTMENT_STATUS_ID, 'name': ' Pendiente por ajuste'},
  {'value': this.statusIDs.NO_ASIGNED_STATUS, 'name': ' No asignado'}]
  title: string;
 
  @Input("idstatus") idstatus: number;
  @Input() isYesOrNoMode:number=this.statusIDs.NO_ASIGNED_STATUS;
  
  constructor() { }
 
  ngOnInit(): void {
    //this.title = this.optionList.find(p => p.value==this.idstatus).name;
  }

}
