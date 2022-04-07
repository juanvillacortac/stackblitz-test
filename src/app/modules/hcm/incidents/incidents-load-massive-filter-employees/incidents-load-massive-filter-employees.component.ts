import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem, MessageService, SelectItem } from 'primeng/api';
import { BaseModel } from 'src/app/models/common/BaseModel';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
//Service
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { PayrollClassService } from '../../shared/services/payroll-class.service';
import { LayoutService } from 'src/app/modules/layout/shared/layout.service';
import { SecurityService } from 'src/app/modules/security/shared/services/security.service';
import { IncidentsService } from '../../shared/services/incidents/incidents.service';
//Model
import { PayrollClassFilter } from '../../shared/filters/laborRelationship/payroll-class-filter';
import { PayrollClass } from '../../shared/models/laborRelationship/payroll-class';
import { CompanyOffice } from 'src/app/models/security/company-office';
import { LaborRelationshipMinimumFilter } from '../../shared/filters/laborRelationship/labor-relationship-minimum-filter';
import { LaborRelationshipMinimum } from '../../shared/models/laborRelationship/labor-relationship-minimum';
import { LaborRelationshipService } from '../../shared/services/labor-relationship.service';
import { IncidentsDetail } from '../../shared/models/incidents/incidents-detail';
import { IncidentsFilter } from '../../shared/filters/incidents/incidents-filter';
import { DatePipe } from '@angular/common';
import { element } from 'protractor';


@Component({
  selector: 'app-incidents-load-massive-filter-employees',
  templateUrl: './incidents-load-massive-filter-employees.component.html',
  styleUrls: ['./incidents-load-massive-filter-employees.component.scss'],
  providers: [DatePipe]
})
export class IncidentsLoadMassiveFilterEmployeesComponent implements OnInit {
  @Input() showPanel: boolean;
  @Input() employeeIncidentsMassive: IncidentsDetail[];
  @Input() idConcepts: number;
  @Input() dateIncidents: Date;
  @Input() employeeList: LaborRelationshipMinimum []= [];
  @Output() returnList: EventEmitter<LaborRelationshipMinimum[]> = new EventEmitter<LaborRelationshipMinimum[]>();
  @Output() backUnChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  _Authservice : AuthService = new AuthService(this._httpClient);
  idCompany: number = 0;

  incidentsDetailFilterList: IncidentsFilter = new IncidentsFilter();

  payrollClassFilter: PayrollClassFilter = new PayrollClassFilter();
  payrollTypeDropdown: SelectItem[] = [];
  payrollClassDropdown: SelectItem[] = [];
  selectClass: number = -1;
  employmentDate: Date;
  seniorityDate: Date;

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
  

  loading: boolean = false;
  messageSearch: string = "";
  constructor(private messageService: MessageService,
              private _payrollClassService: PayrollClassService,
              private _httpClient: HttpClient,
              private _layoutSerice: LayoutService,
              private _securityService: SecurityService,
              public _laborRelationshipService: LaborRelationshipService,
              private _incidentsService: IncidentsService,
              public datepipe: DatePipe) { 
                this.userId = Number(this._Authservice.idUser);
              }

  ngOnInit(): void {
    this.idCompany = parseInt(this._Authservice.currentCompany);
    this.loadPayrollClass();
    this.loadUserOffices();
    this.getDataIncidentsEmployment();
  }

  loadPayrollClass(){
    this._payrollClassService.GetPayrollClasses(this.payrollClassFilter).subscribe((data: PayrollClass[]) =>{
      this.payrollClassDropdown = data.map((item) =>({
        label: item.payrollClassName,
        value: item.id
      }));
    })
  }

  getDataIncidentsEmployment(){
    debugger
    this.incidentsDetailFilterList.idCompany = this.idCompany;
    this.incidentsDetailFilterList.idConcepts = this.idConcepts;
    this.incidentsDetailFilterList.dateIncidents = this.datepipe.transform(this.dateIncidents, 'yyyy-MM-dd');
    this._incidentsService.GetIncidents(this.incidentsDetailFilterList).subscribe((data: IncidentsDetail[]) => {
      debugger
      this.employeeIncidentsMassive = data;
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
    // this.showDataEmployment = true;
  }

  loadEmployment() {
    this.loading = true;
    this.employeeList =  [];
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
      idPayrollClass: this.selectClass,
      idTypeDocument: -1,
    }
    this._laborRelationshipService.GetLaborRelationshipMinimum(this.laborRelationshipMinimumFiltersSearch).subscribe((data: LaborRelationshipMinimum[]) => {
      //this.employeeList = data;
      if(data.length == 0){
        this.messageSearch = "No existen resultados que coincidan con la búsqueda."
      }else{
        this.messageSearch ="";
        data.forEach(element =>{
          var existe = this.employeeIncidentsMassive.find(x => x.numEmployees == element.employmentCode);
          if(!existe){
            element.selected = true;
            this.employeeList.push(element);
          }
        });
      }
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los trabajadores." });
    });
  }

  submit(){
    var listChecked = this.employeeList.filter(x => x.selected);
    if(listChecked.length == 0){
      this.messageService.add({severity: 'error', summary: 'Error', detail: "Debe agregar por lo menos un trabajador válido"});
    }else{
      this.returnList.emit(listChecked);
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
  
  clearFilters(){
    this.branchOfficeId = 0;
    this.selectClass = -1;
    this.employeeList = [];
  }

  outForm(){
    this.backUnChange.emit(false);
  }

}
