import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MenuItem, MessageService, SelectItem, PrimeNGConfig } from 'primeng/api';
import { LaborRelationshipMinimumFilter } from '../../../shared/filters/laborRelationship/labor-relationship-minimum-filter';
import { CompaniesFilter } from 'src/app/modules/masters/companies/shared/filters/companies-filter';
import { HttpClient } from '@angular/common/http';
import { LayoutService } from 'src/app/modules/layout/shared/layout.service';
import { SecurityService } from 'src/app/modules/security/shared/services/security.service';
import { Calendar } from 'primeng/calendar';
import { LaborRelationshipMinimumExcel } from '../../../shared/models/laborRelationship/labor-relationship-minimumexcel';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CompanyOffice } from 'src/app/models/security/company-office';
import { BaseModel } from 'src/app/models/common/BaseModel';

@Component({
  selector: 'companies-employee-filter',
  templateUrl: './companies-employee-filter.component.html',
  styleUrls: ['./companies-employee-filter.component.scss'],
  providers: [DatePipe]
})
export class CompaniesEmployeeFilterComponent implements OnInit {

  @Input() expanded : boolean = false;
  @Input("filters") filters : LaborRelationshipMinimumFilter;
  @Input() branchOffices: SelectItem[] = []; 
  @Input("loading") loading : boolean = false;
  @ViewChild("formIngresoCalendar") formIngresoCalendar: Calendar;
  @ViewChild("formAntiguedadCalendar") formAntiguedadCalendar: Calendar;

  statuslist: SelectItem[] = [
    { label: 'Todos', value: -1 },
    //{ label: 'Activo', value: 33 },   // solo para cuando el cliente
    //{ label: 'Inactivo', value: 34 }, // no haya adquirido el modulo HCM
    { label: 'Alta', value: 35 },
    { label: 'Baja', value: 36 },
    { label: 'Borrador', value: 38 },
    { label: 'Suspendida', value: 37 },
];

  companyGroups:SelectItem[];

  @Output("onSearch") onSearch = new EventEmitter<LaborRelationshipMinimumFilter>();
  @Output() export = new EventEmitter();
  @Output() import = new EventEmitter();
  @Output() exportFormat = new EventEmitter();

  _Authservice : AuthService = new AuthService(this._httpClient);

  listlaborRelationshipMinimumexcel:LaborRelationshipMinimumExcel [] = [];
  fechaIngreso: Date
  fechaAntiguedad: Date
  maxDate: Date = new Date();   //Para limitar el p-calendar
  currentOffice: any;
  userOffices: SelectItem[] = []; 
  userId: number;
  menu: MenuItem[];

  companiesFilters: CompaniesFilter = new CompaniesFilter();
  //@ViewChild("branchOfficeId") branchOfficeId: Dropdown;

  items: MenuItem[]= [
    {
      label: 'Empleados', icon: 'pi pi-file-excel', command: () => {
        this.ExportListExcel();
      }
    }, {
      label: 'Formato Importación', icon: 'pi pi-file-excel', command: () => {
        this.ExportExcel();
      }
    }
    // {label: 'PDF', icon: 'pi pi-file-pdf', command: () => {
    //     this.exportPdf();
    // }}
  ];

  constructor(
    public datepipe: DatePipe,
    public messageService: MessageService, 
    private _httpClient: HttpClient, 
  ) {
    this.userId = Number(this._Authservice.idUser);
   }

  ngOnInit(): void {
    //this.loadUserOffices();
    if(this.filters.employmentDate == undefined || this.filters.employmentDate == "01/01/1900" || this.filters.employmentDate == ""){
      this.fechaIngreso = null;
    }else{
      this.fechaIngreso = new Date(this.filters.employmentDate);
      this.fechaIngreso.setMinutes(this.fechaIngreso.getMinutes() + this.fechaIngreso.getTimezoneOffset());  //evita que la fecha disminuya un dia
    }

    if(this.filters.seniorityDate == undefined || this.filters.seniorityDate == "01/01/1900" || this.filters.seniorityDate == ""){
      this.fechaAntiguedad = null;
    }else{
      this.fechaAntiguedad = new Date(this.filters.seniorityDate);
      this.fechaAntiguedad.setMinutes(this.fechaAntiguedad.getMinutes() + this.fechaAntiguedad.getTimezoneOffset());  //evita que la fecha disminuya un dia
    }
  }
  
  toDate(str: string | Date) {
    if (!str) {
      return undefined
    }
    const d = new Date(str)
    const padLeft = (n: number) => ("00" + n).slice(-2)
    const dformat = [
      d.getFullYear(),
      padLeft(d.getMonth() + 1),
      padLeft(d.getDate()),
    ].join('-');
    return dformat
  }
  

  search(){
    this.filters.idUser = this.userId;
    this.filters.employmentDate = this.fechaIngreso == null || this.fechaIngreso == undefined ? "01/01/1900" : this.toDate(this.fechaIngreso);
    this.filters.seniorityDate = this.fechaAntiguedad == null || this.fechaAntiguedad == undefined ? "01/01/1900" : this.toDate(this.fechaAntiguedad);
    this.filters.employmentCode = this.filters.employmentCode == "" || this.filters.employmentCode == null || this.filters.employmentCode == undefined ? "" : this.filters.employmentCode;
    this.filters.employeeName = this.filters.employeeName == "" || this.filters.employeeName == null || this.filters.employeeName == undefined ? "" : this.filters.employeeName;
    this.filters.idEstatus = this.filters.idEstatus == null || this.filters.idEstatus == undefined ? -1 : this.filters.idEstatus;
    this.filters.branchOfficeId = this.filters.branchOfficeId == null || this.filters.branchOfficeId == undefined ? -1 : this.filters.branchOfficeId;
    this.onSearch.emit(this.filters);
  }

  onBlurMethod(event: any) {
    this.maxDate = event;
    this.fechaAntiguedad = null;
    this.formAntiguedadCalendar.value = null;
    // let dates = new Date(event);
    // if(dates > this.sDate) {
    //    this.sDate = dates;
    //    this.filters.seniorityDate = this.datepipe.transform(this.sDate, "yyyyMMdd");
    //    this.changes.emit(this.filters.seniorityDate);
    // }     
  }

  clearFilters(){
    this.filters.employmentCode = "";
    this.filters.employeeName = "";
    this.filters.employmentDate = "";
    this.filters.seniorityDate = "";
    this.fechaIngreso = null;
    this.fechaAntiguedad = null;
    this.filters.idEstatus = null;
    this.filters.branchOfficeId = null;
    this.formIngresoCalendar.value = null;
    this.formAntiguedadCalendar.value = null;
    this.maxDate = new Date();
  }

  ExportListExcel(){
  //debugger;
    this.export.emit();
  }

  ExportExcel(){
    //debugger;
      this.exportFormat.emit();
    }

  massiveImport(){
    this.import.emit();
  }

 

}
