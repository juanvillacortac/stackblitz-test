import { LowerCasePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, SelectItem } from 'primeng/api';
import { element } from 'protractor';
import { AccountingAccount } from 'src/app/models/financial/AccountingAccount';
import { AccountingAccountFilter } from 'src/app/models/financial/AccountingAccountFilter';
import { AccountingAccountService } from 'src/app/modules/financial/AccountingAccounts/shared/services/accounting-account.service';
import { AccountingPlanBase } from 'src/app/modules/financial/initial-setup/shared/accounting-plan-base.component';
import { InitialSetupService } from 'src/app/modules/financial/initial-setup/shared/initial-setup.service';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { FinancialAplicationFilter } from '../../../shared/filters/Concepts/financial-aplication-filter';
import { AccountingTemplate } from '../../../shared/models/concepts/accounting-template';
import { AccountingTemplateDetail } from '../../../shared/models/concepts/accounting-template-detail';
import { AccountingItem} from '../../../shared/models/masters/accounting-item';
import {AccountinItemService } from '../../../shared/services/accounting-item.service';
import { PayrollCompanyListService } from '../../../shared/services/concepts/payroll-company-list.service';

@Component({
  selector: 'app-accounting-template-panel',
  templateUrl: './accounting-template-panel.component.html',
  styleUrls: ['./accounting-template-panel.component.scss']
})
export class AccountingTemplatePanelComponent extends AccountingPlanBase implements OnInit  {

  @Input() record: AccountingTemplate;
  @Input() id: number;
  @Input() accountPlan: AccountingItem;
  @Input() name: string;
  @Input() showPanel: boolean;
  @Output() backUnChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() recordSave: EventEmitter<AccountingTemplate> = new EventEmitter<AccountingTemplate>();

  accountingTemplateDetailList: AccountingTemplateDetail[];
  accountType: any[];
  submitted: boolean = false;
  message: boolean = false;
  separator: string;
  accountTypeOption: {name: string , value: string};
  financialAplicationFilter: FinancialAplicationFilter = new FinancialAplicationFilter();
  financial: string = "";
  AccountingAccountCode:string="";
  displayModal: boolean;
  filtrarCuenta: boolean;
  stringGenerate: string = "";
  accountingaccountFilter: AccountingAccountFilter = new AccountingAccountFilter();
  accountList: AccountingAccount[] =[];
  accountListDropdown: SelectItem[] = [];
  auxListDropdown: SelectItem[] = [];
  accountOption: number = -1;
  auxOption: number = -1;
  blockArray: string[] = [];
  _validations:Validations = new Validations();


  constructor(  public _accountingAccountService: AccountingAccountService,
                private messageService: MessageService, 
                public userPermissions: UserPermissions,
                private router :Router,
                private initialSetupService: InitialSetupService,
                private _accountingItemService: AccountinItemService,
                private _PayrollService: PayrollCompanyListService,
                injector:Injector
              ){
                  super(injector)    
                }

  
  ngOnInit(): void {
    //debugger;
    this.fetchInitialSetup();
    this.accountType = [{  name: "Crédito" , value: "Crédito" }, {  name: "Débito", value: "Débito" }];
    this.onLoadFinancialConfig();  
  }
  
  onLoadFinancialConfig(){
    debugger;
    var point1 = localStorage.getItem("_CURRENT_OFFICE").lastIndexOf(':');
    var point2 = localStorage.getItem("_CURRENT_OFFICE").lastIndexOf('}');
    var idC = localStorage.getItem("_CURRENT_OFFICE").substring(point1+1, point2);
    this.financialAplicationFilter.idCompany = parseInt(idC);
    this.financialAplicationFilter.idConfigAttributes = 1;
    this.financialAplicationFilter.groupValue = -1;
    this.financialAplicationFilter.idCompanyGroup = 1;


    this._PayrollService.getFinancialConfig(this.financialAplicationFilter).subscribe((resp: string) =>{
      this.financial = resp;
      this.onLoadAccountingItem();
     // debugger;
    });
  }

