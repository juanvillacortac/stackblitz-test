import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Coins } from 'src/app/models/masters/coin';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { CountryService } from 'src/app/modules/masters/country/shared/services/country.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { companyjobpositionsfilter } from '../../shared/filters/company-jobpositions-filter';
import { companylevelsfilter } from '../../shared/filters/company-levels-filter';
import { JobPositionAdjustementFilter } from '../../shared/filters/salaries/job-position-adjustement-filter';
import { SalaryTypeFilter } from '../../shared/filters/salary-type-filter';
import { companyjobposition } from '../../shared/models/masters/company-jobposition';
import { companylevel } from '../../shared/models/masters/company-level';
import { SalaryType } from '../../shared/models/masters/salary-type';
import { Salaries } from '../../shared/models/salaries/salaries';
import { SalaryByLaborRelationship } from '../../shared/models/salaries/salary-labor-relationship';
import { CompanyService } from '../../shared/services/company.service';
import { SalaryByLaborRelationshipService } from '../../shared/services/salaries/salary-labor-relationship.service';
import { SalaryTypeService } from '../../shared/services/salary-type.service';
import { UserService } from '../../shared/services/user.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'app-salary-adjustment-job-position',
  templateUrl: './salary-adjustment-job-position.component.html',
  styleUrls: ['./salary-adjustment-job-position.component.scss']
})
export class SalaryAdjustmentJobPositionComponent implements OnInit {

  constructor(
    private _httpClient: HttpClient, 
    private salaryAdjustmentSingle: SalaryByLaborRelationshipService, 
    private messageService: MessageService,
    private companyService: CompanyService,
    public userPermissions: UserPermissions,
    private _userService: UserService,
    private _salaryTypeService: SalaryTypeService,
    public _Currency: CoinsService,) { }

    permissionsIDs = { ...Permissions };
  _Authservice : AuthService = new AuthService(this._httpClient);
  salaryAdjustmentJobPositionFilter: JobPositionAdjustementFilter = new JobPositionAdjustementFilter();
  jobPositionSalary: SalaryByLaborRelationship;
  salariesList: Salaries[] = [];
  salariesEditList: Salaries[] = [];
  idCompany: number;
  submitted: boolean = false;
  //search3: boolean = false;
  searchLevel: number = -1;
  showFilters: boolean = true;
  showTable: boolean = false; 
  access: boolean = false;
  coin: Coins;
  coinFilter: CoinxCompanyFilter = new CoinxCompanyFilter();
  companylevelsFilters: companylevelsfilter = new companylevelsfilter();
  jobpositionsFilters: companyjobpositionsfilter = new companyjobpositionsfilter();

  levelsDropdown: SelectItem[] = [];
  jobpositionsDropdown: SelectItem[];
  newAdjustment: Salaries;
  panelTitle: string = "";
  idAux: number = -2;
  position: number;
  showSidebar: boolean = false;
  coinDropdown: SelectItem[];
  coinOption: number = 0;

  listTable: any[] = [];
  salaryTypesDropdown: SelectItem[] = [];
  salaryTypesArray: SelectItem[] = [];
  salaryTypeCreate: SelectItem;

  @Output() jobPositionChange: EventEmitter<boolean> =  new EventEmitter<boolean>()

  ngOnInit(): void {
    this.idCompany = parseInt(this._Authservice.currentCompany);
    this.onLoadCompanyLevels();
    this.loadSalaryTypes();
    this.loadCurrency();
    //this.loadNonNaturalIdentifiersType();
  }

  loadSalaryTypes(){
    var filter = new SalaryTypeFilter();
    filter.companyId = this.idCompany; 
    this._salaryTypeService.GetSalaryType(filter).subscribe( (data: SalaryType[]) => {
      if (data != null) {
          this.salaryTypesArray = data.map<SelectItem>((item)=>(
              {
                value: item.id,
                label: item.name
              }
          ));
      }
    },
    (error) => {
      this.messageService.add({severity: 'error', summary: 'Carga de tipo de salarios', detail: 'Error al cargar los tipos de salario'});
    }); 
  }

