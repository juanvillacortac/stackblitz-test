import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuItem, MessageService, SelectItem } from 'primeng/api';
import { BaseModel } from 'src/app/models/common/BaseModel';
import { ColumnD } from 'src/app/models/common/columnsd';
//Service
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { PayrollCalendarService } from '../../shared/services/payroll-calendar.service';
import { PayrollTypeService } from '../../shared/services/payroll-type.service';
import { ListConceptsService } from '../../shared/services/concepts/list-concepts-service';
import { LayoutService } from 'src/app/modules/layout/shared/layout.service';
import { SecurityService } from 'src/app/modules/security/shared/services/security.service';
import { LaborRelationshipService } from '../../shared/services/labor-relationship.service';
//Model
import { PayrollCalendarFilter } from '../../shared/filters/payroll-calendar-filter';
import { PayrollTypeFilter } from '../../shared/filters/payroll-type-filter';
import { PayrollType } from '../../shared/models/masters/payroll-type';
import { PayrollCalendar } from '../../shared/models/masters/payroll-calendar';
import { CompanyOffice } from 'src/app/models/security/company-office';
import { LaborRelationshipMinimumFilter } from '../../shared/filters/laborRelationship/labor-relationship-minimum-filter';
import { LaborRelationshipMinimum } from '../../shared/models/laborRelationship/labor-relationship-minimum';
import { LaborRelationship } from '../../shared/models/laborRelationship/labor-relationship';
import { ListConceptsFilter } from '../../shared/filters/Concepts/list-concepts-filter';
import { ListConcepts } from '../../shared/models/concepts/list-concepts';
import { IncidentsFilter } from '../../shared/filters/incidents/incidents-filter';
import { IncidentsDetail } from '../../shared/models/incidents/incidents-detail';
import { IncidentsService } from '../../shared/services/incidents/incidents.service';
import { Incidents } from '../../shared/models/incidents/incidents';

@Component({
  selector: 'app-incidents-load-single',
  templateUrl: './incidents-load-single.component.html',
  styleUrls: ['./incidents-load-single.component.scss'],
  providers: [DatePipe]
})
export class IncidentsLoadSingleComponent implements OnInit {
  @Output() singleChange: EventEmitter<boolean> =  new EventEmitter<boolean>()
  _Authservice : AuthService = new AuthService(this._httpClient);
  idCompany: number = 0;
  clonedIncidentsModel: { [s: string]: IncidentsDetail; } = {};
  dateIncidents: Date;
  maxDate: Date;

  selectPayrollType: number = 0;
  payrollTypelist : SelectItem[] = [];
  payrollTypeFilter: PayrollTypeFilter = new PayrollTypeFilter();
  payrollTypeModel: PayrollType[] = [];
  payrollTypeObject: PayrollType = new PayrollType();
  payrollCalendarFilter = new  PayrollCalendarFilter();
  payDateList: SelectItem[] = [];
  paymentDate: {name:string, value:number};

  valueIncidents: number;
  selectConceptsIncidents: number;
  incidentsList: SelectItem[] = [];
  ConceptIncidentsFilter: ListConceptsFilter = new ListConceptsFilter();
  incidentsConceptsObject: ListConcepts = new ListConcepts();

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

  incidentsDetailFilterList: IncidentsFilter = new IncidentsFilter();
  incidentsModel: IncidentsDetail[] = [];
  incidentsObject: IncidentsDetail = new IncidentsDetail();
  
  dataEmploymentObject: LaborRelationship = new LaborRelationship();
  showDataEmployment: boolean = false;
  submitted: boolean = false;
  showMenssage: boolean = false;
  showCalendarPayroll: boolean = true;
  showStatus: boolean = true
  loading = false;

  statusSelect: {label: string, value:number};
  statusOption: SelectItem[] = [
    { label: 'Aprobadas', value: 100 },
    { label: 'Cargadas', value:99 },
    { label: 'Procesadas', value: 101 },
  ];

  constructor(private messageService: MessageService,
              private _payrollCalendarService :PayrollCalendarService,
              private _incidentsService: IncidentsService,
              private _listConceptsIncidentsService: ListConceptsService,
              public datepipe: DatePipe,
              private payrolltypeService: PayrollTypeService,
              private _httpClient: HttpClient,
              private _layoutSerice: LayoutService,
              private _securityService: SecurityService,
              public _laborRelationshipService: LaborRelationshipService,) { 
                this.userId = Number(this._Authservice.idUser)
              }

