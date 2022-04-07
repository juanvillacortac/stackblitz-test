import { HttpErrorResponse } from '@angular/common/http';
import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { BaseModel } from 'src/app/models/common/BaseModel';
import { AccountingAccount } from 'src/app/models/financial/AccountingAccount';
import { AccountingAccountFilter } from 'src/app/models/financial/AccountingAccountFilter';
import { AuxiliariesAccountingAccountFilter } from 'src/app/models/financial/AuxiliariesAccountingAccount';
import { Auxiliary } from 'src/app/models/financial/auxiliary';
import { AuxiliaryFilter } from 'src/app/models/financial/AuxiliaryFilter';
import { JournalEntryTransaction } from 'src/app/models/financial/journal-entry-transaction';
import { JournalEntryTransactionDetail } from 'src/app/models/financial/journal-entry-transaction-detail';
import { Lots } from 'src/app/models/financial/lots';
import { LotsFilter } from 'src/app/models/financial/lotsFilter';
import { TypeJournalEntryTransaction } from 'src/app/models/financial/type-journal-entry-transaction';
import { TypeJournalEntryTransactionFilter } from 'src/app/models/financial/type-journal-entry-transaction-filter';
import { Coins } from 'src/app/models/masters/coin';
import { CostCenter } from 'src/app/models/masters/cost-center';
import { ExchangeRateType } from 'src/app/models/masters/exchange-rate-type';
import { ExchangeRates } from 'src/app/models/masters/exchange-rates';
import { SupplierExtend } from 'src/app/models/masters/supplier-extend';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { BranchOffice } from 'src/app/modules/hcm/shared/models/masters/branch-office';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { BranchofficeService } from 'src/app/modules/masters/branchoffice/shared/services/branchoffice.service';
import { CoinFilter } from 'src/app/modules/masters/coin/shared/filters/CoinFilter';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { CostCenterFilters } from 'src/app/modules/masters/cost-center/shared/filters/cost-center-filters';
import { CostCenterService } from 'src/app/modules/masters/cost-center/shared/services/cost-center.service';
import { ExchangeRateTypeFilter } from 'src/app/modules/masters/exchange-rate-type/filters/exchange-rate-type-filter';
import { ExchangeRateTypeService } from 'src/app/modules/masters/exchange-rate-type/service/exchange-rate-type.service';
import { ExchangeRatesFilter } from 'src/app/modules/masters/exchange-rates/shared/filters/exchange-rates-filter';
import { ExchangeRatesService } from 'src/app/modules/masters/exchange-rates/shared/service/exchange-rates.service';
import { SupplierService } from 'src/app/modules/masters/supplier/shared/services/supplier.service';
import { AccountingAccountService } from '../../AccountingAccounts/shared/services/accounting-account.service';
import { ArticleClassificationService } from '../../article-classification/shared/services/article-classification.service';
import { AuxiliaryService } from '../../auxiliaries/shared/services/auxiliary.service';
import { AccountingPlanBase } from '../../initial-setup/shared/accounting-plan-base.component';
import { LotsService } from '../../lots/shared/services/lots.service';
import { StatusEntryTransaction } from '../shared/common/status-entry-transaction';
import { JournalEntryTransactionsService } from '../shared/journal-entry-transactions.service';

type StringProps<T> = {
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T];

function sort<T, K extends StringProps<T>>(array: T[], prop: K): T[] {
  return array.sort((a, b) => (a[prop] as unknown as string).localeCompare((b[prop] as unknown as string)));
}

@Component({
  selector: 'app-journal-entry-transactions-detail',
  templateUrl: './journal-entry-transactions-detail.component.html',
  styleUrls: ['./journal-entry-transactions-detail.component.scss']
})
export class JournalEntryTransactionsDetailComponent extends AccountingPlanBase implements OnInit {

  journalEntryTransactionDetail: JournalEntryTransactionDetail = new JournalEntryTransactionDetail();
  journalEntryTransaction: JournalEntryTransaction = new JournalEntryTransaction();
  idTypeExchangeRate1: number = -1;
  idTypeExchangeRate2: number = -1;
  exchangeRateBaseString: string;
  exchangeRateConvertionString: string;
  exchangeRateBase: number;
  exchangeRateConvertion: number;

