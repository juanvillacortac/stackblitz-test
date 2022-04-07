import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-payments-document-select-modal',
  templateUrl: './payments-document-select-modal.component.html',
  styleUrls: ['./payments-document-select-modal.component.scss']
})
export class PaymentsDocumentSelectModalComponent implements OnInit {

  @Input() displayModal : boolean;
  @Output() displayModalChange = new EventEmitter<boolean>();
  

  columns = [
    { template: p => p.socialReason, field: 'proveedor', header: 'Proveedor', display: 'table-cell' },
    { template: p => p.rif, field: 'Rif', header: 'Rif', display: 'table-cell' },
    { template: p => p.documentNumber, field: 'N° de Documento', header: 'N° de Documento', display: 'table-cell' },
    { template: p => this.formatCurrenciesAmount(p.amount), field: 'Monto total', header: 'Monto Total', display: 'table-cell' },
    { template: p => this.formatCurrenciesAmount(p.appliedAmount), field: 'Monto Aplicado', header: 'Monto Aplicado', display: 'table-cell' },
    { template: p => this.formatCurrenciesAmount(p.remainingAmount), field: 'Monto Por Aplicar', header: 'Monto Por Aplicar', display: 'table-cell' },
    
  ];

  documents = [
    {
      socialReason: "Alimentos Polar S.A",
      rif: "J-12365896-1",
      documentNumber:"CP-001",
      amount: 1000,
      appliedAmount:0,
      remainingAmount:1000,
    },
    {
      socialReason: "Alimentos Polar S.A",
      rif: "J-12365896-1",
      documentNumber:"CP-002",
      amount: 500,
      appliedAmount:250,
      remainingAmount:250,
    }
  ]

  documentTypes: SelectItem[] = [
    {
      label: "Factura",
      value:1
    }, 
    {
      label: "Nota de débito",
      value:2
    }
  ]

  constructor() { }

  ngOnInit(): void {
  } 

  formatCurrenciesAmount(value: number):string{
    return `$${value}`
  }
  
  
  hideDialog(){
    this.displayModal = false;
    this.displayModalChange.emit(this.displayModal);
  }


}
