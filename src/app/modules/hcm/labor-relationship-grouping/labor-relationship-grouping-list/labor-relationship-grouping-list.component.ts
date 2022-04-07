import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { MessageService } from 'primeng/api';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { LaborRelationshipxGroupingViewModel } from '../../shared/view-models/labor-relationship-grouping-viewmodel';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'app-labor-relationship-grouping-list',
  templateUrl: './labor-relationship-grouping-list.component.html',
  styleUrls: ['./labor-relationship-grouping-list.component.scss']
})
export class LaborRelationshipGroupingListComponent implements OnInit {

  @Input() recordList: LaborRelationshipxGroupingViewModel[];
  clonedLaborRelationshipxGrouping: { [s: string]: LaborRelationshipxGroupingViewModel; } = {};
  
  newGrouping: LaborRelationshipxGroupingViewModel;
  disabledSave: number = 0;
  _validations:Validations = new Validations();
  assignedValue: number;


  @Output() returnData: EventEmitter<LaborRelationshipxGroupingViewModel> = new EventEmitter<LaborRelationshipxGroupingViewModel>();
  @Output() saveData: EventEmitter<LaborRelationshipxGroupingViewModel[]> = new EventEmitter<LaborRelationshipxGroupingViewModel[]>();
  @Output() dataInMemory: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor(public userPermissions: UserPermissions, private messageService: MessageService) { }

   permissionsIDs = {...Permissions};

  ngOnInit(): void {
    console.log(this.recordList);
    this.recordList.forEach(element => {
      if(element.assignedValue == undefined){
        element.assignedValue = "";
      }
    });
  }

  add(){
    this.newGrouping = new LaborRelationshipxGroupingViewModel();
    this.returnData.emit(this.newGrouping);
  }

  onRowEditInit(record: LaborRelationshipxGroupingViewModel, index: number) {
    //debugger;
    if(this.recordList[index].assignedValue == undefined){
      this.recordList[index].assignedValue = null;
    }
    this.clonedLaborRelationshipxGrouping[record.idGrouping] = {...record};
    this.disabledSave++;
  }

  onRowEditSave(record: LaborRelationshipxGroupingViewModel, index: number) {
    //debugger;
    if(this.recordList[index].assignedValue == null){
      this.recordList[index].assignedValue = "No aplica";
    }else{
      this.recordList[index].assignedValue = record.assignedValue.toString();
    }
    delete this.clonedLaborRelationshipxGrouping[record.idGrouping];
    this.disabledSave--;
    //debugger;
    //this.dataInMemory.emit(true);
  }

  onRowEditCancel(record: LaborRelationshipxGroupingViewModel, index: number) {
    //debugger;
    this.recordList[index] = this.clonedLaborRelationshipxGrouping[record.idGrouping];
    if(this.recordList[index].assignedValue == null){
      this.recordList[index].assignedValue = "No aplica";
    }
    record.assignedValue = this.recordList[index].assignedValue;
    delete this.clonedLaborRelationshipxGrouping[record.idGrouping];
    this.disabledSave--;
  }

  save(){
    this.saveData.emit(this.recordList);
  }

  validateAssignedValue(event,index){
    var inp = this.recordList[index].assignedValue+(String.fromCharCode(event.keyCode));
    if (/^([0-9]+(\.[0-9]{0,3})?|[A-Za-zäÄëËïÏöÖüÜáéíóúÁÉÍÓÚñÑ\-_0-9]([A-Za-zäÄëËïÏöÖüÜáéíóúÁÉÍÓÚñÑ\-_0-9\s]+)?)$/.test(inp)) { //si cumple el formato  | 
      return true;                 //no hagas nada
    } else {
      event.preventDefault();
      return false;                  //manda el error
    }
  }
}
