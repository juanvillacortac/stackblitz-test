import { Component, Input, OnInit } from '@angular/core';
//Theme Prime NG
import { ConfirmationService, MessageService, SelectItem, SortEvent } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { PayrollCalendarDetail } from '../../shared/models/masters/payroll-calendar-detail';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PayrollCalendarService } from '../../shared/services/payroll-calendar.service';
import { PayrollCalendarFilter } from '../../shared/filters/payroll-calendar-filter';
import { PayrollCalendar } from '../../shared/models/masters/payroll-calendar';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { Router } from '@angular/router';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { PayrollTypeFilter } from '../../shared/filters/payroll-type-filter';
import { PayrollTypeService } from '../../shared/services/payroll-type.service';
import { PayrollType } from '../../shared/models/masters/payroll-type';
import { DatePipe } from '@angular/common';
import { PayrollCalendarDetailViewModel } from '../../shared/view-models/payroll-calendar-detail-viewmodel';

@Component({
  selector: 'app-payroll-calendar-list',
  templateUrl: './payroll-calendar-list.component.html',
  styleUrls: ['./payroll-calendar-list.component.scss'],
  providers: [DatePipe]
})
export class PayrollCalendarListComponent implements OnInit {
  
  permissionsIDs = { ...Permissions };
  showSidebar: boolean = false;
  showFilters: boolean = true;
  showModal: boolean = false;
  showMessage: boolean = false;
  payrollcalendars = [] as PayrollCalendarDetail[];
  payrollCalendarList: PayrollCalendarDetailViewModel[];
  payrollCalendar = new PayrollCalendar();
  payrollCalendarFilter = new  PayrollCalendarFilter();
  payrollcalendarPreviuosFilter = new  PayrollCalendarFilter();
  loading = false;
  notFound: boolean = true;
  notAddDate: boolean = true;
  showList:boolean = false;

  payrollTypeList: PayrollType[] = [];
  payrollTypeDropdown: SelectItem[] = [];
  payrollTypePeriod: PayrollType;

  yearCalendar: number = 0;
  thisYear = new Date();
  idPayrollCalendar: number = 0;

  topDate: string = "";

  calendarPeriod: PayrollCalendarDetail;
  payrollTypeFilter: PayrollTypeFilter = new PayrollTypeFilter();
  payrollTypeSlect: PayrollType [] = [];
  _Authservice : AuthService = new AuthService(this._httpClient);
  
  private toDate = (str: string | Date) => {
    const d = new Date(str)
    const padLeft = (n: number) => ("00" + n).slice(-2)
    const dformat = [
      padLeft(d.getDate()),
      padLeft(d.getMonth() + 1),
      d.getFullYear()
    ].join('/');
    return dformat
  }

  displayedColumns: ColumnD<PayrollCalendarDetailViewModel>[] =
  [
   {template: (data) => { return data.id; }, field: 'id', header: 'Código', display: 'table-cell'},
   {template: (data) => { return data.payrollType; }, field: 'payrollType', header: 'Nómina', display: 'table-cell'},
   {template: (data) => { return data.year; }, field: 'year', header: 'Año', display: 'table-cell'},
   {template: (data) => { return data.period; }, field: 'period', header: 'Período', display: 'table-cell'},
   {template: (data) => { return data.startDateString; }, field: 'startDateString', header: 'Inicio', display: 'table-cell'},
   {template: (data) => { return data.finishDateString; }, field: 'finishDateString', header: 'Fin', display: 'table-cell'},
   {template: (data) => { return data.paymentDateString; }, field: 'paymentDateString', header: 'Pago', display: 'table-cell'},
   {template: (data) => { return data.status; }, field: 'status', header: 'Estatus', display: 'table-cell'},
   {template: (data) => { return data.conversionFactor; }, field: 'conversionFactor', header: 'Fact Conversión', display: 'table-cell'},
  ];

  constructor(private _payrollCalendarService :PayrollCalendarService, 
              private messageService: MessageService,
              private confirmationService: ConfirmationService, 
              public datepipe: DatePipe,
              private _httpClient: HttpClient,
              private _payrollTypeService :PayrollTypeService,
              public userPermissions: UserPermissions,
              private router :Router,
              public breadcrumbService: BreadcrumbService,
              ) 
    { 
      this.breadcrumbService.setItems([
        { label: 'HCM' },
        { label: 'Nómina' },
        { label: 'Calendario de nómina', routerLink: ['/hcm/payroll-calendar-list'] }
      ]);
    }

  ngOnInit(): void {
    this.onLoadPayrolltype();
  }

  onLoadPayrolltype(){
    this.payrollTypeFilter.idCompany = parseInt(this._Authservice.currentCompany);
    this._payrollTypeService.GetPayrollTypes(this.payrollTypeFilter).subscribe((data) =>{
      this.payrollTypeSlect = data.sort((a, b) => a.name.localeCompare(b.name));  
    });
  }

