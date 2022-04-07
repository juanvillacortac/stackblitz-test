import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountingTemplate } from '../../../shared/models/concepts/accounting-template';
import { PayrollCompany } from '../../../shared/models/concepts/payroll-company';
import { PayrollCompanyViewModel } from '../../../shared/view-models/concepts/payroll-company-viewmodel';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'app-accounting-template-table',
  templateUrl: './accounting-template-table.component.html',
  styleUrls: ['./accounting-template-table.component.scss']
})
export class AccountingTemplateTableComponent implements OnInit {

  @Input() accountingList: AccountingTemplate[];
  @Input() company: PayrollCompany;
  @Input() visible: boolean;
  @Output() recordNew: EventEmitter<PayrollCompany> = new EventEmitter<PayrollCompany>();
  @Output() recordEdit: EventEmitter<AccountingTemplate> = new EventEmitter<AccountingTemplate>();
  @Output() recordEnd: EventEmitter<AccountingTemplate> = new EventEmitter<AccountingTemplate>();
  newAccounting: AccountingTemplate;

  permissionsIDs = { ...Permissions };

  constructor(public userPermissions: UserPermissions,) { }

  ngOnInit(): void {
  }

  newDetail(){
    this.recordNew.emit(this.company);
  }

  editDetail(record: AccountingTemplate){
    this.recordEdit.emit(record);
  }

  deleteDetail(record: AccountingTemplate){
    this.recordEnd.emit(record);
  }

}
