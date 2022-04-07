import { Component, OnInit } from '@angular/core';
import { Payment } from '../models';

@Component({
  selector: 'app-payment-details-direct',
  templateUrl: './payment-details-direct.component.html',
  styleUrls: ['./payment-details-direct.component.scss']
})
export class PaymentDetailsDirectComponent implements OnInit {

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

  paymentsApplications : Payment[] =[
    {
      ...new Payment(), 
      id:1,     
      provider:"Alimentos Polar S.A",
      providerRif:"J-12365896-1",
      documents: [
        {
          id:1,
          documentNumber:"CP-001",
          totalAmount:1000,
          appliedAmount:0,
          amountToApply:200,
          remainingAmount: 800
        },
        {
          id:2,
          documentNumber:"CP-002",
          totalAmount:500,
          appliedAmount:250,
          amountToApply:0,
          remainingAmount: 250
        }
      ]
      
    },
    {
      ...new Payment(),    
      id:2,
      provider:"Alimentos  Sisa C.A",
      providerRif:"J-46479875-1",
      documents: [
        {          
            id:3,
            documentNumber:"CP-003",
            totalAmount:100,
            appliedAmount:0,
            amountToApply:100,
            remainingAmount: 100
          },
          {
            id:4,
            documentNumber:"CP-004",
            totalAmount:3000,
            appliedAmount:300,
            amountToApply:300,
            remainingAmount: 2400
          }
      ]              
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
