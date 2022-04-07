import { Component, OnInit } from '@angular/core';
import { Payment } from '../models';

@Component({
  selector: 'app-payment-details-advance',
  templateUrl: './payment-details-advance.component.html',
  styleUrls: ['./payment-details-advance.component.scss']
})
export class PaymentDetailsAdvanceComponent implements OnInit {

  showModal : boolean = false;

  banks = [
    { 
      label:"Venezuela",
      value:1
    },
    { 
      label:"Banesco",
      value:2
    },
    {
      label: "Bnc",
      value:3
    }
  ]

  paymentType = [
    {
      label:"Aplicacion directa",
      value:1
    }
  ]

  bankAccounts = [
    {
      label:"0134256314589652",
      bank:1
    },
    {
      label:"0134256314589442",
      bank:1
    },{
      label:"0144256314589442",
      bank:2
    },
    {
      label:"0144256314589445",
      bank:2
    },{
      label:"0198256314589442",
      bank:3
    },
    {
      label:"0198256314589445",
      bank:3
    },
    


  ]

  upsideTable = [
    {
      letterNumber:"CT-001-1",
      generationDate:"06/07/2021 12:03PM",
      status:"Anulado",
      responsibleUser: "Gilberto Rojas"
    },
    {
      letterNumber:"CT-001-2",
      generationDate:"09/07/2021 12:03PM",
      status:"Activa",
      responsibleUser: "Alberto Marcano"
    },
    
  ]  

  paymentsApplications  = [
    {
     document:"ODC-001",
     total: 400,
     balance: 400,
     amount:400

    },
    {
      document:"ODC-002",
      total: 500,
      balance: 200,
      amount: 0
 
     }
         
  ] 

  distributions: any[] = [
    {
      description:"Banesco",
      accountingAcount:"01225631",
      type: "Transferencia",
      auxiliar:"Banesco (1236)",
      debit:0,
      credit:600
    },
    {
      description:"CC. Proveedores nacionales",
      accountingAcount:"012236",
      type: "Pago",
      auxiliar:"N/A",
      debit:200,
      credit:0
    },
    {
      description:"CC. Proveedores locales",
      accountingAcount:"012230",
      type: "Pago",
      auxiliar:"Chucherias",
      debit:300,
      credit:0
    },
    {
      description:"CC. Proveedores locales",
      accountingAcount:"012230",
      type: "Pago",
      auxiliar:"N/A",
      debit:100,
      credit:0
    },
  ]

  expanded = {}

  constructor() { }



  ngOnInit(): void {
  }

}
