import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-payments-application',
  templateUrl: './payments-application.component.html',
  styleUrls: ['./payments-application.component.scss']
})
export class PaymentsApplicationComponent implements OnInit { 

  paymentTypes: SelectItem[] = [
    { 
      label:"Pago",
      value : 1
    }, {  
      label:"Nota de crédito",
      value : 2
    }
  ]; 
  
  documents: SelectItem[] = [
    { 
      label:"PG-1;100",
      value : 1
    }, {  
      label:"PG-2;200",
      value : 2
    }
  ]


  constructor() { }

  ngOnInit(): void {
  }

}
