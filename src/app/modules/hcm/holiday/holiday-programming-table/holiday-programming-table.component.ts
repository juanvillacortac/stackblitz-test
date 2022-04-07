import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { HolidaysProgramationMassive } from '../../shared/models/holidays/holidays-massive-programation';

@Component({
  selector: 'app-holiday-programming-table',
  templateUrl: './holiday-programming-table.component.html',
  styleUrls: ['./holiday-programming-table.component.scss']
})
export class HolidayProgrammingTableComponent implements OnInit {
  permissionsIDs = { ...Permissions };
  @Input() holidayProgramationList: any[];
  @Input() holidayProgramationType: number;


  @Output() sendPanel : EventEmitter<any> = new EventEmitter<any>();
  @Output() saveAdjustmentList : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() deleteAdjustmentList : EventEmitter<any> = new EventEmitter<any>();


  displayedColumns:ColumnD<HolidaysProgramationMassive>[] = 
     [
       { template: (_segments) => { return _segments.idHolidayProgramation; }, header: 'Id',field:'idHolidayProgramation' ,display: 'none' },
       { template: (_segments) => { return _segments.cycleHolidays; }, header: 'Periodo',field:'cycleHolidays' ,display: 'table-cell' },
       { template: (_segments) => { return _segments.startDate; }, header: 'Inicio',field:'startDate' ,display: 'table-cell' },
       { template: (_segments) => { return _segments.endDate; }, header: 'Fin',field:'endDate' ,display: 'table-cell' },
       { template: (_segments) => { return _segments.payDate; }, header: 'Pago',field:'payDate' ,display: 'table-cell' },
       { template: (_segments) => { return _segments.holidayType; }, header: 'Tipo',field:'updatedByUser' ,display: 'table-cell' },
       { template: (_segments) => { return _segments.status; }, header: 'Estatus',field:'status' ,display: 'table-cell' },
       ];
  constructor(private messageService: MessageService, public userPermissions: UserPermissions, private confirmationService: ConfirmationService,) { }

  salaryTypeCreate: any;

  ngOnInit(): void {
    debugger;
    console.log(this.holidayProgramationList);
    console.log(this.holidayProgramationType);
  }

  onEdit(id: number){
    // console.log(this.holidayProgramming);
    debugger;
    this.sendPanel.emit(this.holidayProgramationList[id]);
  }

  deleted(id: number){
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea eliminar esta programación?',
      accept: () => {
        //this.messageService.add({ severity: 'error', summary: 'Inserción', detail: "Eligio 1" });
        this.deleteAdjustmentList.emit(this.holidayProgramationList[id]);
        // 
      },
       ///// FIN DEL ACCEPT/////
      reject: () => {

      }
    }); 
  }


}