  typeEntryTransaction: SelectItem[] = [];
  currencies: Coins[];

  baseCoin = {
    id: -1 as number,
    symbology: "" as string 
  }
  convertionCoin = {
    id: -1 as number,
    symbology: "" as string 
  }

  statusEntryTransaction = StatusEntryTransaction;
  loaded = false;
  lotModal = false;
  accountingAccountModal = false;
  viewMode = false
  submitted = false;
  submittedSaveTable = false;
  lot: Lots;
  filter: AuxiliariesAccountingAccountFilter = new AuxiliariesAccountingAccountFilter();
  filterAccountingAccount: AccountingAccountFilter = new AccountingAccountFilter();
  loading = false;
  currentPage = 1;
  elementsPerPage = 10;
  totalPaginatorElements: number = null;

  filterData = {
    typeExchangeRates: [] as SelectItem<number>[],
    costCenter: [] as SelectItem<number>[],
    auxiliaries: [] as SelectItem<number>[],
    currencies: [] as SelectItem<number>[],
    status: [] as SelectItem<number>[],
    branchoffice: [] as SelectItem<number>[],
    clients: [] as SupplierExtend[],
    lots: [] as Lots[],
    date: sort([
      {
        label: 'Fecha de documento',
        value: 1,
      },
      {
        label: 'Fecha de transacción',
        value: 2,
      },
    ], 'label') as SelectItem<number>[],
  };

  formatAmount(amount: number) {
    return ((this.currencies || [])?.find(c => c.id == this.journalEntryTransaction.idCoin)?.symbology || '') + '' + amount.toLocaleString('es-Ve', { minimumFractionDigits: 4 })
  }

  formatAmountCoin(amount: number, idCoin: number) {
    return ((this.currencies || [])?.find(c => c.id == idCoin)?.symbology || '') + '' + amount.toLocaleString('es-Ve', { minimumFractionDigits: 2 })
  }

  constructor(private coinsService: CoinsService,
    private branchofficeService: BranchofficeService,
    private loadingService: LoadingService,
    private lotsService: LotsService,
    private supplierService: SupplierService,
    private exchangeRatesService: ExchangeRatesService,
    private exchangeRateTypeService : ExchangeRateTypeService,
    private authservice: AuthService,
    private costCenterService: CostCenterService,
    private articleClassificationService: ArticleClassificationService,
    private accountingAccountService: AccountingAccountService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private messageService: MessageService,
    private journalEntryTransactionService: JournalEntryTransactionsService,
    private confirmationService: ConfirmationService,
    injector: Injector) {
      super(injector)
     }

  ngOnInit(): void {
    this.loadingService.startLoading();
    this.fetchInitialSetup();
    this.searchCoinsxCompany();
    this.getTypeEntryTransaction();
    this.fetchData()
    .then(() => {
      this.loaded = true;
    })
    .finally(() => {
      this.loadingService.stopLoading();
    });

    var idJournalEntryTransaction = parseInt(this.actRoute.snapshot.params['id']);
    var indDuplicate = parseInt(this.actRoute.snapshot.params['ind']);
    
    this.breadcrumbService.setItems([
      { label: "FMS" },
      { label: "Movimientos diarios", routerLink: ["/financial/entry-transactions/journal-entry-transactions"] },
      { label: "Nuevo" },
    ]);

    this.journalEntryTransaction.idType = this.journalEntryTransaction.idType == -1 ? 1 : -1;
    this.journalEntryTransaction.idStatus = this.statusEntryTransaction.ERASER;

    if (idJournalEntryTransaction > 0 && !indDuplicate) {
      this.breadcrumbService.setItems([
        { label: "FMS" },
        { label: "Movimientos diarios", routerLink: ["/financial/entry-transactions/journal-entry-transactions"] },
        { label: "Movimientos" },
      ]);
      this.onLoadJournalEntryTransaction(idJournalEntryTransaction)
    }
  }