  onLoadAccountingItem(){
    debugger;
    //inicializamos las variables a usar
    this.accountingTemplateDetailList = [];
    var aux: AccountingTemplateDetail[] = [];
    var aux2 = "";
    this._accountingAccountService.getAccountingAccountList(this.accountingaccountFilter).subscribe((data: AccountingAccount[]) => {
      //debugger;   llamada al servicio del financiero
      this.accountList = data;
      if(this.accountList != null){
        this.accountList.forEach(record =>{ //recorremos la lista de cuentas del fianciero
          var accountCode = this.formatCode(record.accountingAccountCode,this.currentSeparator.separatorContent);
          record.descripcion = record.accountingAccountName+" ( "+accountCode+" )"
        });
        this.accountListDropdown = this.accountList.sort((a, b) => a.descripcion.localeCompare(b.descripcion)).map<SelectItem>((item)=>({
          label: item.descripcion,    //carga el SelectItem con las posiciones ordenadas de menor a mayor
          value: item.accountingAccountId
        }));
      }

      if(this.record.detail){
        if(this.record.detail.find(x => x.idSegmentType == 6) && this.blockArray.find(x => x == "##")){
          var search = this.record.detail.find(x => x.idSegmentType == 4);
          this.valueAssigned(search.idAssigned);
        }
      }
    });           
    this.separator = this.accountPlan.separatorType;
    
    debugger;
    if(this.record.idAccountingTemplate != -1){ //si es una edicion de aplicacion contable
      aux = this.record.detail;
      aux.forEach(object => {   //recorro la lista de asignando las entradas de dato
        this.evaluateDetail(object);
      });
      this.updateStringCount(); //actualizo la cadena de la  aplicacion contable 

    }else{  //si es una creacion de aplicacion contable
      if (this.accountPlan != null && this.accountPlan.accountingItemDetail != null) {    //si existe una partida contable con segmentos
        this.accountPlan.accountingItemDetail.forEach(element => {  //construyo los segmentos       
          var object = new AccountingTemplateDetail();
          object.idAccountingTemplateDetail = -1;
          object.idAssigned = -1;
          object.idReplace = false;
          object.idAccountingItemDetail = element.idAccountingItemDetail;
          object.identifier = element.identifier;
          object.ordinal = element.ordinal;
          object.description = element.description;
          object.idSegmentType = element.idSegmentType;
          object.idOmit = true;
          if(object.idSegmentType != 4 && object.idSegmentType != 6 && object.idSegmentType != 7){
            object.assignedValue = element.identifier;  // si el segmento no es de tipo cuenta contable, auxiliar o fijo, lo agrego al valor asignado
          }
          this.evaluateDetail(object);  //asigno las entradas de datos
          
          //debugger;
         
          aux.push(object); //agrego el objeto creado a una variable auxiliar
          if(aux2 == ""){   
            aux2 = object.identifier; //agrego el primer segmento a la cadena
          }else{
            aux2 += this.separator+object.identifier; //de lo contrario, concateno incrustando el separador
          }
        });
        this.record.stringCount = aux2; //al finalizar el recorrido actualizo la variable a mostrar
      } 
    }
    //debugger;
    this.accountingTemplateDetailList = aux;  
    this.accountingTemplateDetailList.sort((a, b) => a.ordinal - b.ordinal);  //actualizo la lista a mostrar en la tabla y la ordeno
    if(this.record.movementType != ""){     //creo y asigno el objeto del dropdown de tipo movimiento
      this.accountTypeOption = {  name: this.record.movementType , value: this.record.movementType };
    }
  }

  outForm(){  
    this.showPanel = false;
    this.backUnChanged.emit(this.showPanel); 
  }

