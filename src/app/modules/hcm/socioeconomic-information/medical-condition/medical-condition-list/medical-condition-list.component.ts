import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { DatePipe } from '@angular/common';
import { MedicalConditionViewModel } from '../../../shared/view-models/medical-condition-viewmodel';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';


@Component({
  selector: 'app-medical-condition-list',
  templateUrl: './medical-condition-list.component.html',
  styleUrls: ['./medical-condition-list.component.scss'],
  providers: [DatePipe]
})
export class MedicalConditionListComponent implements OnInit {

  @Input() _medicalConditionList: MedicalConditionViewModel[] = [];

  @Output() returnData1: EventEmitter<MedicalConditionViewModel> = new EventEmitter<MedicalConditionViewModel>();
  @Output() deletedData1: EventEmitter<MedicalConditionViewModel> = new EventEmitter<MedicalConditionViewModel>();

  newMedicalCondition: MedicalConditionViewModel;
  permissionsIDs = {...Permissions};

  medicalConditionColumns:ColumnD<MedicalConditionViewModel>[] = 
     [
       { template: (_list) => { return _list.patology; }, header: 'Patología',field:'patology' ,display: 'table-cell' },
       { template: (_list) => { return _list.patologyType; }, header: 'Observación',field:'patologyType' ,display: 'table-cell' },
       { template: (_list) => { return _list.startDate; }, header: 'Fecha',field:'startDateString' ,display: 'table-cell' },
       ];

  constructor(public userPermissions: UserPermissions, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    // this.onLoadPatologyTypes();
    // this.onLoadPatologies();
    // this.onLoadMedicalConditionList();
  }



  add(){
    this.newMedicalCondition = new MedicalConditionViewModel();
    this.newMedicalCondition.idMedicalCondition = -1;
    this.returnData1.emit(this.newMedicalCondition);
  }

  edit(record: MedicalConditionViewModel): void{
    console.log(record);
    this.returnData1.emit(record);
  }

  deleted(record: MedicalConditionViewModel): void{
    debugger;
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea eliminar esta afección médica?',
      accept: () => {
        this.deletedData1.emit(record);
      },
      reject: () => {
        
      }
    }); 
  }

}
