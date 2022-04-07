import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
//Model
import { IncidentsFilter } from '../../shared/filters/incidents/incidents-filter';
import { IncidentsDetail } from '../../shared/models/incidents/incidents-detail';
//Service
import { IncidentsService } from '../../shared/services/incidents/incidents.service';

@Component({
  selector: 'app-incidents-main-list',
  templateUrl: './incidents-main-list.component.html',
  styleUrls: ['./incidents-main-list.component.scss']
})
export class IncidentsMainListComponent implements OnInit {
  permissionsIDs = { ...Permissions };
  showFilters: boolean = true;
  showMenssage: boolean = false;
  loading= false;
  incidentsDetailFilterList: IncidentsFilter = new IncidentsFilter();
  incidentsModel: IncidentsDetail[] = []
  cleanList: boolean = false;

  displayedColumns: ColumnD<IncidentsDetail>[] =
  [
   {template: (data) => { return data.numEmployees +'-'+ data.employeeFirstName +' '+ data.employeeSecondName; }, field: 'idEmploymentRelationship', header: 'Trabajador', display: 'table-cell'},
   {template: (data) => { return data.codConcepts+'-'+ data.concepts;}, field: 'concepts', header: 'Incidencia', display: 'table-cell'},
   {template: (data) => { return data.idCalendar; }, field: 'idCalendar', header: 'Calendario', display: 'table-cell'},
   {template: (data) => { return data.abbreviation; }, field: 'payrollType', header: 'Nómina', display: 'table-cell'},
   {template: (data) => { return data.dateIncident == null ? '' : data.dateIncident.split('-').reverse().join('/');}, field: 'typeHoliday', header: 'Fecha', display: 'table-cell'},
   {template: (data) => { return data.valueIncident + '(' + data.unit + ')';}, field: 'valueIncident', header: 'Valor', display: 'table-cell'},
   {template: (data) => { return data.idUnit;}, field: 'idUnit', header: 'Unidad', display: 'table-cell'},
  ];

  constructor(private messageService: MessageService,
              private _httpClient: HttpClient,
              private _incidentsService: IncidentsService) { }

  ngOnInit(): void {
    this.incidentsModel = [];
  }

  search(){
    this._incidentsService.GetIncidents(this.incidentsDetailFilterList).subscribe((data: IncidentsDetail[]) => {
      // this.incidentsModel = new this.incidentsModel[];
      this.incidentsModel = data;
      this.showMenssage = true;
      this.cleanList = true;
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });

  }

  cleanCardList(){
    this.cleanList = false;
    this.incidentsModel=[];
  }
}
