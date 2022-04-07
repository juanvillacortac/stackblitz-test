import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoanInstallment } from '../../shared/models/loans/loan-installment';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { Repayment } from '../../shared/models/loans/repayment';
import { DatePipe } from '@angular/common';
import { RedemptionPayment } from '../../shared/models/loans/redemption-payment';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { MotivesFilters } from 'src/app/models/masters/motives-filters';
import { MotivesService } from 'src/app/modules/masters/motives/shared/services/motives.service';
import { MotivesType } from 'src/app/models/masters/motives-type';


@Component({
  selector: 'app-repayment-exemption',
  templateUrl: './repayment-exemption.component.html',
  styleUrls: ['./repayment-exemption.component.scss'],
  providers: [DatePipe]
})
export class RepaymentExemptionComponent implements OnInit {

  @Input() idLoan: number;
  @Input() quotaList: LoanInstallment[]; 
  @Input() visible: boolean;
  @Input() symbolArray: string[];

  permissionsIDs = { ...Permissions };


  @Output() backUnChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() saveRepayment: EventEmitter<Repayment> = new EventEmitter<Repayment>();


  repaymentAmount: number = 0;
  totalRepaymentAmount: number = 0;
  totalRepaymentEdit: number = 0;
  showPanelPayment: boolean = false;

  newRepayment: Repayment = new Repayment();

  redemptionList: RedemptionPayment[] = [];

  motiveFilter: MotivesFilters = new MotivesFilters();
  motiveDropdown: SelectItem[] = [];
  motiveSelect: number = -1;
  _Authservice : AuthService = new AuthService(this._httpClient);

  repaymentListQuota: LoanInstallment[] = [];

  constructor(  public userPermissions: UserPermissions, 
                public datepipe: DatePipe, 
                private messageService: MessageService,
                private motiveService: MotivesService, 
                private confirmationService: ConfirmationService,
                private _httpClient: HttpClient,) { }

  ngOnInit(): void {
    debugger;
    this.onLoadMotive();
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

  onLoadMotive(){
    this.motiveFilter.idMotivesType = 31;
    this.motiveService.getMotives(this.motiveFilter).then((data: MotivesType[]) => {
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      debugger;
      this.motiveDropdown = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
      
   }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Carga de tipo de motivos', detail: "Ha ocurrido un error cargando los motivos"});
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
    this.newRepayment.idRepaymentType = 2;
    this.newRepayment.amountRepayment = this.totalRepaymentAmount;
    this.newRepayment.repaymentDate = this.datepipe.transform(new Date(), "yyyy-MM-dd");
    this.newRepayment.quotaList = this.repaymentListQuota;
    this.newRepayment.idMotive = this.motiveSelect;
    this.newRepayment.redemptionPaymentList = this.redemptionList;
    this.saveRepayment.emit(this.newRepayment);
  }

  // sendPanel(){

  // }

  updateMax(){
    if(this.totalRepaymentAmount < this.totalRepaymentEdit){
      this.repaymentAmount = this.repaymentAmount + (this.totalRepaymentEdit - this.totalRepaymentAmount);
      this.totalRepaymentAmount = this.totalRepaymentEdit;
    }else{
      var acum = 0;
      this.repaymentListQuota.forEach(element =>{
        acum += element.repaymentAmount;
      });
      if(acum > this.totalRepaymentEdit){
        this.confirmationService.confirm({
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          message: 'El monto ingresado es menor a la distribución antes realizada. Se reinicará la distribución ¿Está seguro que desea continuar?',
          accept: () => {
            this.repaymentListQuota.forEach(element =>{
              element.repaymentAmount = 0;
            });
            this.repaymentAmount = this.totalRepaymentEdit;
            this.totalRepaymentAmount = this.totalRepaymentEdit;
          },
          reject: () => {
            this.totalRepaymentEdit = this.totalRepaymentAmount;
          }
        }); 
      }else{
        this.repaymentAmount = this.repaymentAmount + (this.totalRepaymentEdit - this.totalRepaymentAmount);
        this.totalRepaymentAmount = this.totalRepaymentEdit;
      }
    }

    //this.totalRepaymentAmount = this.totalRepaymentEdit;
  }

}
