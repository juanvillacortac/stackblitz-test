import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { SaleTransaction } from 'src/app/models/financial/sale-transactions';
import { Coins } from 'src/app/models/masters/coin';

@Component({
  selector: 'app-sale-transactions-tree',
  templateUrl: './sale-transactions-tree.component.html',
  styleUrls: ['./sale-transactions-tree.component.scss']
})
export class SaleTransactionsTreeComponent implements OnInit {

  table: any[] = [];
  _transactions: SaleTransaction[];
  @Input('transactions')
  set transactions(value: SaleTransaction[]) {
    this._transactions = value;
    this.table = this.formatTable(value);
  }

  @Input() isDirect = false;
  @Input() isFiltered: boolean;
  @Input() showFilters: boolean;
  @Input() currencies: Coins[];
  @Input() currentPage: number;
  @Input() elementsPerPage: number;
  @Input() totalPaginatorElements: number;
  @Output() openModal = new EventEmitter();
  @Output() onRefresh = new EventEmitter();
  @Output() onEdit = new EventEmitter<SaleTransaction>();
  @Output() showFiltersChange = new EventEmitter<boolean>();
  @Output() currentPageChange = new EventEmitter<number>();
  @Output() elementsPerPageChange = new EventEmitter<number>();
  @ViewChild(Table, { static: true }) treeRef: Table;

  changePage(e) {
    this.elementsPerPage = e.rows;
    this.currentPage = e.page + 1;
    this.currentPageChange.emit(this.currentPage);
    this.elementsPerPageChange.emit(this.elementsPerPage);
    this.refresh();
  }

  refresh() {
    this.onRefresh.emit();
  }

  constructor(public breadcrumbService: BreadcrumbService, private router: Router) {
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
    this.showFiltersChange.emit();
  }

  private toDate = (str: string | Date) => {
    const d = new Date(str);
    const padLeft = (n: number) => ('00' + n).slice(-2);
    const dformat = [
      padLeft(d.getDate()),
      padLeft(d.getMonth() + 1),
      d.getFullYear(),
    ].join('/');
    return dformat;
  }

  cols = [
    { template: p => p.documentNumber, field: 'documentNumber', header: 'Número de documento', display: 'table-cell' },
    { template: p => p.module, field: 'module', header: 'Origen', display: 'table-cell' },
    { template: p => p.lot, field: 'lot', header: 'Lote', display: 'table-cell' },
    { template: p => p.commercialReason + '(' + p.customerSupplierDocumentNumber + ')', field: 'commercialReason', header: 'Cliente', display: 'table-cell' },
    { template: p => new Date(p.documentDate).getFullYear() !== 1900 ? this.toDate(p.documentDate) : null, field: 'documentDate', header: 'Fecha del documento', display: 'table-cell' },
    { template: p => new Date(p.expirationDate).getFullYear() !== 1900 ? this.toDate(p.expirationDate) : null, field: 'expirationDate', header: 'Fecha de transacción', display: 'table-cell' },
    { template: p => p.transactionStatusType, field: 'transactionStatusType', header: 'Estatus transacción', display: 'table-cell' },
    { template: p => p.createdByUser, field: 'createdByUser', header: 'Creado por', display: 'table-cell' },
  ];

  ngOnInit(): void {
  }

  formatTable(transactions: SaleTransaction[] = []) {
    const arr = transactions?.map(t => t) || [];
    const transformed = arr.map((obj) => {
      for (let key in obj) {
        const col = this.cols.find(c => c.field == key);
        if (col) {
          obj[key] = col.template(obj);
        }
      }
      return obj;
    });
    console.log(transformed);
    return transformed;
  }

  showModal() {
    this.openModal.emit();
  }

  edit(transact: SaleTransaction) {
    this.onEdit.emit(transact);
  }

  newTransact() {
    this.router.navigate(['/financial/sales/sale-transactions/new'], {queryParams:{indDirect: this.isDirect}});
  }

}
