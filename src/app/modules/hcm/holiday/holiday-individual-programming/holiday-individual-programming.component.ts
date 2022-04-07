import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ColumnD } from 'src/app/models/common/columnsd';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';


// Services
import { SalaryByLaborRelationshipService } from '../../shared/services/salaries/salary-labor-relationship.service';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import {HolidaysProgramationService}  from '../../shared/services/holidays/holidays-programming.service';

//Modelos
import { SalaryByLaborRelationship } from '../../shared/models/salaries/salary-labor-relationship';
import { IndividualAdjustmentFilter } from '../../shared/filters/salaries/individual-adjustment-filter';
import { HolidaysIndividualProgramation } from '../../shared/models/holidays/holidays-individual-programation';
import { HolidayCycle } from '../../shared/models/holidays/holiday-cycle';
import { debug } from 'console';
import { HolidaysIndividualProgramationFilter } from '../../shared/filters/holidays/holidays-individual-programation-Filter';

@Component({
  selector: 'app-holiday-individual-programming',
  templateUrl: './holiday-individual-programming.component.html',
  styleUrls: ['./holiday-individual-programming.component.scss']
})
export class HolidayIndividualProgrammingComponent implements OnInit {
  permissionsIDs = { ...Permissions };
  showFilters : boolean = true;
  showPanel: boolean = false;
  loading = false;
  holidayIndividualProgramationFilter: HolidaysIndividualProgramationFilter = new HolidaysIndividualProgramationFilter();
  holidaysIndividualModel: HolidaysIndividualProgramation;
  holidayCycleObject = new HolidayCycle();
  holidayCycle: HolidayCycle[] = [];
  individualSalary: SalaryByLaborRelationship;
  _Authservice : AuthService = new AuthService(this._httpClient);
  idCompany: number;

  isBtnBalanceDisable: boolean = false;

  displayedColumns: ColumnD<HolidayCycle>[] =
  [
   {template: (data) => { return data.cycleHolidays; }, field: 'cycleHolidays', header: 'Período', display: 'table-cell'},
   {template: (data) => { return data.starDate == null ? '' : data.starDate.split('-').reverse().join('/'); }, field: 'starDate', header: 'Inicio', display: 'table-cell'},
   {template: (data) => { return data.endDate == null  ? '' : data.endDate.split('-').reverse().join('/'); }, field: 'endDate', header: 'Fin', display: 'table-cell'},
   {template: (data) => { return data.payDate == null ? '' : data.payDate.split('-').reverse().join('/'); }, field: 'payDate', header: 'Pago', display: 'table-cell'},
   {template: (data) => { return data.typeHoliday;}, field: 'typeHoliday', header: 'Tipo', display: 'table-cell'},
   {template: (data) => { return data.status;}, field: 'status', header: 'Situación', display: 'table-cell'},
  ];

  constructor(
    private salaryAdjustmentSingle: SalaryByLaborRelationshipService,
    private _holidaysProgramationService: HolidaysProgramationService,
    private messageService: MessageService,
    private _httpClient: HttpClient,
    public userPermissions: UserPermissions
  ) { }

  ngOnInit(): void {
    this.idCompany = parseInt(this._Authservice.currentCompany);
  }

  editHolidayCycle(index){   
    this.holidayCycleObject = this.holidaysIndividualModel.cycle[index];
    this.showPanel = true;
  }

  search(){
    this.isBtnBalanceDisable= false;
    this.holidayIndividualProgramationFilter.idCompany = this.idCompany;
    this._holidaysProgramationService.GetHolidaysIndividualProgramation(this.holidayIndividualProgramationFilter).subscribe((data: HolidaysIndividualProgramation) => {
      this.holidaysIndividualModel = new HolidaysIndividualProgramation;
      this.holidaysIndividualModel = data;
      this.holidayCycle = data.cycle;
      if(this.holidaysIndividualModel.balance == null){
        this.isBtnBalanceDisable = true;
      }
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });

  }

  saveHolidayProgramming(record: HolidayCycle){
    let data = new HolidaysIndividualProgramation();
    data = this.holidaysIndividualModel;
    data.cycle = [];
    debugger
    data.cycle.push(record);
    this._holidaysProgramationService.InsertHolidaysIndividualProgramation(data).subscribe((data) => {
      if (data > 0) {
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
        this.search();
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

  resetValues(valor: boolean){  //se ejecuta cada vez que se sale de un modal (editar o eliminar) sin realizar cambios
    this.showPanel = valor;
    this.holidayCycleObject = new HolidayCycle();
  }

}
