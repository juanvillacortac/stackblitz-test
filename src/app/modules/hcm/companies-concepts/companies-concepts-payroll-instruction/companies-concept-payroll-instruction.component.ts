import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-companies-concept-payroll-instruction',
  templateUrl: './companies-concept-payroll-instruction.component.html',
  styleUrls: ['./companies-concept-payroll-instruction.component.scss']
})
export class CompaniesConceptPayrollInstructionComponent implements OnInit {

  instructionType: number = 0;
  constructor() { }

  @Input() variables: SelectItem[];
  @Input() editInstruction: any;

  @Output() returnString: EventEmitter<string> = new EventEmitter<string>();
  @Output() returnJson: EventEmitter<any> = new EventEmitter<any>();


  instructionList: any[];
  selectedInstruccTypes: { name: string, value: number};
  jsonConcat: string = "";
  disabledDropdown: boolean = false;

  ngOnInit(): void {
    this.instructionList = [{ name: "Asignación", value: 4},{ name: "Condicional", value: 1}];
    this.selectedInstruccTypes = { name: "", value: 0};
    if(this.editInstruction.type != 0){
      this.selectedInstruccTypes.name = this.editInstruction.type == 1 ? "Condicional" : "Asignación";
      this.selectedInstruccTypes.value = this.editInstruction.type;
      this.disabledDropdown = true;
    }
  }

  buildJson(value: any){
    this.returnJson.emit(value); 
  }

  changeInstruction(){
    debugger;
    this.editInstruction = {type: this.selectedInstruccTypes.value, string: "", complete: false}
    this.returnJson.emit(this.editInstruction);
  }

}
