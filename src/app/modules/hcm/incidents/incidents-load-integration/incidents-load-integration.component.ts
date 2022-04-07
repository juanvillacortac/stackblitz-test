import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuItem, MessageService, SelectItem } from 'primeng/api';
import { BaseModel } from 'src/app/models/common/BaseModel';
//Service
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { PayrollCalendarService } from '../../shared/services/payroll-calendar.service';
import { PayrollTypeService } from '../../shared/services/payroll-type.service';
import { LayoutService } from 'src/app/modules/layout/shared/layout.service';
import { SecurityService } from 'src/app/modules/security/shared/services/security.service';
import { IncidentsService } from '../../shared/services/incidents/incidents.service';
import { ListConceptsService } from '../../shared/services/concepts/list-concepts-service';
//Model
import { CompanyOffice } from 'src/app/models/security/company-office';
import { PayrollCalendarFilter } from '../../shared/filters/payroll-calendar-filter';
import { PayrollTypeFilter } from '../../shared/filters/payroll-type-filter';
import { PayrollType } from '../../shared/models/masters/payroll-type';
import { PayrollCalendar } from '../../shared/models/masters/payroll-calendar';
import { ListConceptsFilter } from '../../shared/filters/Concepts/list-concepts-filter';
import { ListConcepts } from '../../shared/models/concepts/list-concepts';
import { IncidentsDetail } from '../../shared/models/incidents/incidents-detail';
import { IncidentsIntegrationFilter } from '../../shared/filters/incidents/incidents-integration-filter';
import { Incidents } from '../../shared/models/incidents/incidents';
import { LaborRelationshipMinimumFilter } from '../../shared/filters/laborRelationship/labor-relationship-minimum-filter';
import { LaborRelationshipService } from '../../shared/services/labor-relationship.service';
import { LaborRelationshipMinimum } from '../../shared/models/laborRelationship/labor-relationship-minimum';

@Component({
  selector: 'app-incidents-load-integration',
  templateUrl: './incidents-load-integration.component.html',
  styleUrls: ['./incidents-load-integration.component.scss'],
  providers: [DatePipe]
})
export class IncidentsLoadIntegrationComponent implements OnInit {
  @Output() integrationChange: EventEmitter<boolean> =  new EventEmitter<boolean>()
  _Authservice : AuthService = new AuthService(this._httpClient);
  idCompany: number = 0;
  dateIncidents: Date;
  maxDate: Date;


  selectPayrollType: number = 0;
  payrollTypelist : SelectItem[] = [];
  payrollTypeModel: PayrollType[] = [];
  payrollTypeObject: PayrollType = new PayrollType();
  payrollTypeFilter: PayrollTypeFilter = new PayrollTypeFilter();
  payrollCalendarFilter = new  PayrollCalendarFilter();
  payDateList: SelectItem[] = [];
  paymentDate: {name:string, value:number};

  valueIncidents: number;
  selectConceptsIncidents: number = 0;
  incidentsList: SelectItem[] = [];
  ConceptIncidentsFilter: ListConceptsFilter = new ListConceptsFilter();
  incidentsConceptsObject: ListConcepts = new ListConcepts();

  incidentsIntegrationFilter: IncidentsIntegrationFilter = new IncidentsIntegrationFilter();
  incidentsModel: IncidentsDetail[] = [];
  clonedIncidentsModel: { [s: string]: IncidentsDetail; } = {};

  employmentCode: number;
  laborRelationshipMinimumFiltersSearch: LaborRelationshipMinimumFilter = new LaborRelationshipMinimumFilter();
  employmentList: SelectItem[]= [];
  employmentModel: LaborRelationshipMinimum [] = [];
  employmentSelect: number = 0;

  userOffices: SelectItem[] = [];
  userId: number;
  currentOffice: any;
  branchOfficesList: CompanyOffice[] = [];
  branchOfficeId: number= 0;
  menu: MenuItem[];

  enableEmploymentList: boolean = true;
  showCalendarPayroll: boolean = true;
  showList: boolean = false;
  showStatus: boolean = true;
  submitted: boolean = false;
  constructor(private messageService: MessageService,
              private _payrollCalendarService :PayrollCalendarService,
              private _listConceptsIncidentsService: ListConceptsService,
              public datepipe: DatePipe,
              private payrolltypeService: PayrollTypeService,
              private _incidentsService: IncidentsService,
              private _httpClient: HttpClient,
              private _layoutSerice: LayoutService,
              private _securityService: SecurityService,
              public _laborRelationshipService: LaborRelationshipService,) {
                this.userId = Number(this._Authservice.idUser);
               }

  ngOnInit(): void {
    this.maxDate = new Date(),
    this.idCompany = parseInt(this._Authservice.currentCompany);
    this.loadPayrollTypes();
    this.loadIncidentsList();
    this.loadUserOffices();
  }