  evaluateDetail(segment: AccountingTemplateDetail){
    switch (segment.idSegmentType) {    //si el tipo de segmento es
      case 4:   //cuenta contable
        if(this.financial != ""){ //si existe financiero
          this.blockArray[segment.ordinal] = "$$";  //habilita el dropdown de cuentas contables
          if(segment.idAssigned != null){   //si es una edicion
            this.accountOption = segment.idAssigned;  //inicializa el valor dentro del dropdown
          }
        }else{
          this.blockArray[segment.ordinal] = "";  //de lo contrario habilita el input
        }
        break;
    
      case 6: //auxiliar
        if(this.financial != ""){ //si existe financiero
          this.blockArray[segment.ordinal] = "##";  //habilita el dropdown de auxiliares
          if(segment.idAssigned != null){ //si es una edicion
            this.auxOption = segment.idAssigned;  //inicializa el valor dentro del dropdown
          }
        }else{
          this.blockArray[segment.ordinal] = "";  //de lo contrario habilita el input
        }
        break;
      case 7: //fijo
        this.blockArray[segment.ordinal] = "**";  //habilita el inputNumber
        break;
      default:
        this.blockArray[segment.ordinal] = segment.identifier;  //en cualquier otro caso, muestra el valor
        break;
    }
  }

  submit(){
    //debugger;
    var error = false;
    if(this.accountTypeOption == null || this.record.implementationRate <= 0){
      error = true;
    }
    this.record.detail = this.accountingTemplateDetailList;
    this.record.detail.forEach(element => {
      switch (element.idSegmentType) {

        case 4: //
          if(this.blockArray[element.ordinal] == "$$"){
            if(this.accountOption == -1 && element.idOmit == true){
              error = true;
              this.message = true;
            }else{
              element.idAssigned = this.accountOption;  //guardo el id del dropdown del financiero
            }
          }else{
            if((element.assignedValue == null || element.assignedValue == "") && element.idOmit == true){
              error = true;
              this.message = true;
            }
          }
          break;

        case 6: //auxiliar
          if(this.blockArray[element.ordinal] == "##"){
            if(this.auxOption == -1 && element.idOmit == true){
              error = true;
              this.message = true;
            }else{
              element.idAssigned = this.auxOption;  //guardo el id del dropdown del financiero
            }
          }else{
            if((element.assignedValue == null || element.assignedValue == "") && element.idOmit == true){
              error = true;
              this.message = true;
            }
          }
          break;

        case 7: //fijo
          if((element.assignedValue == null || element.assignedValue == "") && element.idOmit == true){
            error = true;
            this.message = true;
          }
          break;

        default:
          break;
      }
    });

    if(error){
      this.submitted = true;
      if(this.message){
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe completar todos los identificadores de los segmentos" });
      }
    }else{
      this.submitted = false;
      this.message = false;
      this.recordSave.emit(this.record);
    }
    
  }

  valueAssigned(valor){
    //debugger;
    var segmentChange = this.accountingTemplateDetailList.find(x => x.idSegmentType == 4);  //guardo el segmento a cambiar
    
    if(this.auxOption != null){
      segmentChange.identifier
    }
    var account = this.accountList.find(x => x.accountingAccountId == valor); //busco el objeto en el arreglo a traves de su id
    this.stringGenerate = this.formatCode(account.accountingAccountCode,this.currentSeparator.separatorContent);  //guardo el codigo de la cuenta contable elegida
      //var segmentChange;  creo una variable donde guardar el segmento a cambiar
      // if(this.accountingTemplateDetailList.length > 0){ //siempre va a entrar en esta seccion
      // }else{
        //   segmentChange = this.accountPlan.accountingItemDetail.find(x => x.idSegmentType == 4);
        // }
        this.record.stringCount = this.record.stringCount.replace(segmentChange.identifier , this.stringGenerate);  //actualizo el stringCount, remplazando el identificador anterior
        segmentChange.identifier = this.stringGenerate; //actualizo el idenfificador del segmento
        segmentChange.assignedValue = this.stringGenerate;
        
        var ind = this.accountingTemplateDetailList.findIndex(x => x.idSegmentType == 4); //busco el indice de dicho segmento dentro de la lista
        this.accountingTemplateDetailList[ind] = segmentChange; //y lo actualizo para proximos cambios
      
        this.auxListDropdown = account.auxiliary.sort((a, b) => a.auxiliar.localeCompare(b.auxiliar)).map<SelectItem>((item)=>({
          label: item.auxiliar,    //carga el SelectItem con las posiciones ordenadas de menor a mayor
          value: item.idAuxiliar
        }));
    if(segmentChange.idAssigned != valor){  //una vez que termino con el segmento de tipo cuenta contable, inicializo el segmento auxiliar
      this.auxOption = -1;
      segmentChange = this.accountingTemplateDetailList.find(x => x.idSegmentType == 6);  //guardo el segmento a cambiar
      if(segmentChange){  //si existe un segmento auxiliar
        segmentChange.assignedValue = "";
        segmentChange.idAssigned = -1;
        segmentChange.identifier = this.accountPlan.accountingItemDetail.find(x => x.idSegmentType == 6).identifier;
        this.updateStringCount();
      }
    }
  }

