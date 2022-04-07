import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Coins } from 'src/app/models/masters/coin';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { LaborRelationshipMinimumFilter } from '../../shared/filters/laborRelationship/labor-relationship-minimum-filter';
import { ConversionRateFilter } from '../../shared/filters/loans/conversion-rate-filter';
import { LoanFilter } from '../../shared/filters/loans/loan-filter';
import { LoanListFilter } from '../../shared/filters/loans/loan-list-filter';
import { LoanTypeFilter } from '../../shared/filters/loans/loan-type-filter';
import { PayrollTypeFilter } from '../../shared/filters/payroll-type-filter';
import { LaborRelationshipMinimum } from '../../shared/models/laborRelationship/labor-relationship-minimum';
import { ConversionRateList } from '../../shared/models/loans/conversion-rate-list';
import { Loan } from '../../shared/models/loans/loan';
import { LoanInstallment } from '../../shared/models/loans/loan-installment';
import { LoanType } from '../../shared/models/loans/loan-type';
import { PayrollType } from '../../shared/models/masters/payroll-type';
import { LaborRelationshipService } from '../../shared/services/labor-relationship.service';
import { LoanService } from '../../shared/services/loans/loan.service';
import { PayrollTypeService } from '../../shared/services/payroll-type.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { Repayment } from '../../shared/models/loans/repayment';
import { RepaymentService } from '../../shared/services/loans/repayment.service';

@Component({
  selector: 'app-loan-detail',
  templateUrl: './loan-detail.component.html',
  styleUrls: ['./loan-detail.component.scss'],
  providers: [DatePipe]
})
export class LoanDetailComponent implements OnInit {

  submitted: boolean = false;
  paymentPlanLocked: number = 1;
  loanSingle: Loan = new Loan;
  filterLoan: LoanFilter = new LoanFilter();

  permissionsIDs = { ...Permissions };
  loanFilter: LoanListFilter[] = [];

  loanTypeFilter: LoanTypeFilter = new LoanTypeFilter();
  loanTypeList: LoanType[] = [];
  loanTypeDropdown: SelectItem[] =[];
  discountStartDate: Date;
  createDate: Date = new Date();
  loanPayDate: Date;

  showPaymentPlan: boolean = false;
  showRepayment: boolean = false;
  showDiscontinue: boolean = false; 
  paid: boolean = false;

  _Authservice : AuthService = new AuthService(this._httpClient);

  loanTypeSelect: number = -1;
  currencySelect: number = -1;
  rateSelect: number = 0;
  symbolCoin1: string = "";
  symbolCoin2: string = "";

  coinArray: Coins[] = [];

  coinFilter: CoinxCompanyFilter = new CoinxCompanyFilter();
  coinDropdown: SelectItem[] = [];
  rateDropdown: SelectItem[] = [];
  ConversionRateFilter: ConversionRateFilter = new ConversionRateFilter();

  newQuota: LoanInstallment;

  repaymentType: number;
  titlePanel: string = ""

  payrollTypeFilter: PayrollTypeFilter = new PayrollTypeFilter();
  payrollTypeList: PayrollType[] = [];
  _PayrollTypeList: PayrollType[] = [];

  userId: number;
  laborRelationshipMinimumFiltersSearch: LaborRelationshipMinimumFilter = new LaborRelationshipMinimumFilter();
  employmentList: SelectItem[]= [];
  dataSave: boolean = false;
  symbolCoinArray: string[] = [];
  //paymentList: any[];
  buttonSavePlan: boolean = true;

  constructor(  private activatedRoute: ActivatedRoute,
                private router: Router,
                private _payrollTypeService: PayrollTypeService,
                public _Currency: CoinsService,
                public userPermissions: UserPermissions,
                public datepipe: DatePipe,
                private confirmationService: ConfirmationService,
                public _laborRelationshipService: LaborRelationshipService,
                private _httpClient: HttpClient,
                public messageService: MessageService,
                private _loanService: LoanService,
                private _repaymentService: RepaymentService,) 

              { 
                this.userId = Number(this._Authservice.idUser)
              }

