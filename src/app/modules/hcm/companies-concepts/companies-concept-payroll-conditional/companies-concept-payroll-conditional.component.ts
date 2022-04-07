import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-companies-concept-payroll-conditional',
  templateUrl: './companies-concept-payroll-conditional.component.html',
  styleUrls: ['./companies-concept-payroll-conditional.component.scss']
})
export class CompaniesConceptPayrollConditionalComponent implements OnInit {

  @Input() variables: SelectItem[];
  @Input() editInstruction: any;

  @Output() returnString: EventEmitter<string> = new EventEmitter<string>();  
  @Output() returnJson: EventEmitter<any> = new EventEmitter<any>();  


  constructor() { }

  ngOnInit(): void {
    debugger;
    if(this.editInstruction.type == 0){
      this.editInstruction = {type: 1, condition: null, string: "IF ()", complete: false};
    }
  }

  buildJson(value: any){
    debugger;
    var conditional = {type: 1, condition: value, string: "IF "+value.string+" ", complete: value.complete}
    this.returnJson.emit(conditional); 
  }

}
