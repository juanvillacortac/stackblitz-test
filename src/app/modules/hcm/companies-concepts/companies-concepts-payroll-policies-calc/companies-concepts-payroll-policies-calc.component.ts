//General
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
// Theme PrimeNG
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { PoliticalCalcService } from '../../shared/services/concepts/political-calc.service';
import { PoliticalCalcFilter } from '../../shared/filters/Concepts/politic-calc-filter';
import { PayrollPoliticVariables } from '../../shared/models/Payroll-Policies/payrroll-politic-vars';
import { ColumnD } from 'src/app/models/common/columnsd';
import { InstruccionCalc } from '../../shared/models/Payroll-Policies/instruccion-calc';
import fi from 'date-fns/esm/locale/fi/index';
import { PoliticCalc } from '../../shared/models/Payroll-Policies/payroll-politic-calc';
import { PayrollInstruccionsCalc } from '../../shared/models/Payroll-Policies/payroll-politic-instruccion';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'app-companies-concepts-payroll-policies-calc',
  templateUrl: './companies-concepts-payroll-policies-calc.component.html',
  styleUrls: ['./companies-concepts-payroll-policies-calc.component.scss']
})
export class CompaniesConceptsPayrollPoliciesCalcComponent implements OnInit {

  constructor(
        public messageService: MessageService, 
        private confirmationService: ConfirmationService, 
        private politicCalcService: PoliticalCalcService,
        public userPermissions: UserPermissions,
        private policiesVarCal: PoliticalCalcService
  ) { }


  politicCalcDropdown: SelectItem[] = []; 
  filter: PoliticalCalcFilter = new PoliticalCalcFilter();
  politicInstruccs: InstruccionCalc[] = [];
  indPos: number = 0;
  edit: number = 0;
  //Otros valores
  index: number= -1;
  newId: number= -1;
  tabSpace:number;
  //policiesLine: string[];
  policiesLine: string;

  //politicas
  politicVars: PayrollPoliticVariables [] = [];
  permissionsIDs = { ...Permissions };
  showPanel: boolean = false;
  showSidebar: boolean = false;
  showModal: boolean = false;
  varTable: boolean = true;
  policieTable: boolean = true;

  policiesCalc: PoliticCalc = new PoliticCalc();

  policies: any;
  
  displayedColumns: ColumnD<PayrollPoliticVariables>[] =
  [
   {template: (data) => { return data.varType; }, field: 'varType', header: 'Tipo', display: 'table-cell'},
   {template: (data) => { return data.variable; }, field: 'variable', header: 'Nombre', display: 'table-cell'},
   {template: (data) => { return data.varValue; }, field: 'varValue', header: 'Valor', display: 'table-cell'},
   {template: (data) => { return data.description; }, field: 'description', header: 'Descripción', display: 'table-cell'},
   ];


  ngOnInit(): void {
    this.loadPoliticCalc();
    //this.politicInstruccs.push({type: 1},{type: 1},{type:2, condition:{type:1,expLeft:{type:1,value:"346435"},operator:">",expRight:{type:1,value:"345345"}}},{type: 100},{type: 20},{type: 10});
  }

  loadPoliticCalc(){
    this.filter.conceptId = parseInt(sessionStorage.getItem("conceptId"));
    this.politicCalcService.GetPoliticCalc(this.filter).subscribe(data =>{
      this.politicVars = data.variables;
      this.politicInstruccs = data.instructions.map<InstruccionCalc>((item) => ({
        politicCalcId: item.politicCalcId,
        sequence : item.sequence,
        instruction: JSON.parse(item.instruction)
      }));
      debugger;
    });
  }

  resetValues(valor: boolean){
    this.showSidebar = valor;
    this.showPanel = valor;
  }

  newPayrollPolicies(){
    this.indPos = this.politicInstruccs.length;
    this.edit = 0;
    this.policies = {type: 0, string: ""};
    this.showPanel = true;
  }

  editPayrollPolicies(value: number, object: InstruccionCalc){
    this.indPos = value;
    this.edit = 1;
    this.policies = object.instruction;
    this.showPanel = true;
  }