  ngOnInit(): void {
    this.maxDate = new Date(),
    this.idCompany = parseInt(this._Authservice.currentCompany);
    this.statusSelect = {label: 'Aprobadas', value:100};
    this.loadPayrollTypes();
    this.loadUserOffices();
    this.loadIncidentsList();
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

  loadIncidentsList() {
    this._listConceptsIncidentsService.GetListConcepts(this.ConceptIncidentsFilter).subscribe((data: ListConcepts[]) => {
      this._listConceptsIncidentsService._ListConcepts = data;
      this.incidentsList = data.sort((a, b) => a.concepts.localeCompare(b.concepts)).map<SelectItem>((item) => ({
      value: item.idConcepts,
      label: item.codConcepts+'-'+item.concepts
      }));
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
      this.getDataPayrollType();
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar la fecha de pago." });        
    });
  }

  loadEmployments() {
    this.loading = true;
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
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los trabajadores." });
    });
  }

  getDataIncidentsEmployment(){
    debugger
    this.dataEmploymentObject = this._laborRelationshipService._laborRelationshipMinimumList.find(x => x.idLaborRelationship == this.employmentSelect); 
    this.showDataEmployment = true;
  }

  enterIncidents(){
    let record = this.incidentsModel.find(x => x.idConcepts == this.selectConceptsIncidents  && x.dateIncident == this.datepipe.transform(this.dateIncidents, 'yyyy-MM-dd') );
    if(this.selectPayrollType == 0 || this.paymentDate== null || this.selectConceptsIncidents == null || this.dateIncidents == null || this.valueIncidents == null){
      this.submitted = true;
    }else if(!record){
      let segment = {
      idIncidents: -1,
      idEmploymentRelationship: this.dataEmploymentObject.idLaborRelationship,
      numEmployees: this.employmentSelect.toString(),
      employeeFirstName: '',
      employeeSecondName:'',
      employeeLastName: '',
      employeeSecondLastName:'',
      idConcepts: this.selectConceptsIncidents,
      codConcepts: this.incidentsConceptsObject.codConcepts,
      concepts: this.incidentsConceptsObject.concepts,
      idPayrollType: this.selectPayrollType,
      abbreviation: this.payrollTypeObject.abbreviation,
      payrollType: this.payrollTypeObject.name,
      idCalendar: this.paymentDate.value,
      idStatus:  this.statusSelect.value,
      status: this.statusSelect.label,
      idUnit: this.incidentsConceptsObject.idUnid,
      unit: this.incidentsConceptsObject.unid,
      valueIncident: this.valueIncidents,
      dateIncident: this.datepipe.transform(this.dateIncidents, 'yyyy-MM-dd'),
      dateCreate: '',
      dateUpdate: '',
      selected: false,

      }; 
    this.incidentsModel.push(segment)
    this.submitted=false;
    this.resetValue();
    this.singleChange.emit(true);
    }else{
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Registro duplicado, el concepto incidencia y la fecha, se encuentran en la lista." });
    }
  }

  onRowEditInit(model: IncidentsDetail) {
      this.clonedIncidentsModel[model.idIncidents] = {...model};
  }

  onRowEditSave(model: IncidentsDetail, index: number) {
      if (model.valueIncident > 0) {
        this.incidentsModel[index].valueIncident = model.valueIncident;
          delete this.clonedIncidentsModel[model.idIncidents];
      }
      else {
          this.messageService.add({severity:'error', summary: 'Error', detail:'Valor invalido'});
      }
  }

  onRowEditCancel(model: IncidentsDetail, index: number) {
    model[index] = this.clonedIncidentsModel[model.idIncidents];
    delete this.clonedIncidentsModel[model.idIncidents];
  }

  deleteIncidents(index: number){
    this.incidentsModel.splice(index,1); 
  }
  
  save(){
    let incidents = new Incidents()
    incidents.idCompany = this.idCompany;
    incidents.idTypeLoadIncidents = 1;
    incidents.incidentsDetail = this.incidentsModel;
    this._incidentsService.InsertIncidents(incidents).subscribe((data) => {
      if (data == 0) {
        this.showDataEmployment = false;
        this.incidentsModel = [];
        this.resetValue();
        this.singleChange.emit(false);
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
       
      }else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
      }
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
    });
  }

  getDataConceptsIncidents(){
    this.incidentsConceptsObject = this._listConceptsIncidentsService._ListConcepts.find(x => x.idConcepts == this.selectConceptsIncidents); 
  }

  getDataPayrollType(){
    this.payrollTypeObject = this.payrollTypeModel.find(x => x.id == this.selectPayrollType); 
  }

  resetValue(){
      this.selectConceptsIncidents = null;
      this.selectPayrollType = null;
      this.paymentDate = null;
      this.valueIncidents = null;
      this.dateIncidents = null;
      this.incidentsConceptsObject = new ListConcepts();
      this.employmentSelect = 0;
      
  }

  getCompanyId(){
    // obteniendo id de empresa en la variable localStorage
    var point1 = localStorage.getItem("_CURRENT_OFFICE").lastIndexOf(':');
    var point2 = localStorage.getItem("_CURRENT_OFFICE").lastIndexOf('}');
    var idC = localStorage.getItem("_CURRENT_OFFICE").substring(point1+1, point2);
    return idC;
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
