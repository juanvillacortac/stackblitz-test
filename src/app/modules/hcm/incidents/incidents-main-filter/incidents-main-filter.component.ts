import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem, MessageService, SelectItem } from 'primeng/api';
//Service
import { PayrollCalendarService } from '../../shared/services/payroll-calendar.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PayrollTypeService } from '../../shared/services/payroll-type.service';
import { CompanyOffice } from 'src/app/models/security/company-office';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { ListConceptsService } from '../../shared/services/concepts/list-concepts-service';
import { SecurityService } from 'src/app/modules/security/shared/services/security.service';
import { BaseModel } from 'src/app/models/common/BaseModel';
import { LayoutService } from 'src/app/modules/layout/shared/layout.service';
//Model
import { DatePipe } from '@angular/common';
import { PayrollCalendarFilter } from '../../shared/filters/payroll-calendar-filter';
import { PayrollTypeFilter } from '../../shared/filters/payroll-type-filter';
import { PayrollType } from '../../shared/models/masters/payroll-type';
import { PayrollCalendar } from '../../shared/models/masters/payroll-calendar';
import { ListConcepts } from '../../shared/models/concepts/list-concepts';
import { ListConceptsFilter } from '../../shared/filters/Concepts/list-concepts-filter';
import { LaborRelationshipService } from '../../shared/services/labor-relationship.service';
import { LaborRelationshipMinimumFilter } from '../../shared/filters/laborRelationship/labor-relationship-minimum-filter';
import { LaborRelationshipMinimum } from '../../shared/models/laborRelationship/labor-relationship-minimum';
import { IncidentsFilter } from '../../shared/filters/incidents/incidents-filter';

@Component({
  selector: 'app-incidents-main-filter',
  templateUrl: './incidents-main-filter.component.html',
  styleUrls: ['./incidents-main-filter.component.scss'],
  providers: [DatePipe]
})
export class IncidentsMainFilterComponent implements OnInit {
  @Input() expanded = false;
  @Input() loading = false;
  @Input() cleanList = true;
  @Input() filters: IncidentsFilter;

  @Output() onSearch = new EventEmitter<IncidentsFilter>();
  @Output() cleanCardList = new EventEmitter<boolean>();

  _Authservice : AuthService = new AuthService(this._httpClient);
  dateIncidents: Date;
  idCompany: number = 0;
  maxDate: Date;

  selectPayrollType: number = 0;
  payrollTypelist : SelectItem[] = [];
  payrollTypeFilter: PayrollTypeFilter = new PayrollTypeFilter();
  payrollCalendarFilter = new  PayrollCalendarFilter();
  payDateList: SelectItem[] = [];
  paymentDate: {name:string, value:number};

  selectConceptsIncidents: number = 0;
  incidentsList: SelectItem[] = [];
  ConceptIncidentsFilter: ListConceptsFilter = new ListConceptsFilter();

  userOffices: SelectItem[] = [];
  userId: number;
  currentOffice: any;
  branchOfficesList: CompanyOffice[] = [];
  branchOfficeId: number= 0;
  menu: MenuItem[];

  employmentCode: number;
  laborRelationshipMinimumFiltersSearch: LaborRelationshipMinimumFilter = new LaborRelationshipMinimumFilter();
  employmentList: SelectItem[]= [];
  employmentSelect: number = 0;

  statusSelect: number = 0 ;
  statusOption: SelectItem[] = [
    { label: 'Todos', value: -1 },
    { label: 'Aprobadas', value: 100 },
    { label: 'Cargadas', value:99 },
    { label: 'Procesadas', value: 101 },
  ];

  showCalendarPayroll: boolean = true;
  enableEmploymentList: boolean = true;
  submitted: boolean = false;
  constructor(private messageService: MessageService,
              private _payrollCalendarService :PayrollCalendarService,
              private _listConceptsIncidentsService: ListConceptsService,
              public datepipe: DatePipe,
              private payrolltypeService: PayrollTypeService,
              private _httpClient: HttpClient,
              private _layoutSerice: LayoutService,
              private _securityService: SecurityService,
              public _laborRelationshipService: LaborRelationshipService,) {
                this.userId = Number(this._Authservice.idUser);

              }

