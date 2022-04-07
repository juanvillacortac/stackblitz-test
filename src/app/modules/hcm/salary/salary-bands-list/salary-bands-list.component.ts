import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
//Service
import { SalaryRangeService } from '../../shared/services/salaries/salary-range.service';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';

//Model
import { Coins } from 'src/app/models/masters/coin';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { SalaryRangeFilter } from '../../shared/filters/salaries/salary-range-filter';
import { SalaryRangeViewFilter } from '../../shared/filters/salaries/salary-range-view-filter';
import { SalaryRange } from '../../shared/models/salaries/salary-range';
import { JobPositionFilter } from '../../shared/filters/job-position-filter';
import { SalaryTypeFilter } from '../../shared/filters/salary-type-filter';
import { SalaryTypeService } from '../../shared/services/salary-type.service';
import { JobPositionService } from '../../shared/services/job-position.service';
import { SalaryType } from '../../shared/models/masters/salary-type';
import { JobPosition } from '../../shared/models/masters/job-position';
import * as moment from 'moment';

@Component({
  selector: 'app-salary-bands-list',
  templateUrl: './salary-bands-list.component.html',
  styleUrls: ['./salary-bands-list.component.scss']
})
export class SalaryBandsListComponent implements OnInit {
  permissionsIDs = { ...Permissions };
  //var
  showFilters : boolean = true;
  showModal: boolean = false;
  showList:boolean = false;
  notFound: boolean = true;
  loading = false;

  _Authservice : AuthService = new AuthService(this._httpClient);
  salaryRangeList: SalaryRange [] = []; // Data show in the table
  salaryRangeModel: SalaryRange [] = [];// all data salary range
  salaryRangeObject: SalaryRange;// Save data by send the DB
  salaryRangeFilter: SalaryRangeFilter = new SalaryRangeFilter;
  salaryRangeViewFilter: SalaryRangeViewFilter = new SalaryRangeViewFilter;
  
  jobPositionFilter: JobPositionFilter = new JobPositionFilter();
  salaryTypeFilter: SalaryTypeFilter = new SalaryTypeFilter();
  coinFilter: CoinxCompanyFilter = new CoinxCompanyFilter();
  salaryTypeSelect: SelectItem[];
  jobPositionSelect: SelectItem[];
  coinModelOpction:SelectItem[];

  all: SelectItem =
  { label: "Todos", value: '-1' };
  idCurrency: number;
  index: number= -1;
  public expandedRows = {};
  public isExpanded:boolean = false;
  public temDataLength:number = 0;

  displayedColumns: ColumnD<SalaryRange>[] =
  [
   {template: (data) => { return data.jobPosition; }, field: 'jobPosition', header: 'Cargo', display: 'table-cell'},
   {template: (data) => { return data.typeSalary; }, field: 'typeSalary', header: 'Tipo sueldo', display: 'table-cell'},
   {template: (data) => { return data.symbol + data.minAmount.toLocaleString('de-DE',{minimumFractionDigits: 2, maximumFractionDigits: 2}); }, field: 'minAmount', header: 'Mínimo', display: 'table-cell'},
   {template: (data) => { return data.symbol + data.maxAmount.toLocaleString('de-DE',{minimumFractionDigits: 2, maximumFractionDigits: 2}); }, field: 'maxAmount', header: 'Máximo', display: 'table-cell'},
   {template: (data) => { return data.abbreviation; }, field: 'abbreviation', header: 'Moneda', display: 'table-cell'},
  ];

  constructor(
    private _salaryRangeService: SalaryRangeService,
    private _httpClient: HttpClient,
    private _jobPositionService: JobPositionService,
    private _salaryTypeService: SalaryTypeService,
    private _currency: CoinsService,
    private messageService: MessageService,
    public userPermissions: UserPermissions
  ) { }

  ngOnInit(): void {


    // On load data for dropdown
    this.loadJobPosition();
    this.loadSalaryType();
    this.onLoadCurrency();
    this.salaryRangeList = [];
  }

