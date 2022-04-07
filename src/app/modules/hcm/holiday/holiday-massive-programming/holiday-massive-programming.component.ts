import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { HolidaysTypeFilter } from '../../shared/filters/holidays/holidays-type-filter';
import { HolidaysType } from '../../shared/models/holidays/holidays-type';
import { HolidaysTypeService } from '../../shared/services/holidays/holidays-type.service';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { HolidaysMassiveProgramationFilter } from '../../shared/filters/holidays/holidays-massive-programation-filter';
import { HolidaysProgramationService } from '../../shared/services/holidays/holidays-programming.service';
import { HolidaysProgramationMassive } from '../../shared/models/holidays/holidays-massive-programation';
import { HolidaysProgramationFilter } from '../../shared/filters/holidays/holidays-programation-filter';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'app-holiday-massive-programming',
  templateUrl: './holiday-massive-programming.component.html',
  styleUrls: ['./holiday-massive-programming.component.scss']
})
export class HolidayMassiveProgrammingComponent implements OnInit {
  permissionsIDs = { ...Permissions };
  @Input() idProgramationType: number;


  statuslist: SelectItem[] = [
    { label: 'Todos', value: -1 },
    { label: 'Disfrutada', value: 85 },
    { label: 'Programada', value: 84 },
    { label: 'Registrada', value: 83 },
  ];

  constructor(  private _holidayTypeService: HolidaysTypeService, private messageService: MessageService, 
                private _httpClient: HttpClient, 
                private _holidayProgramation: HolidaysProgramationService,
                public userPermissions: UserPermissions) { }

  _Authservice : AuthService = new AuthService(this._httpClient);
  holidayTypeFilter: HolidaysTypeFilter = new HolidaysTypeFilter();
  showFilters: boolean = true;
  showSidebar: boolean = false;
  holidaysTypeDropdown: SelectItem[] = [];
  searchHolidaysType: number = -1;
  date1: number;
  date2: number;
  _validations:Validations = new Validations();
  status: number = null;
  startDate: Date = null;
  endDate: Date = null;
  payDate: Date;
  cycleHoliday: string;
  idCompany: number;
  holidayProgramationFilter: HolidaysMassiveProgramationFilter = new HolidaysMassiveProgramationFilter();
  holidayProgramationDetailFilter: HolidaysProgramationFilter = new HolidaysProgramationFilter();
  holidayProgramationList: HolidaysProgramationMassive[] = [];
  newHolidayProgramation: HolidaysProgramationMassive;
  today = new Date();
  filterTitle: string = "";

  ngOnInit(): void {
    this.idCompany = parseInt(this._Authservice.currentCompany);
    this.loadHolidaysType();
    this.date1 = this.today.getFullYear();
    this.date2 = this.date1 + 1;
    this.searchHolidaysprogramation();
    this.filterTitle = this.idProgramationType == 2 ? "Programación masiva" : "Programación colectiva";
  }

  loadHolidaysType(){
    this.holidayTypeFilter.indActive = 1;
    this._holidayTypeService.GetHolidaysType(this.holidayTypeFilter).subscribe((data: HolidaysType[]) => {
      this.holidaysTypeDropdown = data.map((item)=>({
        label: item.typeHolidays,
        value: item.idTypeHolidays
      }));

      this.holidaysTypeDropdown = this.holidaysTypeDropdown.filter(x => x.label != "Vencidas").sort((a, b) => a.label.localeCompare(b.label));
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Carga de tipo de vacaciones', detail: "Ha ocurrido un error cargando los tipos de vacaciones"});
    });
  }

  searchHolidaysprogramation(){
    debugger;
    this.holidayProgramationFilter.idCompany = this.idCompany;
    this.holidayProgramationFilter.idProgramationType = this.idProgramationType;
    this.holidayProgramationFilter.idStatus = this.status == null ? -1 : this.status;
    this.holidayProgramationFilter.cycleHolidays = this.date1+"-"+this.date2;
    this.holidayProgramationFilter.idHolidayType = this.searchHolidaysType == null ? -1 : this.searchHolidaysType;
    this.holidayProgramationFilter.startDate = this.startDate == null ? "1900-01-01" : this.toDate(this.startDate);
    this.holidayProgramationFilter.endDate = this.endDate == null ? "1900-01-01" : this.toDate(this.endDate);
    this.holidayProgramationFilter.payDate = this.payDate == null ? "1900-01-01" : this.toDate(this.payDate);
    this._holidayProgramation.GetHolidaysMassiveProgramation(this.holidayProgramationFilter).subscribe( (data: HolidaysProgramationMassive[]) =>{
      this.holidayProgramationList = data;
      debugger;
    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de vacaciones', detail: 'Error al cargar el listado'});
    });
  }