  loadPayrollTypes() {
    this.payrollTypeFilter.idCompany = parseInt(this._Authservice.currentCompany);
    this.payrolltypeService.GetPayrollTypes(this.payrollTypeFilter).subscribe((data: PayrollType[]) => {
      this.payrollTypeModel = data;
      this.payrollTypelist = data.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item) => ({
        value: item.id,
        label: item.name
        }));
    }, (error: HttpErrorResponse) => {
    this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los Tipo de nómina" });
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
      this.getDataPayrollType();
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar la fecha de pago." });        
    });
  }

  loadEmployment() {
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
      this.employmentModel = data;
      this.employmentList = data.sort((a, b) => a.documentNumber.localeCompare(b.documentNumber)).map<SelectItem>((item) => ({
        value:item.idLaborRelationship,
        label: item.employmentCode +"-"+ item.identifier +""+ item.documentNumber +"-"+ item.employeeName,
        })); 
      this.employmentList.push({label: "Todos", value: -1})
      this.employmentList.sort((a, b) => {if(a.label < b.label || a.value == -1){return -1}if(a.label > b.label){return 1}return 0});
    }, (error: HttpErrorResponse) => {  
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los trabajadores." });
    });
  }
  
  loadIncidentsList() {
    this._listConceptsIncidentsService.GetListConcepts(this.ConceptIncidentsFilter).subscribe((data: ListConcepts[]) => {
      this._listConceptsIncidentsService._ListConcepts = data;
    this.incidentsList = data.sort((a, b) => a.concepts.localeCompare(b.concepts)).map<SelectItem>((item) => ({
      value: item.idConcepts,
      label: item.codConcepts +'-'+ item.concepts
      }));
      this.incidentsList.push({label: "Todos", value: -1})
      this.incidentsList.sort((a, b) => {if(a.label < b.label || a.value == -1){return -1}if(a.label > b.label){return 1}return 0});
    }, (error: HttpErrorResponse) => {
    this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los conceptos por incidencias" });
    });
  }

  getDataPayrollType(){
    this.payrollTypeObject = this.payrollTypeModel.find(x => x.id == this.selectPayrollType); 
  }

  getDataConceptsIncidents(){
    this.incidentsConceptsObject = this._listConceptsIncidentsService._ListConcepts.find(x => x.idConcepts == this.selectConceptsIncidents); 
  }

  search(){
    if(this.selectPayrollType == 0 || this.paymentDate == null){
      this.submitted = true;
    }else{
      if(this.branchOfficeId  == 0 && this.selectConceptsIncidents == 0 && this.employmentSelect == 0 && this.dateIncidents == null){
        this.branchOfficeId = -1;
        this.selectConceptsIncidents = -1;
        this.employmentSelect = -1;
        this.loadEmployment();
      }
        this.incidentsIntegrationFilter.idCompany = this.idCompany;
        this.incidentsIntegrationFilter.idEmploymentRelationship = this.employmentSelect;
        this.incidentsIntegrationFilter.idConcepts = this.selectConceptsIncidents;
        this.incidentsIntegrationFilter.numEmployees = '';
        this.incidentsIntegrationFilter.dateIncidents = this.dateIncidents == null ? '' : this.datepipe.transform(this.dateIncidents,'yyyy-MM-dd');
        this._incidentsService.GetIncidentsIntegration(this.incidentsIntegrationFilter).subscribe((data: IncidentsDetail[]) => {
        this.incidentsModel = data;
        
        this.incidentsModel.forEach(element =>{
          element.abbreviation = this.payrollTypeObject.abbreviation;
          element.idPayrollType = this.selectPayrollType;
          element.idCalendar = this.paymentDate.value;
          element.idIncidents = -1;
        });
        this.showList = true;
        this.integrationChange.emit(true);
      }, (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
      });
    }
  }

  onRowEditInit(model: IncidentsDetail) {
    debugger
      this.clonedIncidentsModel[model.idEmploymentRelationship] = {...model};
  }

  onRowEditSave(model: IncidentsDetail, index: number) {
    if (model.valueIncident > 0) {
      this.incidentsModel[index].valueIncident = model.valueIncident;
        delete this.clonedIncidentsModel[model.idEmploymentRelationship];       
    }
    else {
        this.messageService.add({severity:'error', summary: 'Error', detail:'Valor invalido'});
    }
  }

  onRowEditCancel(model: IncidentsDetail, index: number) {
    model[index] = this.clonedIncidentsModel[model.idEmploymentRelationship];
    delete this.clonedIncidentsModel[model.idEmploymentRelationship];
  }

  deleteIncidents(index: number){
    this.incidentsModel.splice(index,1); 
  }

  save(){
    let incidents = new Incidents()
    incidents.idCompany = this.idCompany;
    incidents.idTypeLoadIncidents = 4;
    incidents.incidentsDetail = this.incidentsModel;
    this._incidentsService.InsertIncidents(incidents).subscribe((data) => {
      if (data == 0) {
        this. resetValue();
        this.integrationChange.emit(false);
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
       
      }else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
      }
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
    });
  }

  resetValue(){
    this.selectConceptsIncidents = 0;
    this.selectPayrollType = 0;
    this.paymentDate = null;
    this.incidentsConceptsObject = new ListConcepts();
    this.showList = false;
    this.incidentsModel = [];
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

}
