// Global
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
//Theme Prime NG
import { MessageService, SelectItem } from 'primeng/api';
// Models
import { PayrollTypeFilter } from 'src/app/modules/hcm/shared/filters/payroll-type-filter';
import { PayrollType } from '../../shared/models/masters/payroll-type';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
// Services
import { PayrollTypeService } from 'src/app/modules/hcm/shared/services/payroll-type.service';
import { PayrollCalendarFilter } from '../../shared/filters/payroll-calendar-filter';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'app-payroll-calendar-filter',
  templateUrl: './payroll-calendar-filter.component.html',
  styleUrls: ['./payroll-calendar-filter.component.scss']
})
export class PayrollCalendarFilterComponent implements OnInit {

  year= new Date().getFullYear();
  periodicity: number;
  onLoadPayrollType: PayrollType [] = [];
  @Input() expanded = false;
  @Input() loading = false;
  @Input() showList = true;
  @Input() filters: PayrollCalendarFilter;
  @Output() onSearch = new EventEmitter<PayrollCalendarFilter>();
  @Output() clearList = new EventEmitter<boolean>();
  permissionsIDs = { ...Permissions };

  _Authservice : AuthService = new AuthService(this._httpClient);
  payrollTypelist : SelectItem[];
  selectPayrollType: number;
  SelectPayrollTypeItem: SelectItem = {value:0, label:''};
  
  payrollTypeFilter: PayrollTypeFilter = new PayrollTypeFilter();
  payrollTypeSlect: PayrollType [] =[]
  
  showSidebar:boolean=false;


  constructor(
    private _httpClient: HttpClient,
    private payrolltypeService: PayrollTypeService,
    private messageService: MessageService,
    public userPermissions: UserPermissions,
    ) { }

  ngOnInit(): void {
    this.loadFilters()
  }

  loadFilters() {
    this.payrollTypeFilter.idCompany = parseInt(this._Authservice.currentCompany);
    this.payrolltypeService.GetPayrollTypes(this.payrollTypeFilter).subscribe((data: PayrollType[]) => {
      this.payrollTypelist = data.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item) => ({
        value: item.id,
        label: item.name
      }));
      }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los Tipo de Nómina" });
  });
  }

  search() {
    this.filters.idPayrollType = this.selectPayrollType ? this.selectPayrollType: -1;
    this.filters.year = this.year
    this.onSearch.emit(this.filters);
    
  }

  clearFilters(){
    this.selectPayrollType = -1
    this.year= new Date().getFullYear();
    this.showList = false;
    this.clearList.emit(this.showList);
  }
  
}
