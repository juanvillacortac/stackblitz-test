import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { PoliticalCalcFilter } from '../../shared/filters/Concepts/politic-calc-filter';

@Component({
  selector: 'app-companies-concept-payroll-assignment',
  templateUrl: './companies-concept-payroll-assignment.component.html',
  styleUrls: ['./companies-concept-payroll-assignment.component.scss']
})
export class CompaniesConceptPayrollAssignmentComponent implements OnInit {

  @Input() variables: SelectItem[];
  @Input() editInstruction: any;
  @Output() returnString: EventEmitter<string> = new EventEmitter<string>();  
  @Output() returnJson: EventEmitter<any> = new EventEmitter<any>();  

  filter: PoliticalCalcFilter = new PoliticalCalcFilter();
  selectVar: SelectItem = {value:0, label:""};
  assignmentString: string;
  variable: string ="";
  expression: string ="";
  expressionEdit: any;


  constructor( ) { }

  ngOnInit(): void {
    debugger;
    if(this.editInstruction.type != 0){
      if(this.editInstruction.variable){
        this.selectVar.value = this.editInstruction.variable.id;
        this.selectVar.label = this.editInstruction.variable.name;
        this.variable = this.editInstruction.variable.name;
      }
      if(this.editInstruction.expression){
        this.expressionEdit = this.editInstruction.expression;
      }
    }
  }

  updateString1(e){
    this.variable = e.value.label;
    var text = this.editInstruction.expression ? this.editInstruction.expression.string : "";
    var complete = this.editInstruction.expression ? this.editInstruction.expression.complete : false;
    this.editInstruction = {type: 4, variable: {id: this.selectVar.value, name:  this.selectVar.label}, expression: this.editInstruction.expression, string: this.variable+" = "+text, complete: complete}
    this.returnJson.emit(this.editInstruction); 
    debugger;
  }

  buildJson(value: any){
    var complete = value.complete && this.selectVar.value != 0;
    this.editInstruction = {type: 4, variable: {id: this.selectVar.value, name:  this.selectVar.label}, expression: value, string: this.variable+" = "+value.string, complete: complete}
    this.returnJson.emit(this.editInstruction); 
  }

}
