import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { JournalEntryTransaction } from 'src/app/models/financial/journal-entry-transaction';
import { JournalEntryTransactionFilter } from 'src/app/models/financial/journal-entry-transaction-filter';
import { Coins } from 'src/app/models/masters/coin';
import { CoinFilter } from 'src/app/modules/masters/coin/shared/filters/CoinFilter';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { JournalEntryTransactionsService } from '../shared/journal-entry-transactions.service';

@Component({
  selector: 'app-journal-entry-transactions-list',
  templateUrl: './journal-entry-transactions-list.component.html',
  styleUrls: ['./journal-entry-transactions-list.component.scss']
})
export class JournalEntryTransactionsListComponent implements OnInit {

  filter = new JournalEntryTransactionFilter();
  showFilters: boolean = false;
  transactions: JournalEntryTransaction[] =[];
  currentPage = 1;
  elementsPerPage = 10;
  totalPaginatorElements: number = null;
  currencies: Coins[] = [];

  cols: ColumnD<JournalEntryTransaction>[] = [
    { template: (data) => { return data.documentNumber; }, field: 'documentNumber', header: 'Número comprobante', display: 'table-cell' },
    { template: (data) => { return new Date(data.createDate).getFullYear() !== 1900 ? this.toDate(data.createDate) : null; }, field: 'createDate', header: 'Fecha', display: 'table-cell' },
    { template: (data) => { return data.concept; }, field: 'concept', header: 'Concepto', display: 'table-cell' },
    { template: (data) => { return data.lot; }, field: 'lot', header: 'Lote', display: 'table-cell' },
    { template: (data) => { return data.referent; }, field: 'referent', header: 'Referencia', display: 'table-cell' },
    { template: (data) => { return this.formatAmount(data.debit, data.idCoin); }, field: 'debit', header: 'Debe', display: 'table-cell' },
    { template: (data) => { return this.formatAmount(data.assets, data.idCoin); }, field: 'assets', header: 'Haber', display: 'table-cell' },
    { template: (data) => { return data.type; }, field: 'type', header: 'Tipo', display: 'table-cell' },
    { template: (data) => { return data.status; }, field: 'status', header: 'Estatus', display: 'table-cell' },
    { template: (data) => { return data.createUser; }, field: 'createUser', header: 'Creado por', display: 'table-cell' },
  ];

  formatAmount(amount: number, idCoin: number) {
    return ((this.currencies || [])?.find(c => c.id == idCoin)?.symbology || '') + '' + amount.toLocaleString('es-Ve', { minimumFractionDigits: 4 })
  }

  constructor(private router: Router,
    private breadcrumbService: BreadcrumbService,
    private coinsService: CoinsService,
    private journalEntryTransactionService: JournalEntryTransactionsService) {
    this.breadcrumbService.setItems([
      { label: "FMS" },
      { label: "Movimientos diarios" },
    ]);
   }

  async ngOnInit() {
    this.search()
    this.currencies = await this.coinsService.getCoinsList({ ...new CoinFilter(), active: 1 }).toPromise();
  }

  async search(filter = this.filter){
    const entryTransactionPage = await this.journalEntryTransactionService.getEntryTransactions({ ...filter, pageNumber: this.currentPage, pagelogs: this.elementsPerPage }).toPromise();
    this.transactions = entryTransactionPage.items;
    console.log(this.transactions)
    this.totalPaginatorElements = entryTransactionPage.registers;
  }

  newJournalEntryTransact(){
    this.router.navigate(['/financial/entry-transactions/journal-entry-transactions/new/',-1,0]);
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

  changePage(e) {
    this.elementsPerPage = e.rows;
    this.currentPage = e.page + 1;
    this.search();
  }

  edit(transaction: JournalEntryTransaction){
    this.router.navigate(['/financial/entry-transactions/journal-entry-transactions/new/',transaction.id,0]);
  }
}
