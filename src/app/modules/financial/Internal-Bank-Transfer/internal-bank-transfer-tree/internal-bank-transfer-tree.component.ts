import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ColumnD } from 'src/app/models/common/columnsd';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { Coins } from 'src/app/models/masters/coin';
import { InternalBankTransfer } from 'src/app/models/financial/Internal-bank-transfer';

@Component({
  selector: 'app-internal-bank-transfer-tree',
  templateUrl: './internal-bank-transfer-tree.component.html',
  styleUrls: ['./internal-bank-transfer-tree.component.scss']
})
export class InternalBankTransferTreeComponent implements OnInit {
  table: any[] = [];
  _transactions: InternalBankTransfer[];
  @Input('transactions')
  set transactions(value: InternalBankTransfer[]) {
     this._transactions = value;
     this.table = this.formatTable(value);
  }

  @Input() isFiltered: boolean
  @Input() showFilters: boolean;
  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Input() currencies: Coins[]

  @ViewChild(Table, { static: true }) treeRef: Table;
  @Output() openModal = new EventEmitter();
  @Output() onEdit = new EventEmitter<InternalBankTransfer>();
  @Output() onRefresh = new EventEmitter();

  @Input() currentPage: number
  @Input() elementsPerPage: number
  @Input() totalPaginatorElements: number

  @Output() currentPageChange = new EventEmitter<number>();
  @Output() elementsPerPageChange = new EventEmitter<number>();

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
    this.showFilters = !this.showFilters
    this.showFiltersChange.emit()
  }

  private toDate = (str: string | Date) => {
    const d = new Date(str)
    const padLeft = (n: number) => ("00" + n).slice(-2);
    const dformat = [
      padLeft(d.getDate()),
      padLeft(d.getMonth() + 1),
      d.getFullYear()
    ].join('/');
    return dformat;
  }

  log = console.log;

  cols = [
    { template: p => p.documentNumber, field: 'documentNumber', header: 'Número de documento', display: 'table-cell' },
    { template: p => p.originBank +' '+ p.bankAccountOriginNumber, field: 'originBank', header: 'Cuenta de origen', display: 'table-cell' },
    { template: p => p.destinationBank +' '+p.destinyBankAccountNumber, field: 'destinationBankAccountId', header: 'Cuenta de destino', display: 'table-cell' },
    { template: p => p.destinyBankAccountCurrency, field: 'destinyBankAccountCurrency', header: 'Moneda', display: 'table-cell' },
    { template: p => p.reference, field: 'reference', header: 'Referencia bancaria', display: 'table-cell' },
    { template: p => p.amount, field: 'amount', header: 'Monto', display: 'table-cell' },
    { template: p => new Date(p.transferDate).toLocaleDateString(), field: 'transferDate', header: 'Fecha de creación', display: 'table-cell' },
    { template: p => new Date(p.transactionDate).getFullYear() !== 1900 ? this.toDate(p.transactionDate) : null, field: 'transactionDate', header: 'Fecha de transacción', display: 'table-cell' },
    { template: p => new Date(p.bankPostingDate).getFullYear() !== 1900 ? this.toDate(p.bankPostingDate) : null, field: 'bankPostingDate', header: 'Fecha de contabilización', display: 'table-cell' },
    { template: p => p.typeEstatusTransaction, field: 'typeEstatusTransactionId', header: 'Estatus transacción', display: 'table-cell' },
    // { template: p => null, field: 'active', header: 'Estatus', display: 'table-cell' },
  ];

  ngOnInit(): void {
  }

  formatTable(transactions: InternalBankTransfer[] = []) {
    let arr = transactions?.map(t => t) || [];
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

  newTransact() {
    this.router.navigateByUrl('/financial/banks/bank-transfer-internal-detail/new');
  }

  edit(transact: InternalBankTransfer) {
    this.onEdit.emit(transact);
  }
}
