import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ColumnD } from 'src/app/models/common/columnsd';

//Service
import { HolidaysProgramationService } from '../../shared/services/holidays/holidays-programming.service';
import { MessageService } from 'primeng/api';

//Model
import { HolidaysIndividualProgramationFilter } from '../../shared/filters/holidays/holidays-individual-programation-Filter';
import { HolidaysBalanceFilter } from '../../shared/filters/holidays/holidays-balance-filter';
import { HolidaysBalance } from '../../shared/models/holidays/holidays-balance';

@Component({
  selector: 'app-holiday-amounts-list',
  templateUrl: './holiday-amounts-list.component.html',
  styleUrls: ['./holiday-amounts-list.component.scss']
})
export class HolidayAmountsListComponent implements OnInit {
  showFilters : boolean = true;
  loading = false;
  holidaysBalanceFilter: HolidaysBalanceFilter = new HolidaysBalanceFilter();
  holidayBalanceModel: HolidaysBalance[] = [];
  showTable: boolean = false;
  displayedColumns: ColumnD<HolidaysBalance>[] =
  [
   {template: (data) => { return data.idLaborRelationship; }, field: 'idLaborRelationship', header: 'Código', display: 'table-cell'},
   {template: (data) => { return data.firstNames + ' ' + data.firstSurname  }, field: 'name', header: 'Trabajador', display: 'table-cell'},
   {template: (data) => { return data.dateEntry == null ? '' : data.dateEntry.split('-').reverse().join('/'); }, field: 'dateEntry', header: 'Ingreso', display: 'table-cell'},
   {template: (data) => { return data.holidaysTotal  }, field: 'holidaysTotal', header: 'Por antigüedad año en curso', display: 'table-cell'},
   {template: (data) => { return data.accumulatedCyclePrevious }, field: 'accumulatedCyclePrevious', header: 'Por antigüedad año anterior', display: 'table-cell'},
   {template: (data) => { return data.programmed;}, field: 'programmed', header: 'Programada', display: 'table-cell'},
   {template: (data) => { return data.noProgrammed;}, field: 'noProgrammed', header: 'No Programada', display: 'table-cell'},
   {template: (data) => { return data.expired;}, field: 'expired', header: 'Vencidas', display: 'table-cell'},
   {template: (data) => { return data.enjoyed;}, field: 'enjoyed', header: 'Disfrutadas', display: 'table-cell'},
  ];

  constructor(private _holidaysProgramationService: HolidaysProgramationService,
    private messageService: MessageService,
    private _httpClient: HttpClient,) { }

  ngOnInit(): void {
  }

  search(){
    this._holidaysProgramationService.GetHolidaysBalance(this.holidaysBalanceFilter).subscribe((data: HolidaysBalance[]) => {
      this.holidayBalanceModel = data;
      this.showTable = true;
      console.log(data);
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });

  }
}