  search(e: SalaryRangeViewFilter){
    this.salaryRangeFilter.idCompany = parseInt(this._Authservice.currentCompany);
    this._salaryRangeService.GetSalaryRangeList(this.salaryRangeFilter).subscribe((data: SalaryRange[]) => {
        this.salaryRangeModel = data;
        this.salaryRangeList = this.salaryRangeModel.filter(x => (x.idJobPosition == e.jobPosition.value || e.jobPosition.value == -1) 
          && (x.idTypeSalary == e.typeSalary.value || e.typeSalary.value == -1) 
          && ( x.idCurrency == e.Currency.value || e.Currency.value == -1))
          this.showList= true;
      }, (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error" });
    });
  }

  newSalaryBands(){
    this.salaryRangeObject = new SalaryRange();
    this.jobPositionSelect.splice(-1,1);
    this.salaryTypeSelect.splice(-1,1);
    this.showModal = true;
    
  }

  onEdit(index){
    this.salaryRangeObject = new SalaryRange();
    this.salaryRangeObject.idSalaryRange = this.salaryRangeList[index].idSalaryRange;
    this.salaryRangeObject.idJobPosition = this.salaryRangeList[index].idJobPosition;
    this.salaryRangeObject.jobPosition = this.salaryRangeList[index].jobPosition;
    this.salaryRangeObject.idTypeSalary = this.salaryRangeList[index].idTypeSalary;
    this.salaryRangeObject.typeSalary = this.salaryRangeList[index].typeSalary;
    this.salaryRangeObject.minAmount = this.salaryRangeList[index].minAmount;
    this.salaryRangeObject.maxAmount = this.salaryRangeList[index].maxAmount;
    this.salaryRangeObject.conversionFactor = this.salaryRangeList[index].conversionFactor;
    this.salaryRangeObject.abbreviation = this.salaryRangeList[index].abbreviation;
    this.showModal= true;
  }

  loadJobPosition(){
    this.jobPositionFilter.company = parseInt(this._Authservice.currentCompany);
    this._jobPositionService.GetJobPosition(this.jobPositionFilter).subscribe((data: JobPosition[]) => {
      this.jobPositionSelect = data.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item) => ({
        value: item.id,
        label: item.name.split(';')[0]
      }));
      this.jobPositionSelect.push(this.all);
      }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los Cargos" });
  });
  }

  loadSalaryType(){
    this.salaryTypeFilter.companyId = parseInt(this._Authservice.currentCompany);
    this._salaryTypeService.GetSalaryType(this.salaryTypeFilter).subscribe((data: SalaryType[]) => {
      this.salaryTypeSelect = data.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item) => ({
        value: item.id,
        label: item.name
      }));
      this.salaryTypeSelect.push(this.all);
      }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los Tipo de Salarios" });
  });
}

  onLoadCurrency(){  
    this.coinFilter.idCompany = parseInt(this._Authservice.currentCompany);
    this._currency.getCoinxCompanyList(this.coinFilter).subscribe((valor: Coins[]) => {
      this.coinModelOpction = valor.sort((a, b) => a.name.localeCompare(b.name)).map<SelectItem>((item) => ({
        value: item.id,
        label: item.name
      }));
      this.coinModelOpction.push(this.all);
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error" });
    });
  }

  saveSalaryRange(){    
    debugger
    this.salaryRangeObject.idCompany = parseInt(this._Authservice.currentCompany);
    this._salaryRangeService.PostSalaryRange(this.salaryRangeObject).subscribe((data) => {
      if (data == 0) {
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
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

  processSalaryRange(record: SalaryRange) { 
      this.salaryRangeObject = record;
      this.saveSalaryRange();
  }

  resetValues(valor: boolean){  //se ejecuta cada vez que se sale de un modal (editar o eliminar) sin realizar cambios
    this.showModal = valor;
    this.search(this.salaryRangeViewFilter);
    this.loadJobPosition();
    this.loadSalaryType();
    this.onLoadCurrency();
  }

  onRowExpand() {
    console.log("row expanded", Object.keys(this.expandedRows).length);
    if(Object.keys(this.expandedRows).length === this.temDataLength){
      this.isExpanded = true;
      console.log(this.expandedRows);
      console.log("true");
    }
  }
  onRowCollapse() {
    console.log("row collapsed",Object.keys(this.expandedRows).length);
    if(Object.keys(this.expandedRows).length === 0){
      this.isExpanded = false;
      console.log(this.expandedRows);
      console.log("false");
    }
  }

  clearList(){
    this.showList = false;
    this.salaryRangeList = [];
  }

}
