import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-companies-concept-payroll-condition',
  templateUrl: './companies-concept-payroll-condition.component.html',
  styleUrls: ['./companies-concept-payroll-condition.component.scss']
})
export class CompaniesConceptPayrollConditionComponent implements OnInit {

  constructor() { }

  @Input() variables: SelectItem[];
  @Input() edit: any;

  @Output() returnString: EventEmitter<string> = new EventEmitter<string>();
  @Output() returnJson: EventEmitter<any> = new EventEmitter<any>();  

  conditionList: any[];
  condition = {name:"", value:0};
  operatorLogicalList1: any[];
  operatorLogicalList2: any[];
  operatorLogical = {name:"", value:""};
  jsonLeft: any;
  jsonRight: any;
  operator: string = "";
  expRight: string = "";
  expLeft: string = "";

  ngOnInit(): void {
    this.conditionList = [{ name: "Expresión", value: 5},{ name: "Condición", value: 6},{ name: "Negación", value: 7}];
    this.operatorLogicalList1 = [{ name: "<", value: "<"},{ name: ">", value: ">"},{ name: "=", value: "="},{ name: "!=", value: "!="},{ name: "<=", value: "<="},{ name: ">=", value: ">="}];
    this.operatorLogicalList2 = [{ name: "AND", value: "AND"},{ name: "OR", value: "OR"}];
    debugger;
    if(this.edit != undefined){
      this.condition = this.conditionList.find(x => x.value == this.edit.type);
      switch (this.edit.type) {
        case 7:
          this.jsonRight = this.edit.expRight;
          break;
        default:
          this.jsonLeft = this.edit.expLeft;
          this.jsonRight = this.edit.expRight;
          this.expLeft = this.edit.expLeft.string;
          this.expRight = this.edit.expRight.string;
          this.operator = this.edit.operator;
          if(this.edit.type == 5){
            this.operatorLogical = this.operatorLogicalList1.find(x => x.value == this.operator);
          }else{
            this.operatorLogical = this.operatorLogicalList2.find(x => x.value == this.operator);
          }
          break;
      }
    }
  }

  changeCondition(){
    this.edit = {type: this.condition.value, string: this.condition.value == 7 ? "(NOT ())" :"()", complete: false}
    this.operatorLogical = {name:"", value:""};
    this.jsonLeft = null;
    this.jsonRight = null;
    this.operator = "";
    this.returnJson.emit(this.edit);
  }

  buildJsonLeft(valor: any){
    debugger;
    this.expRight = this.jsonRight ? this.jsonRight.string : "";
    this.jsonLeft = valor;
    var complete = false;
    if(this.jsonLeft != null && this.jsonRight != null){
      complete = this.jsonLeft.complete && this.jsonRight.complete && this.operatorLogical.value != "";
    }
    this.expLeft = this.jsonLeft.string;
    var exp = "("+this.jsonLeft.string+" " + this.operator + " "+this.expRight+")";
    var jsonExpression = {type: this.condition.value, expLeft: this.jsonLeft, operator: this.operatorLogical.value, expRight: this.jsonRight, string: exp, complete: complete};
    this.returnJson.emit(jsonExpression);
  }

  buildJsonRight(valor: any){
    debugger;
    this.jsonRight = valor;
    this.expRight = this.jsonRight.string;
    if(this.condition.value == 7){
      var exp = "(NOT "+this.jsonRight.string+")";
      var jsonNot = {type: this.condition.value, expRight: this.jsonRight, string: exp, complete: this.jsonRight.complete};
      this.returnJson.emit(jsonNot);
    }else{
      this.expLeft = this.jsonLeft ? this.jsonLeft.string : "";
      this.jsonRight = valor;
      var complete = false;
      if(this.jsonLeft != null && this.jsonRight != null){
        complete = this.jsonLeft.complete && this.jsonRight.complete && this.operatorLogical.value != "";
      }
      var exp = "("+this.expLeft+" " + this.operator + " "+this.jsonRight.string+")";
      var jsonExpression = {type: this.condition.value, expLeft: this.jsonLeft, operator: this.operatorLogical.value, expRight: this.jsonRight, string: exp, complete: complete};
      this.returnJson.emit(jsonExpression);
    }
  }

  operatorSelected(){
    this.operator = this.operatorLogical.name;
    var complete = false;
    if(this.jsonLeft != null && this.jsonRight != null){
      complete = this.jsonLeft.complete && this.jsonRight.complete && this.operatorLogical.value != "";
    }
    var exp = "("+this.expLeft+" " + this.operator + " "+this.expRight+")";
    var jsonExpression = {type: this.condition.value, expLeft: this.jsonLeft, operator: this.operatorLogical.value, expRight: this.jsonRight, string: exp, complete: complete};
    this.returnJson.emit(jsonExpression);
  }

}
