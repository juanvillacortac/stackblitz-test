import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountingTemplate } from '../../../shared/models/concepts/accounting-template';
import { PayrollCompany } from '../../../shared/models/concepts/payroll-company';
import { PayrollCompanyListService } from '../../../shared/services/concepts/payroll-company-list.service';

@Component({
  selector: 'app-accounting-template-list',
  templateUrl: './accounting-template-list.component.html',
  styleUrls: ['./accounting-template-list.component.scss']
})
export class AccountingTemplateListComponent implements OnInit {


  @Input() accountList: AccountingTemplate[];
  @Input() id: number;
  @Input() name: string;
  @Input() showList: boolean;
  @Output() accountRecord: EventEmitter<AccountingTemplate> = new EventEmitter<AccountingTemplate>();
  @Output() companyData: EventEmitter<any> = new EventEmitter<any>();
  
  newRecord: AccountingTemplate;
  
  
  
  constructor() { }

  ngOnInit(): void {
  }


  newAccount(){
    this.newRecord = new AccountingTemplate();
    this.companyData.emit({id: this.id, name: this.name})
    this.accountRecord.emit(this.newRecord);
  }

  editAccount(record: AccountingTemplate){
    this.accountRecord.emit(record);
  }

}