  async fetchData(filter = this.filter, reset = false) {
    if (reset) {
      this.currentPage = 1;
    }

    this.loading = true;

    try {

      //const transactionsPage = await this.saleTransactionService.getTransactions({ ...filter, pageNumber: this.currentPage, pagelogs: this.elementsPerPage }, this.isDirect).toPromise();
      //this.transactions = transactionsPage.items;
      //this.totalPaginatorElements = transactionsPage.registers;
      this.currencies = await this.coinsService.getCoinsList({ ...new CoinFilter(), active: 1 }).toPromise();
      this.filterData.currencies = sort(this.currencies, 'name')
        .map(t => ({
          value: t.id,
          label: t.name + " (" + t.symbology + ")",
        }));

      const typeExchangeRates = await this.exchangeRateTypeService.getExchangeRateTypebyFilter({ ...new ExchangeRateTypeFilter() }).toPromise();
      this.filterData.typeExchangeRates = sort(typeExchangeRates, 'name')
        .map(t => ({
          value: t.id,
          label: t.name,
        }));

      const costCenter = await this.costCenterService.getCentersCostsList({ ...new CostCenterFilters(), active: 1 }).toPromise();
      this.filterData.costCenter = sort(costCenter, 'name')
        .map(t => ({
          value: t.id,
          label: t.name,
        }));
      const branchoffice = await this.branchofficeService.getBranchOfficeList().toPromise();
      this.filterData.branchoffice = sort(branchoffice.filter(o => o.active && o.idCompany === 1).map(o => ({
        value: o.id,
        label: o.branchOfficeName,
      })), 'label');
      
      this.filterData.lots = (await this.lotsService.getLotsList({ ...new LotsFilter(), allowsEntry: 1 }).toPromise())
        .find(l => l.moduleContent.toLowerCase() === 'compras')?.lots
        .filter(l => l.indStatusLot === 2)
        .sort((a, b) => a.lotName.localeCompare(b.lotName)) || [];
      this.filterData.clients = (await this.supplierService.getSupplierExtendList().toPromise())
        .sort((a, b) => a.socialReason.localeCompare(b.socialReason));
    } catch (err) {
      console.error(err);
    }

    this.loading = false;
  }

  toDate = (str: string | Date) => {
    const d = new Date(str);
    const padLeft = (n: number) => ('00' + n).slice(-2);
    const dformat = [
      padLeft(d.getDate()),


      padLeft(d.getMonth() + 1),
      d.getFullYear(),
    ].join('/');
    return dformat;
  }

  onLoadJournalEntryTransaction(idJournalEntryTransaction: number){
    this.journalEntryTransactionService.getEntryTransactionDetail(idJournalEntryTransaction, this.authservice.currentCompany)
    .subscribe((data: JournalEntryTransaction) => {
      this.journalEntryTransaction = {...data};
      this.journalEntryTransaction.transactionDate = new Date(this.journalEntryTransaction.transactionDate).getFullYear() == 1900 ? null : new Date(this.journalEntryTransaction.transactionDate);
      this.journalEntryTransaction.details.filter(x => x.idTemp = x.id);
      this.chargExchangeRate(this.journalEntryTransaction.idExchangeRateBase, true)
      this.chargExchangeRate(this.journalEntryTransaction.idExchangeRateConvertion, false)
    })
  }

