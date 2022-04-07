import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Motives } from 'src/app/models/masters/motives';
import { MotivesFilters } from 'src/app/models/masters/motives-filters';
import { MotivesService } from 'src/app/modules/masters/motives/shared/services/motives.service';
import { SalaryType } from '../../shared/models/masters/salary-type';
import { SalaryTypeFilter } from '../../shared/filters/salary-type-filter';
import { SalaryTypeService } from '../../shared/services/salary-type.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Dropdown } from 'primeng/dropdown';
import { HttpErrorResponse } from '@angular/common/http';
import { SalariesForPayrollData } from '../../shared/models/laborRelationship/salariesforpayrolldata';
import { SalariesForPayrollDataService } from '../../shared/services/salariesforpayrolldata.service';
import { SalariesForPayrollDataFilter } from '../../shared/filters/laborRelationship/salariesforpayrolldata-filter';

@Component({
  selector: 'employee-salary-history',
  templateUrl: './employee-salary-history.component.html',
  styleUrls: ['./employee-salary-history.component.scss']
})

export class EmployeeSalaryHistoryComponent implements OnInit {
  salaryTypeDropdown: SelectItem[] = [];
  motivesDropdown: SelectItem[] = [];
  loading : boolean = false;
  fechaDesde: Date;
  fechaHasta: Date;
  
  salaryType: number; 
  optMotive: number;
  @ViewChild("Motive") motive: Dropdown; 
  SalariesForPayrollDataFiltersSearch: SalariesForPayrollDataFilter = new SalariesForPayrollDataFilter();
  filterInitial: SalariesForPayrollDataFilter = new SalariesForPayrollDataFilter();

  displayedColumns: ColumnD<SalariesForPayrollData>[] =
    [
      { template: (data) => { return data.validityDate; }, header: 'Fecha', field: 'validityDate', display: 'table-cell' },
      { template: (data) => { return data.typeSalary; }, header: 'Tipo', field: 'typeSalary', display: 'table-cell' },
      { template: (data) => { return data.currencySymbol+data.amount; }, header: 'Monto', field: 'amount', display: 'table-cell' },
      { template: (data) => { return data.motive; }, header: 'Motivo', field: 'motive', display: 'table-cell' },
      { template: (data) => { return data.createdByUser; }, header: 'Creado por', field: 'createdByUser', display: 'table-cell' },
    ];

  constructor(
    public _salaryForPayrollDataService: SalariesForPayrollDataService,
    public _salaryTypeService: SalaryTypeService,
    public _motivesService: MotivesService,
    public messageService: MessageService,
  ) {
    this.yearRange = `${new Date().getFullYear() - 70}:${new Date().getFullYear()}`;
   }

  yearRange: string;
  fromMaxDate: string;
  toMinDate: string;

  ngOnInit(): void { 
    this.loadSalaryTypes();
    this.loadMotives();
    this.onLoadHistory(this.filterInitial);
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

  getCompanyId(){
    debugger
    // obteniendo id de empresa en la variable localStorage
    var point1 = localStorage.getItem("_CURRENT_OFFICE").lastIndexOf(':');
    var point2 = localStorage.getItem("_CURRENT_OFFICE").lastIndexOf('}');
    var idC = localStorage.getItem("_CURRENT_OFFICE").substring(point1+1, point2);
    return idC;
  }

  loadSalaryTypes() {
    var filter = new SalaryTypeFilter();
    filter.companyId = parseInt(this.getCompanyId());
    this._salaryTypeService.GetSalaryType(filter).subscribe( (data: SalaryType[]) => {
      if (data != null) {
          this.salaryTypeDropdown = data.map<SelectItem>((item)=>(
            {
              value: item.id,
              label: item.name
            }
          ));
          console.log(data);
          console.log(this.salaryTypeDropdown);
      }
      this.salaryTypeDropdown.sort((a, b) => a.label.localeCompare(b.label));
      this.salaryType = this.salaryTypeDropdown.find(x => x.label.toLowerCase() == "sueldo base" ).value;
    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de tipos de salario', detail: 'Error al cargar los tipos de salario'});
    });
  }

  loadMotives() {
    var filter = new MotivesFilters();
    filter.idMotivesType = 3;
    this._motivesService.getMotives(filter).then((data: Motives[]) => {
      if (data != null) {
          this.motivesDropdown = data.map<SelectItem>((item)=>(
            {
              value: item.id,
              label: item.name
            }
          ));
          console.log(data);
          console.log(this.motivesDropdown);
      }
      this.motivesDropdown.sort((a, b) => a.label.localeCompare(b.label));
    },
    (error) => {
      this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de motivos', detail: 'Error al cargar los motivos'});
    });
  }

  searchSalaryHistory(){
    debugger;
    this.SalariesForPayrollDataFiltersSearch.typeSalaryId = this.salaryType == undefined ? -1 : this.salaryType;
    this.SalariesForPayrollDataFiltersSearch.motiveId = this.optMotive == undefined ? -1 : this.optMotive;
    this.SalariesForPayrollDataFiltersSearch.startDate = this.fechaDesde == null || this.fechaDesde == undefined ? "01/01/1900" : this.toDate(this.fechaDesde);
    this.SalariesForPayrollDataFiltersSearch.endDate = this.fechaHasta == null || this.fechaHasta == undefined ? "01/01/1900" : this.toDate(this.fechaHasta);
    if (this.SalariesForPayrollDataFiltersSearch.typeSalaryId == -1 && 
        this.SalariesForPayrollDataFiltersSearch.motiveId == -1 && 
        this.SalariesForPayrollDataFiltersSearch.startDate == "01/01/1900" &&
        this.SalariesForPayrollDataFiltersSearch.endDate == "01/01/1900") {
      this.messageService.add({severity:'error', summary:'Alerta', detail: "Debe completar por lo menos uno de los filtros para realizar una búsqueda."});
    } else {
      this.onLoadHistory(this.SalariesForPayrollDataFiltersSearch);
    }
        
  }

  onLoadHistory(filter: SalariesForPayrollDataFilter){
    filter.idLaborRelationship = parseInt(sessionStorage.getItem('idLaborRelationship'));
    this._salaryForPayrollDataService.GetSalariesForPayrollData(filter).subscribe((data: SalariesForPayrollData[]) => {
      this._salaryForPayrollDataService.SalariesForPayrollDataList = data;
      this.loading = false;
      debugger;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar el histórico de sueldos." });
    });
  }

  fromBlurMethod(event: any) {
    this.toMinDate = event;
  }

  toBlurMethod(event: any) {
    this.fromMaxDate = event;
  }

  onBlurMethod(event: any) {
    // let dates = new Date(event);
    // if(dates > this.sDate) {
    //    this.sDate = dates;
    //    this.filters.seniorityDate = this.datepipe.transform(this.sDate, "yyyyMMdd");
    //    this.changes.emit(this.filters.seniorityDate);
    // }     
  }

}
