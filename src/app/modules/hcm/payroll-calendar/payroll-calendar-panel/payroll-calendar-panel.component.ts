import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DateAdapter } from 'angular-calendar';
import * as moment from 'moment';
import { MessageService, ConfirmationService, SelectItem } from 'primeng/api';
import { TTBody } from 'primeng/treetable';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { ColumnD } from 'src/app/models/common/columnsd';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { PayrollCalendarFilter } from '../../shared/filters/payroll-calendar-filter';
import { PayrollTypeFilter } from '../../shared/filters/payroll-type-filter';
import { PayrollCalendar } from '../../shared/models/masters/payroll-calendar';
import { PayrollCalendarDetail } from '../../shared/models/masters/payroll-calendar-detail';
import { PayrollType } from '../../shared/models/masters/payroll-type';
import { PayrollCalendarService } from '../../shared/services/payroll-calendar.service';
import { PayrollTypeService } from '../../shared/services/payroll-type.service';
import { PayrollCalendarDetailViewModel } from '../../shared/view-models/payroll-calendar-detail-viewmodel';

@Component({
  selector: 'app-payroll-calendar-panel',
  templateUrl: './payroll-calendar-panel.component.html',
  styleUrls: ['./payroll-calendar-panel.component.scss']
})
export class PayrollCalendarPanelComponent implements OnInit {
  @Input() showDialog: boolean;
  @Input() year: number;
  @Input() payrollType: number;
  @Input() tope: string;
  @Output() backUnChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  permissionsIDs = { ...Permissions };

  checkedAllYear: boolean = false

  payDay: number = 0;
  dayB: Date /*to set the business day on the start date*/ 
  startDate: Date; 
  endDate: Date;
  paymentDate: Date;
  paymentMaxDate: Date;
  selectPayrollType: number;
  
  _Authservice : AuthService = new AuthService(this._httpClient);
  payrolCalendar: PayrollCalendar = new PayrollCalendar();
  payrollcalendarlist = [] as PayrollCalendarDetailViewModel[];
  payrollcalendarPreviuos = [] as PayrollCalendarDetail[];
  payrollcalendarPreviuosFilter: PayrollCalendarFilter = new  PayrollCalendarFilter();
  periodicity: number; 
  listPayrollType: PayrollType [] = [];
  
  periods: PayrollCalendarDetail[] = [];
  payrollTypelist : SelectItem[];

  payrollTypeFilter: PayrollTypeFilter = new PayrollTypeFilter();
  payrollTypeSlect: PayrollType [] = []
  
  private toDate = (str: string | Date) => {
    const d = new Date(str)
    const padLeft = (n: number) => ("00" + n).slice(-2)
    const dformat = [
      d.getFullYear(),
      padLeft(d.getMonth() + 1),
      padLeft(d.getDate())
    ].join('-');
    return dformat
  }

  displayedColumns: ColumnD<PayrollCalendarDetailViewModel>[] =
  [
   {template: (data) => { return data.payrollType; }, field: 'payrollType', header: 'Nómina', display: 'table-cell'},
  // {field: 'activo', header: 'Estatus', display: 'table-cell' },
   {template: (data) => { return data.year; }, field: 'year', header: 'Año', display: 'table-cell'},
   {template: (data) => { return data.period; }, field: 'period', header: 'Periodo', display: 'table-cell'},
   {template: (data) => {return data.startDateString}, field: 'starDate', header: 'Inicio', display: 'table-cell'},
   {template: (data) => {return data.finishDateString}, field: 'finishDate', header: 'Fin', display: 'table-cell'},
   {template: (data) => {return data.paymentDateString}, field: 'paymentDate', header: 'Pago', display: 'table-cell'},
  ];
  
  constructor(
    private messageService: MessageService,
    private _payrolltypeService: PayrollTypeService,
    public datepipe: DatePipe,
    private _httpClient: HttpClient,
    private _payrollCalendarService :PayrollCalendarService,
    public userPermissions: UserPermissions    ) { }

  ngOnInit(): void {
    this.onLoadPayrolltype();
    this.setStarDate();
    console.log(this.tope);
  }
  
