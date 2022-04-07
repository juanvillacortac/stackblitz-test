import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Coins } from 'src/app/models/masters/coin';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { companyjobpositionsfilter } from '../../shared/filters/company-jobpositions-filter';
import { companylevelsfilter } from '../../shared/filters/company-levels-filter';
import { MassiveAdjustmentFilter } from '../../shared/filters/salaries/massive-adjustment-filter';
import { SalaryTypeFilter } from '../../shared/filters/salary-type-filter';
import { SalaryType } from '../../shared/models/masters/salary-type';
import { Salaries } from '../../shared/models/salaries/salaries';
import { SalaryByLaborRelationship } from '../../shared/models/salaries/salary-labor-relationship';
import { CompanyService } from '../../shared/services/company.service';
import { SalaryByLaborRelationshipService } from '../../shared/services/salaries/salary-labor-relationship.service';
import { SalaryTypeService } from '../../shared/services/salary-type.service';

import { IdentifierTypeFilter } from '../../shared/filters/identifier-type-filter';
import { Company } from 'src/app/models/masters/company';
import { IdentifierType } from '../../shared/models/masters/IdentifierType';
import { UserService } from '../../shared/services/user.service';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'app-salary-adjustment-massive',
  templateUrl: './salary-adjustment-massive.component.html',
  styleUrls: ['./salary-adjustment-massive.component.scss']
})
export class SalaryAdjustmentMassiveComponent implements OnInit {

  constructor(
    private _httpClient: HttpClient, 
    private salaryAdjustmentService: SalaryByLaborRelationshipService, 
    private messageService: MessageService,
    private _salaryTypeService: SalaryTypeService,
    private _companyService: CompanyService,
    public userPermissions: UserPermissions,
    private _userService: UserService,
    public _Currency: CoinsService,) { }

  _Authservice : AuthService = new AuthService(this._httpClient);
  salaryAdjustmentMassiveFilter: MassiveAdjustmentFilter = new MassiveAdjustmentFilter();
  massiveSalary: SalaryByLaborRelationship;
  salariesList: Salaries[] = [];
  idCompany: number;
  submitted: boolean = false;
  //search3: boolean = false;
  searchLevel: number = -1;
  showFilters: boolean = true;
  coin: Coins;
  coinFilter: CoinxCompanyFilter = new CoinxCompanyFilter();
  companylevelsFilters: companylevelsfilter = new companylevelsfilter();
  jobpositionsFilters: companyjobpositionsfilter = new companyjobpositionsfilter();
  
  permissionsIDs = { ...Permissions };

  levelsDropdown: SelectItem[] = [];
  jobpositionsDropdown: SelectItem[];
  newAdjustment: Salaries;
  panelTitle: string = "";
  idAux: number = -2;
  position: number;
  showSidebar: boolean = false;
  access: boolean = false;


  listTable: any[] = [];
  arrayDocValues: any[] = [];
  salaryTypesDropdown: SelectItem[] = [];
  salaryTypesArray: SalaryType[] = [];

  opc: string;
  coinDropdown: SelectItem[];
  coinOption: number = 0;
  editDropdown = [{label:"Por monto", value: "val1"},{label:"Porcentual", value: "val2"}];

  @Output() massiveChange: EventEmitter<boolean> =  new EventEmitter<boolean>()

  ngOnInit(): void {
    this.idCompany = parseInt(this._Authservice.currentCompany);
    this.searchSalaryAdjustment();
    this.loadSalaryTypes();
    this.loadCurrency();
    //this.loadNonNaturalIdentifiersType();
  }

  loadSalaryTypes(){
    var filter = new SalaryTypeFilter();
    filter.companyId = this.idCompany; 
    this._salaryTypeService.GetSalaryType(filter).subscribe( (data: SalaryType[]) => {
      if (data != null) {
          this.salaryTypesArray = data;
          this.salaryTypesDropdown =  this.salaryTypesArray.map<SelectItem>((item)=>(
              {
                value: item.id,
                label: item.name
              }
          ));
      }
      this.salaryTypesDropdown = this.salaryTypesDropdown.sort((a, b) => { if(a.label < b.label || a.value == -1){return -1} if(a.label > b.label){return 1} return 0});
    },
    (error) => {
      this.messageService.add({severity: 'error', summary: 'Carga de tipo de salarios', detail: 'Error al cargar los tipos de salario'});
    }); 
  }

