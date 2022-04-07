import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { FISCAL_YEAR_FILTER_LIST_DEFAULT } from 'src/app/models/financial/fiscalYear/filters/fiscalYearFilter';
import { FiscalYear } from 'src/app/models/financial/fiscalYear/FiscalYear';
import { JournalEntryTransactionFilter } from 'src/app/models/financial/journal-entry-transaction-filter';
import { Lots } from 'src/app/models/financial/lots';
import { TransactionStatus, TransactionStatusFilter } from 'src/app/models/financial/TransactionStatus';
import { TypeJournalEntryTransaction } from 'src/app/models/financial/type-journal-entry-transaction';
import { TypeJournalEntryTransactionFilter } from 'src/app/models/financial/type-journal-entry-transaction-filter';
import { FiscalYearService } from '../../fiscal-year/shared/services/fiscal-year.service';
import { SaleTransactionService } from '../../sale-transactions/shared/sale-transaction.service';
import { JournalEntryTransactionsService } from '../shared/journal-entry-transactions.service';

type StringProps<T> = {
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T];

function sort<T, K extends StringProps<T>>(array: T[], prop: K): T[] {
  return array.sort((a, b) => (a[prop] as unknown as string).localeCompare((b[prop] as unknown as string)));
}

const formatDate = (str: string | Date) => {
  if (!str) {
    return undefined;
  }
  const d = new Date(str);
  const padLeft = (n: number) => ('00' + n).slice(-2);
  const dformat = [
    d.getFullYear(),
    padLeft(d.getMonth() + 1),
    padLeft(d.getDate()),
  ].join('.');
  return dformat;
};

@Component({
  selector: 'app-journal-entry-transaction-filters',
  templateUrl: './journal-entry-transaction-filters.component.html',
  styleUrls: ['./journal-entry-transaction-filters.component.scss'],
  providers: [DatePipe]
})
export class JournalEntryTransactionFiltersComponent implements OnInit {

  filters: JournalEntryTransactionFilter= new JournalEntryTransactionFilter();
  lots: Lots[] = [];
  lot: Lots;
  fiscalYear: SelectItem[] = [];
  status: SelectItem[] = [];
  date: SelectItem[] = sort([
    {
      label: 'Fecha de documento',
      value: 1,
    },
    {
      label: 'Fecha de transacción',
      value: 2,
    },
  ], 'label') as SelectItem<number>[];
  dateRange: Date[];
  loading = false;

  lotModal = false;

  @Output() onSearch = new EventEmitter<JournalEntryTransactionFilter>();

  constructor(private fiscalYearService: FiscalYearService,
    private saleTransactionService: SaleTransactionService,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getFiscalYear();
    this.getStatus();
  }

  search() {
    this.onSearch.emit({
      ...this.filters,
      initDate: formatDate(this.filters.initDate) || '',
      endDate: formatDate(this.filters.endDate) || '',
    });
  }

  getFiscalYear(){
    var filter = FISCAL_YEAR_FILTER_LIST_DEFAULT
    filter.active = 1;
    this.fiscalYearService.getList(filter)
    .subscribe((data: FiscalYear[])=>{
      //data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.fiscalYear = data.map((item)=>({
        label: this.datePipe.transform(item.initDate, "dd/MM/yyyy") + " - " + this.datePipe.transform(item.endDate, "dd/MM/yyyy"),
        value: item.id
      }));
    },(error)=>{
      console.log(error);
    });
  }

  getStatus(){
    var filter = new TransactionStatusFilter()
    filter.indActive = 1;
    this.saleTransactionService.getTransactionStatus(filter)
    .subscribe((data: TransactionStatus[])=>{
      data = data.filter(x => x.transactionStatusTypeId != 5 && x.transactionStatusTypeId != 6 && x.transactionStatusTypeId != 7 && x.transactionStatusTypeId != 8)
      data = data.sort((a, b) => a.transactionStatus.localeCompare(b.transactionStatus));
      this.status = data.map((item)=>({
        label: item.transactionStatus,
        value: item.transactionStatusTypeId
      }));
    },(error)=>{
      console.log(error);
    });
  }

  clearFilters() { 
    this.filters.documentNumber = "";
    this.filters.idFiscalYear = -1;
    this.filters.idTypeDate = -1;
    this.filters.idStatus = -1;
  }
}