  saveEntryTransaction(){
    this.submitted = true;
    if (this.journalEntryTransaction.idLot > 0 && this.journalEntryTransaction.idCoin > 0 && this.journalEntryTransaction.idType > 0) {
      if(this.journalEntryTransaction.details.length > 0){
        if (this.journalEntryTransaction.details.filter(x => x.isModified == true).length > 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Finalize la edición de los detalles para guardar" });
        }else{
          this.journalEntryTransaction.idFiscalYear = 1;
          this.journalEntryTransaction.idCompany = this.authservice.currentCompany;
          this.journalEntryTransaction.transactionDate = this.journalEntryTransaction.transactionDate == null ? new Date("01/01/1900") : this.journalEntryTransaction.transactionDate;
          this.journalEntryTransactionService.postEntryTransaction(this.journalEntryTransaction)
            .subscribe((data: number) => {
            if (data == 1000) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los movimientos" });
            }else{
              this.submitted = false;
              this.onLoadJournalEntryTransaction(data);
              this.router.navigate(['/financial/entry-transactions/journal-entry-transactions/new/', data, 0]);
              this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Movimientos guardados correctamente" });
            }
          })
        }
      }else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe registrar los movimientos para guardar" });
      }
    }
  }

  assessEntryTransaction(){
    if (this.journalEntryTransaction.details.reduce((sum, current) => sum + current.debit, 0) == this.journalEntryTransaction.details.reduce((sum, current) => sum + current.assets, 0)) {
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        message: '¿Desea contabilizar estos movimientos?',
        accept: () => {
          this.journalEntryTransaction.transactionDate = this.journalEntryTransaction.transactionDate == null ? new Date("01/01/1900") : this.journalEntryTransaction.transactionDate;
          this.journalEntryTransactionService.postEntryTransaction(this.journalEntryTransaction).subscribe((data: number) => {
            this.journalEntryTransactionService.accountedEntryTransaction(this.journalEntryTransaction.id)
            .subscribe((data: boolean) => {
              if (!data) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al contabilizar los movimientos" });
              }else{
                this.onLoadJournalEntryTransaction(this.journalEntryTransaction.id);
                this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Movimientos contabilizados correctamente" });
              }
            })
          })
        },
        reject: (type) => {
        }
      })
    }else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "El saldo debe ser igual a 0 para poder contabilizar" });
    }
    
  }

  cancelEntryTransaction(){
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Desea cancelar estos movimientos?',
      accept: () => {
        this.journalEntryTransactionService.cancelEntryTransaction(this.journalEntryTransaction.id)
        .subscribe((data: boolean) => {
          if (!data) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al cancelar los movimientos" });
          }else{
            this.onLoadJournalEntryTransaction(this.journalEntryTransaction.id);
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Movimientos cancelados correctamente" });
          }
        })
      },
      reject: (type) => {
      }
    })
  }

  anulledEntryTransaction(){
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Desea anular estos movimientos?',
      accept: () => {
        this.journalEntryTransactionService.anulledEntryTransaction(this.journalEntryTransaction.id)
        .subscribe((data: boolean) => {
          if (!data) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al anular los movimientos" });
          }else{
            this.onLoadJournalEntryTransaction(this.journalEntryTransaction.id);
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Movimientos anulados correctamente" });
          }
        })
      },
      reject: (type) => {
      }
    })
  }

  changeCoin(coin: number){
    if (this.idTypeExchangeRate1 > 0) {
      var filter = new ExchangeRatesFilter();
      filter.idOriginCurrency =  coin;
      filter.idDestinationCurrency = this.baseCoin.id;
      filter.idExchangeRateType = this.idTypeExchangeRate1;
      this.exchangeRatesService.getExchangeRatesbyFilter(filter).subscribe((data: ExchangeRates[]) => {
        if (data.length > 0) {
          this.journalEntryTransaction.idExchangeRateBase = data[0].idExchangeRate;
          this.exchangeRateBaseString = this.baseCoin.symbology + " " + data[0].conversionFactor;
          this.exchangeRateBase = data[0].conversionFactor;
        }else{
          this.exchangeRateBaseString = "Sin tasa de cambio"
          this.exchangeRateBase = 0;
        }
      }, (error: HttpErrorResponse)=>{
        console.log(error)
      });
    }
    if (this.idTypeExchangeRate2 > 0) {
      var filter = new ExchangeRatesFilter();
      filter.idOriginCurrency = this.journalEntryTransaction.idCoin;
      filter.idDestinationCurrency = this.convertionCoin.id;
      filter.idExchangeRateType = this.idTypeExchangeRate1;
      this.exchangeRatesService.getExchangeRatesbyFilter(filter).subscribe((data: ExchangeRates[]) => {
        if (data.length > 0) {
          this.journalEntryTransaction.idExchangeRateConvertion = data[0].idExchangeRate;
          this.exchangeRateConvertionString = this.convertionCoin.symbology + " " + data[0].conversionFactor;
          this.exchangeRateConvertion = data[0].conversionFactor;
        }else{
          this.exchangeRateConvertionString = "Sin tasa de cambio"
          this.exchangeRateConvertion = 0;
        }
      }, (error: HttpErrorResponse)=>{
        console.log(error)
      });
    }
  }

  changeExchangeRateBaseType(id: number){
    var filter = new ExchangeRatesFilter();
    if (this.journalEntryTransaction.idCoin > 0) {
      filter.idOriginCurrency =  this.journalEntryTransaction.idCoin;
      filter.idDestinationCurrency = this.baseCoin.id;
      filter.idExchangeRateType = id;
      this.exchangeRatesService.getExchangeRatesbyFilter(filter).subscribe((data: ExchangeRates[]) => {
        if (data.length > 0) {
          this.journalEntryTransaction.idExchangeRateBase = data[0].idExchangeRate;
          this.exchangeRateBaseString = this.baseCoin.symbology + " " + data[0].conversionFactor;
          this.exchangeRateBase = data[0].conversionFactor;
        }else{
          this.exchangeRateBaseString = "Sin tasa de cambio"
          this.exchangeRateBase = 0;
        }
      }, (error: HttpErrorResponse)=>{
        console.log(error)
      });
    }
  }

  changeExchangeRateConvertionType(id: number){
    var filter = new ExchangeRatesFilter();
    if (this.journalEntryTransaction.idCoin > 0) {
      filter.idOriginCurrency = this.journalEntryTransaction.idCoin;
      filter.idDestinationCurrency = this.convertionCoin.id;
      filter.idExchangeRateType = id;
      this.exchangeRatesService.getExchangeRatesbyFilter(filter).subscribe((data: ExchangeRates[]) => {
        if (data.length > 0) {
          this.journalEntryTransaction.idExchangeRateConvertion = data[0].idExchangeRate;
          this.exchangeRateConvertionString = this.convertionCoin.symbology + " " + data[0].conversionFactor;
          this.exchangeRateConvertion = data[0].conversionFactor;
        }else{
          this.exchangeRateConvertionString = "Sin tasa de cambio"
          this.exchangeRateConvertion = 0;
        }
      }, (error: HttpErrorResponse)=>{
        console.log(error)
      });
    }
  }

  chargExchangeRate(id: number, ind: boolean){
    var filter = new ExchangeRatesFilter();
    filter.idExchangeRate = id;
    this.exchangeRatesService.getExchangeRatesbyFilter(filter).subscribe((data: ExchangeRates[]) => {
      if (data.length > 0) {
        if (ind) {
          this.idTypeExchangeRate1 = data[0].idExchangeRateType;
          this.exchangeRateBaseString = this.baseCoin.symbology + " " + data[0].conversionFactor;
          this.exchangeRateBase = data[0].conversionFactor;
        }else{
          this.idTypeExchangeRate2 = data[0].idExchangeRateType;
          this.exchangeRateConvertionString = this.convertionCoin.symbology + " " + data[0].conversionFactor;
          this.exchangeRateConvertion = data[0].conversionFactor;
        }
      }else{
        if (ind) {
          this.exchangeRateBaseString = "Sin tasa de cambio"
          this.exchangeRateBase = 0;
        }else{
          this.exchangeRateConvertionString = "Sin tasa de cambio"
          this.exchangeRateConvertion = 0;
        }
      }
    }, (error: HttpErrorResponse)=>{
      console.log(error)
    });
  }

  searchCoinsxCompany(){
    var filter = new CoinxCompanyFilter();
    filter.idCompany = this.authservice.currentCompany;
    this.coinsService.getCoinxCompanyList(filter).subscribe((data: Coins[]) => {
      data.forEach(coin => {
        if (coin.legalCurrency == true) {
          this.baseCoin.id = coin.id;
          this.baseCoin.symbology = coin.symbology;
        }else{
          this.convertionCoin.id = coin.id;
          this.convertionCoin.symbology = coin.symbology;
        }
      });
    }, (error: HttpErrorResponse)=>{
      console.log(error);
    });
  }

  addEntryTransaction(){
    var transaction: JournalEntryTransactionDetail = {
      id: -1,
      idTemp: this.journalEntryTransaction.details.length > 0 ? this.journalEntryTransaction.details[this.journalEntryTransaction.details.length - 1].id == -1 ? this.journalEntryTransaction.details[this.journalEntryTransaction.details.length - 1].idTemp + 1 : this.journalEntryTransaction.details[this.journalEntryTransaction.details.length - 1].id + 1 : this.journalEntryTransaction.details.length + 1,
      idCostCenter: -1,
      costCenter: "",
      idBranchOffice: -1,
      branchOffice: "",
      idAccountingAccount: -1,
      accountingAccount: "",
      codeAccountingAccount: "",
      idPlanCuentaContableDetalle: -1,
      idAuxiliary: -1,
      auxiliary: "",
      description: "",
      referent: "",
      debit: 0,
      debitBase: 0,
      debitConvertion: 0,
      assets: 0,
      assetsBase: 0,
      assetsConvertion: 0,
      indActive: true,
      isModified: true,
      auxiliaries: [],
      indDebit: false,
      indAssets: false,
      indAuxiliary: false
    }
    this.journalEntryTransaction.details.push(transaction)
  }

  showModalAccountingAccount(transaction: JournalEntryTransactionDetail){
    this.journalEntryTransactionDetail = transaction;
    this.accountingAccountModal = !this.accountingAccountModal;
  }

  clearAccountingAccount(transaction: JournalEntryTransactionDetail){
    transaction.idAccountingAccount = -1;
    transaction.accountingAccount = "";
    transaction.codeAccountingAccount = "";
    transaction.idPlanCuentaContableDetalle = -1;
    transaction.auxiliaries = [];
    transaction.indAssets = false;
    transaction.indDebit = false;
  }

  foo(){
    //this.filter.idPlanCuentaContableDetalle = this._data.idPlanCuentaContableDetalle;
    this.onLoadAuxiliariesAssociatedList();
    this.onLoadAccountingAccount();
    //this.AuxiliarID=-1

  }

  onLoadAccountingAccount(_onLoad?: () => void) {
    this.filterAccountingAccount.accountingAccountCode = this.journalEntryTransactionDetail.codeAccountingAccount|| "";
    this.accountingAccountService.getAccountingAccountList(this.filterAccountingAccount)
      .subscribe((data) => {
        if(data.length > 0){
          var transaction = data[0];
          this.journalEntryTransactionDetail.idAccountingAccount = transaction.accountingAccountId
          if(transaction.tipoSaldoTipicoId == 1){
            this.journalEntryTransactionDetail.indDebit = true
            this.journalEntryTransactionDetail.indAssets = false
          }else{
            this.journalEntryTransactionDetail.indDebit = false
            this.journalEntryTransactionDetail.indAssets = true
          }
        }
      }, (error) => {
        console.log(error);
      });
  }

  onLoadAuxiliariesAssociatedList(_onLoad?: () => void) {
    this.filter.idPlanCuentaContableDetalle = this.journalEntryTransactionDetail.idPlanCuentaContableDetalle|| -1;
    this.filter.active=1;
    this.articleClassificationService.getAuxiliariesAssociatedList(this.filter)
      .subscribe((data) => {
        data.sort((a, b) => 0 - (a.id > b.id ? -1 : 1));
        this.journalEntryTransactionDetail.auxiliaries = [...data.map((item) => ({
          label: item.auxiliar,
          value: item.id,
        }))]
      }, (error) => {
        console.log(error);
      });
  }

  onRowSave(transaction: JournalEntryTransactionDetail){
    this.submittedSaveTable = true;
    if(transaction.idBranchOffice > 0) {
      if(transaction.idCostCenter > 0){
        if(transaction.idAccountingAccount > 0){
          if(transaction.idAuxiliary > 0){
            if ((transaction.debit > 0 || transaction.assets > 0)) {
              if(transaction.debit > 0){
                transaction.debitBase = transaction.debit * this.exchangeRateBase;
                transaction.debitConvertion = transaction.debit * this.exchangeRateConvertion;
              }
              if(transaction.assets > 0){
                transaction.assetsBase = transaction.assets * this.exchangeRateBase;
                transaction.assetsConvertion = transaction.assets * this.exchangeRateConvertion;
              }
              this.submittedSaveTable = false;
              transaction.isModified = false;
            }else{
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "Asigne el 'Debe' o 'Haber' para guardar" });
            }
          }else{
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Seleccione el auxiliar" });
          }
        }else{
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Seleccione una cuenta contable" });
        }
      }else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Seleccione el centro de costo" });
      }
    }else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Seleccione la sucursal" });
    }
    
  }

  onRowEdit(transaction: JournalEntryTransactionDetail){
    transaction.isModified = true;
  }

  onRowDelete(transaction: JournalEntryTransactionDetail){
    if(transaction.id > 0){
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        message: 'Este movimiento será eliminado. ¿Desea continuar?',
        accept: () => {
          this.journalEntryTransactionService.deleteEntryTransactionDetail(this.journalEntryTransaction.id, transaction.id).subscribe((result: boolean) => {
            if (result) {
              this.journalEntryTransaction.details = this.journalEntryTransaction.details.filter(x => x.id != transaction.id);
              this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: "Movimiento eliminado correctamente." });
            }else{
              this.messageService.add({ severity: 'error', summary: 'Eliminado', detail: "Ha ocurrido un error al eliminar el movimiento." });  
            }
          })
        },
        reject: (type) => {
        }
      })
    }else{
      this.journalEntryTransaction.details = this.journalEntryTransaction.details.filter(x => x.idTemp != transaction.idTemp);
    }
  }

  searchCodeAccountingAccount(event, transaction: JournalEntryTransactionDetail){
    var filter = new AccountingAccountFilter();
    this.journalEntryTransactionDetail = transaction;
    filter.accountingAccountCode = event.target.value.replaceAll(this.currentSeparator.separatorContent, '##');
    this.accountingAccountService.getAccountingAccountList(filter).subscribe((data: AccountingAccount[]) => {
      if (data.length > 0) {
        var accountingAccount = data[0];
        transaction.idAccountingAccount = accountingAccount.accountingAccountId;
        transaction.accountingAccount = accountingAccount.accountingAccountName;
        transaction.codeAccountingAccount = accountingAccount.accountingAccountCode;
        transaction.idPlanCuentaContableDetalle = accountingAccount.planCuentaContableDetalleId;
        this.onLoadAuxiliariesAssociatedList();
        if(accountingAccount.tipoSaldoTipicoId == 1){
          transaction.indDebit = true
          transaction.indAssets = false
        }else{
          transaction.indDebit = false
          transaction.indAssets = true
        }
      }else{
        transaction.idAccountingAccount = -1;
        transaction.accountingAccount = "";
        transaction.idPlanCuentaContableDetalle = -1;
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "La cuenta contable no existe." });  
      }
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar la cuenta contable." });  
    });
  }

  changeBranchOffice(event, transaction: JournalEntryTransactionDetail){
    transaction.branchOffice = event.originalEvent.target.innerText;
  }

  changeCostCenter(event, transaction: JournalEntryTransactionDetail){
    transaction.costCenter = event.originalEvent.target.innerText;
  }

  changeAuxiliary(event, transaction: JournalEntryTransactionDetail){
    transaction.auxiliary = event.originalEvent.target.innerText;
  }

  getDistTotals() {
    const dists = this.journalEntryTransaction.details
    const debit = dists.map(d => d.debit).reduce((a, b) => a + b, 0)
    const assets = dists.map(d => d.assets).reduce((a, b) => a + b, 0)
    const diff = debit - assets
    const format = (number: number) => this.formatAmount(number)
    return {
      debit: format(debit),
      assets: format(assets),
      diff: format(diff),
      color: diff === 0 ? 'green' : 'red',
    }
  }

  back(){
    this.router.navigate(['/financial/entry-transactions/journal-entry-transactions']);
  }

  clear(){
    this.journalEntryTransaction.idCoin = -1
    this.journalEntryTransaction.coin = "";
    this.journalEntryTransaction.idType = -1;
    this.journalEntryTransaction.type = "";
    this.journalEntryTransaction.idLot = -1;
    this.journalEntryTransaction.lot = "";
    this.idTypeExchangeRate1 = -1;
    this.idTypeExchangeRate2 = -1;
    this.exchangeRateBaseString = "";
    this.exchangeRateBase = 0;
    this.exchangeRateConvertionString = "";
    this.exchangeRateConvertion = 0;
    this.journalEntryTransaction.details = [];
  }

  getTypeEntryTransaction(){
    var filter = new TypeJournalEntryTransactionFilter()
    filter.indActive = 1;
    this.journalEntryTransactionService.getTypeEntryTransactions(filter)
    .subscribe((data: TypeJournalEntryTransaction[])=>{
      data = data.sort((a, b) => a.typeJournalEntryTransaction.localeCompare(b.typeJournalEntryTransaction));
      this.typeEntryTransaction = data.map((item)=>({
        label: item.typeJournalEntryTransaction,
        value: item.idTypeJournalEntryTransaction
      }));
    },(error)=>{
      console.log(error);
    });
  }

  selectLot(lot: Lots){
    this.journalEntryTransaction.idLot = lot.id;
    this.journalEntryTransaction.lot = lot.lotName;
  }

  getPrice(value: number, ind: number){
    if (ind == 0)
      return this.formatAmountCoin(value, this.journalEntryTransaction.idCoin);
    if (ind == 1) 
      return this.formatAmountCoin(value * this.exchangeRateBase, this.baseCoin.id);
    if (ind == 2) 
      return this.formatAmountCoin(value * this.exchangeRateConvertion, this.convertionCoin.id);
  }

  getSymbology(){
    return (this.currencies || [])?.find(c => c.id == this.journalEntryTransaction.idCoin)?.symbology || '';
  }

  duplicate(){
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        message: 'Duplicará este movimiento diario. ¿Desea continuar?',
        accept: () => {
          this.loadingService.startLoading();
          var duplicateEntryTransaction = new JournalEntryTransaction();
          duplicateEntryTransaction = {...this.journalEntryTransaction}
          duplicateEntryTransaction.id = -1;
          duplicateEntryTransaction.documentNumber = "";
          duplicateEntryTransaction.idStatus = this.statusEntryTransaction.ERASER;
          if (duplicateEntryTransaction.details.length > 0) {
            for (let i = 0; i < duplicateEntryTransaction.details.length; i++) {
              duplicateEntryTransaction.details[i].id = -1;
            };
          }
          this.journalEntryTransactionService.postEntryTransaction(duplicateEntryTransaction)
            .subscribe((data: number) => {
            if (data == 1000) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al duplicar el movimiento" });
            }else{
              this.submitted = false;
              this.onLoadJournalEntryTransaction(data);
              this.router.navigate(['/financial/entry-transactions/journal-entry-transactions/new/', data, 0]);
              this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Movimientos duplicados correctamente" });
            }
          })
          this.loadingService.stopLoading();
        },
        reject: (type) => {
        }
      })
  }

  reverse(){
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: 'Reversará este movimiento diario. ¿Desea continuar?',
      accept: () => {
        var reverseEntryTransaction = new JournalEntryTransaction();
        reverseEntryTransaction = {...this.journalEntryTransaction}
        reverseEntryTransaction.id = -1;
        reverseEntryTransaction.idType = 2;
        reverseEntryTransaction.concept = "Reverso del movimiento: " + this.journalEntryTransaction.documentNumber;
        if (reverseEntryTransaction.details.length > 0) {
          for (let i = 0; i < reverseEntryTransaction.details.length; i++) {
            reverseEntryTransaction.details[i].id = -1;
            var detailTemp = {...reverseEntryTransaction.details[i]}
            reverseEntryTransaction.details[i].debit = detailTemp.assets;
            reverseEntryTransaction.details[i].debitBase = detailTemp.assetsBase;
            reverseEntryTransaction.details[i].debitConvertion = detailTemp.assetsConvertion;
            reverseEntryTransaction.details[i].assets = detailTemp.debit;
            reverseEntryTransaction.details[i].assetsBase = detailTemp.debitBase;
            reverseEntryTransaction.details[i].assetsConvertion = detailTemp.debitConvertion;
          }
        }
        this.journalEntryTransactionService.postEntryTransaction(reverseEntryTransaction)
            .subscribe((data: number) => {
            if (data == 1000) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al reversar el movimiento" });
            }else{
              this.submitted = false;
              this.onLoadJournalEntryTransaction(data);
              this.router.navigate(['/financial/entry-transactions/journal-entry-transactions/new/', data, 0]);
              this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Movimientos reversados correctamente" });
            }
          })
      },
      reject: (type) => {
      }
    })
    
  }

  getPostingDate(){
    if (this.journalEntryTransaction.postingDate == null || this.journalEntryTransaction.postingDate == undefined || new Date(this.journalEntryTransaction.postingDate).getFullYear() == 1900) {
      return false
    }else{
      return true;
    }
  }
}
