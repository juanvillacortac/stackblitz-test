import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CollectionTransactionDocument } from "src/app/models/financial/collectiontransactions";
import { SupplierExtend } from "src/app/models/masters/supplier-extend";
import { CollectionTransactionApplicacion, ReceivableAccountsDocumentShowTable } from "../receivable-accounts-documents-application/receivable-accounts-documents-application.component";

@Component({
  selector: "app-receivable-accounts-documents-application-list",
  templateUrl:
    "./receivable-accounts-documents-application-list.component.html",
  styleUrls: [
    "./receivable-accounts-documents-application-list.component.scss",
  ],
})
export class ReceivableAccountsDocumentsApplicationListComponent
  implements OnInit
{
  cols = [
    {
      template: (p) => p.documentNumber,
      field: "documentNumber",
      header: "Número de documento",
      display: "table-cell",
    },
    {
      template: (p) => String(p.expirationDate).split("T")[0],
      header: "Fecha de vencimiento",
      display: "table-cell",
    },
    {
      template: (p) => p.documentType,
      field: "documentTypeId",
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
      template: (p) => p.totalAmount - p.amountToApply,
      field: "remainingAmount",
      header: "Restante por aplicar",
      display: "table-cell",
    },
  ];

  @Input() data: CollectionTransactionDocument[] = [];
  @Input() client: SupplierExtend;
  @Input() charge: CollectionTransactionApplicacion;
  @Input() amountApplied: number;
  @Output() amountAppliedChange = new EventEmitter<number>();
  @Output() dataChange = new EventEmitter<CollectionTransactionDocument[]>();


  showModal: Boolean = false;

  get countAppliedTotal(): number {
    const result = this.data.reduce((previous, actual) => {
      return previous + actual.amountToApply;
    }, 0);
    
    if(this.amountApplied !== result){
      this.amountAppliedChange.emit(result);  
    }    
    
    return result;
  }

  constructor() {}

  ngOnInit(): void {
    console.log(this.data);
  }

  appendToList($event: any) {    
    this.data.push($event);
  }

  delete(i: number) {
    this.data.splice(i,1);
    this.countAppliedTotal;
  }
}