  addPayrollPolicies(jsonObject: any){
    if(this.edit == 1){
      this.politicInstruccs[this.indPos].instruction = jsonObject;    // sobreescribe el valor del objeto
    }else{
      this.politicInstruccs.splice(this.indPos, this.edit, {politicCalcId:-1 , sequence: this.indPos+1, instruction: jsonObject});  //inserta el objeto en una posicion determinada
    }
    if(jsonObject.type == 1 && this.edit == 0){
      this.politicInstruccs.splice(this.indPos+1, this.edit,{politicCalcId:-1 ,sequence: this.indPos+2,instruction:{type: 100}});               //linea nueva instruccion
      this.politicInstruccs.splice(this.indPos+2, this.edit,{politicCalcId:-1 ,sequence: this.indPos+3,instruction:{type: 20, string: "ELSE"}});//linea else
      this.politicInstruccs.splice(this.indPos+3, this.edit,{politicCalcId:-1 ,sequence: this.indPos+4,instruction:{type: 3, string: "ENDIF"}});//linea endif
    }
    this.showPanel = false;
  }

  newPayrollPoliciesIf(value: number){
    this.indPos = value;
    this.edit = 0;
    this.policies = {type: 0};
    this.showPanel = true;
  }

  newPayrollPoliciesElse(value: number){
    this.politicInstruccs[value].instruction.type = 2;
    this.politicInstruccs.splice(value+1, 0,{politicCalcId:-1 ,sequence: value+2,instruction:{type: 100}});
  }

  deletePayrollPoliciesElse(value: number){
    debugger;
    var cont = 1;
    this.politicInstruccs[value].instruction.type = 20;
    do{
      if(this.politicInstruccs[value+1].instruction.type == 1){
        cont++;
      }
      this.politicInstruccs.splice(value+1, 1);
      if(this.politicInstruccs[value+1].instruction.type == 3){
        cont--;
      }
    }
    while(cont > 0);
  }

  deletePayrollPoliciesIf(value: number){
    debugger;
    var cont = 0;
    do{
      if(this.politicInstruccs[value].instruction.type == 1){
        cont++;
      }
      if(this.politicInstruccs[value].instruction.type == 3){
        cont--;
      }
      this.politicInstruccs.splice(value, 1);
    }
    while(cont > 0);
    //this.politicInstruccs.splice(value, 1);
  }

