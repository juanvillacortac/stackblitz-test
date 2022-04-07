import { Component, OnInit } from '@angular/core';

import { AccountingTemplate } from '../../../shared/models/concepts/accounting-template';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { PayrollCompany } from '../../../shared/models/concepts/payroll-company';
import { PayrollCompanyList } from '../../../shared/models/concepts/payroll-company-list';
import { PayrollTypeObject } from '../../../shared/models/concepts/payroll-type-object';
import { PayrollAplicationFilter} from '../../../shared/filters/Concepts/payroll-aplication-filter';
import { PayrollCompanyListService} from '../../../shared/services/concepts/payroll-company-list.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PayrollTypeService } from '../../../shared/services/payroll-type.service';
import { PayrollType } from '../../../shared/models/masters/payroll-type';
import { PayrollTypeFilter } from '../../../shared/filters/payroll-type-filter';
import { Coins } from 'src/app/models/masters/coin';
import { CoinFilter } from 'src/app/modules/masters/coin/shared/filters/CoinFilter';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from 'src/app/modules/masters/companies/shared/services/company.service';
import { AccountingItem } from '../../../shared/models/masters/accounting-item';


@Component({
  selector: 'app-accounting-template-tab',
  templateUrl: './accounting-template-tab.component.html',
  styleUrls: ['./accounting-template-tab.component.scss']
})
export class AccountingTemplateTabComponent implements OnInit {

  accountingAplicationFilter: PayrollAplicationFilter = new PayrollAplicationFilter();
  payrollTypeFilter: PayrollTypeFilter = new PayrollTypeFilter();
  object: PayrollCompanyList = new PayrollCompanyList(); 
  idCompany: number = 0;
  company: string = "";
  accountingTemplate: AccountingTemplate;
  companiesList: PayrollCompany[] = [];
  companiesAccountingAplication: PayrollCompany;
  payrollTypexCompaniesList: PayrollTypeObject[] = [];
  payrollTypeList: PayrollType[] = [];
  coinList: Coins[] = [];
  coinsFilter: CoinFilter = new CoinFilter();
  accountingTemplateList: any[] = []; 
  idAux: number = -1;
  showSideBar: boolean = false;
  accountingTemplateView: AccountingTemplate[] = [];
  conceptId: number;
  idGroupCompany: number;
  accountingItem: AccountingItem;
  permissionsIDs = { ...Permissions };
  rowGroupMetadata: any;
  public expandedRows = {};
  public isExpanded:boolean = false;
  public temDataLength:number = 0;
  showEditing: boolean[] = [];

  displayedColumns: ColumnD<AccountingTemplate>[] =
    [
      { template: (data) => { return data.idAccountingTemplate; }, header: 'Id', field:'idAccountingTemplate', display: 'none' },
      { template: (data) => { return data.movementType; }, header: 'Institución/Ente', field:'movementType' },
      { template: (data) => { return data.stringCount; }, header: 'Nombre corto',field:'stringCount' ,display: 'table-cell' },
      { template: (data) => { return data.implementationRate; }, header: 'Tipo', field:'implementationRate', display: 'table-cell' },
    ];

  constructor(private _payrollCompanyListService: PayrollCompanyListService, 
              private _payrollTypeService: PayrollTypeService,
              private _coinService: CoinsService,
              private _companyService: CompanyService,
              private messageService: MessageService,
              public userPermissions: UserPermissions,
              private activatedRoute: ActivatedRoute, 
              private confirmationService: ConfirmationService,
              private router: Router) {
                
                      this.conceptId = parseInt(this.activatedRoute.snapshot.params['id']);

               }

  ngOnInit(): void {
    this.onLoadPayrollTypes();
    console.log(localStorage);
  }

  onLoadCoin(){
    this._coinService.getCoinsList(this.coinsFilter).subscribe((data: Coins[]) => {
      ////debugger;
      this.coinList = data;
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los tipos de segmentos" });
    });
  }

  onLoadPayrollTypes(){
    var point1 = localStorage.getItem("_CURRENT_OFFICE").lastIndexOf(':');
    var point2 = localStorage.getItem("_CURRENT_OFFICE").lastIndexOf('}');
    this.idCompany = parseInt(localStorage.getItem("_CURRENT_OFFICE").substring(point1+1, point2));     ///obtener idEmpresa
    this.payrollTypeFilter.idCompany = this.idCompany;
    this._payrollTypeService.GetPayrollTypes(this.payrollTypeFilter).subscribe((data: PayrollType[]) => {
      ////debugger;
      this.payrollTypeList = data;    //obtener nominas
      this.onLoadCoin();
      this._companyService.getCompany(this.idCompany).subscribe(data =>{
        this.idGroupCompany = data.idGroup;   //obtener idGrupoEmpresa
        this.onLoadAccountingAplication();
      });
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los tipos de segmentos" });
    });
  }

  onLoadAccountingAplication(){
    this.accountingAplicationFilter.idCompanyGroup = this.idGroupCompany;
    this.accountingAplicationFilter.idConcept = this.conceptId;
    this._payrollCompanyListService.getPayrollCompanyLists(this.accountingAplicationFilter).subscribe((data: PayrollCompanyList) => {
      this.object = data;
      //debugger;
      this.companiesList = this.object.list; 
      ////debugger;
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los tipos de segmentos" });
    });
  }

  saveIdCompany(id: number, name: string){
    this.idCompany = id;
    this.company = name;
    console.log(this.company);
    console.log(this.idCompany);
  }

