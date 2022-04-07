import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api'
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { BankTransactionsTreeComponent } from '../bank-transactions-tree/bank-transactions-tree.component';
import { BankTransactionService } from '../shared/services/bank-transaction.service';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { BankTransaction, BankTransactionFilter } from 'src/app/models/financial/bank-transactions';
import { Router } from '@angular/router';
import { BankService } from 'src/app/modules/masters/bank/shared/services/bank.service';
import { BankAccountsService } from 'src/app/modules/masters/bank-accounts/shared/services/bank-accounts.service';
import { MotivesService } from 'src/app/modules/masters/motives/shared/services/motives.service';
import { MotivesType } from 'src/app/models/masters/motives-type';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { Coins } from 'src/app/models/masters/coin';
import { CoinFilter } from 'src/app/modules/masters/coin/shared/filters/CoinFilter';
import { Motives } from 'src/app/models/masters/motives';
import { MotivesFilters } from 'src/app/models/masters/motives-filters';
import { BankFilters } from 'src/app/models/masters/bank-filters';
import { bankAccountsFilter } from 'src/app/models/masters/bankAccounts';

type StringProps<T> = {
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T]

function sort<T, K extends StringProps<T>>(array: T[], prop: K): T[] {
  return array.sort((a, b) => (a[prop] as unknown as string).localeCompare((b[prop] as unknown as string)))
}

@Component({
  selector: 'app-bank-transactions-list',
  templateUrl: './bank-transactions-list.component.html',
  styleUrls: ['./bank-transactions-list.component.scss']
})
export class BankTransactionsListComponent implements OnInit {
  currentPage = 1
  elementsPerPage = 10
  totalPaginatorElements: number = null

  transactions: BankTransaction[] = []
  filter = new BankTransactionFilter()
  loaded = false
  loading = false
  showFilters: boolean = false;
  showDialog = false;

  isFiltered = false

  @ViewChild(BankTransactionsTreeComponent, { static: true }) treeComp: BankTransactionsTreeComponent;

  constructor(
    private service: BankTransactionService,
    private bankService: BankService,
    private accountsService: BankAccountsService,
    private reasonsService: MotivesService,
    private coinsService: CoinsService,
    private loadingService: LoadingService,

    private msgService: MessageService,
    public breadcrumbService: BreadcrumbService,
    private router: Router,
  ) {
    this.breadcrumbService.setItems([
      { label: 'Financiero' },
      { label: 'Bancos' },
      { label: 'Ajustes bancarios', routerLink: ['/financial/banks/bank-transactions'] }
    ]);
  }

  filterData = {
    accounts: [] as SelectItem<number>[],
    banks: [] as SelectItem<number>[],
    adjustmentsTypes: [] as SelectItem<number>[],
    reasons: [] as SelectItem<number>[],
    currencies: [] as SelectItem<number>[],
    date: sort([
      {
        label: 'Fecha de creación',
        value: 1,
      },
      {
        label: 'Fecha de transacción',
        value: 2,
      },
      {
        label: 'Fecha de contabilización',
        value: 3,
      },
    ], 'label') as SelectItem<number>[],
  }


  
  filterState = {
    accounts: [] as SelectItem<number>[],
    banks: [] as SelectItem<number>[],
    adjustmentsTypes: [] as SelectItem<number>[],
    reasons: [] as SelectItem<number>[],
    currencies: [] as SelectItem<number>[],
    date: sort([
      {
        label: 'Borrador',
        value: 1,
      },
      {
        label: 'Coontabilizado',
        value: 2,
      },
      {
        label: 'Cancelado',
        value: 3,
      },
      {
        label: 'Anulado',
        value: 4,
      }
    ], 'label') as SelectItem<number>[],
  }

  currencies: Coins[]

  async fetchData(filter = this.filter, reset = false) {
    if (reset) {
      this.currentPage = 1
    }

    this.loading = true

    try {
      debugger
      const transactionsPage = await this.service.getTransactions({ ...filter, pageNumber: this.currentPage, pagelogs: this.elementsPerPage }).toPromise()
      this.transactions = transactionsPage.items
      this.totalPaginatorElements = transactionsPage.registers

      const bankAdjustmentTypes = await this.service.getAdjustmentType().toPromise()
      this.filterData.adjustmentsTypes = sort(bankAdjustmentTypes.map(t => ({
        value: t.adjustmentTypeId,
        label: t.adjustmentType,
      })), 'label')

      const banks = await this.bankService.getBanks({ ...new BankFilters(), active: 1 }).toPromise()
      this.filterData.banks = sort(banks.map(t => ({
        value: t.id,
        label: t.name,
      })), 'label')

      const accounts = sort(await this.accountsService.getbankAccountsList({ ...new bankAccountsFilter(), active: 1 }).toPromise(), 'accountNumber')
      this.filterData.accounts = accounts.map(t => ({
        value: t.bankAccountId,
        label: t.accountNumber,
        bankId: t.bankId,
      }))

      this.filterData.reasons = sort(await this.reasonsService.getMotives({ ...new MotivesFilters(), active: 1, idModule: 163, idApp: 5 }) as Motives[], 'name')
        .map(t => ({
          value: t.id,
          label: t.name,
        }))

      this.currencies = await this.coinsService.getCoinsList({...new CoinFilter(), active: 1}).toPromise()
      this.filterData.currencies = sort(this.currencies, 'name')
        .map(t => ({
          value: t.id,
          label: t.name,
        }))
    } catch (err) {
      console.error(err)
    }

    this.loading = false
  }

  edit(transact: BankTransaction) {
    this.router.navigate(['/financial/banks/bank-transactions/', transact.bankTransactionId,]);
  }

  ngOnInit(): void {
    this.loadingService.startLoading()
    this.fetchData()
      // Totalmente cargado sin errores
      .then(() => {
        this.loaded = true
      })
      // Quitar el indicador de carga aunque existan errores
      .finally(() => {
        this.loadingService.stopLoading()
      })
  }
}
