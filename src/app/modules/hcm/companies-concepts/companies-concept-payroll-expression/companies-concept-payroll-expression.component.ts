import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { PoliticalCalcFilter } from '../../shared/filters/Concepts/politic-calc-filter';
import { PoliticalCalcService } from '../../shared/services/concepts/political-calc.service';

@Component({
  selector: 'app-companies-concept-payroll-expression',
  templateUrl: './companies-concept-payroll-expression.component.html',
  styleUrls: ['./companies-concept-payroll-expression.component.scss']
})
export class CompaniesConceptPayrollExpressionComponent implements OnInit {

  @Input() variables: SelectItem[];
  @Input() edit: any;


  @Output() returnString: EventEmitter<string> = new EventEmitter<string>();
  @Output() returnJson: EventEmitter<any> = new EventEmitter<any>();  

  expression = {name:"", value:0};
  expressionList: any[];
  operatorMath = {name:"", value:""};
  operatorMathList: any[];
  literal: string = "";
  variable: string = "";
  expLeft: string = "";
  expRight: string = "";
  jsonLeft: any;
  jsonRight: any;
  operator: string = "";
  selectVar= {label:"", value:0};
  assignmentString: string;

  constructor() { }

  ngOnInit(): void {
    debugger;
    this.expressionList = [{ name: "Literal", value: 9},{ name: "Variable", value: 11},{ name: "Expresión", value: 8}];
    this.operatorMathList = [{ name: "+", value: "+"},{ name: "-", value: "-"},{ name: "*", value: "*"},{ name: "/", value: "/"}];
    if(this.edit != undefined){
      this.expression.value = this.edit.type;
      switch (this.expression.value) {
        case 9:
          this.literal = this.edit.value;
          this.expression.name = "Literal";
          break;
        case 11:
          this.selectVar.value = this.edit.variable.id;
          this.selectVar.label = this.edit.variable.name;
          this.expression.name = "Variable";
          break;
        default:
          this.jsonLeft = this.edit.expLeft;
          this.jsonRight = this.edit.expRight;
          this.expLeft = this.edit.expLeft.string;
          this.expRight = this.edit.expRight.string;
          this.operator = this.edit.operator;
          this.operatorMath.value = this.edit.operator;
          this.operatorMath.name = this.edit.operator;
          this.expression.name = "Expresión";
          break;
      }

    }
  }

  changeExpression(){
    debugger;
    this.edit = {type: this.expression.value, string: "()", complete: false}
    this.literal = "";
    this.selectVar = {label:"", value:0};
    this.jsonLeft = null;
    this.jsonRight = null;
    this.expLeft = "";
    this.expRight = "";
    this.operator = "";
    this.variable = "";
    this.operatorMath = {name:"", value:""};
    this.returnJson.emit(this.edit);
  }

  literalValue(){
    var literalJson;
    if(this.literal == ""){
      literalJson = {type: 9, value: this.literal, string:this.literal, complete: false};
    }else{
      literalJson = {type: 9, value: this.literal, string:this.literal, complete: true};
    }
    this.returnJson.emit(literalJson);
  }

  varSelected(){
    var varJson;
    if(this.selectVar.value == 0){
      varJson = {type: 11, variable: {id: this.selectVar.value, name: this.selectVar.label}, string:this.selectVar.label, complete: false};
    }else{
      varJson = {type: 11, variable: {id: this.selectVar.value, name: this.selectVar.label}, string:this.selectVar.label, complete: true};
    }
    this.returnJson.emit(varJson);
  }

  operatorSelected(){
    this.operator = this.operatorMath.name;
    var complete = false;
    if(this.jsonLeft != null && this.jsonRight != null){
      complete = this.jsonLeft.complete && this.jsonRight.complete && this.operator != "";
    }
    var exp = "("+this.expLeft+" " + this.operator + " "+this.expRight+")";
    var jsonExpression = {type: 8, expLeft: this.jsonLeft, operator: this.operator, expRight: this.jsonRight, string: exp, complete: complete};
    this.returnJson.emit(jsonExpression);
  }

  buildJsonLeft(valor: any){
    this.jsonLeft = valor; 
    var complete = false;
    if(this.jsonLeft != null && this.jsonRight != null){
      complete = this.jsonLeft.complete && this.jsonRight.complete && this.operator != "";
    }
    this.expLeft = this.jsonLeft.string;
    var exp = "("+this.expLeft+" " + this.operator + " "+this.expRight+")";
    var jsonExpression = {type: 8, expLeft: this.jsonLeft, operator: this.operator, expRight: this.jsonRight, string: exp, complete: complete};
    this.returnJson.emit(jsonExpression);
  }

  buildJsonRight(valor: any){
    this.jsonRight = valor;
    var complete = false;
    if(this.jsonLeft != null && this.jsonRight != null){
      complete = this.jsonLeft.complete && this.jsonRight.complete && this.operator != "";
    }
    this.expRight = this.jsonRight.string;
    var exp = "("+this.expLeft+" " + this.operator + " "+this.expRight+")";
    var jsonExpression = {type: 8, expLeft: this.jsonLeft, operator: this.operator, expRight: this.jsonRight, string: exp, complete: complete};
    this.returnJson.emit(jsonExpression);
  }

}