  ngOnInit(): void {
    this.idCompany = parseInt(this._Authservice.currentCompany);
    this.maxDate = new Date(),
    this.loadPayrollTypes();
    this.loadIncidentsList();
    this.loadUserOffices();
  }

  loadPayrollTypes() {
    this.payrollTypeFilter.idCompany = parseInt(this._Authservice.currentCompany);
    this.payrolltypeService.GetPayrollTypes(this.payrollTypeFilter).subscribe((data: PayrollType[]) => {
    this.payrollTypelist = data.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item) => ({
      value: item.id,
      label: item.name
      }));
      this.payrollTypelist.push({label: "Todos", value: -1})
      this.payrollTypelist.sort((a, b) => {if(a.label < b.label || a.value == -1){return -1}if(a.label > b.label){return 1}return 0});
    }, (error: HttpErrorResponse) => {
    this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los Tipo de nómina" });
    });
  }


  loadIncidentsList() {
    this._listConceptsIncidentsService.GetListConcepts(this.ConceptIncidentsFilter).subscribe((data: ListConcepts[]) => {
    this.incidentsList = data.sort((a, b) => a.concepts.localeCompare(b.concepts)).map<SelectItem>((item) => ({
      value: item.idConcepts,
      label: item.codConcepts+'-'+item.concepts
      }));
      this.incidentsList.push({label: "Todos", value: -1})
      this.incidentsList.sort((a, b) => {if(a.label < b.label || a.value == -1){return -1}if(a.label > b.label){return 1}return 0});
    }, (error: HttpErrorResponse) => {
    this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los conceptos por incidencias" });
    });
  }


  loadPayDates(){
    let thisYear = new Date().getFullYear();
    this.payrollCalendarFilter.year = thisYear;
    this.payrollCalendarFilter.idPayrollType = this.selectPayrollType;
    this._payrollCalendarService.GetPayrollCalendarList(this.payrollCalendarFilter).subscribe((data: PayrollCalendar) => {
      this.payDateList = data.payrollCalendarDetail.filter(x => x.idStatus == 72).map<SelectItem>((item) =>({
        value: item.id,
        name: item.id+" - "+item.startDate.split('-').reverse().join('/') + " al " + item.finishDate.split('-').reverse().join('/'),
      }));
      this.showCalendarPayroll = false;
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar la fecha de pago." });
    });
  }

  loadEmployment() {
    this.loading = true;
    this.enableEmploymentList = false
    this.laborRelationshipMinimumFiltersSearch = {
      idLaborRelationship: -1,
      idUser: this.userId,
      idCompany: this.idCompany,
      branchOfficeId: this.branchOfficeId,
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
        value:item.idLaborRelationship,
        label: item.employmentCode +"-"+ item.identifier +""+ item.documentNumber +"-"+ item.employeeName,
        }));
      this.loading = false;
      this.employmentList.push({label: "Todos", value: -1})
      this.employmentList.sort((a, b) => {if(a.label < b.label || a.value == -1){return -1}if(a.label > b.label){return 1}return 0});
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los trabajadores." });
    });
  }

  searchEmploymentForCode(){
    debugger
    this.employmentSelect = 0;
    let record: LaborRelationshipMinimum = new LaborRelationshipMinimum();
    record = this._laborRelationshipService._laborRelationshipMinimumList.find(x => x.employmentCode == this.employmentCode.toString())
    if(record){
      this.employmentSelect = record.idLaborRelationship;
    }else{
      this.employmentSelect = 0;
    }
    
  }

  //$$$$$$$$$$$$$$ Star load branches $$$$$$$$$$$$$$$$$$$$$$$$$$$
  private loadUserOffices() {
    this._layoutSerice.getCompanyBrachOfficesByUser(this.userId)
      .then(offices => { this.saveDefaultOffice(offices); return offices; })
      .then(offices => this.branchOfficesList = offices)
      .then(() => this.getCurrentOffice())
      .then(() => this.loadUserModules())
      .then(() => this.loadBranchOffices(this.branchOfficesList[0].offices))
      .catch(error => this.handleError(error));
  }

