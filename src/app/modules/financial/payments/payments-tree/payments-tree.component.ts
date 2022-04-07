import { Component, Input, OnInit } from '@angular/core';
import { Payment } from '../models';

@Component({
  selector: 'app-payments-tree',
  templateUrl: './payments-tree.component.html',
  styleUrls: ['./payments-tree.component.scss']
})
export class PaymentsTreeComponent implements OnInit {

  showFilters:boolean = false;
  elementsPerPage: number = 10;


  @Input() data: Payment[] = [];

  get totalPaginatorElements(){
    return this.data.length + 1;
  }

  cols = [
    { template: p => p.documentNumber, field: 'documentNumber', header: 'Número de documento', display: 'table-cell' },
    { template: p => p.paymentType, field: 'paymentType', header: 'Tipo de pago', display: 'table-cell' },
    { template: p => p.originAccount , field: 'originAccount', header: 'Cuenta origen', display: 'table-cell' },
    { template: p => p.currency, field: 'currency', header: 'Moneda', display: 'table-cell' },
    { template: p => p.lot, field: 'lot', header: 'Lote', display: 'table-cell' },
    { template: p => "$ " + p.totalAmount, field: 'totalAmount', header: 'Monto', display: 'table-cell' },
    { template: p => p.creationDate, field: 'creationDate', header: 'Fecha de creacion', display: 'table-cell' },
    { template: p => p.contabilizationDate, field: 'contabilizationDate', header: 'Fecha de contabilizacion', display: 'table-cell' },
    { template: p => p.transactionDate, field: 'transactionDate', header: 'Fecha de la transacción', display: 'table-cell' },
  ];



  constructor() { }

  ngOnInit(): void {
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

}