  auxAssigned(valor1, valor2){
    //debugger;
    var account = this.accountList.find(x => x.accountingAccountId == valor1);  //busco la cuenta en el arreglo a traves de su id
    var aux = account.auxiliary.find(y => y.idAuxiliar == valor2);      //busco el objeto en el arreglo de auxiliares
    var segmentChange = this.accountingTemplateDetailList.find(x => x.idSegmentType == 6);  //guardo el segmento a cambiar
    this.record.stringCount = this.record.stringCount.replace(segmentChange.identifier , aux.auxiliar);  //actualizo el stringCount, remplazando el identificador anterior
    segmentChange.identifier = aux.auxiliar;
    segmentChange.assignedValue = aux.auxiliar;
    var ind = this.accountingTemplateDetailList.findIndex(x => x.idSegmentType == 6); //busco el indice de dicho segmento dentro de la lista
    this.accountingTemplateDetailList[ind] = segmentChange; //y lo actualizo para proximos cambios
  }

  updateStringCount(){
    var aux = ""
    //debugger;
    this.accountingTemplateDetailList.forEach(element => {
      switch (element.idSegmentType) {
        case 4:
          if(this.blockArray[element.ordinal] == "$$"){ 
            if(element.idAssigned != -1){ //al editar
              this.accountOption = element.idAssigned;
            }
          }
          break;
        case 6:
          if(this.blockArray[element.ordinal] == "##"){
            if(element.idAssigned != -1){  //al editar
              this.auxOption = element.idAssigned;
            }
          }
          break;
        case 7:
          if(element.assignedValue != ""){
            element.identifier = element.assignedValue
          }
          break;
        default:
          break;
      }
      if(element.idOmit){
        if(aux == ""){
          aux = element.identifier;
        }else{
          aux += this.separator+element.identifier;
        }
      }
    });
    this.record.stringCount = aux;
  }

  updateSegmentInput(record: AccountingTemplateDetail){
    //debugger;
    this.record.stringCount = this.record.stringCount.replace(record.identifier , record.assignedValue);  //actualizo el stringCount, remplazando el identificador anterior
    record.identifier = record.assignedValue;
    this.updateStringCount();
  }

  accountTypeChange(evento){
    // debugger;
    this.record.movementType = evento.value.value;
    console.log(this.record.movementType);
  }

  showModalDialog(){
     
    this.displayModal = true;
    this.filtrarCuenta = false;
  //  if (this._data.accountingAccountId >= 0) {
  //   this.viewMode = true
  //  }
  
 }

 evaluateCheckBox(ind: number){
   if(this.blockArray[ind+1] == "$$" && !this.accountingTemplateDetailList[ind].idOmit){
      var indice = this.blockArray.findIndex(x => x == "##");
      if(indice > -1){
        this.accountingTemplateDetailList[indice-1].idOmit = false;
      }
   }
  //  if(this.accountingTemplateDetailList[ind].idOmit){
  //   for (let i = ind; i >= 0; i--) {
  //     this.accountingTemplateDetailList[i].idOmit = this.accountingTemplateDetailList[ind].idOmit;
  //   }
  //  }else{
  //   for (let i = ind; i <= this.accountingTemplateDetailList.length; i++) {
  //     this.accountingTemplateDetailList[i].idOmit = this.accountingTemplateDetailList[ind].idOmit;
  //   }
  //  }
    this.updateStringCount();
 }


}