  search(){
    this.loading = true;
    this.showList= true;
    this.messageService.clear();  
    this._payrollCalendarService.GetPayrollCalendarList(this.payrollCalendarFilter).subscribe((data: PayrollCalendar) => {    
    if(this.payrollCalendarFilter.year >= this.thisYear.getFullYear()){  
      if(data.payrollCalendarDetail.length != 0 ){
        this.notFound = true;
        this.payrollCalendar = data;
        this.payrollCalendarList = [];
        this.payrollcalendars = data.payrollCalendarDetail.sort((a,b) => 0 - (a.idPayrollTypeDetail == b.idPayrollTypeDetail ? -1 : 1));
        this.payrollcalendars.forEach(element => {
          var object = new PayrollCalendarDetailViewModel();
          object.id = element.id;
          object.idPayrollTypeDetail = element.idPayrollTypeDetail;
          object.startDate = element.startDate;
          object.payrollType = element.payrollType;
          object.finishDate = element.finishDate;
          object.year = element.year;
          object.period = element.period;
          object.paymentDate = element.paymentDate;
          object.idStatus = element.idStatus;
          object.status = element.status;
          object.idCurrency = element.idCurrency;
          object.paymentDay = element.paymentDay;
          object.conversionFactor = element.conversionFactor;
          object.startDateString = this.datepipe.transform(element.startDate,'dd/MM/yyyy');
          object.finishDateString = this.datepipe.transform(element.finishDate,'dd/MM/yyyy');
          object.paymentDateString = this.datepipe.transform(element.paymentDate,'dd/MM/yyyy');
          this.payrollCalendarList.push(object);       
        });
        let last = this.payrollCalendarList.slice(-1);
        let lastDateEnd = new Date(last[0].finishDate);
        let yearThisCalendar = new Date(this.payrollCalendarFilter.year.toString()+'-12-31');
        if(lastDateEnd > yearThisCalendar ){
          this.notAddDate = true;
        }else{
          this.notAddDate = false;
        }
      }else{
        this.notFound = false;
        this.showMessage = true;
        this.payrollCalendarList = [];
        this.payrollcalendars = [];
      }  
    }else{
      this.notFound = true;
      this.showMessage = true;
      this.payrollCalendarList = [];
      this.payrollcalendars = [];
    }
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar el calendario." });        
    });
  }
  
  showPanel(){
      this.showSidebar = true
  }

  resetValues(valor: boolean){  //se ejecuta cada vez que se sale de un modal (editar o eliminar) sin realizar cambios 
    this.showSidebar = valor;
    this.showModal = valor;
    this.search();
  }

  newCalendar(){
    if(this.payrollCalendarFilter.year == null || this.payrollCalendarFilter.idPayrollType == -1){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe completar los campos año y tipo de nómina" });
    }else{
      this.yearCalendar = this.payrollCalendarFilter.year;
      this.idPayrollCalendar = this.payrollCalendarFilter.idPayrollType;
      //cambiar filtro
      this.payrollcalendarPreviuosFilter.year = this.payrollCalendarFilter.year - 1; // Busca el año anterior y lo asigna
      this.payrollcalendarPreviuosFilter.idPayrollType = this.payrollCalendarFilter.idPayrollType; //busca el tipo de nómina
      this._payrollCalendarService.GetPayrollCalendarList(this.payrollcalendarPreviuosFilter).subscribe((data: PayrollCalendar) => {    
        if(data.payrollCalendarDetail.length != 0){
          var last: PayrollCalendarDetail[];
           last = data.payrollCalendarDetail.slice(-1);            
           this.topDate = last[0].finishDate; ///Asigna la ultima fecha del ultimo periodo del calendario, para luego enviarlo al panel
        }
      });
      this.showSidebar = true;
    }
  }

  newPeriod(){
    this.calendarPeriod = new PayrollCalendarDetail();
    this.calendarPeriod.id = -1;
    this.calendarPeriod.idPayrollTypeDetail = this.payrollCalendarFilter.idPayrollType;
    this.calendarPeriod.startDate = this.payrollcalendars[this.payrollcalendars.length-1].finishDate;
    this.calendarPeriod.finishDate = "";
    this.calendarPeriod.year = this.payrollCalendarFilter.year;
    this.calendarPeriod.period = this.payrollcalendars[this.payrollcalendars.length-1].period+1;
    this.calendarPeriod.paymentDate = "";
    this.calendarPeriod.idStatus = 72;
    this.topDate = this.payrollcalendars[this.payrollcalendars.length-1].finishDate;
    this.showModal = true;
  }

