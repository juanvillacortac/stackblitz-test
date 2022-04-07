import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoanInstallment } from '../../shared/models/loans/loan-installment';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { Repayment } from '../../shared/models/loans/repayment';
import { DatePipe } from '@angular/common';
import { RedemptionPayment } from '../../shared/models/loans/redemption-payment';
import { CompanyBankAccount } from '../../shared/models/masters/company-bank-account';
import { CompanyBankAccountFilter } from '../../shared/filters/company-bank-account-filter';
import { SelectItem } from 'primeng/api';
import { CompanyBankAccountService } from '../../shared/services/company-bank-account.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/modules/login/shared/auth.service';

@Component({
  selector: 'app-repayment-list',
  templateUrl: './repayment-list.component.html',
  styleUrls: ['./repayment-list.component.scss'],
  providers: [DatePipe]
})
export class RepaymentListComponent implements OnInit {

  @Input() idLoan: number;
  @Input() quotaList: LoanInstallment[]; 
  @Input() visible: boolean;
  @Input() symbolArray: string[];

  permissionsIDs = { ...Permissions };


  @Output() backUnChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() saveRepayment: EventEmitter<Repayment> = new EventEmitter<Repayment>();


  repaymentAmount: number = 0;
  totalRepaymentAmount: number = 0;
  showPanelPayment: boolean = false;

  newRepayment: Repayment = new Repayment();

  redemptionList: RedemptionPayment[] = [];

  bankAccountFilter: CompanyBankAccountFilter = new CompanyBankAccountFilter();
  bankAccountDropdown: SelectItem[] = [];
  _Authservice : AuthService = new AuthService(this._httpClient);

  repaymentListQuota: LoanInstallment[] = [];

  constructor(  public userPermissions: UserPermissions, 
                public datepipe: DatePipe, 
                private _httpClient: HttpClient, 
                private _companyBankAccountService: CompanyBankAccountService) { }

  ngOnInit(): void {
    debugger;
    this.onLoadCompanyBankAccount();
    //this.repaymentListQuota = this.quotaList.slice(0,this.quotaList.length)
    this.quotaList.forEach(element =>{
      if(element.pendingAmount > 0){
        var object = new LoanInstallment();
        object.idLoan = element.idLoan;
        object.idLoanInstallment = element.idLoanInstallment;
        object.idCalendar = element.idCalendar;
        object.idPayrollType = element.idPayrollType;
        object.idStatus = element.idStatus;
        object.repaymentAmount = element.repaymentAmount;
        object.paidAmount = element.paidAmount;
        object.pendingAmount = element.pendingAmount;
        object.repaymentDifference = element.pendingAmount;
        object.payDate = element.payDate;
        object.payrollType = element.payrollType;
        object.status = element.status;
        object.quotaAmount = element.quotaAmount;
        object.conversionPaidAmount = element.conversionPaidAmount;
        object.conversionPendingAmount = element.conversionPendingAmount;
        object.conversionQuotaAmount = element.conversionQuotaAmount;
        //object.quotaAmount = element.quotaAmount;
        this.repaymentListQuota.push(object);
      }
    });
  }

  updateData(aux: number){
    var acum = 0;
    this.repaymentListQuota[aux].repaymentDifference = this.repaymentListQuota[aux].pendingAmount - this.repaymentListQuota[aux].repaymentAmount;
    this.repaymentListQuota.forEach(element =>{
      acum += element.repaymentAmount;
    });
    this.repaymentAmount = this.totalRepaymentAmount - acum;
  }

  outForm(){
    this.repaymentListQuota = null;
    this.backUnChange.emit(false);
  }

  submit(){
    this.newRepayment.idLoan = this.idLoan;
    this.newRepayment.idRepaymentType = 1;
    this.newRepayment.amountRepayment = this.totalRepaymentAmount;
    this.newRepayment.repaymentDate = this.datepipe.transform(new Date(), "yyyy-MM-dd");
    this.newRepayment.quotaList = this.repaymentListQuota;
    this.newRepayment.redemptionPaymentList = this.redemptionList;
    this.saveRepayment.emit(this.newRepayment);
  }

  // sendPanel(){

  // }

  onLoadCompanyBankAccount(){
    this.bankAccountFilter.idCompany = parseInt(this._Authservice.currentCompany);
    this._companyBankAccountService.GetAccountsforPayrollData(this.bankAccountFilter).subscribe((data: CompanyBankAccount[]) => {
      this.bankAccountDropdown = data.map((item)=>(
        {
          label: item.bank+" - "+item.accountNumber,
          value: item.id
        }
      ));
    });
  }

  resetValues(value: boolean){
    this.showPanelPayment = value;
  }

  savePaymentList(list: RedemptionPayment[]){
    debugger;
    var aux = this.totalRepaymentAmount - this.repaymentAmount;
    this.totalRepaymentAmount = 0;
    this.redemptionList = list.slice();
    this.redemptionList.forEach(element => {
      this.totalRepaymentAmount +=  element.paymentAmount;
    });
    this.repaymentAmount = this.totalRepaymentAmount - aux;
    this.showPanelPayment = false;
  }
}
