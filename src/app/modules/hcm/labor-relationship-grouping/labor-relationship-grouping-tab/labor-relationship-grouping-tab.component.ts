import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { LaborRelationshipxGrouping } from '../../shared/models/laborRelationship/labor-relationship-grouping';
import { LaborRelationshipxGroupingFilter } from '../../shared/filters/laborRelationship/labor-relationship-grouping-filter';
import { LaborRelationshipxGroupingService } from '../../shared/services/labor-relationship-grouping.service';
import { Grouping } from '../../shared/models/laborRelationship/grouping';
import { GroupingFilter } from '../../shared/filters/grouping-filter';
import { GroupingService } from '../../shared/services/grouping.service';
import { GroupingViewModel } from '../../shared/view-models/grouping-viewmodel';




@Component({
  selector: 'app-labor-relationship-grouping-tab',
  templateUrl: './labor-relationship-grouping-tab.component.html',
  styleUrls: ['./labor-relationship-grouping-tab.component.scss']
})
export class LaborRelationshipGroupingTabComponent implements OnInit {

  @Input() idLaborRelationship: number;

  @Output() dataGroupingSave: EventEmitter<boolean> = new EventEmitter<boolean>();


  loading: boolean;
  showSidebar4: boolean = false;
  _laborRelationshipxGroupingList: LaborRelationshipxGrouping[] = [];
  laborRelationshipxGroupingFilter: LaborRelationshipxGroupingFilter = new LaborRelationshipxGroupingFilter();
  grouping: Grouping;
  groupingFilter: GroupingFilter = new GroupingFilter();
  groupingList: Grouping[] = [];
  groupingListViewModel: GroupingViewModel[] = [];
  newGroupingModel: GroupingViewModel;
  
  constructor(public _groupingService: GroupingService,
            private messageService: MessageService, 
            public userPermissions: UserPermissions,
            public _laborRelationshipxGroupingService: LaborRelationshipxGroupingService,
            ) { 
   
  }


  ngOnInit(): void {
    this.onLoadGrouping();
    this.onLoadlaborRelationshipxGrouping();
    this.onLoadListgrouping();
  }

  onLoadGrouping(){
    this._groupingService.getGrouping(this.groupingFilter).subscribe((data) =>{
      this.groupingList = data;
    })
  }

  onLoadlaborRelationshipxGrouping(){
    this._laborRelationshipxGroupingService.getLaborRelationshipxGrouping(this.laborRelationshipxGroupingFilter).subscribe((data) =>{
      this._laborRelationshipxGroupingList = data;
    })
  }

  onLoadListgrouping(){
    this.groupingList.forEach(element =>{
      var object = new GroupingViewModel();
      object.idGrouping = element.idGrouping;
      object.idGroupingType = 2;
      object.abbreviation = element.abbreviation;
      object.groups = element.groups;
      object.createdByUserId = element.createdByUserId;
      object.updatedByUserId = element.updatedByUserId;
      var laboralelationshipxGrouping = new LaborRelationshipxGrouping();
      laboralelationshipxGrouping  = this._laborRelationshipxGroupingList.find(x => x.idGrouping == object.idGrouping && x.idLaborRelationship == this.idLaborRelationship);
      if(laboralelationshipxGrouping.idLaborRelationshipxGrouping == -1){
        object.values = "";
        object.exist = false;
      }else{
        object.values = laboralelationshipxGrouping.assignedValue;
        object.exist = true;
      }
      this.groupingListViewModel.push(object);
    });
  }

  callPanelGrouping(record: GroupingViewModel){
    if(record.idGrouping == -1){
      this.newGroupingModel = new GroupingViewModel();
      this.newGroupingModel.idGrouping = -1;
      this.newGroupingModel.idGroupingType = 2;
      this.newGroupingModel.abbreviation = "";
      this.newGroupingModel.groups = "";
      this.newGroupingModel.values = "";
      this.newGroupingModel.exist = true;
      this.newGroupingModel.createdByUserId = -1;
      this.newGroupingModel.updatedByUserId = -1;
    }else{
      this.newGroupingModel = new GroupingViewModel();
      this.newGroupingModel.idGrouping = record.idGrouping;
      this.newGroupingModel.idGroupingType = record.idGroupingType;
      this.newGroupingModel.abbreviation = record.abbreviation;
      this.newGroupingModel.groups = record.groups;
      this.newGroupingModel.values = record.values;
      this.newGroupingModel.exist = true;
      this.newGroupingModel.createdByUserId = record.createdByUserId;
      this.newGroupingModel.updatedByUserId = record.updatedByUserId;
    }
    this.showSidebar4 = true;
  }

  resetValues(send: boolean){
    this.showSidebar4 = false;
  }
  saveChange(record: GroupingViewModel){
    this.grouping = new Grouping();
    this.grouping.idGrouping = -1;
    this.grouping.createdByUserId = -1;
    this.grouping.updatedByUserId = -1;
    this.grouping.idGroupingType = 2;
    this.grouping.abbreviation = record.abbreviation;
    this.grouping.groups = record.groups;
    this._groupingService.insertGrouping(this.grouping).subscribe((data) => { //de lo contrario se insertan
      if (data> 0) {    //si no ocurre algún error
           this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
           this.groupingListViewModel.push(record);
           this.showSidebar4 = false;
      }else if(data == -1) {    //de lo contrario se evalúa (validaciones de otros módulos)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
      }else if(data == -2) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
      }else if(data == -3) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El dispositivo no existe" });
      }else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
      }
        //window.location.reload(); Recarga la página
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
    });  
  }

  groupingChange(value: boolean){
    debugger;
    this.dataGroupingSave.emit(value);
  }

}
