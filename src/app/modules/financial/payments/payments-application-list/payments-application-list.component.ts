import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payments-application-list',
  templateUrl: './payments-application-list.component.html',
  styleUrls: ['./payments-application-list.component.scss']
})
export class PaymentsApplicationListComponent implements OnInit {

  displayModal: boolean = false;


  cols = [
    {
      template: (p) => p.documentNumber,
      field: "documentNumber",
      header: "Número de documento",
      display: "table-cell",
    },
    {
      template: (p) => String(p.expirationDate).split("T")[0],
      field:"expirationDate",
      header: "Fecha de vencimiento",
      display: "table-cell",
    },
    {
      template: (p) => p.type,
      field: "type",
      header: "Tipo",
      display: "table-cell",
    },
    {
      template: (p) => p.totalAmount,
      field: "totalAmount",
      header: "Monto total",
      display: "table-cell",
    },
    {
      template: (p) => p.amountApplied,
      field: "amountApplied",
      header: "Monto aplicado",
      display: "table-cell",
    },
    {
      template: (p) => p.amountToApply,
      field: "amountToApply",
      header: "Monto a aplicar",
      display: "table-cell",
    },
    {
      template: (p) => p.remainingAmount,
      field: "remainingAmount",
      header: "Restante por aplicar",
      display: "table-cell",
    },
  ];

  data = [  
    {
      documentNumber:"CP-001",
      expirationDate:"15/07/2021",
      type:"Factura",
      totalAmount:100,
      amountApplied:20,
      amountToApply:10,
      remainingAmount:70
    },
    {
      documentNumber:"CP-002",
      expirationDate:"15/07/2022",
      type:"Nota de debito",
      totalAmount:200,
      amountApplied:200,
      amountToApply:0,
      remainingAmount:0
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