  deletePayrollPolicies(value: number){
    var text = "";
    switch (this.politicInstruccs[value].instruction.type) {
      case 4:
        text = "¿Está seguro que desea eliminar esta asignación?";
        break;
      case 1:
        text = "Se eliminarán las instrucciones dentro de este bloque \n ¿Está seguro que desea eliminar este condicional?";
          break;
      case 2:
        text = "Se eliminarán las instrucciones dentro de este bloque \n ¿Está seguro que desea eliminar este else?";
          break;
    }
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: text,
      accept: () => {
        switch (this.politicInstruccs[value].instruction.type) {
          case 4:
            this.politicInstruccs.splice(value, 1);
            break;
          case 1:
            this.deletePayrollPoliciesIf(value);
            break;
          case 2:
            this.deletePayrollPoliciesElse(value);
            break;
            }
      },
      reject: () => {
        
      }
    }); 
  }
  
  savePolitic(){
    this.policiesCalc.conceptId = this.filter.conceptId;
    this.policiesCalc.variables = this.politicVars;
    this.policiesCalc.instructions = this.politicInstruccs.map<PayrollInstruccionsCalc>((item, index) => ({
      politicCalcId: item.politicCalcId,
      sequence : index+1,
      instruction: JSON.stringify(item.instruction)
    }));
    this.politicCalcService.PostPoliticCalc(this.policiesCalc).subscribe((data) => { //de lo contrario se insertan
      if (data == 0) {    //si no ocurre algun error
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
      }else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
      }
        //window.location.reload(); Recarga la pagina
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
    });  
  }


  openSidebar(){
    this.newId--;
    this.showSidebar=true;
    this.index=-1;
  }

  onDelete(index: number, obj: PayrollPoliticVariables){
    debugger;
    var result = false;
    for (let i = 0; i < this.politicInstruccs.length; i++) {
      if(this.politicInstruccs[i].instruction.type == 1 || this.politicInstruccs[i].instruction.type == 4){
        result = this.searchVar(obj.varConceptId, this.politicInstruccs[i].instruction);
        if(result){
          i = this.politicInstruccs.length+2;
        }
      }
    }
    debugger;
    if(result){
      this.messageService.add({severity:'error', summary: 'Error', detail:'La variable no puede ser eliminada porque se está usando en la política de cálculo'});
    }else{
      this.politicVars.splice(index, 1);
    }
  }

  onEdit(index){
    debugger
    this.index= index;
    this.showSidebar= true;
  }

  updatePoliciesCalc(object: PayrollPoliticVariables){
    debugger;
    if(object.varConceptId < 0){
      object.varConceptId = -1;
    }
    //llamada al servicio para insertar en DB
    var aux = this.politicVars.findIndex(x => x.varConceptId == object.varConceptId);
    if(aux != -1){
      if(this.politicVars[aux].variable != object.variable){
        this.politicInstruccs.forEach(element => {
          if(element.instruction.type != 100 && element.instruction.type != 20 && element.instruction.type != 3 && element.instruction.type != 2){
            //element.instruction.string.replace(this.politicVars[aux].variable, object.variable);
            element.instruction = this.updateVar(object, element.instruction);
          }
        });  
      }
      this.politicVars[aux] = object;
      this.showSidebar = false;
    }else{
      object.conceptId = this.filter.conceptId;
      this.policiesVarCal.insertVariablesCalc(object).subscribe(data =>{ //de lo contrario se insertan
        if (data> 0) {    //si no ocurre algun error
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
          object.varConceptId = data;
          this.politicVars.push(object);
          this.showSidebar = false;
        }else if(data == -1) {    //de lo contrario se evalua (validaciones de otros módulos)
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "La variable se encuentra declarada." });
        }else if(data == -2) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "La abreviatura ya se encuentra registrada para el tipo dispositivo seleccionado." });
        }else if(data == -3) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El dispositivo no existe" });
        }else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al eliminar los datos" });
        }
          //window.location.reload(); Recarga la pagina
      }, () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al borrar los datos" });
      });
    }
  }

  searchVar(id: number, obj: any): boolean{
    var resp = false;
    debugger;
    switch (obj.type) {
        case 1:
          resp = this.searchVar(id, obj.condition);
          break;
        case 4:
          resp = obj.variable.id == id ? true : this.searchVar(id, obj.expression);
          break;
        case 5:
        case 6:
        case 8:
          resp = this.searchVar(id, obj.expLeft) ? true : this.searchVar(id, obj.expRight);
          break;
        case 7:
          resp = this.searchVar(id, obj.expRight);
          break;
        case 11:
          resp = obj.variable.id == id;
        break;
    }
    return resp;
  }

  updateVar(search: PayrollPoliticVariables, obj: any): any{
    debugger;
    switch (obj.type) {
        case 1:
          obj.condition = this.updateVar(search, obj.condition);
          obj.string = "IF "+obj.condition.string;
          break;
        case 4:
          if(obj.variable.id == search.varConceptId){
            obj.variable.name = search.variable;
          }
          obj.expression = this.updateVar(search, obj.expression);
          obj.string = obj.variable.name+" = "+obj.expression.string;
          break;
        case 5:
        case 6:
        case 8:
          obj.expLeft = this.updateVar(search, obj.expLeft);
          obj.expRight = this.updateVar(search, obj.expRight);
          obj.string = "("+obj.expLeft.string+" "+obj.operator+" " +obj.expRight.string+ ")";
          break;
        case 7:
          obj.expRight = this.updateVar(search, obj.expRight);
          obj.string = "NOT"+obj.expRight.string;
          break;
        case 11:
          if(obj.variable.id == search.varConceptId){
            obj.variable.name = search.variable;
            obj.string = search.variable;
          }
        break;
    }
    return obj;
  }

  viewPolicies(){
    debugger;
    this.tabSpace = 0;
    this.policiesLine = "";
    var algo = "\t"
    this.politicInstruccs.forEach(element => {
      if(element.instruction.type != 100 && element.instruction.type != 20){

        if(element.instruction.type == 3 || element.instruction.type == 2){
          this.tabSpace--;
        }

        this.policiesLine += algo.repeat(this.tabSpace)+element.instruction.string+"\n";

        if(element.instruction.type == 1 || element.instruction.type == 2){
          this.tabSpace++;
        }
      }
    });
    this.showModal = true;
  }


}
