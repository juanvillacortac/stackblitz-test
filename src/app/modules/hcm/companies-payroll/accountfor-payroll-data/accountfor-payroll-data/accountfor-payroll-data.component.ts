import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { AccountforPayrollData } from '../../../shared/models/laborRelationship/accountforpayrolldata';

@Component({
  selector: 'app-accountfor-payroll-data',
  templateUrl: './accountfor-payroll-data.component.html',
  styleUrls: ['./accountfor-payroll-data.component.scss']
})

export class AccountforPayrollDataComponent implements OnInit {

 
  @Input() bankAccountsList: AccountforPayrollData[];
  clonedAccountforPayrollData: { [s: string]: AccountforPayrollData; } = {};
  
  newAccountforPayrollData: AccountforPayrollData;
  disabledSave: number = 0;

  @Output() returnData: EventEmitter<AccountforPayrollData> = new EventEmitter<AccountforPayrollData>();
  @Output() saveData: EventEmitter<AccountforPayrollData[]> = new EventEmitter<AccountforPayrollData[]>();

  constructor(private messageService: MessageService) { }

   permissionsIDs = {...Permissions};

  ngOnInit(): void {
  }

  add(){
    this.newAccountforPayrollData = new AccountforPayrollData();
    this.returnData.emit(this.newAccountforPayrollData);
  }

  edit(record: AccountforPayrollData){
    this.returnData.emit(record);
  }
  // onRowEditInit(record: AccountforPayrollData) {
  //   // this.clonedAccountforPayrollData[record.id] = {...record};
  //   this.disabledSave++;
  // }

  // onRowEditSave(record: AccountforPayrollData) {
  //   //debugger;
  //   var error: boolean = false;
  //   if(record.indActive && record.accountNumber == ""){
  //     error = true;
  //     this.messageService.add({ severity: 'error', summary: 'Error', detail: "El campo número de cuenta es requerido" });
  //   }

  //   // if(!record.indActive && record.assignedValue != ""){
  //   //   error = true;
  //   //   this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe presionar el indicador para asociar la agrupación" });
  //   // }
  
  //   if(!error){
  //     delete this.clonedAccountforPayrollData[record.accountforPayrollDataId];
  //   }
  //   this.disabledSave--;
  // }

  // onRowEditCancel(record: AccountforPayrollData, index: number) {
  //   this.bankAccounts[index] = this.clonedAccountforPayrollData[record.accountforPayrollDataId];
  //   delete this.clonedAccountforPayrollData[record.accountforPayrollDataId];
  //   this.disabledSave--;
  // }



}
