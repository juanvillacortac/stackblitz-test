import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { CollectionTransaction } from 'src/app/models/financial/collectiontransactions';
import { Coins } from 'src/app/models/masters/coin';

@Component({
  selector: 'app-collection-transactions-tree',
  templateUrl: './collection-transactions-tree.component.html',
  styleUrls: ['./collection-transactions-tree.component.scss']
})
export class CollectionTransactionsTreeComponent implements OnInit {

  table: any[] = [];
  _transactions: CollectionTransaction[];
  @Input('transactions')
  set transactions(value: CollectionTransaction[]) {
    this._transactions = value;
    this.table = this.formatTable(value); 
    console.log(value)
  }

  @Input() isFiltered: boolean;
  @Input() showFilters: boolean;
  @Input() currencies: Coins[];
  @Input() currentPage: number;
  @Input() elementsPerPage: number;
  @Input() totalPaginatorElements: number;
  @Output() openModal = new EventEmitter();
  @Output() onRefresh = new EventEmitter();
  @Output() onEdit = new EventEmitter<CollectionTransaction>();
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
    { template: p => p.typeApplicationCollection, field: 'typeApplicationCollection', header: 'Tipo de pago', display: 'table-cell' },
    { template: p => p.bankAccountNumber + '' + p.accountingAccountCode, field: 'accountingAccountCode', header: 'Cuenta origen', display: 'table-cell' },
    { template: p => p.currency, field: 'currency', header: 'Moneda', display: 'table-cell' },
    { template: p => p.lot, field: 'lot', header: 'Lote', display: 'table-cell' },
    { template: p => p.amount, field: 'amount', header: 'Monto', display: 'table-cell' },
  ];

  ngOnInit(): void {
  }

  formatTable(transactions: CollectionTransaction[] = []) {
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

  edit(transact: CollectionTransaction) {
    this.onEdit.emit(transact);
  }

  newTransact() {
    this.router.navigateByUrl('/financial/collection/collection-transactions/new');
  }

}