  loadNaturalIdentifiersType() {
    var filter: IdentifierTypeFilter = new IdentifierTypeFilter();
    filter.idDocumentType = -1;
    filter.idEntityType = 1;
    this._companyService.getCompany(this.idCompany).subscribe( (data: Company) => {
      if (data != null) {
        debugger;
        filter.idCountry = data.idCountry;    //filtra el pais perteneciente a la empresa
        this._userService.getIdentifierTypesByCountry(filter).subscribe( (data: IdentifierType[]) => {
          if (data != null) {
              this.arrayDocValues = data.map((item)=>(
                  {
                    value: item.id,
                    label: item.type.toString().concat(' ( ' + item.identifier + ' )')
                  }
              ));
          }
          this.arrayDocValues.sort((a, b) => a.label.localeCompare(b.label));
        },
        (error) => {
          this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de tipo de documentos', detail: 'Error al cargar los tipos de documento'});
        });
      }
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
    this.salaryAdjustmentMassiveFilter.idCompany = this.idCompany;
    this.submitted = false;
    this.salaryAdjustmentService.getMassiveSalaries(this.salaryAdjustmentMassiveFilter).subscribe((data: SalaryByLaborRelationship) => {
      this.massiveSalary = new SalaryByLaborRelationship;
      this.massiveSalary = data;
      this.salariesList = this.massiveSalary.salaries;

      if(this.coinOption > 0){  //si se filtró un tipo de moneda
        this.salariesList = this.salariesList.filter(x => x.salary?.idCurrency == this.coinOption);
      }
      this.listTable = [];
      var object;
      debugger;
        this.salariesList.forEach(element => {
          if(element.salary.idSalaryByLaborRelationship == undefined || element.salary.idSalaryByLaborRelationship == -1){
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
              idSalaryAdjustmentType: 3,  //ajustes masivos
              access: true      //necesario para mostrar en el componente salary-adjustment-table
            }
          }else{
            var validate = element.adjustment.idSalaryAdjustmentType == 3 ? true : false;
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
              idSalaryAdjustmentType: element.adjustment?.idSalaryAdjustmentType == undefined ? 3 : element.adjustment.idSalaryAdjustmentType,
              currencySymbol: element.salary.currencySymbol,
              access: this.userPermissions.allowed(this.permissionsIDs.MANAGE_MASSIVE_ADJUSTMENT_PERMISSION_ID) && validate ? true : false
            }
          }
          this.listTable.push(object);
        });
        this.access = this.userPermissions.allowed(this.permissionsIDs.MANAGE_MASSIVE_ADJUSTMENT_PERMISSION_ID);   //permiso para crear ajustes masivos

        //se toman los tipos de sueldos diferentes de los que tienen ajustes para mostrarlos en el dropdown del formulario de creacion
        this.salaryTypesDropdown = (this.salaryTypesDropdown.filter(x => this.salariesList.findIndex( y => y.salary.idSalaryType == x.value) == -1)).
        sort((a, b) => { if(a.label < b.label || a.value == -1){return -1} if(a.label > b.label){return 1} return 0});
      }, (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los salarios" });
     });    
  }

  sendPanel(record: any){
    debugger;///llamada al formulario de edicion (no crea salarios)
    this.newAdjustment = new Salaries();
      this.submitted = false;
      var obj = this.salariesList.find(x => x.salary.idSalaryType == record.idSalaryType);
      this.position = this.salariesList.findIndex(x => x.salary.idSalaryType == record.idSalaryType);
      this.newAdjustment.salary = obj.salary;
      this.newAdjustment.adjustment.idSalaryAdjustment = record.idSalaryAdjustment;
      this.newAdjustment.adjustment.idSalaryAdjustmentType = 3;
      this.newAdjustment.adjustment.idSalaryReason = record.idSalaryReason == 0 ? -1 : record.idSalaryReason;
      this.newAdjustment.adjustment.salaryReason = record.salaryReason == null ? "" : record.salaryReason;
      this.newAdjustment.adjustment.adjustmentAmount = record.adjustmentAmount == '-' ? 0 : record.adjustmentAmount;
      this.newAdjustment.adjustment.adjustmentPercentage = record.adjustmentPercentage;
      this.newAdjustment.adjustment.validityDate = record.validityDate;
      this.panelTitle = record.salaryType;
      this.showSidebar = true;
   
  }

  resetValues(val: boolean){
    this.showSidebar = val;
  }

  clearFilters(){
    this.opc = null;
    this.coinOption = 0;
  }

  saveAdjustment(record: Salaries){
    debugger;
    if(record.adjustment.idSalaryAdjustment == -1){
      //si se trata de un ajuste nuevo, se le asigna un id negativo diferente de -1 para identificarlo mientras este en memoria
      this.idAux--;
      record.salary.idSalaryByLaborRelationship = this.idAux;
      record.adjustment.idSalaryAdjustment = this.idAux;  //se le asigna la ultima posicion dentro de la lista
      this.position = this.salariesList.findIndex(x => x.salary.idSalaryType == record.salary.idSalaryType);
    }
    record.adjustment.idSalaryAdjustmentType = 3;
    this.salariesList[this.position] = record;
    
    this.listTable = [];///se vacia y actualiza listTable
    this.salariesList.forEach(element => {
      var validate;
      if(element.adjustment){
        validate = element.adjustment.idSalaryAdjustmentType == 3 ? true : false;
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
        idSalaryAdjustmentType: element.adjustment?.idSalaryAdjustmentType == undefined ? 3 : element.adjustment.idSalaryAdjustmentType,
        currencySymbol: element.salary.currencySymbol,
        access: this.userPermissions.allowed(this.permissionsIDs.MANAGE_MASSIVE_ADJUSTMENT_PERMISSION_ID) && validate ? true : false
      }
      this.listTable.push(object);
    });
    this.massiveChange.emit(true);
    this.showSidebar = false;
  }

  saveListAdjustment(val: boolean){
    debugger;
    this.massiveSalary.salaries = this.salariesList;
    this.massiveSalary.idCompany = this.idCompany;
    if(val){
      this.salaryAdjustmentService.insertSalaryByLaborRelationship(this.massiveSalary).subscribe((data) => { 
        if (data == 0) {    //si no ocurre algun error
             this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
             this.massiveChange.emit(false);
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
