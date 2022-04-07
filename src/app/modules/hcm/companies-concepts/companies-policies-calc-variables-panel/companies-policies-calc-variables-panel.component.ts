import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { threadId } from 'worker_threads';
import { GlobalVariablesFilter } from '../../shared/filters/Concepts/global-variables-filter';
import { TypesVaryingFilter } from '../../shared/filters/Concepts/types-varying-filter';
import { TypesVarying } from '../../shared/models/concepts/types-varying';
import { PayrollPoliticVariables } from '../../shared/models/Payroll-Policies/payrroll-politic-vars';
import { GlobalVariablesService } from '../../shared/services/concepts/global-variables.service';
import { TypesVaryingsService } from '../../shared/services/concepts/types-varying.service';
import { GlobalVariableViewModel } from '../../shared/view-models/concepts/global-variable-viewmodel';
import { TypesVaryingViewModel } from '../../shared/view-models/concepts/types-varying-viewmodel';

@Component({
  selector: 'app-companies-policies-calc-variables-panel',
  templateUrl: './companies-policies-calc-variables-panel.component.html',
  styleUrls: ['./companies-policies-calc-variables-panel.component.scss']
})
export class CompaniesPoliciesCalcVariablesPanelComponent implements OnInit {


  @Input() displayModal: boolean;
  @Input() politicVars: PayrollPoliticVariables [];
  @Input() index: number;
  @Input() newId: number;
  @Output() backUnchange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() updateVar: EventEmitter<PayrollPoliticVariables> = new EventEmitter<PayrollPoliticVariables>();



  globalVarFilters: GlobalVariablesFilter = new GlobalVariablesFilter();
  globalVar: GlobalVariableViewModel[] = [];
  filterGlobalVar = new GlobalVariableViewModel;
  valList: SelectItem[] = [];
  selectTypeVal: any = {Label:'', value:0};
  selectValList: number;
  typeVarFilters: TypesVaryingFilter = new TypesVaryingFilter();
  typeVarList: SelectItem[] = [];
  showListVal: boolean = false;
  showTypeVal: boolean = false;
  submitted: boolean = false;
  
  constructor(public _globalVariableService: GlobalVariablesService, 
              public _typeVariableService: TypesVaryingsService,
              private messageService: MessageService) { }
  
  ngOnInit(): void {
    if(this.index!= -1){
      //this.filterGlobalVar.co = this.politicVars[this.index].varConceptId;
      this.filterGlobalVar.idTypeVarying = this.politicVars[this.index].typeVarId;
      this.filterGlobalVar.varyingType = this.politicVars[this.index].varType;
      this.filterGlobalVar.id = this.politicVars[this.index].idVariable
      this.filterGlobalVar.varying = this.politicVars[this.index].variable;
      this.filterGlobalVar.value = this.politicVars[this.index].varValue;
      this.filterGlobalVar.description = this.politicVars[this.index].description;
      this.selectTypeVal = {label:this.politicVars[this.index].varType, value:this.politicVars[this.index].typeVarId};
      this.showTypeVal= true;
    }
    this.onLoadTypesVar();
    this.onLoadVarGlobals();
  }

  onLoadTypesVar(){
    //this._typeVariableService.idCompanyGroup = parseInt(sessionStorage.getItem('groupId'));
      this._typeVariableService.getTypesVaryings(this.typeVarFilters).subscribe((data)=>{ 
        this.typeVarList = data.map<SelectItem>((item) => ({
          value: item.id,
          label: item.varyingTypes
        }));
      });
      
  }
  
  onChange(){
    this.filterGlobalVar.varying ='';
    this.filterGlobalVar.value= "";
    this.filterGlobalVar.description='';
    this.selectValList = null;
    this.showListVal= this.selectTypeVal.value == 4 ? false: true;
    this.valList= [];
    this.valList = this.globalVar.filter(x => x.idTypeVarying == this.selectTypeVal.value).map<SelectItem>((item) => ({
      value: item.id,
      label: item.varying
    }));
  }

  onLoadVarGlobals(){
    this.globalVarFilters.idCompanyGroup = parseInt(sessionStorage.getItem('groupId'));
    this._globalVariableService.getGlobalVariables(this.globalVarFilters).subscribe((data)=>{  
    this.globalVar = data;
      });
  }
  
  onDetailVal(){
    if(this.politicVars.find(x => x.idVariable === this.selectValList) ){
      this.showListVal= false;
      this.filterGlobalVar.varying ='';
      this.filterGlobalVar.value= "";
      this.filterGlobalVar.description='';
      this.selectTypeVal={Label:'', value:0};
      this.selectValList = null;
      this.messageService.add({ severity: 'error', summary: 'Registro', detail: "La Variable se encuentra declarada, seleccione otra"});
    }else{
      this.filterGlobalVar = this.globalVar.find(x => x.id == this.selectValList);
      this.filterGlobalVar.value = this.filterGlobalVar.value.toString();
    }
  }

  add(){
    debugger;
    if(this.selectTypeVal.value == 0 || this.filterGlobalVar.varying == null 
      || this.filterGlobalVar.varying == "" || this.filterGlobalVar.description == null || this.filterGlobalVar.description == "" 
      || this.filterGlobalVar.value == null || this.filterGlobalVar.value == "" || (this.selectTypeVal.value != 4 && this.selectValList == null)){
        this.submitted = true;
    }else{
      if(this.index == -1){
        var value = this.filterGlobalVar.value.toString();
        debugger
        if(this.selectTypeVal.value !== 4){
        
          let segmen = {
            conceptId: -1,
            varConceptId: this.newId,
            typeVarId: this.filterGlobalVar.idTypeVarying,
            varType:  this.filterGlobalVar.varyingType,
            idVariable: this.filterGlobalVar.id,
            variable: this.filterGlobalVar.varying,
            varValue: value,
            description:  this.filterGlobalVar.description,
          };
          //this.politicVars.push(segmen[0]);
          this.updateVar.emit(segmen);      //emit(PayrollPoliticVariables)
        }else{
          if(this.politicVars.find(x => x.variable === this.filterGlobalVar.varying) ){
            this.messageService.add({ severity: 'error', summary: 'Registro', detail: "Nombre de variable duplicado."});
          }else{
            let segmen = {
              conceptId: -1,
              varConceptId: this.newId,
              typeVarId: this.selectTypeVal.value,
              varType:  this.selectTypeVal.label,
              idVariable: -1,
              variable: this.filterGlobalVar.varying,
              varValue: value,
              description:  this.filterGlobalVar.description,
            };
          //this.politicVars.push(segmen[0]);
          this.updateVar.emit(segmen);
        }
      }
      }else{
        let segmen = {
          conceptId: -1,
          varConceptId: this.politicVars[this.index].varConceptId,
          typeVarId: this.politicVars[this.index].typeVarId,
          varType:  this.politicVars[this.index].varType,
          idVariable: this.politicVars[this.index].idVariable,
          variable: this.filterGlobalVar.varying,
          varValue: this.filterGlobalVar.value.toString(),
          description:  this.filterGlobalVar.description,
        };
        
        this.updateVar.emit(segmen);
      }

    }    
  }
  
  outForm(){
    this.backUnchange.emit(false);
  }

}