  loadCurrency(){  
    this.coinFilter.idCompany = parseInt(this._Authservice.currentCompany);
    this._Currency.getCoinxCompanyList(this.coinFilter).subscribe((valor: Coins[]) => {
      this.coinDropdown = valor.map<SelectItem>((item) => ({
        value: item.id,
        label: item.name
      }));
      this.coinDropdown.push({value: -1, label:'Todos'});
      this.coinDropdown.sort((a, b) => { if(a.label < b.label || a.value == -1){return -1} if(a.label > b.label){return 1} return 0});
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error" });
    });
  }

  searchSalaryAdjustment(){
    this.salaryAdjustmentJobPositionFilter.idJobPosition = this.salaryAdjustmentJobPositionFilter.idJobPosition == undefined ? -1 : this.salaryAdjustmentJobPositionFilter.idJobPosition;
    if(this.salaryAdjustmentJobPositionFilter.idJobPosition != -1){ //si se elige un cargo
      this.submitted = false;
      this.salaryAdjustmentSingle.getJobPositionSalaries(this.salaryAdjustmentJobPositionFilter).subscribe((data: SalaryByLaborRelationship) => {
        this.showTable = true;
        this.jobPositionSalary = new SalaryByLaborRelationship;
        this.jobPositionSalary = data;
        this.salariesEditList = this.jobPositionSalary.salaries;

        if(this.coinOption > 0){  //si se filtró un tipo de moneda
          this.salariesList = this.salariesEditList.filter(x => x.salary?.idCurrency == this.coinOption);
        }else{
          this.salariesList = this.salariesEditList;
        }
        debugger;
        this.listTable = [];
        var object: any;
        this.salariesList.forEach(element => {
          if(element.salary.idSalaryByLaborRelationship == undefined || element.salary.idSalaryByLaborRelationship == -1){  //si es una insercion
            this.idAux--;
            element.salary.idSalaryByLaborRelationship = this.idAux;
          }
          if(element.adjustment == null){ //si se trata de un salario sin ajustes
            object = {
              idSalaryType: element.salary.idSalaryType,
              salaryType: element.salary.salaryType,
              idSalaryByLaborRelationship: element.salary.idSalaryByLaborRelationship,
              amount: element.salary.amount,
              adjustmentAmount: 0,
              validityDate: null,
              idSalaryReason: -1,
              adjustmentPercentage: 0,
              salaryReason: "-",
              idSalaryAdjustment: -1,
              idSalaryAdjustmentType: 2,  //ajuste por cargo
              access: true    //necesario para mostrar en el componente salary-adjustment-table
            }
          }else{
            var validate = element.adjustment.idSalaryAdjustmentType == 2 ? true : false;
            object = {
              idSalaryType: element.salary.idSalaryType,
              salaryType: element.salary.salaryType,
              idSalaryByLaborRelationship: element.salary.idSalaryByLaborRelationship,
              amount: element.salary.amount,
              adjustmentAmount: element.adjustment?.adjustmentAmount == undefined ? '-' : element.adjustment.adjustmentAmount,
              validityDate: element.adjustment?.validityDate == undefined ? null : element.adjustment.validityDate,
              idSalaryReason: element.adjustment?.idSalaryReason == undefined ? -1 : element.adjustment.idSalaryReason,
              adjustmentPercentage: element.adjustment?.adjustmentPercentage == undefined ? 0 : element.adjustment.adjustmentPercentage,
              salaryReason: element.adjustment?.salaryReason == undefined ? '-' : element.adjustment.salaryReason,
              idSalaryAdjustment: element.adjustment?.idSalaryAdjustment == undefined ? -1 : element.adjustment.idSalaryAdjustment,
              idSalaryAdjustmentType: element.adjustment?.idSalaryAdjustmentType == undefined ? 2 : element.adjustment.idSalaryAdjustmentType,
              currencySymbol: element.salary.currencySymbol,
              access: this.userPermissions.allowed(this.permissionsIDs.MANAGE_JOB_POSITION_ADJUSTMENT_HCM_PERMISSION_ID) && validate ? true : false
            }
          }
          this.listTable.push(object);
        });
        this.access = this.userPermissions.allowed(this.permissionsIDs.MANAGE_JOB_POSITION_ADJUSTMENT_HCM_PERMISSION_ID); //permiso para crear ajustes por cargo
       
        debugger;//se toman los tipos de sueldos diferentes de los que tienen ajustes para mostrarlos en el dropdown del formulario de creacion
        this.salaryTypesDropdown = (this.salaryTypesArray.filter(x => this.salariesEditList.findIndex( y => y.salary.idSalaryType == x.value) == -1)).
        sort((a, b) => { if(a.label < b.label || a.value == -1){return -1} if(a.label > b.label){return 1} return 0});
      }, (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los salarios" });
     });
    }else{
      this.submitted = true;
    }   

  }