  editDetail(edit: AccountingTemplate){
    debugger;
    var object = this.companiesList.find(x => x.payrollTemplates.find(y => y.idAccountingTemplate == edit.idAccountingTemplate));
    this.idCompany = object.idCompany;
    this.company = object.companyName;
    this.accountingTemplateView = object.payrollTemplates;
    this.accountingTemplate = new AccountingTemplate();
    this.accountingTemplate.idAccountingTemplate = edit.idAccountingTemplate;
    this.accountingTemplate.sequence = edit.sequence;
    this.accountingTemplate.implementationRate = edit.implementationRate;
    this.accountingTemplate.movementType = edit.movementType;
    this.accountingTemplate.stringCount = edit.stringCount;
    this.accountingTemplate.detail = edit.detail;
    this.showSideBar = true;
    this.accountingItem = new AccountingItem();
    this.accountingItem = JSON.parse(object.accounts.toString());

    console.log(this.companiesList);
  }
  
  newDetail(record: PayrollCompany){
    debugger;
    //var object = this.companiesList.find(x => x.idCompany == record.idCompany);
    this.idCompany = record.idCompany;
    this.company = record.companyName;
    this.accountingTemplateView = record.payrollTemplates;
    this.accountingTemplate = new AccountingTemplate();
    this.accountingTemplate.idAccountingTemplate = -1;
    this.accountingTemplate.sequence = record.payrollTemplates == undefined ? 1 : record.payrollTemplates.length + 1;
    this.accountingTemplate.implementationRate = 0;
    this.accountingTemplate.movementType = "";
    this.accountingTemplate.stringCount = "";
    this.accountingTemplate.detail = [];
    this.showSideBar = true;
    this.accountingItem = new AccountingItem();
    this.accountingItem = JSON.parse(record.accounts.toString());
    console.log(this.companiesList);
  }

  resetValues(resp: boolean){
    this.showSideBar = resp;
  }

  saveAccountingDetail(record){
    debugger;
    var indCompany = this.companiesList.findIndex(x => x.idCompany == this.idCompany);  //se ubica la empresa
    if(record.idAccountingTemplate == -1){      //si es una insercion
      this.idAux--;                             //agregas un id diferente, no repetido
      record.idAccountingTemplate = this.idAux; //sobreescribes el id -1
      var position = this.accountingTemplateView.length;  //guardas la nueva posicion
      this.accountingTemplateView[position] = record;     //para anexarla en la lista
    }else{
      var ind = this.accountingTemplateView.findIndex(x => x.idAccountingTemplate == record.idAccountingTemplate);
      this.accountingTemplateView[ind] = record;  //de lo contrario sobreescribes el registro a traves de su posicion
    }
    this.companiesList[indCompany].payrollTemplates = this.accountingTemplateView;  //sobreescribes la lista de plantillas contables

    //this.accountingTemplateView = [];
    this.showSideBar = false; 
  }

  savePayrollCompanies(){
    this.object.list = this.companiesList;
    this._payrollCompanyListService.insertPayrollCompanyList(this.object).subscribe((data) => { //de lo contrario se insertan
      //debugger;
      if (data == 0) {    //si no ocurre algún error
           this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
           this.onLoadPayrollTypes();
      }else if(data == -1) {    //de lo contrario se evalúa (validaciones de otros módulos)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
      }else if(data == -2) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
      }else if(data == -3) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El dispositivo no existe" });
      }else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
      }
        //window.location.reload(); Recarga la página
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
    }); 
  }

  deleteDetail(element: AccountingTemplate){       //muestra el modal de confirmar eliminación de segmento
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea eliminar este segmento de la lista?',
      accept: () => {
        debugger;
        var object = this.companiesList.find(x => x.payrollTemplates.find(y => y.idAccountingTemplate == element.idAccountingTemplate));
        this.idCompany = object.idCompany;
        this.company = object.companyName;
        var indCompany = this.companiesList.findIndex(x => x.idCompany == this.idCompany);  //se ubica la empresa
        this.accountingTemplateView = [];
        this.companiesList[indCompany].payrollTemplates.forEach( record =>{    //se recorre la lista y se buscan las plantillas por su id
          if (record.idAccountingTemplate != element.idAccountingTemplate) {  //diferentes a la que debe eliminarse
            this.accountingTemplateView.push(record);  //se guardan en la lista
          }
        });
        this.companiesList[indCompany].payrollTemplates = this.accountingTemplateView;  //se actualiza la lista original y se habilita el botón guardar con changedata
      },
      reject: () => {
        
      }
    });     
  }

  onSort() {
    this.updateRowGroupMetaData();
  }

  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    if (this.companiesList) {
      for (let i = 0; i < this.companiesList.length; i++) {
        let rowData = this.companiesList[i];
        let idCompany = rowData.idCompany;
        if( this.showEditing[i] == null){
          this.showEditing[i] = false;
        }
        if (i == 0) {
          this.rowGroupMetadata[idCompany] = { index: 0, size: 1 };
        }
        else {
          let previousRowData = this.companiesList[i - 1];
          let previousRowGroup = previousRowData.idCompany;
          if (idCompany === previousRowGroup)
            this.rowGroupMetadata[idCompany].size++;
          else
            this.rowGroupMetadata[idCompany] = { index: i, size: 1 };
        }
      }
    }
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

  onPage(event: any) {
    this.temDataLength = this.companiesList.slice(event.first, event.first + 10).length;
    console.log(this.temDataLength);
    this.isExpanded = false;
    this.expandedRows={};
  }

  toggleExpanded(status: boolean) {
    if(this.companiesList != undefined){
     if(status){
       this.companiesList.forEach(data =>{
         this.expandedRows[data.idCompany] = true;
       })
      }
      else{
       this.expandedRows={};
      }
   
      this.isExpanded = !this.isExpanded;
    }
  
   }

  // if(this.companiesList != null){
  //   this.accountingAplicationList = ;
    
  // }else{

  //}

}
