import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { PaymentScheduleListFilter } from '../../shared/filters/loans/payment-schedule-list-filter';
import { Loan } from '../../shared/models/loans/loan';
import { LoanInstallment } from '../../shared/models/loans/loan-installment';
import { PayrollType } from '../../shared/models/masters/payroll-type';
import { LoanService } from '../../shared/services/loans/loan.service';


@Component({
  selector: 'app-loan-installment-panel',
  templateUrl: './loan-installment-panel.component.html',
  styleUrls: ['./loan-installment-panel.component.scss']
})
export class LoanInstallmentPanelComponent implements OnInit {


 // @Input() record: LoanInstallment;
 
  @Input() loan: Loan;
  @Input() visible: boolean;
  @Input() payrollTypeList: PayrollType[];
  @Input() symbolArray: string[];

  @Output() backUnChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() paymentPlanPreview: EventEmitter<LoanInstallment[]> = new EventEmitter<LoanInstallment[]>();

  newObject: any;
  paymentList: any[] = [];
  dataComplete: boolean = false;
  submitted: boolean = false;
  idCompany: number;
  _Authservice : AuthService = new AuthService(this._httpClient);
  quotaNumber: number;
  payrollTypesDropdown: SelectItem[] = [];
  payrollTypeSlect: number = -1;
  maxQuota: number = 0;
  //maxAmount: number = 0;
  editQuotaAmount: number = 0;
  editIdPayrollType: number = -1;
  newQuotaList: LoanInstallment[] = [];
  quota: LoanInstallment;

  requestList: PaymentScheduleListFilter = new PaymentScheduleListFilter();

  paymentPlanList: any[];

  shareAmount: number;

  constructor(private _loanService: LoanService, private _httpClient: HttpClient, private messageService: MessageService,) { }

  ngOnInit(): void {
    this.idCompany = parseInt(this._Authservice.currentCompany);
    this.onLoadPayrolltype();
    this.maxQuota = this.loan.quotasAmount;
    this.shareAmount = this.loan.quotaAmount;
    //this.initialList();
  }

  onLoadPayrolltype(){
    this.payrollTypesDropdown = this.payrollTypeList.map<SelectItem>((item)=>(
        {
          value: item.id,
          label: item.name
        }
    ));
    this.payrollTypesDropdown.sort((a, b) => a.label.localeCompare(b.label));;
  }

  outForm(){
    this.backUnChange.emit(false);
  }

  inputComplete(){
    if(this.loan.quotasAmount!= undefined && this.loan.quotasAmount > 0 && this.quotaNumber!= undefined &&this.quotaNumber > 0  && this.payrollTypeSlect > 0){
      this.dataComplete = true;
    }else{
      this.dataComplete = false;
    }
  }

  addQuota(){
    var position = 0;
    var object = {
      idPayrollType: this.payrollTypeSlect,
      payrollType: this.payrollTypesDropdown.find(x => x.value == this.payrollTypeSlect).label,
      quotaNumber: this.quotaNumber,
      quotaAmount: this.shareAmount,
      sum: this.quotaNumber*this.shareAmount,
    }
    if(this.editIdPayrollType == -1){
      this.paymentList.push(object);
    }else{
      position = this.paymentList.findIndex(x => x.idPayrollType == this.editIdPayrollType);
      this.paymentList.splice(position, 1, object);
    }
    
    this.payrollTypesDropdown = this.payrollTypesDropdown.filter(x => x.value != object.idPayrollType);
    this.maxQuota -= this.quotaNumber;
    this.payrollTypeSlect = -1;
    this.quotaNumber = null;
    this.editIdPayrollType = -1;
    this.editQuotaAmount = 0;
  }

  edit(record: any){
    this.maxQuota -= this.editQuotaAmount;
    this.payrollTypesDropdown = this.payrollTypesDropdown.filter(x => x.value != this.editIdPayrollType);
    this.editIdPayrollType = record.idPayrollType;
    this.editQuotaAmount = record.quotaNumber;
    this.maxQuota += this.editQuotaAmount;
    this.quotaNumber = record.quotaNumber;
    var addSelect = this.payrollTypeList.find(x => x.id == this.editIdPayrollType);
    var option = {value: addSelect.id, label: addSelect.name};
    this.payrollTypesDropdown.push(option);
    this.payrollTypesDropdown.sort((a, b) => a.label.localeCompare(b.label));;
    this.payrollTypeSlect = record.idPayrollType;
  }

  submit(){
    var cont = 0;
    debugger;
    this.paymentList.forEach(element =>{
      cont += element.quotaNumber;
    });
    if(cont < this.loan.quotasAmount){
      this.messageService.add({ severity: 'error', summary: 'Crear plan de pago', detail: "Faltan cuotas por asociar al plan de pago" });
    }else{
      this.requestList.list = "";
      this.paymentPlanList = [];
      this.paymentList.forEach(element =>{
        var object = {
          IdTipoNomina: element.idPayrollType,
          CantidadCuotas: element.quotaNumber,
          FechaInicio: this.loan.discountStartDate
        }
        this.paymentPlanList.push(object);
      });
      this.requestList.list = JSON.stringify(this.paymentPlanList);
      this._loanService.getPaymentSchedule(this.requestList).subscribe((data: LoanInstallment[]) => {
        this.newQuotaList = data;
        if(this.newQuotaList.length < this.loan.quotasAmount){
          var nominas = []
          this.paymentList.forEach(element =>{
            var filter = []
            filter = this.newQuotaList.filter(x => x.idPayrollType == element.idPayrollType);
            if(filter.length < element.quotaNumber){
              nominas.push(element.payrollType);
            }
          });
          if(nominas.length == 1){
          this.messageService.add({ severity: 'error', summary: 'Crear plan de pago', detail: "El plan de pago no puede crearse porque faltan fechas en el calendario de nómina: "+nominas[0] });
          }else{
            this.messageService.add({ severity: 'error', summary: 'Crear plan de pago', detail: "El plan de pago no puede crearse porque faltan fechas en los calendarios de nómina: "+nominas.join()});
          }
        }else{
          var aux = this.loan.loanAmount;
          this.newQuotaList.forEach(element => {
            element.idLoanInstallment = -1;
            element.idLoan = this.loan.idLoan;
            element.idStatus = 95;
            element.status = "Pendiente";
            element.quotaAmount = this.shareAmount;
            element.paidAmount = 0;
            element.pendingAmount = this.shareAmount;
            element.conversionQuotaAmount = element.quotaAmount*this.loan.conversionFactor;
            element.conversionPaidAmount =  element.paidAmount*this.loan.conversionFactor;
            element.conversionPendingAmount = element.pendingAmount*this.loan.conversionFactor;
            aux -= this.shareAmount;
            if(aux < this.shareAmount){
              this.shareAmount = aux;
            }
          });
          this.paymentPlanPreview.emit(this.newQuotaList);
        }
      });
    }
    /////validaciones
    
  }
}
