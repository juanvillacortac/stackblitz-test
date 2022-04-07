import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
//Service
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { PayrollCalendarService } from '../../shared/services/payroll-calendar.service';
import { PayrollTypeService } from '../../shared/services/payroll-type.service';
import { ListConceptsService } from '../../shared/services/concepts/list-concepts-service';
import { IncidentsService } from '../../shared/services/incidents/incidents.service';
//Model
import { PayrollCalendarFilter } from '../../shared/filters/payroll-calendar-filter';
import { PayrollTypeFilter } from '../../shared/filters/payroll-type-filter';
import { PayrollType } from '../../shared/models/masters/payroll-type';
import { PayrollCalendar } from '../../shared/models/masters/payroll-calendar';
import { ListConceptsFilter } from '../../shared/filters/Concepts/list-concepts-filter';
import { ListConcepts } from '../../shared/models/concepts/list-concepts';
import { IncidentsDetail } from '../../shared/models/incidents/incidents-detail';
import { LaborRelationshipMinimum } from '../../shared/models/laborRelationship/labor-relationship-minimum';
import { Incidents } from '../../shared/models/incidents/incidents';

@Component({
  selector: 'app-incidents-load-massive',
  templateUrl: './incidents-load-massive.component.html',
  styleUrls: ['./incidents-load-massive.component.scss'],
  providers: [DatePipe]
})
export class IncidentsLoadMassiveComponent implements OnInit {
  @Output() massiveChange: EventEmitter<boolean> =  new EventEmitter<boolean>()
  _Authservice : AuthService = new AuthService(this._httpClient);
  idCompany: number = 0;
  dateIncidents: Date;
  maxDate: Date;
  
  employeeList: LaborRelationshipMinimum []= [];
  
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
  
  employeeIncidentsListExisting: IncidentsDetail[] = [];
  incidentsModel: IncidentsDetail[] = [];
  clonedIncidentsModel: { [s: string]: IncidentsDetail; } = {};

  statusSelect: {label: string, value: number};
  statusOption: SelectItem[] = [
    { label: 'Aprobadas', value: 100 },
    { label: 'Cargadas', value:99 },
    { label: 'Procesadas', value: 101 },
  ]

  showCalendarPayroll: boolean = true;
  showStatus: boolean = true;
  showList: boolean = false;
  submitted: boolean = false;
  displayModal: boolean = false;
  constructor(private messageService: MessageService,
              private _payrollCalendarService :PayrollCalendarService,
              private _listConceptsIncidentsService: ListConceptsService,
              public datepipe: DatePipe,
              private payrolltypeService: PayrollTypeService,
              private _httpClient: HttpClient,
              private _incidentsService: IncidentsService) { }

  ngOnInit(): void {
    this.maxDate = new Date(),
    this.statusSelect = {label: 'Aprobadas', value:100};
    this.idCompany = parseInt(this._Authservice.currentCompany);
    this.loadPayrollTypes();
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

  loadIncidentsList() {
    this._listConceptsIncidentsService.GetListConcepts(this.ConceptIncidentsFilter).subscribe((data: ListConcepts[]) => {
      this._listConceptsIncidentsService._ListConcepts = data;
    this.incidentsList = data.sort((a, b) => a.concepts.localeCompare(b.concepts)).map<SelectItem>((item) => ({
      value: item.idConcepts,
      label: item.codConcepts +'-'+ item.concepts
      }));
    }, (error: HttpErrorResponse) => {
    this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los conceptos por incidencias" });
    });
  }

  getDataConceptsIncidents(){
    this.incidentsConceptsObject = this._listConceptsIncidentsService._ListConcepts.find(x => x.idConcepts == this.selectConceptsIncidents); 
  }

  getDataPayrollType(){
    this.payrollTypeObject = this.payrollTypeModel.find(x => x.id == this.selectPayrollType); 
  }

  showModalEmployeeList(){
    if(this.selectPayrollType == 0 || this.paymentDate== null || this.selectConceptsIncidents == 0 || this.dateIncidents == null || this.valueIncidents == null){
      this.submitted = true;
    }else{
    this.displayModal = true;
    }
  }

  uploadListEmployee(list: LaborRelationshipMinimum[]){
    console.log(list);
    var newList = [];
    list.forEach(element =>{
      var object = new IncidentsDetail();
      object.idIncidents = -1;
      object.idEmploymentRelationship = element.idLaborRelationship,
      object.numEmployees =  element.employmentCode.toString(),
      object.employeeFirstName = '';
      object.employeeSecondName = '';
      object.employeeLastName = '';
      object.employeeSecondLastName ='';
      object.idConcepts = this.selectConceptsIncidents;
      object.codConcepts =  this.incidentsConceptsObject.codConcepts;
      object.concepts = this.incidentsConceptsObject.concepts;
      object.idPayrollType = this.selectPayrollType;
      object.abbreviation = this.payrollTypeObject.abbreviation;
      object.payrollType = this.payrollTypeObject.name;
      object.idCalendar = this.paymentDate.value;
      object.idStatus = this.statusSelect.value;
      object.status = this.statusSelect.label;
      object.idUnit =  this.incidentsConceptsObject.idUnid;
      object.unit = this.incidentsConceptsObject.unid,
      object.valueIncident = this.valueIncidents;
      object.dateIncident = this.datepipe.transform(this.dateIncidents, 'yyyy-MM-dd');
      object.dateCreate = '';
      object.dateUpdate = '';
      object.selected = false;
      newList.push(object);
    })
    this.incidentsModel = newList.concat(this.incidentsModel);
    this.displayModal = false;
    this.showList = true;
    this.massiveChange.emit(true);
    console.log(this.incidentsModel);
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
    incidents.idTypeLoadIncidents = 2;
    incidents.incidentsDetail = this.incidentsModel;
    this._incidentsService.InsertIncidents(incidents).subscribe((data) => {
      if (data == 0) {
        this. resetValue();
        this.massiveChange.emit(false);
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
       
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

  onHideModal(opt: boolean){
    this.displayModal = opt;
  }

  resetValue(){
    this.selectConceptsIncidents = null;
    this.selectPayrollType = null;
    this.paymentDate = null;
    this.valueIncidents = null;
    this.dateIncidents = null;
    this.incidentsConceptsObject = new ListConcepts();
    this.showList = false;
    this.incidentsList = [];
  }

}
