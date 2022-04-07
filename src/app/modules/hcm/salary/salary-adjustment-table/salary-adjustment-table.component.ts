import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
//import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
//import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'app-salary-adjustment-table',
  templateUrl: './salary-adjustment-table.component.html',
  styleUrls: ['./salary-adjustment-table.component.scss']
})
export class SalaryAdjustmentTableComponent implements OnInit {
  permissionsIDs = { ...Permissions };
  @Input() salaryAdjustmentList: any[];
  @Input() salaryAdjustmentType: number;
  @Input() companyId : number; 
  @Input() access : boolean; 


  @Output() recordSave : EventEmitter<any> = new EventEmitter<any>();
  @Output() SelectedOption : EventEmitter<SelectItem> = new EventEmitter<SelectItem>();
  @Output() saveAdjustmentList : EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor(private messageService: MessageService,
              ) { }

  salaryTypeCreate: any;
  //access: boolean = false;

  ngOnInit(): void {
    debugger;
  }

  onEdit(id: number){
    // console.log(this.salaryAdjustmentList);
    this.recordSave.emit(this.salaryAdjustmentList[id]);
  }

  saveAdjustment(){
    debugger;
    this.saveAdjustmentList.emit(true);
  }

}