  onLoadCompanyLevels(){
    debugger;
    this.companylevelsFilters.Company = this.idCompany;
    this.companyService.getCompanyLevels(this.companylevelsFilters).subscribe((data: companylevel[]) => {
      this.levelsDropdown = data.map<SelectItem>((item)=>(
        {
          value: item.id,
          label: item.description
        }
    ));
    this.levelsDropdown.sort((a, b) => { if(a.label.toUpperCase() < b.label.toUpperCase() || a.value == -1){return -1} if(a.label.toUpperCase() > b.label.toUpperCase()){return 1} return 0});
    },
      (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar Niveles" });
      });
  }

  onLoadJobPosition(idLevel: number){
    this.jobpositionsDropdown = [];
    this.jobpositionsFilters.Company = this.idCompany;
    this.jobpositionsFilters.hierarchicalLevel = idLevel;
    this.salaryAdjustmentJobPositionFilter.idJobPosition =- 1;
    this.companyService.getCompanyJobPositions(this.jobpositionsFilters).subscribe((data: companyjobposition[]) => {
      if(data != null) {
        data.forEach(element => { //data contiene los nombre de los cargos con los indicadores de plazas (fija y temporal)

          var obj = {value:0, label:""}
          obj.value = element.id;
          var size: string[] = element.name.split(";");
          obj.label = size[0];  //agrega al label solo el nombre del cargo
          this.jobpositionsDropdown.push(obj);
        });
        //ordenamiento del desplegable
        this.jobpositionsDropdown.sort((a, b) => { if(a.label < b.label || a.value == -1){return -1} if(a.label > b.label){return 1} return 0});
      }
    },
      (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar Cargos" });
      });
  }

  createNew(){
    debugger;
    var register = {
      idSalaryByLaborRelationship: -1,
      idSalaryAdjustment: -1
    };
    this.sendPanel(register);
  }

  sendPanel(record: any){
    //llamada al formulario de creacion/edicion
    debugger;
    this.newAdjustment = new Salaries();
    if(record.idSalaryByLaborRelationship == -1){ //si se crea un nuevo ajuste
      this.newAdjustment.salary.idSalaryType = -1
      this.newAdjustment.salary.salaryType = "";
      this.newAdjustment.salary.amount = 0;
      this.newAdjustment.adjustment.idSalaryAdjustment = record.idSalaryAdjustment;
      this.newAdjustment.adjustment.idSalaryAdjustmentType = 2;
      this.newAdjustment.adjustment.idSalaryReason = -1;
      this.newAdjustment.adjustment.salaryReason = "";
      this.newAdjustment.adjustment.adjustmentAmount = 0;
      this.newAdjustment.adjustment.adjustmentPercentage = 0;
      this.newAdjustment.adjustment.validityDate = null
      this.panelTitle = "Sueldo";
    }else{    
      //si se edita un ajuste existente
       var obj = this.salariesList.find(x => x.salary.idSalaryType == record.idSalaryType);
      this.position = this.salariesList.findIndex(x => x == obj);
      this.newAdjustment.salary = obj.salary;
      this.newAdjustment.adjustment.idSalaryAdjustment = record.idSalaryAdjustment;
      this.newAdjustment.adjustment.idSalaryAdjustmentType = record.idSalaryAdjustmentType;
      this.newAdjustment.adjustment.idSalaryReason = record.idSalaryReason;
      this.newAdjustment.adjustment.salaryReason = record.salaryReason;
      this.newAdjustment.adjustment.adjustmentAmount = record.adjustmentAmount == '-' ? 0 : record.adjustmentAmount;
      this.newAdjustment.adjustment.adjustmentPercentage = record.adjustmentPercentage;
      this.newAdjustment.adjustment.validityDate = record.validityDate;
      this.panelTitle = record.salaryType;
    }
    this.showSidebar = true;
  }