  onLoadPayrolltype(){
    this.payrollTypeFilter.idCompany = parseInt(this._Authservice.currentCompany);
    this._payrolltypeService.GetPayrollTypes(this.payrollTypeFilter).subscribe((data) =>{
      this.listPayrollType = data.sort((a, b) => a.name.localeCompare(b.name));
      this.payrollTypelist = this.listPayrollType.map<SelectItem>((item) => ({
        value: item.id,
        label: item.name
      }));

      this.loadPeriodicity();

    })
  }

  setStarDate(){
    
    let topEndDate = new Date(this.tope);
    let compareDate = new Date(this.year,0,1);
    if(topEndDate >= compareDate){
      this.dayB = new Date(topEndDate);
      this.dayB.setDate(this.dayB.getDate() + 1);
      this.dayB.setMinutes(this.dayB.getMinutes() + this.dayB.getTimezoneOffset());  //evita que la fecha disminuya un dia
      this.startDate = new Date(topEndDate);
      this.startDate.setDate(this.startDate.getDate() + 1);
      this.startDate.setMinutes(this.startDate.getMinutes() + this.startDate.getTimezoneOffset());  //evita que la fecha disminuya un dia
    }else{
      this.dayB = new Date(this.year, 0, 1);
      this.startDate = new Date(this.year, 0, 1);
    }
    this.setEndDay(this.startDate);
  }
  
  setEndDay(event){
    this.endDate = new Date(event);
    this.endDate.setDate(event.getDate() + this.periodicity -1);
    this.endDate.setMinutes(this.endDate.getMinutes() + this.endDate.getTimezoneOffset());  //evita que la fecha disminuya un dia
    this.paymentDate = new Date(event);
    this.paymentDate.setDate(event.getDate() + this.periodicity -1);
    this.paymentDate.setMinutes(this.paymentDate.getMinutes() + this.paymentDate.getTimezoneOffset());  //evita que la fecha disminuya un dia
    this.paymentMaxDate = new Date(this.endDate);
    this.paymentMaxDate.setDate(this.endDate.getDate() + this.periodicity);
    this.paymentMaxDate.setMinutes(this.paymentMaxDate.getMinutes() + this.paymentMaxDate.getTimezoneOffset());  //evita que la fecha disminuya un dia
    this.setPaymentDate();
  }