  ngOnInit(): void {
  
    var filters = this.activatedRoute.snapshot.queryParamMap.get('loanFilter');
    // 
    if (filters!=undefined) {
      const loanFilter = filters;
      if (loanFilter === null) {
        this.loanFilter = [];
      } else {
        this.loanFilter = JSON.parse(loanFilter);
        sessionStorage.setItem('searchParameters', loanFilter)
      }
    }else{
      this.loanFilter = JSON.parse(sessionStorage.getItem('searchParameters'));
    }
    
    var url = this.router.url.substring(0, this.router.url.indexOf('?')) == "" ? this.router.url : this.router.url.substring(0, this.router.url.indexOf('?'));
    this.router.navigateByUrl(url);

    this.loadEmployments();
    this.loadLoanTypes();
    this.loadCurrency();
  }


  onLoadPayrollTypes(){
    this.payrollTypeFilter.idCompany = parseInt(this._Authservice.currentCompany);
    this._payrollTypeService.GetPayrollTypes(this.payrollTypeFilter).subscribe((data) =>{
      this._PayrollTypeList = data;
      this.loadData();
   },
   (error) => {
     this.messageService.add({severity: 'error', summary: 'Carga de tipo de nómina', detail: 'Error al cargar los tipos de nómina'});
    });
  }

  loadLoanTypes(){
    this.loanTypeFilter.idCompany = parseInt(this._Authservice.currentCompany);
    this._loanService.getLoanType(this.loanTypeFilter).subscribe( (data: LoanType[]) => {
      if (data != null) {
        this.loanTypeDropdown = data.map((item)=>(
            {
              value: item.idLoanType,
              label: item.name
            }
        ));
    }
      this.loanTypeDropdown.sort((a, b) => a.label.localeCompare(b.label))
    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Cargar tipo de prestamos', detail: 'Error al cargar los tipos de prestamos'});
    });
  }

  loadCurrency(){  
    this.coinFilter.idCompany = parseInt(this._Authservice.currentCompany);
    this._Currency.getCoinxCompanyList(this.coinFilter).subscribe((valor: Coins[]) => {
      this.coinArray = valor;
      this.coinDropdown = valor.map<SelectItem>((item) => ({
        value: item.id,
        label: item.name
      }));
      this.coinDropdown.sort((a, b) => a.label.localeCompare(b.label));
      this.onLoadPayrollTypes();
      //this.coinDropdown.push({value: -1, label:'Todos'});
      //this.coinDropdown.sort((a, b) => { if(a.label < b.label || a.value == -1){return -1} if(a.label > b.label){return 1} return 0});
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error" });
    });
  }

  loadData(){
    this.filterLoan.idLoan = parseInt(sessionStorage.getItem('idLoanList'));
    if(this.filterLoan.idLoan != -1){
      this._loanService.getLoan(this.filterLoan).subscribe((data: Loan) => {
        this.loanSingle = data;
        this.currencySelect = this.loanSingle.idCurrency;
        this.payrollTypeList = this._PayrollTypeList.filter(x => x.currency == this.currencySelect);
        let aux = {value: this.loanSingle.idCurrency};
        this.selectCurrency(aux);
        this.rateSelect = this.loanSingle.conversionFactor;
        this.createDate = new Date(this.loanSingle.createDate);
        this.discountStartDate = new Date(this.loanSingle.discountStartDate);
        this.loanPayDate = new Date(this.loanSingle.loanPayDate);
        if(this.loanSingle.quotaList.length != 0){
          this.paymentPlanLocked = 3;
          this.buttonSavePlan = false;
          var cont = 0;
          while(cont < this.loanSingle.quotaList.length && !this.paid){
            if(this.loanSingle.quotaList[cont].paidAmount > 0){
              this.paid = true;
            }
            cont++;
          }    
        }else{
          this.paymentPlanLocked = 2;
        }
        this.dataSave = true;
      })
    }
  }

  loadEmployments() {
    this.laborRelationshipMinimumFiltersSearch = {
      idLaborRelationship: -1,
      idUser: this.userId,
      idCompany: parseInt(this._Authservice.currentCompany),
      branchOfficeId: -1,
      employmentCode: '',
      employeeName: '',
      employmentDate: "1900-01-01",
      seniorityDate: "1900-01-01",
      idEstatus: 35,
      idPayrollClass: -1,
      idTypeDocument: -1,
    }
    this._laborRelationshipService.GetLaborRelationshipMinimum(this.laborRelationshipMinimumFiltersSearch).subscribe((data: LaborRelationshipMinimum[]) => {
      this._laborRelationshipService._laborRelationshipMinimumList = data;
      this.employmentList = data.sort((a, b) => a.documentNumber.localeCompare(b.documentNumber)).map<SelectItem>((item) => ({
        value: item.idLaborRelationship,
        label: item.employmentCode +"-"+ item.identifier +""+ item.documentNumber +"-"+ item.employeeName, 
        }));
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los trabajadores." });
    });
  }

