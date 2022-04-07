import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ColumnD } from 'src/app/models/common/columnsd';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Table } from 'primeng/table';
import { BankTransaction } from 'src/app/models/financial/bank-transactions';
import { Router } from '@angular/router';
import { Coins } from 'src/app/models/masters/coin';

@Component({
  selector: 'app-bank-transactions-tree',
  templateUrl: './bank-transactions-tree.component.html',
  styleUrls: ['./bank-transactions-tree.component.scss'],
})
export class BankTransactionsTreeComponent implements OnInit {
  table: any[] = []
  _transactions: BankTransaction[]
  @Input('transactions')
  set transactions(value: BankTransaction[]) {
     this._transactions = value;
     this.table = this.formatTable(value)
  }
  
  @Input() isFiltered: boolean
  @Input() showFilters: boolean;
  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Input() currencies: Coins[]

  @Output() openModal = new EventEmitter();
  @Output() onEdit = new EventEmitter<BankTransaction>();
  @ViewChild(Table, { static: true }) treeRef: Table

  @Output() onRefresh = new EventEmitter();

  @Input() currentPage: number
  @Input() elementsPerPage: number
  @Input() totalPaginatorElements: number

  @Output() currentPageChange = new EventEmitter<number>();
  @Output() elementsPerPageChange = new EventEmitter<number>();

  changePage(e) {
    this.elementsPerPage = e.rows
    this.currentPage = e.page + 1
    this.currentPageChange.emit(this.currentPage)
    this.elementsPerPageChange.emit(this.elementsPerPage)
    this.refresh()
  }

  refresh() {
    this.onRefresh.emit()
  }

  constructor(public breadcrumbService: BreadcrumbService, private router: Router) {
  }

  toggleFilters() {
    this.showFilters = !this.showFilters
    this.showFiltersChange.emit()
  }

  private toDate = (str: string | Date) => {
    const d = new Date(str)
    const padLeft = (n: number) => ("00" + n).slice(-2)
    const dformat = [
      padLeft(d.getDate()),
      padLeft(d.getMonth() + 1),
      d.getFullYear()
    ].join('/');
    return dformat
  }

  log = console.log

  cols = [
    { template: p => p.documentNumber, field: 'documentNumber', header: 'Número de documento', display: 'table-cell' },
    { template: p => p.bank, field: 'bank', header: 'Banco', display: 'table-cell' },
    { template: p => p.accountNumber, field: 'accountNumber', header: 'Número de cuenta', display: 'table-cell' },
    { template: p => p.bankAccountCurrency, field: 'bankAccountCurrency', header: 'Moneda', display: 'table-cell' },
    { template: p => p.reference, field: 'reference', header: 'Referencia', display: 'table-cell' },
    { template: p => p.bankReason, field: 'bankReason', header: 'Motivo', display: 'table-cell' },
    { template: p => this.currencies?.find(c => c.id == p.bankAccountCurrencyId).symbology + '' + (p.bankAdjustmentTypeId == 2 ? p.amount : -p.amount).toLocaleString('en-US', { minimumFractionDigits: 4 }), field: 'amount', header: 'Monto', display: 'table-cell' },
    { template: p => p.typeEstatusTransaction, field: 'typeEstatusTransaction', header: 'Estatus transacción', display: 'table-cell' },
    { template: p => new Date(p.createdDate).getFullYear() !== 1900 ? this.toDate(p.createdDate) : null, field: 'createdDate', header: 'Fecha de creación', display: 'table-cell' },
    { template: p => new Date(p.transactionDate).getFullYear() !== 1900 ? this.toDate(p.transactionDate) : null, field: 'transactionDate', header: 'Fecha de transacción', display: 'table-cell' },
    { template: p => new Date(p.bankPostingDate).getFullYear() !== 1900 ? this.toDate(p.bankPostingDate) : null, field: 'bankPostingDate', header: 'Fecha de contabilización', display: 'table-cell' },
    // { template: p => null, field: 'active', header: 'Estatus', display: 'table-cell' },
  ];

  ngOnInit(): void {
  }

  formatTable(transactions: BankTransaction[] = []) {
    let arr = transactions?.map(t => t) || []
    const transformed = arr.map((obj) => {
      for (let key in obj) {
        const col = this.cols.find(c => c.field == key)
        if (col) { 
          obj[key] = col.template(obj)
        }
      }
      return obj
    })
    console.log(transformed)
    return transformed
  }

  showModal() {
    this.openModal.emit()
  }

  newTransact() {
    this.router.navigateByUrl('/financial/banks/bank-transactions/new')
  }

  edit(transact: BankTransaction) {
    this.onEdit.emit(transact)
  }
}