  setPaymentDate(){
    let fecha1 = moment(this.startDate);
    let fecha2 = moment(this.paymentDate);
    var time1 = moment(this.startDate).format('YYYY-MM-DD');
    var time2 = moment(this.paymentDate).format('YYYY-MM-DD');
    // // var tiempo = event.getTime() - this.startDate.getTime(); 
    // // this.payDay = Math.floor(tiempo / (1000 * 60 * 60 * 24) + 1) ;

    if (time2 < time1 ){
      this.setEndDay(this.startDate)
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "La fecha de pago no puede ser menor a la fecha de Inicio" });
    }else{
      this.payDay = fecha2.diff(fecha1, 'days') + 1;
    }
    
  }
  loadPeriodicity(){
    var payrollTypeSelectperiodicity = new PayrollType();
    payrollTypeSelectperiodicity = this.listPayrollType.find(x => x.id == this.payrollType);
    this.periodicity = payrollTypeSelectperiodicity.periodicity;
  }

  // setPayDate(event) {
  //   if(event.value <= this.periodicity) {
  //     this.paymentDate = new Date(this.endDate);
  //     this.paymentDate.setDate(this.paymentDate.getDate() + event.value);
  //   }else{
  //     this.paymentDate = this.endDate;
  //     this.payDay = 0;
  //     this.messageService.add({ severity: 'error', summary: 'Error', detail: "La fecha de pago no puede ser mayor al periodo de pago de la nómina " });
  //   }
  // }

  
  addPeriod(){ // Function Create the list period all year
    const endYear = new Date(this.year, 11, 31);  
    var payrollTypeString = this.listPayrollType.find(x => x.id == this.payrollType).name;
    if(this.checkedAllYear == true){
      this.periods = [];
      this.payrollcalendarlist = [];
      var i = new Date(this.startDate);
      var auxEndDate= new Date(this.endDate)
      var auxStartDate = new Date(this.startDate)
      var auxPaymentDate = new Date(this.paymentDate)
      var p = 0;
      while (i <= endYear) {
        let segmen = {

          id: -1,
          idPayrollTypeDetail: this.payrollType,
          payrollType: payrollTypeString,
          idCurrency: -1,
          currency: '',
          year: this.year,
          numMonday: -1,
          period: p + 1,
          conversionFactor: -1,
          indMultiply: true,
          startDate: this.toDate(auxStartDate),
          finishDate: this.toDate(auxEndDate),
          paymentDate: this.toDate(auxPaymentDate),
          idStatus: -1,
          paymentDay: 0,
          status: '',
          userCreate: '',
          userUpdate: '',
        };

        auxStartDate.setMinutes(auxStartDate.getMinutes() + auxStartDate.getTimezoneOffset());
        auxEndDate.setMinutes(auxEndDate.getMinutes() + auxEndDate.getTimezoneOffset());
        auxPaymentDate.setMinutes(auxPaymentDate.getMinutes() + auxPaymentDate.getTimezoneOffset());
        let segmenViewModel = {
          
          id: -1,
          idPayrollTypeDetail: this.payrollType,
          payrollType: payrollTypeString,
          idCurrency: -1,
          currency: '',
          year: this.year,
          numMonday: -1,
          period: p + 1,
          conversionFactor: -1,
          indMultiply: true,
          startDate: this.toDate(auxStartDate),
          finishDate: this.toDate(auxEndDate),
          paymentDate: this.toDate(auxPaymentDate),
          idStatus: -1,
          paymentDay: 0,
          status: '',
          userCreate: '',
          userUpdate: '',
          startDateString: this.datepipe.transform(auxStartDate,'dd/MM/yyyy'),
          finishDateString: this.datepipe.transform(auxEndDate,'dd/MM/yyyy'),
          paymentDateString: this.datepipe.transform(auxPaymentDate,'dd/MM/yyyy'),
        };
        this.periods.push(segmen);
        this.payrollcalendarlist.push(segmenViewModel);
        let aux = new Date(auxEndDate);
        auxStartDate = new Date(aux);
        auxStartDate.setDate(auxStartDate.getDate() + 1); //Are assigned a startdaye the finish date + 1.
        auxEndDate = new Date(aux);
        auxEndDate.setDate(auxEndDate.getDate() + this.periodicity);
        auxPaymentDate= new Date(auxStartDate);
        auxPaymentDate.setDate(auxPaymentDate.getDate() + this.payDay - 1);
        i= new Date(auxStartDate);
        p = p + 1
      }
    }

  }
  
  save(){
    if(this.checkedAllYear == false){
      this.periods = [];
      var payrollTypeString = this.listPayrollType.find(x => x.id == this.payrollType).name;
      let p = 0;
      let segmen = [{
      id: -1,
      idPayrollTypeDetail: this.payrollType,
      payrollType: payrollTypeString,
      idCurrency: -1,
      currency: '',
      year: this.year,
      numMonday: -1,
      period: p + 1,
      conversionFactor: -1,
      indMultiply: true,
      startDate: this.toDate(this.startDate),
      finishDate: this.toDate(this.endDate),
      paymentDate: this.toDate(this.paymentDate),
      idStatus: -1,
      paymentDay: 0,
      status: '',
      userCreate: '',
      userUpdate: '',
    }];
    this.periods.push(segmen[0]);
    }

    this.payrolCalendar.idPayrollType= this.payrollType;
    this.payrolCalendar.year = this.year;
    this.payrolCalendar.payrollCalendarDetail = this.periods;
    //this.submitted = true;
    if (this.payrollType > 0 ) {
     this.messageService.clear();
    // this.saving = true 
      this._payrollCalendarService.PostPayrollCalendar(this.payrolCalendar).subscribe((data) => {
        if (data == 0) {
         
         this.showDialog = false;
         this.backUnChanged.emit(this.showDialog);
         // this.submitted = false;
         // this.saving = false;
         // this.onUpdate.emit();
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
        } else if (data == 1001) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
         // this.saving = false;
        }
        else if (data == -3) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Este registro no existe" });
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
        }
        //window.location.reload();
      }, () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
      });
      
    }else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe selecionar el tipo de nomina" });
    }
  
  }

  clear() { 
    this.payDay = 0
    this.startDate = new Date(this.dayB);
    this.setEndDay(this.startDate);
    this.periods = [];
    this.payrollcalendarlist = [];
  }

  outForm(){  //se pasa el control al componente padre, indicando que no hubieron cambios (crear o editar)
    this.backUnChanged.emit(false); 
  }
}