  onEdit(record: PayrollCalendarDetailViewModel){
    this.calendarPeriod = new PayrollCalendarDetail();
    this.calendarPeriod.id = record.id;
    this.calendarPeriod.idPayrollTypeDetail = record.idPayrollTypeDetail;
    this.calendarPeriod.startDate = record.startDate;
    this.calendarPeriod.finishDate = record.finishDate;
    this.calendarPeriod.year = record.year;
    this.calendarPeriod.period = record.period;
    this.calendarPeriod.paymentDate = record.paymentDate;
    this.calendarPeriod.idStatus = record.idStatus;
    this.calendarPeriod.paymentDay = record.paymentDay;
    if(record.period == 1){
      let inicio = new Date("01-01-"+record.year.toString());
      let actual = new Date();
      if(actual < inicio){
        inicio.setDate(inicio.getDate() - 1);
        this.topDate = this.datepipe.transform(inicio,'yyyy-MM-dd');
      }else{
        this.topDate = this.datepipe.transform(actual,'yyyy-MM-dd');
      }
    }else{
      this.topDate = this.payrollcalendars[record.period-2].finishDate;
    }
    this.showModal = true;
  }

  saveCalendar(){
    this.payrollCalendar.idPayrollType = this.payrollCalendarFilter.idPayrollType;
    this.payrollCalendar.year = this.payrollCalendarFilter.year;
    this.payrollCalendar.payrollCalendarDetail = this.payrollcalendars;
    this._payrollCalendarService.PostPayrollCalendar(this.payrollCalendar).subscribe((data) => {
      if (data == 0) {
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
        this.resetValues(false);
      } else if (data == 1001) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
      }
      else if (data == -3) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Este registro no existe" });
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
      }
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
    });
   
  }

  updateCalendar(record: PayrollCalendarDetail) { 
    this.showModal = false;
    if(record.id == -1){
      this.payrollcalendars.push(record);
      this.saveCalendar();
      
    }else{
      debugger;
      this.updatePeriod(record);
      this.saveCalendar(); 
    }
    
  }

  updatePeriod(record: PayrollCalendarDetail){
    let initDate;     //fecha de inicio
    let endDate;      //fecha de Final
    let payrollObject = this.payrollTypeSlect.find(x => x.id == this.payrollCalendarFilter.idPayrollType);      //fecha de fin
    let payDate;       //fecha de pago
    let ind = record.period-1;
    this.payrollcalendars[ind] = record;
    debugger;
    if(record.period < this.payrollcalendars.length){
      initDate = new Date(this.payrollcalendars[record.period].startDate);
      endDate = new Date(this.payrollcalendars[record.period-1].finishDate);
        if(endDate >= initDate){
        initDate = new Date(endDate);
        initDate.setDate(initDate.getDate() + 1);
        initDate.setMinutes(initDate.getMinutes() + initDate.getTimezoneOffset());  //evita que la fecha disminuya un dia

        endDate = new Date(initDate);
        endDate.setDate(endDate.getDate() + payrollObject.periodicity);
        endDate.setMinutes(endDate.getMinutes() + endDate.getTimezoneOffset());  //evita que la fecha disminuya un dia

        payDate = new Date(initDate);
        payDate.setDate(payDate.getDate() + record.paymentDay);
        payDate.setMinutes(payDate.getMinutes() + payDate.getTimezoneOffset());  //evita que la fecha disminuya un dia

        this.payrollcalendars[record.period].startDate = this.datepipe.transform(initDate,'yyyy-MM-dd');
        this.payrollcalendars[record.period].finishDate = this.datepipe.transform(endDate,'yyyy-MM-dd');
        this.payrollcalendars[record.period].paymentDate = this.datepipe.transform(payDate,'yyyy-MM-dd');

        this.payrollCalendarList[record.period].startDateString = this.datepipe.transform(initDate,'dd/MM/yyyy');
        this.payrollCalendarList[record.period].finishDateString = this.datepipe.transform(endDate,'dd/MM/yyyy');
        this.payrollCalendarList[record.period].paymentDateString = this.datepipe.transform(payDate,'dd/MM/yyyy');

        this.updatePeriod(this.payrollcalendars[record.period]);
      }
    }
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      debugger
        let value1 = data1[event.field];
        let value2 = data2[event.field];
        let result = null;

        if (event.field == 'startDateString'){
          let auxvalue1 = new Date(data1['startDate']);
          let auxvalue2 = new Date(data2['startDate']);
          result = (auxvalue1 < auxvalue2) ? -1 : (auxvalue1 > auxvalue2) ? 1 : 0;
        }else if(event.field == 'finishDateString'){
          let auxvalue1 = new Date(data1['finishDate']);
          let auxvalue2 = new Date(data2['finishDate']);
          result = (auxvalue1 < auxvalue2) ? -1 : (auxvalue1 > auxvalue2) ? 1 : 0;
        }else if( event.field == 'paymentDateString'){
          let auxvalue1 = new Date(data1['paymentDate']);
          let auxvalue2 = new Date(data2['paymentDate']);
          result = (auxvalue1 < auxvalue2) ? -1 : (auxvalue1 > auxvalue2) ? 1 : 0;
        }
        else
            result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

        return (event.order * result);
    });
}
clearList(){
  this.showList = false;
  this.payrollCalendarList = [];
}
}
