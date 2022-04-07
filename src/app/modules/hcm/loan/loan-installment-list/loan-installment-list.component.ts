import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoanInstallment } from '../../shared/models/loans/loan-installment';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'app-loan-installment-list',
  templateUrl: './loan-installment-list.component.html',
  styleUrls: ['./loan-installment-list.component.scss']
})
export class LoanInstallmentListComponent implements OnInit {

  constructor(public userPermissions: UserPermissions,) { }

  @Input() paymentPlan: LoanInstallment[];
  @Input() lockedButton: number;
  @Input() symbolArray: string[];
  @Input() visibleButton: boolean;

  @Output() SendPanelLoan: EventEmitter<LoanInstallment> = new EventEmitter<LoanInstallment>();
  @Output() SavePlanList: EventEmitter<LoanInstallment[]> = new EventEmitter<LoanInstallment[]>();


  permissionsIDs = { ...Permissions };

  ngOnInit(): void {
  }

  create(){
    var object = new LoanInstallment();
    this.SendPanelLoan.emit(object);
  }

  submit(){
    this.SavePlanList.emit(this.paymentPlan);
  }

}
