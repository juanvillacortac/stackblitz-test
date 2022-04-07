import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { te } from 'date-fns/locale';
import { MessageService, SelectItem } from 'primeng/api';

@Component({
  selector: 'app-companies-concepts-payroll-policies-panel',
  templateUrl: './companies-concepts-payroll-policies-panel.component.html',
  styleUrls: ['./companies-concepts-payroll-policies-panel.component.scss']
})
export class CompaniesConceptsPayrollpoliciesPanelComponent implements OnInit {


  @Input() displayModal: boolean;  
  @Input() politicVars: any[];   
  @Input() policiesEdit: any;

  @Output() backUnchange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() returnJson: EventEmitter<any> = new EventEmitter<any>();

  

  //instrucciones

  politicInstruccs: string = "";

  instPoliticList: any[];

  politicCalcString: string = "";
  
  operator = ["+","-","*","/","(",")","<",">","="];

  //Codigo Generado
  codeLine:string[]=[];
  lastValue: string = "";

  conditionalCreated: boolean = false;
  instruccions:string[] = [];
  politicCalcDropdown: SelectItem[] = [];

  constructor(private messageService: MessageService,) { }

  ngOnInit(): void {
    //this.loadPoliticCalc();
    if(this.policiesEdit.type != 0){
      this.politicCalcString = this.policiesEdit.string;
    }
    this.onLoadPoliticVars()
  }

  viewString(valor: string){
    this.politicCalcString = valor;
  }

  newInstruction(value: any){
    this.politicInstruccs = JSON.stringify(value);
    this.policiesEdit = value;
    //this.politicCalcString = this.stringInstrucction(value);
  }

  outForm(){
    this.backUnchange.emit(false);
  }

  submit(){
    if(this.policiesEdit.complete){
      this.returnJson.emit(this.policiesEdit);
    }else{
      this.messageService.add({severity:'error', summary:'Error', detail: "Se deben completar todos los campos pertenecientes a la instrucción"});
    }
  }

  onLoadPoliticVars(){
    this.politicCalcDropdown = this.politicVars.map<SelectItem>((item) => ({
      value: item.varConceptId,
      label: item.variable
    }));
  }
}


