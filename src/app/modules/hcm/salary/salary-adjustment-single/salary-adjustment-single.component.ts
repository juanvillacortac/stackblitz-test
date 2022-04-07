import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Coins } from 'src/app/models/masters/coin';
import { Company } from 'src/app/models/masters/company';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { CountryService } from 'src/app/modules/masters/country/shared/services/country.service';
import { IndividualAdjustmentFilter } from '../../shared/filters/salaries/individual-adjustment-filter';
import { SalaryTypeFilter } from '../../shared/filters/salary-type-filter';
import { SalaryType } from '../../shared/models/masters/salary-type';
import { Salaries } from '../../shared/models/salaries/salaries';
import { SalaryByLaborRelationship } from '../../shared/models/salaries/salary-labor-relationship';
import { CompanyService } from '../../shared/services/company.service';
import { SalaryByLaborRelationshipService } from '../../shared/services/salaries/salary-labor-relationship.service';
import { SalaryTypeService } from '../../shared/services/salary-type.service';
import { DocumentTypeFilter } from 'src/app/models/masters/document-type-filters';
import { DocumentTypeService } from 'src/app/modules/masters/document-types/shared/services/document-type.service';
import { DocumentTypes } from 'src/app/models/masters/document-type';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'app-salary-adjustment-single',
  templateUrl: './salary-adjustment-single.component.html',
  styleUrls: ['./salary-adjustment-single.component.scss']
})
export class SalaryAdjustmentSingleComponent implements OnInit {
  permissionsIDs = { ...Permissions };
  constructor(
              private _httpClient: HttpClient, 
              private salaryAdjustmentSingle: SalaryByLaborRelationshipService, 
              private messageService: MessageService,
              private _companyService: CompanyService,
              private _salaryTypeService: SalaryTypeService,
              private _documentTypeService: DocumentTypeService,
              private _countryService: CountryService,
              public _Currency: CoinsService,
              public userPermissions: UserPermissions) { }

  _Authservice : AuthService = new AuthService(this._httpClient);
  salaryAdjustmentSingleFilter: IndividualAdjustmentFilter = new IndividualAdjustmentFilter();
  individualSalary: SalaryByLaborRelationship;
  salariesList: Salaries[] = [];
  salariesEditList: Salaries[] = [];
  idCompany: number;
  documentTypeDropdown: SelectItem[] = [];
  search1: boolean;
  search2: boolean;
  search3: boolean;
  numDoc: boolean = false;
  typeDoc: boolean = false;
  code: boolean = false;
  showFilters: boolean = true;
  showTable: boolean = false; 
  coinDropdown: SelectItem[];
  coinOption: number = 0;
  coinFilter: CoinxCompanyFilter = new CoinxCompanyFilter();

  newAdjustment: Salaries;
  panelTitle: string = "";
  idAux: number = -1;
  position: number;
  showSidebar: boolean = false;

  listTable: any[] = [];
  salaryTypesDropdown: SelectItem[] = [];
  salaryTypesArray: SelectItem[] = [];
  access: boolean = false;

  @Output() singleChange: EventEmitter<boolean> =  new EventEmitter<boolean>()


  ngOnInit(): void {
    this.idCompany = parseInt(this._Authservice.currentCompany);
    this.loadNonNaturalIdentifiersType();
    this.loadSalaryTypes();
    this.loadCurrency();
  }

  // saveAdjustmentSingle(record: Salaries[]){
  //   debugger;
  //   this.salariesList = record;

  

  // }

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