private saveDefaultOffice(companies) {
  debugger;

    if (this._Authservice.currentOffice !== -1) { return; }
    const firstCompany = companies[0];
    const firstOffice = firstCompany?.offices[0];
    this.onOfficeSelected({ idOffice: firstOffice?.id ?? -1, idCompany: firstCompany?.id ?? -1,nameCompany: firstCompany?.name ?? '',nameOffice: firstOffice?.name ?? '' });
  }

  onOfficeSelected(companyOffice) {
    this._Authservice.updateCurrentOffice(companyOffice.idOffice, companyOffice.idCompany,companyOffice.nameCompany,companyOffice.nameOffice);
    this._Authservice.removeRouteVisited();
    this.getCurrentOffice();
    this.loadUserModules();
  }

  private getCurrentOffice() {
    this.currentOffice = {
      idOffice: this._Authservice.currentOffice,
      idCompany: this._Authservice.currentCompany

    };
  }

private loadUserModules() {
    this._securityService.getModulesTreeByUser(Number(this.userId), this.currentOffice.idCompany, this.currentOffice.idOffice)
      .then(modulesTree => this.setupModulesTree(modulesTree))  //no
      .then(_ => this.loadUserAccesses())
      .catch(error => this.handleError(error));
  }

  private setupModulesTree(modulesTree) {
    this.resetMenuItems();          //no
    this.menu = this.menu.concat(modulesTree);
  }

  private resetMenuItems() {
    this.menu = [{
      label: 'Inicio',
      icon: 'pi pi-fw pi-home',
      routerLink:  ['home'],
    }];
  }

  private loadUserAccesses() {
    this._securityService.getAccessPromise(Number(this.userId), this.currentOffice.idCompany, this.currentOffice.idOffice)
      .then(accesses => { this._layoutSerice.sendToStorage(accesses); })
      //.then(_ => this.silentReload())
      .catch(error => this.handleError(error));
  }

  private handleError(error) {
    console.error('Error at layout-componet', error);
  }

  loadBranchOffices(list: BaseModel[]){
    this.userOffices = list.map<SelectItem>((item)=>(
      {
        value: item.id,
        label: item.name
      }
    ));
    this.userOffices.push({label: "Todos", value: -1})
    this.userOffices.sort((a, b) => {if(a.label < b.label || a.value == -1){return -1}if(a.label > b.label){return 1}return 0});
    //this.userOffices = this.userOffices.sort((a, b) => a.label.localeCompare(b.label));
  }
  //$$$$$$$$$$$$$$ End load branches $$$$$$$$$$$$$$$$$$$$$$$$$$$

  search(){
    
    this.filters.idCompany = this.idCompany;
    this.filters.idEmploymentRelationship = this.employmentSelect == 0 ? -1 : this.employmentSelect;
    this.filters.idPayrollType = this.selectPayrollType == 0 ? -1 : this.selectPayrollType;
    this.filters.idCalendar = this.paymentDate?.value == null ? -1 : this.paymentDate.value;
    this.filters.idConcepts = this.selectConceptsIncidents == 0 ? -1 : this.selectConceptsIncidents;
    this.filters.numEmployees = this.employmentCode == null ? '' : this.employmentCode.toString();
    this.filters.dateIncidents = this.dateIncidents == null ? "1900-01-01" : this.datepipe.transform(this.dateIncidents, 'yyyy-MM-dd');
    this.filters.idStatus = this.statusSelect == 0 ? -1 : this.statusSelect;
    debugger
    if(this.branchOfficeId  == 0 && this.selectPayrollType == 0 && this.selectConceptsIncidents == 0 && this.employmentSelect == 0 && this.statusSelect == 0 && this.employmentCode == null && this.dateIncidents == null){
      this.branchOfficeId = -1;
      this.selectPayrollType = -1;
      this.selectConceptsIncidents = -1;
      this.employmentSelect = -1;
      this.statusSelect = -1
      this.loadEmployment();
    }
    this.onSearch.emit(this.filters);

  }

  clearFilters(){
    this.employmentSelect = 0;
    this.selectPayrollType = 0;
    this.paymentDate = null;
    this.selectConceptsIncidents = 0;
    this.dateIncidents = null;
    this.statusSelect = 0;
    this.branchOfficeId = 0;
    this.cleanList = false;
    this.cleanCardList.emit(this.cleanList);
  }

}