  resetValues(val: boolean){
    this.showSidebar = val;
  }

  saveAdjustment(record: Salaries){
    debugger;
    if(record.salary.idSalaryByLaborRelationship == -1){
      //si se trata de un ajuste nuevo, se le asigna un id negativo diferente de -1 para identificarlo mientras este en memoria
      this.idAux--;
      record.adjustment.idSalaryAdjustment = this.idAux;
      record.salary.idSalaryByLaborRelationship = this.idAux;
      this.position = this.salariesList.length; //se le asigna la ultima posicion dentro de la lista
      record.salary.salaryType = this.salaryTypesDropdown.find(x => x.value == record.salary.idSalaryType).label; //se completa el campo tipo de salario
    }
    record.adjustment.idSalaryAdjustmentType = 2;
    this.salariesList[this.position] = record;
    //Se excluye el tipo de salario en el dropdown de crear ajustes, debido a que se creo
    this.salaryTypesDropdown =  this.salaryTypesDropdown.filter(x => x.value != record.salary.idSalaryType);

    this.listTable = [];  ///se vacia y actualiza listTable
    this.salariesList.forEach(element => {
      var validate;
      if(element.adjustment){
        validate = element.adjustment.idSalaryAdjustmentType == 2 ? true : false;
      }else{
        validate = true;
      }
      var object = {
        idSalaryType: element.salary.idSalaryType,
        salaryType: element.salary.salaryType,
        idSalaryByLaborRelationship: element.salary.idSalaryByLaborRelationship,
        amount: element.salary.amount,
        adjustmentAmount: element.adjustment?.adjustmentAmount == undefined ? 0 : element.adjustment.adjustmentAmount,
        validityDate: element.adjustment?.validityDate == undefined ? null : element.adjustment.validityDate,
        idSalaryReason: element.adjustment?.idSalaryReason == undefined ? -1 : element.adjustment.idSalaryReason,
        adjustmentPercentage: element.adjustment?.adjustmentPercentage == undefined ? 0 : element.adjustment.adjustmentPercentage,
        salaryReason: element.adjustment?.salaryReason == undefined ? '-' : element.adjustment.salaryReason,
        idSalaryAdjustment: element.adjustment?.idSalaryAdjustment == undefined ? -1 : element.adjustment.idSalaryAdjustment,
        idSalaryAdjustmentType: element.adjustment?.idSalaryAdjustmentType == undefined ? 2 : element.adjustment.idSalaryAdjustmentType,
        currencySymbol: element.salary.currencySymbol,
        access: this.userPermissions.allowed(this.permissionsIDs.MANAGE_JOB_POSITION_ADJUSTMENT_HCM_PERMISSION_ID) && validate ? true : false

      }
      this.listTable.push(object);
    });
    this.jobPositionChange.emit(true);
    this.showSidebar = false;
  }


  clearFilters(){
    this.salaryAdjustmentJobPositionFilter.idJobPosition = -1;
    this.searchLevel = -1;
    this.coinOption = 0;
    this.submitted = false;
    this.showTable = false;
    this.salaryTypesDropdown = [];
    this.jobpositionsDropdown = [];
  }

  saveListAdjustment(val: boolean){
    debugger;
    this.salariesList.forEach(element =>{// todos los registros con id negativos se les reasigna -1 para que sean creados en DB
      if(element.adjustment.idSalaryAdjustment < 0){
        element.adjustment.idSalaryAdjustment = -1;
      }
    });
    this.jobPositionSalary.salaries = this.salariesList;
    this.jobPositionSalary.idCompany = this.idCompany;
    if(val){
      this.salaryAdjustmentSingle.insertSalaryByLaborRelationship(this.jobPositionSalary).subscribe((data) => { 
        if (data == 0) {    //si no ocurre algun error
             this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
             this.jobPositionChange.emit(false);
        }else if(data == -1) {    //de lo contrario se evalua (validaciones de otros módulos)
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
        }else if(data == -2) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
        }else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al eliminar los datos" });
        }
          //window.location.reload(); Recarga la pagina
      }, () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al borrar los datos" });
      }); 
    }
    
  }

}