  loadNonNaturalIdentifiersType() {
    var filter: DocumentTypeFilter = new DocumentTypeFilter();
    filter.active = 1;
    filter.idEntityType = 1;
    this._companyService.getCompany(this.idCompany).subscribe( (data: Company) => {
      if (data != null) {
        filter.idCountry = data.idCountry;
        this._documentTypeService.getdocumentTypeList(filter).subscribe( (data: DocumentTypes[]) => {
          if (data != null) {
              this.documentTypeDropdown = data.map<SelectItem>((item)=>(
                  {
                    value: item.id,
                    label: item.name.concat(' ( ' + item.identifier + ' )')
                  }
              ));
          }
          this.documentTypeDropdown.sort((a, b) => { if(a.label < b.label || a.value == -1){return -1} if(a.label > b.label){return 1} return 0});
        },
        (error) => {
          this.messageService.add({key:'register-user',severity: 'error', summary: 'Carga de tipo de documentos', detail: 'Error al cargar los tipos de documento'});
        });
      }
    });
  }

  searchSalaryAdjustment(){
    //debugger;
    this.search1 = false;
    this.search2 = false;
    this.search3 = false;
    this.salaryAdjustmentSingleFilter.idCompany = this.idCompany

    if(this.salaryAdjustmentSingleFilter.documentNumber != null && this.salaryAdjustmentSingleFilter.documentNumber != ""){
      this.search1 = true;
    }
    if(this.salaryAdjustmentSingleFilter.employmentCode != null && this.salaryAdjustmentSingleFilter.employmentCode != ""){
      this.search2 = true;
    }
    if(this.salaryAdjustmentSingleFilter.idDocumentType != -1){
      this.search3 = true;
    }

    if(this.search1 && this.search3 || this.search2){
      this.search1 = false;
      this.search2 = false;
      this.numDoc = false;
      this.typeDoc = false;
      this.code = false;
      this.salaryAdjustmentSingle.getIndividualSalaries(this.salaryAdjustmentSingleFilter).subscribe((data: SalaryByLaborRelationship) => {
        this.individualSalary = new SalaryByLaborRelationship;
        this.individualSalary = data;
        this.showTable = true;
        this.salariesEditList = this.individualSalary.salaries;

        if(this.coinOption > 0){
          this.salariesList = this.salariesEditList.filter(x => x.salary?.idCurrency == this.coinOption);
        }else{
          this.salariesList = this.salariesEditList;
        }
        debugger;
        this.listTable = [];
        var object;
        this.salariesList.forEach(element => {
          if(element.salary.idSalaryByLaborRelationship == undefined || element.salary.idSalaryByLaborRelationship == -1){
            this.idAux--;
            element.salary.idSalaryByLaborRelationship = this.idAux;
          }
          if(element.adjustment == null){
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
              idSalaryAdjustmentType: 1,
              access: true
            }
          }else{
            var validate = element.adjustment.idSalaryAdjustmentType != 3 && element.adjustment.idSalaryAdjustmentType != 2 ? true : false;
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
              idSalaryAdjustmentType: element.adjustment?.idSalaryAdjustmentType == undefined ? 1 : element.adjustment.idSalaryAdjustmentType,
              currencySymbol: element.salary.currencySymbol,
              access: this.userPermissions.allowed(this.permissionsIDs.MANAGE_INDIVIDUAL_ADJUSTMENT_PERMISSION_ID) &&  validate ? true : false
            }
          }
          this.listTable.push(object);
        });
        this.access = this.userPermissions.allowed(this.permissionsIDs.MANAGE_INDIVIDUAL_ADJUSTMENT_PERMISSION_ID);
        this.salaryTypesDropdown = (this.salaryTypesArray.filter(x => this.salariesEditList.findIndex( y => y.salary.idSalaryType == x.value) == -1)).
        sort((a, b) => { if(a.label < b.label || a.value == -1){return -1} if(a.label > b.label){return 1} return 0});

      }, (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los salarios" });
    });
    }else{
      if(this.search1){
        this.typeDoc = true;
        this.numDoc = false;
        this.code = false;
      }else{
        if(this.search3){
          this.numDoc = true;
          this.typeDoc = false;
          this.code = false;
        }else{
          this.typeDoc = true;
          this.numDoc = true;
          this.code = true;
        }
      }
    }
  }

  sendPanel(record: any){
    debugger;
    this.newAdjustment = new Salaries();
    if(record.idSalaryByLaborRelationship == -1){
      this.newAdjustment.salary.idSalaryType = -1
      this.newAdjustment.salary.salaryType = record.salaryType;
      this.newAdjustment.adjustment.idSalaryAdjustment = record.idSalaryAdjustment;
      this.newAdjustment.adjustment.idSalaryAdjustmentType = 1;
      this.newAdjustment.adjustment.idSalaryReason = -1;
      this.newAdjustment.adjustment.salaryReason = "";
      this.newAdjustment.adjustment.adjustmentAmount = 0;
      this.newAdjustment.adjustment.adjustmentPercentage = 0;
      this.newAdjustment.adjustment.validityDate = null
      this.panelTitle = "Sueldo";
    }else{
      var list = this.salariesList.filter(x => x.salary.idSalaryByLaborRelationship == record.idSalaryByLaborRelationship);
      var obj = list.find(x => x.adjustment?.idSalaryAdjustmentType != 3 && x.adjustment?.idSalaryAdjustmentType != 2);
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
      this.idAux--;
      record.adjustment.idSalaryAdjustment = this.idAux;
      record.salary.idSalaryByLaborRelationship = this.idAux;
      this.position = this.salariesList.length;
      record.salary.salaryType = this.salaryTypesDropdown.find(x => x.value == record.salary.idSalaryType).label;
    }
    record.adjustment.idSalaryAdjustmentType = 1;
    this.salariesList[this.position] = record;
    this.salaryTypesDropdown =  this.salaryTypesDropdown.filter(x => x.value != record.salary.idSalaryType);
    this.listTable = [];
    this.salariesList.forEach(element => {
      var validate;
      if(element.adjustment){
        validate = element.adjustment.idSalaryAdjustmentType == 1 ? true : false;
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
        idSalaryAdjustmentType: element.adjustment?.idSalaryAdjustmentType == undefined ? 1 : element.adjustment.idSalaryAdjustmentType,
        currencySymbol: element.salary.currencySymbol,
        access: this.userPermissions.allowed(this.permissionsIDs.MANAGE_INDIVIDUAL_ADJUSTMENT_PERMISSION_ID) &&  validate ? true : false
      }
      this.listTable.push(object);
    });
    this.singleChange.emit(true);
    this.showSidebar = false;
  }

  createNew(){
    debugger;
    var register = {
      idSalaryByLaborRelationship: -1,
      idSalaryAdjustment: -1
    };
    this.sendPanel(register);
  }

  clearFilters(){
    this.salaryAdjustmentSingleFilter.documentNumber = "";
    this.salaryAdjustmentSingleFilter.employmentCode = "";
    this.salaryAdjustmentSingleFilter.idDocumentType = -1;
    this.individualSalary = null;
    this.coinOption = 0;
    this.code = false;
    this.typeDoc = false;
    this.numDoc = false;
    this.showTable = false;
    this.salaryTypesDropdown = [];
  }

  saveListAdjustment(val: boolean){
    debugger;
    this.salariesList.forEach(element =>{
      if(element.adjustment.idSalaryAdjustment < 0){
        element.adjustment.idSalaryAdjustment = -1;
      }
    });
    this.individualSalary.salaries = this.salariesList;
    if(val){
      this.salaryAdjustmentSingle.insertSalaryByLaborRelationship(this.individualSalary).subscribe((data) => { 
        if (data == 0) {    //si no ocurre algun error
             this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
             this.singleChange.emit(false);
        }else if(data == -1) {    //de lo contrario se evalua (validaciones de otros módulos)
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
        }else if(data == -2) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
        }else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los ajustes" });
        }
          //window.location.reload(); Recarga la pagina
      }, () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los ajustes" });
      }); 
    }
    
  }
}