  sendPanel(record: any){
    debugger;
    this.newHolidayProgramation = new HolidaysProgramationMassive();
    if(record.idHolidayProgramation != -1){
      this.holidayProgramationDetailFilter.idHolidayProgramation = record.idHolidayProgramation;
      this._holidayProgramation.GetHolidaysProgramation(this.holidayProgramationDetailFilter).subscribe((data: HolidaysProgramationMassive) => {
        debugger;
        this.newHolidayProgramation.idCompany = this.idCompany;
        this.newHolidayProgramation.idProgramationType = this.idProgramationType;
        this.newHolidayProgramation.idHolidayProgramation = data.idHolidayProgramation;
        this.newHolidayProgramation.idHolidayType = data.idHolidayType;
        this.newHolidayProgramation.idPayrollType = data.idPayrollType;
        this.newHolidayProgramation.holidayType = data.holidayType;
        this.newHolidayProgramation.idStatus = data.idStatus;
        this.newHolidayProgramation.status = data.status;
        this.newHolidayProgramation.startDate = data.startDate;
        this.newHolidayProgramation.payDate = data.payDate;
        this.newHolidayProgramation.endDate = data.endDate;
        this.newHolidayProgramation.cycleHolidays = data.cycleHolidays;
        this.newHolidayProgramation.idCalendar = data.idCalendar;
        this.newHolidayProgramation.detail = data.detail;
        this.showSidebar = true;
      }, (error: HttpErrorResponse)=>{
        this.messageService.add({severity:'error', summary:'Carga de tipo de vacaciones', detail: "Ha ocurrido un error cargando los tipos de vacaciones"});
      });
    }else{
      this.showSidebar = true;
    }
  }

  createNew(){
    debugger;
    var register = {
      idHolidayProgramation: -1,
      idPayrollType: -1,
      idCalendar: -1
    };
    this.sendPanel(register);
  }

  saveHolidaysProgramation(newRecord: HolidaysProgramationMassive){
    this._holidayProgramation.InsertHolidaysProgramation(newRecord).subscribe((data) => {
      if (data> 0) {    //si no ocurre algun error
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
        this.searchHolidaysprogramation();
        this.showSidebar = false;
      }else if(data == -1) {    //de lo contrario se evalua (validaciones de otros módulos)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
      }else if(data == -2) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
      }else if(data == -3) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El dispositivo no existe" });
      }else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al eliminar los datos" });
      }
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Carga de tipo de vacaciones', detail: "Ha ocurrido un error al guardar la programación de vacaciones"});
    });
  }

  deletedHolidayProgramation(record: any){
    var filter = new HolidaysProgramationFilter();
    filter.idHolidayProgramation = record.idHolidayProgramation;
    this._holidayProgramation.deletedHolidaysProgramation(filter).subscribe((data) => {
      if (data> 0) {    //si no ocurre algun error
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
        this.searchHolidaysprogramation();
        this.showSidebar = false;
      }else if(data == -1) {    //de lo contrario se evalua (validaciones de otros módulos)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
      }else if(data == -2) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
      }else if(data == -3) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El dispositivo no existe" });
      }else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al eliminar los datos" });
      }
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Carga de tipo de vacaciones', detail: "Ha ocurrido un error al eliminar la programación de vacaciones"});
    });
  }

  sideBarReturn(resp: boolean){
    if(resp){
      this.searchHolidaysprogramation();
    }
    this.showSidebar = false;
  }

  clearFilters(){
    this.date1 = this.today.getFullYear();
    this.date2 = this.date1 + 1;
    this.status = null;
    this.searchHolidaysType = -1;
    this.startDate = null;
    this.endDate = null;
    this.payDate = null;
  }

  onLoadLastYear(val: number){
    //debugger;
   this.date2 = val + 1;
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

  cycleHolidayChange(num: number){
    this.date2 = num + 1;
  }

}