  loadPaymentPlan(planList: LoanInstallment[]){
    this.loanSingle.quotaList = planList;
    this.showPaymentPlan = false;
    this.paymentPlanLocked = 3;
  }

  sendPanel(record: LoanInstallment){
    this.showPaymentPlan = true;
  }

  resetValues(value: boolean){
    this.showPaymentPlan = value;
    this.showRepayment = value;
    this.showDiscontinue = value;
  }

  selectCurrency(e){
    this.ConversionRateFilter.idCompany = parseInt(this._Authservice.currentCompany);
    this._loanService.getConversionRate(this.ConversionRateFilter).subscribe( (data: ConversionRateList[]) => {
      var rates = data.find(x => x.idCurrency == e.value);
      if (rates != null) {
        this.rateDropdown = rates.list.map((item)=>(
            {
              value: item.conversionFactor,
              label: item.name
            }
        ));
      }
      this.rateDropdown.sort((a, b) => a.label.localeCompare(b.label));
      this.symbolCoin1 = this.coinArray.find(x => x.id == e.value).symbology;
      this.symbolCoin2 = this.coinArray.find(x => x.id != e.value).symbology;
      this.symbolCoinArray = [this.symbolCoin1, this.symbolCoin2]
      this.payrollTypeList = this._PayrollTypeList.filter(x => x.currency == this.currencySelect);
      if(this.loanSingle.idCurrency == e.value){
        this.rateSelect = this.loanSingle.conversionFactor;
      }else{
        this.rateSelect = 0;
        this.selectRate(0);
      }

    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Cargar tasas', detail: 'Error al cargar las tasas de conversión'});
    });
  }

  selectRate(e){
    this.loanSingle.conversionFactor = this.rateSelect;
    this.loanSingle.conversionAmount = this.loanSingle.amount * this.loanSingle.conversionFactor;
    this.amountChange(e);
    this.loanSingle.conversionQuotaAmount = this.loanSingle.quotaAmount * this.loanSingle.conversionFactor;
  }

  amountChange(e){
    this.loanSingle.conversionAmount = this.loanSingle.amount * this.loanSingle.conversionFactor;
    this.interestRateChange(e);
  }

  interestRateChange(e){
    this.loanSingle.interestRateAmount = (this.loanSingle.interestRate / 100) * this.loanSingle.amount;
    this.loanSingle.conversionInterestRateAmount = this.loanSingle.interestRateAmount * this.loanSingle.conversionFactor;
    this.loanSingle.loanAmount = this.loanSingle.amount + this.loanSingle.interestRateAmount;
    this.loanSingle.conversionLoanAmount = this.loanSingle.conversionAmount + this.loanSingle.conversionInterestRateAmount;
    this.calculateQuotaAmount();
  }

  shareAmountChange(e){
    this.loanSingle.conversionQuotaAmount = this.loanSingle.quotaAmount * this.loanSingle.conversionFactor;
    this.calculateQuotaAmount();
  }

  calculateQuotaAmount(){
    this.loanSingle.quotasAmount = Math.ceil(this.loanSingle.loanAmount / this.loanSingle.quotaAmount);
    if(isNaN(this.loanSingle.quotasAmount) || !isFinite(this.loanSingle.quotasAmount)){
      this.loanSingle.quotasAmount = 0;
    }
    if(this.loanSingle.quotaList.length == 0){
      if(this.currencySelect != -1 && this.rateSelect != -1 && this.loanSingle.amount > 0 
        && this.loanSingle.amount != undefined && this.loanSingle.interestRate >= 0 && this.loanSingle.interestRate != undefined && this.loanSingle.quotaAmount > 0 
        && this.loanSingle.quotaAmount != undefined)
      {
        this.paymentPlanLocked = 2;
      }else{
        this.paymentPlanLocked = 1;
      }
    }
  }

  sendRepayment(type: number){
    this.repaymentType = type;
    this.showRepayment = true;
  }

  ///// Guardar ajuste /////
  submit(){
    if(this.currencySelect == -1 || this.rateSelect == -1 || this.loanSingle.amount <= 0 
      || this.loanSingle.amount == undefined || this.loanSingle.interestRate < 0 || this.loanSingle.interestRate == undefined || this.loanSingle.quotaAmount <= 0 
      || this.loanSingle.quotaAmount == undefined
      || this.loanSingle.idLaborRelationship == -1 || this.loanSingle.idLoanType == -1 || this.loanSingle.createDate == null || this.loanSingle.loanPayDate == null || this.loanSingle.discountStartDate == null)
    {
      this.submitted = true;
    }else{
      if(this.loanSingle.idLoan == -1){
        this.loanSingle.idCompany = parseInt(this._Authservice.currentCompany);
      }
      //this.loanSingle.idLoanType = this.loanTypeSelect;
      this.loanSingle.createDate = this.datepipe.transform(this.createDate, "yyyy-MM-dd");
      this.loanSingle.loanPayDate = this.datepipe.transform(this.loanPayDate, "yyyy-MM-dd");
      this.loanSingle.discountStartDate = this.datepipe.transform(this.discountStartDate, "yyyy-MM-dd");
      this.loanSingle.idCurrency = this.currencySelect;
      this.loanSingle.idConversionCurrency = this.coinDropdown.find(x => x.value != this.currencySelect).value;
      this.loanSingle.currency = this.coinDropdown.find(x => x.value == this.currencySelect).label;
      this.loanSingle.idStatus = this.loanSingle.quotaList.length > 0 ? 95 : 0;
      this.loanSingle.status = this.loanSingle.quotaList.length > 0 ? "Pendiente" : "Borrador";
      this._loanService.insertLoan(this.loanSingle).subscribe((data) => { //de lo contrario se insertan
        if (data > 0) {    //si no ocurre algun error
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
            // if(this.loanSingle.quotaList.length > 0){
            // }
            sessionStorage.setItem('idLoanList', data.toString());
            var url = "hcm/loan-detail-generalsection/"+data.toString();
            this.router.navigateByUrl(url);
            this.loadData();
            this.dataSave = true;
        }else if(data == -1) {    //de lo contrario se evalua (validaciones de otros módulos)
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
        }else if(data == -2) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
        }else if(data == -3) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El dispositivo no existe" });
        }else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
        }
          //window.location.reload(); Recarga la pagina
      }, () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
      });  
    }
  }

  //// Regresar a listado de prestamos /////
  returnBack(){
    const queryParams: any = {};
      queryParams.loanFilter = JSON.stringify(this.loanFilter);
      const navigationExtras: NavigationExtras = {
        queryParams
      };
      sessionStorage.removeItem('idLoanList');
      this.router.navigate(['hcm/loan/loan-list'], navigationExtras)
  }

  //// Guardar Amortizacion ////
  saveRepaymentRecord(record: Repayment){
    this._repaymentService.insertRepayment(record).subscribe((data) => { //de lo contrario se insertan
      if (data > 0) {    //si no ocurre algun error
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
        this.showRepayment = false;
        this.paid = true;
        this.loadData();
      }else if(data == -1) {    //de lo contrario se evalua (validaciones de otros módulos)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
      }else if(data == -2) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
      }else if(data == -3) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El dispositivo no existe" });
      }else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
      }
        //window.location.reload(); Recarga la pagina
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
    });  
  }

  ///Modificar ajuste ///
  updateData(){
    if(this.loanSingle.quotaList.length != 0){
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        message: 'Se habilitará los campos del ajuste, pero se eliminará el plan de pago existente ¿Está seguro que desea continuar?',
        accept: () => {
          this.dataSave = false;
          this.loanSingle.quotaList = [];
          this.buttonSavePlan = true;
          this.paymentPlanLocked = 2;
        },
        reject: () => {
          
        }
      }); 
    }else{
      this.dataSave = false;
    }
  }

  //// Guardar plan de pago /////
  savePaymentPlan(list: LoanInstallment[]){
    this.loanSingle.quotaList = list;
    this._loanService.insertPaymentPlan(this.loanSingle).subscribe((data) => { //de lo contrario se insertan
      if (data > 0) {    //si no ocurre algun error
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
          // if(this.loanSingle.quotaList.length > 0){
          // }
          this.buttonSavePlan = false;
          this.dataSave = true;
          this.loadData();
      }else if(data == -1) {    //de lo contrario se evalua (validaciones de otros módulos)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
      }else if(data == -2) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
      }else if(data == -3) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El dispositivo no existe" });
      }else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
      }
        //window.location.reload(); Recarga la pagina
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
    });  
  }

}
