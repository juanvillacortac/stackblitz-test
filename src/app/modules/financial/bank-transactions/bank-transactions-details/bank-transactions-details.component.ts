
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { AccountingAccount } from 'src/app/models/financial/AccountingAccount';
import { AuxiliariesAccountingAccountFilter } from 'src/app/models/financial/AuxiliariesAccountingAccount';
import { BankTransaction, BankTransactionDetail, BankTransactionFilter } from 'src/app/models/financial/bank-transactions';
import { BankAdjustmentType } from 'src/app/models/financial/BankAdjustmentType';
import { Bank } from 'src/app/models/masters/bank';
import { bankAccounts } from 'src/app/models/masters/bankAccounts';
import { Coins } from 'src/app/models/masters/coin';
import { ExchangeRateByCurrency } from 'src/app/models/masters/exchangeRateByCurrency';
import { MotivesFilters } from 'src/app/models/masters/motives-filters';
import { MotivesType } from 'src/app/models/masters/motives-type';
import { MotivesTypeFilters } from 'src/app/models/masters/motives-type-filters';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { BankAccountsService } from 'src/app/modules/masters/bank-accounts/shared/services/bank-accounts.service';
import { BankService } from 'src/app/modules/masters/bank/shared/services/bank.service';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { MotivesService } from 'src/app/modules/masters/motives/shared/services/motives.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { AccountingAccountService } from '../../AccountingAccounts/shared/services/accounting-account.service';
import { ArticleClassificationService } from '../../article-classification/shared/services/article-classification.service';
import { AccountingPlanBase } from '../../initial-setup/shared/accounting-plan-base.component';
import { BankTransactionService } from '../shared/services/bank-transaction.service';

type Distribution = {
  accountId: number
  account: string
  accountCode: string
  auxiliaryId: number
  auxiliary: string
  indAux: boolean
  direction: 'credit' | 'debit'
}

@Component({
  selector: 'app-bank-transactions-details',
  templateUrl: './bank-transactions-details.component.html',
  styleUrls: ['./bank-transactions-details.component.scss']
})
export class BankTransactionsDetailsComponent extends AccountingPlanBase implements OnInit {
  dataLoaded = false;
  showItems = true;
  showPlan = true;
  submitted = false;
  permissionsIDs = { ...Permissions };
  showDialog = false;
  showFilters: boolean = false;
  loading = false;
  viewMode = false;
  accountCode = "";

  transact = new BankTransaction()
  oldBankAdjustment = new BankTransaction()
  bankAdjustmentFilter = new BankTransactionFilter();
  ind: number = 0;

  indChange = false;
  adjustmentType: BankAdjustmentType[];
  bank: Bank[];
  bankAccount: bankAccounts[];
  currency: Coins[];
  motivesTypes: MotivesType[];
  bankAccountExchangeRateByCurrency: ExchangeRateByCurrency[];
  filter: AuxiliariesAccountingAccountFilter = new AuxiliariesAccountingAccountFilter();
  bankAccountExchangeRate: SelectItem[];
  bankAccountExchangeRateConver: SelectItem[];
  auxiliarylist: SelectItem[];
  statuslist: SelectItem[] = [
    { label: 'Activo', value: 1 },
    { label: 'Inactivo', value: 2 },
  ];

  saving: boolean;
  displayModal: boolean;
  idItem: number = 0;
  idPlanCuentaContableDetalle: number;
  requiredd: string = "*";
  bankAccountList: bankAccounts[];
  currencyList: Coins[];
  currencyXcompany: Coins[];
  LegacyCurrency: boolean;

  accountingAccounts: AccountingAccount[]


  distributions: [Distribution, Distribution] = [null, null]

  getDistributions = (): BankTransactionDetail[] => {
    return this.distributions.map(dist => ({
      ...new BankTransactionDetail(),
      bankTransaction: this.transact.bankTransactionId,
      accountingAccountingId: dist.accountId,
      auxiliarIdDetail: dist.auxiliaryId,
      codeAccountingAcccount: dist.accountCode,
      typeEntriesId: 1,
      idTypeEstatusTransaction: 1,
      indPermiteAuxiliar: dist.indAux,
      typeEstatusTransactionDetail: '',
      credit: this.getDistAmount(dist, 'credit'),
      debit: this.getDistAmount(dist, 'debit'),
    }))
  }
  indCurrency: boolean;
  record: boolean;
  nombre: string= "Nombre del destinatario/emisor";
  
  formatAmount(amount: number) {
    return (this.currency.find(c => c.id == this.transact.bankAccountCurrencyId)?.symbology || '') + '' + amount.toLocaleString('es-Ve', { minimumFractionDigits: 4 })
  }

  getTotal = () => this.distributions
    .map(d => [d ? this.getDistAmount(d, 'debit') : 0, d ? this.getDistAmount(d, 'credit') : 0])
    .reduce<[number, number]>(([aa, ab], [ba, bb]) => [aa + ab, ba + bb], [0, 0])

  getDistAmount = (dist: Distribution, direction: 'credit' | 'debit') =>
    (dist.direction == direction ? this.transact.bankAdjustmentTypeId == 1 : this.transact.bankAdjustmentTypeId == 2) && this.transact?.amount
      ? this.transact.amount : 0
  getFormatedDistAmount = (dist: Distribution, direction: 'credit' | 'debit') => this.formatAmount(this.getDistAmount(dist, direction))

  cols: ColumnD<Distribution>[] = [
    { template: p => p.account, header: 'Descripción', display: 'table-cell' },
    { template: p => this.formatCode(p.accountCode), header: 'Cuenta contable', display: 'table-cell' },
    { template: p => 'Transacción bancaria', header: 'Tipo', display: 'table-cell' },
    { template: p => p.indAux ? p.auxiliary : 'N/A', header: 'Auxiliar', display: 'table-cell' },
    { template: p => this.getFormatedDistAmount(p, 'debit'), field: 'debit', header: 'Débito', display: 'table-cell', textAlign: 'right' },
    { template: p => this.getFormatedDistAmount(p, 'credit'), field: 'credit', header: 'Crédito', display: 'table-cell', textAlign: 'right' },
  ];
  Total: any;

  constructor(
    private actRoute: ActivatedRoute,
    public breadcrumbService: BreadcrumbService,
    private messageService: MessageService,
    public userPermissions: UserPermissions,
    private router: Router,
    private confirmationService: ConfirmationService,
    private accountingAccountService: AccountingAccountService,
    injector: Injector,
    private loadingService: LoadingService,
    private _bankTransactionService: BankTransactionService,
    private _bankService: BankService,
    private _bankAccountsService: BankAccountsService,
    private _coinsService: CoinsService,
    private _motivesService: MotivesService,
    private _articleClassificationService: ArticleClassificationService

  ) {
    super(injector)
    this.breadcrumbService.setItems([
      { label: 'FMS' },
      { label: 'Bancos' },
      { label: 'Ajustes bancarios', routerLink: ['/financial/banks/bank-transactions'] }
    ])
  }

  maxPostingDate: Date

  ngOnInit() {
    this.loadingService.startLoading();

    this.maxPostingDate = new Date()

    this.accountingAccountService.getAccountingAccountList().subscribe((aa: AccountingAccount[]) => {

      this.accountingAccounts = aa

    })

    this.fetchData()
      .finally(() => {
        this.loadingService.stopLoading();
      })
  }

  toDate = (date: string | Date) => new Date(date)

  onChangeBank(event) {
debugger
    this.bankAccountList = this.bankAccount.filter(b => b.bankId == event.value)
    //this.bankAccountExchangeRateConver=[];
    this.currencyList = [];
    //this.transact.bankAccountId = -1
    //this.transact.bankAccountCurrencyId=-1
    this.onChangebankAccount({ value: -1 })
  }

  onChangeAdjust(event){
    if (event.value==1) {
      this.nombre="Nombre del destinatario"
    }else{
      this.nombre= "Nombre del emisor"
    }
   
  }

  onChangebankAccount(event) {
    debugger
    
    const f = this.bankAccount.filter(b => b.bankAccountId == event.value).map(a => a.currencyId)
    this.setAccountInDist(this.bankAccount.find(b => b.bankAccountId == event.value))

    this.currencyList = this.currency;
    this.LegacyCurrency = this.currency.find(f => f.id == f[0])?.legalCurrency
   
    this.transact.bankAccountCurrencyId = this.transact.bankAccountId>0 ? f[0] : this.transact.bankAccountCurrencyId;

    this.indCurrency = (this.currencyXcompany.filter(f => f.id == this.transact.bankAccountCurrencyId)).length ? true : false


  }

  setAccountInDist(account: bankAccounts) {
    if (!account) {
      this.distributions[0] = null
      return
    }
    this.distributions[0] = {
      accountId: account.accountingAccountId,
      account: account.accountingAccount,
      indAux: this.accountingAccounts.find(aa => account.accountingAccountId == aa.accountingAccountId)?.indPermiteAuxiliar,
      auxiliaryId: account.auxiliaryId,
      auxiliary: account.auxiliary || 'Ninguno',
      accountCode: this.accountingAccounts.find(aa => account.accountingAccountId == aa.accountingAccountId)?.accountingAccountCode,
      direction: 'credit'
    }
  }

  lastAccountingAccountName: string = ''

  setLastAccountInDist() {
    if (!this.accountCode && !this.transact?.accountingAccount) {
      this.distributions[1] = null
      return
    }
    const code = this.accountCode || this.transact.accountingAccount
    console.log(code, this.accountingAccounts)
    this.distributions[1] = {
      accountId: this.accountingAccounts.find(aa => code == aa.accountingAccountCode)?.accountingAccountId,
      account: this.accountingAccounts.find(aa => code == aa.accountingAccountCode)?.accountingAccountName,
      indAux: this.transact.indPermitAuxiliary,
      auxiliaryId: this.transact.auxiliarId,
      auxiliary: this.auxiliarylist.find(a => a.value === this.transact.auxiliarId)?.label || 'Ninguno',
      accountCode: this.accountCode,
      direction: 'debit',
    }
  }

  rateTypes: SelectItem<number>[]

  onChangeExchangeRateByCurrency(event) {

    this.bankAccountExchangeRate = this.bankAccountExchangeRateByCurrency
      .filter(b => b.exchangeTypeId == event.value).map(c => ({
        label: c.destinationCurrencySymbol + c.conversionFactor,
        value: c.exchangeTypeId
      }))




  }

  onChangeExchangeRateByCurrencyConver(event) {

    this.bankAccountExchangeRateConver = this.bankAccountExchangeRateByCurrency.filter(b => b.exchangeTypeId == event.value).map(c => ({
      label: c.destinationCurrencySymbol + c.conversionFactor,
      value: c.exchangeTypeId
    }))


  }


  assertPostingDate() {
    if (!this.transact?.bankPostingDate || !this.transact?.transactionDate) {
      return
    }
    if (new Date(this.transact.transactionDate) > new Date(this.transact.bankPostingDate)) {
      this.transact.bankPostingDate = null
    }
  }

  validateAccountingAccount(bankAccountId: number, accountingAccountId: number) {
    const bankAccount = this.bankAccount.find(ba => ba.bankAccountId == bankAccountId)
    const accountingAccount = this.accountingAccounts.find(aa => aa.accountingAccountId == accountingAccountId)
    const invalid = accountingAccount?.accountingAccountId == bankAccount?.accountingAccountId
    if (invalid) {
      this.messageService.add({ severity: 'error', summary: 'Cuenta contable duplicada', detail: "La cuenta contable asociada a la cuenta bancaria no puede ser igual a la cuenta de registro." });
    }
    return invalid
  }

  validateAuxiliary(bankAccountId: number, auxiliaryId: number) {
    const bankAccount = this.bankAccount.find(ba => ba.bankAccountId == bankAccountId)
    const invalid = auxiliaryId == bankAccount?.auxiliaryId
    if (invalid) {
      this.messageService.add({ severity: 'error', summary: 'Auxiliar duplicado', detail: "El auxiliar asociado a la cuenta bancaria no puede ser igual al auxiliar seleccionado." });
    }
    return invalid
  }

  setAccountingAccount(id: number) {
    const accountingAccount = this.accountingAccounts.find(aa => aa.accountingAccountId == id)
    if (this.validateAccountingAccount(this.transact?.bankAccountId, +id)) {
      return
    }
    this.transact.accountingAccountTransactionId = +id
    this.accountCode = accountingAccount?.accountingAccountCode || this.accountCode
    this.setLastAccountInDist()
  }

  setAuxiliary(id: number) {
    if (this.validateAuxiliary(this.transact.bankAccountId, +id)) {
      this.transact.auxiliarId = -1
      return
    }
    this.transact.auxiliarId = +id
    this.setLastAccountInDist()
  }

  setBankAccount(id: number) {
    const invalidAA = this.validateAccountingAccount(+id, this.transact.accountingAccountTransactionId)
    const invalidBA = this.validateAuxiliary(+id, this.transact?.auxiliarId)
    if (invalidAA || invalidBA) {
      this.transact.bankAccountId = -1
      return
    }
    this.transact.bankAccountId = +id
    this.onChangebankAccount({ value: +id })
  }



  getBankAdjustmentDetails() {
 
    if (this.loading)
      return;
    this.loading = true;
    this.bankAdjustmentFilter.bankTransactionId = this.idItem;
    this._bankTransactionService.getTransactionsDetail(this.bankAdjustmentFilter).subscribe((data: BankTransaction) => {
      this.transact = {
        ...data,
        ...(data?.bankPostingDate ? { bankPostingDate: new Date(data.bankPostingDate) } : {}),
        ...(data?.transactionDate ? { transactionDate: new Date(data.transactionDate) } : {}),
      };
      if ((this.transact.bankPostingDate as Date)?.getFullYear() === 1900) {
        this.transact.bankPostingDate = null
      }
      if (data == null) {
        this.messageService.clear();
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar el detalle del ajuste bancario." });
        this.loading = false;
        return;
      }
      if (this.transact.bankAdjustmentTypeId==1) {
        this.nombre="Nombre del destinatario"
      }else{
        this.nombre= "Nombre del emisor"
      }
      this.loading = false;
      const queryParams: any = {};
      queryParams.filters = JSON.stringify(this.transact);
      this.oldBankAdjustment = { ...this.transact }
      this.accountCode = this.transact.accountingAccount


      this.idPlanCuentaContableDetalle = this.accountingAccounts.find(f => f.accountingAccountCode == this.accountCode)?.planCuentaContableDetalleId
      this.onLoadAuxiliariesAssociatedList();
      this.onChangeBank({ value: this.transact.bankId })
      this.onChangebankAccount({ value: this.transact.bankAccountId })
      this.Total = (this.currencyList.find(c => c.id == this.transact.bankAccountCurrencyId)?.symbology || '') + '' + (this.transact.amount * 2).toLocaleString('es-Ve', { minimumFractionDigits: 4 });

      this.bankAccountExchangeRate = this.bankAccountExchangeRateByCurrency
        .filter(b => b.exchangeTypeId == this.transact.taxeChangeId).map(c => ({
          label: c.destinationCurrencySymbol + c.conversionFactor,
          value: c.exchangeTypeId
        }))

      this.bankAccountExchangeRateConver = this.bankAccountExchangeRateByCurrency
        .filter(b => b.exchangeTypeId == this.transact.converTaxeChangeId).map(c => ({
          label: c.destinationCurrencySymbol + c.conversionFactor,
          value: c.exchangeTypeId
        }))



    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar el detalle del ajuste bancario." });

    });

  }

  async fetchData() {
    try {
      await this.fetchInitialSetup()
      await this.search()
      await this.fetchData2()

      this.idItem = this.actRoute.snapshot.params['id'];
      debugger
      if (this.idItem != 0 && this.idItem != undefined) {

        this.getBankAdjustmentDetails();

        if (this.transact.typeEstatusTransactionId == 2)
          this.saving = true;

        if (this.transact.typeEstatusTransactionId == 1)
          this.saving = false;

      }
      else {
        this.transact.active = true;
        this.requiredd = "";

        this.Total = (this.currency.find(c => c.id == this.transact.bankAccountCurrencyId)?.symbology || '') + '' + (this.transact.amount * 2).toLocaleString('es-Ve', { minimumFractionDigits: 4 });
      }
    } catch (err) {
      console.error(err)
    }

    this.dataLoaded = true
  }

  async search() {
    if (this.loading)
      return;
    this.loading = true;
  }

  onLoadAuxiliariesAssociatedList(_onLoad?: () => void) {
    debugger
    this.auxiliarylist = [];
    this.filter.idPlanCuentaContableDetalle = this.idPlanCuentaContableDetalle || -1;

    this.filter.active = 1;
    //this.AuxiliarID=-1;

    this._articleClassificationService.getAuxiliariesAssociatedList(this.filter)
      .subscribe((data) => {
        data.sort((a,b) => 0 - (a.auxiliar > b.auxiliar ? -1 : 1))
        this.auxiliarylist = data.map((item) => ({
          label: item.auxiliar,
          value: item.id,
        }))
        this.setLastAccountInDist()
      }, (error) => {
        console.log(error);
      });
  }

  currencyOnchange(event) {
    if (this.loading)
      return;
    debugger
    this.loading = true;
    this._bankAccountsService.GetBankAccountExchangeRateByCurrency(event.value).subscribe((data) => {
      this.bankAccountExchangeRateByCurrency = data;
      this.rateTypes = data
        .filter((value, index) => data.findIndex(t => t.exchangeTypeId == value.exchangeTypeId) == index)
        .map(t => ({
          label: t.exchangeType,
          value: t.exchangeTypeId,
        }))

      this.loading = false;

    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los tipos tasa de cambio." });

    });

  }


  fetchData2() {
    return this._bankTransactionService.getAdjustmentType().toPromise()
      .then((adjustmentsType) => this.adjustmentType = adjustmentsType.sort((a, b) => a.adjustmentType.localeCompare(b.adjustmentType)))
      .then(() => this._bankService.getBanks().toPromise())
      .then((banks) => this.bank = banks.filter(b => b.active && b.accountingAccountId > 0).sort((a, b) => a.name.localeCompare(b.name)))
      .then(() => this._bankAccountsService.getbankAccountsList().toPromise())
      .then((bankAccountss) => this.bankAccount = bankAccountss.sort((a, b) => a.accountNumber.localeCompare(b.accountNumber)))
      .then(() => this._motivesService.getMotives({ ...new MotivesFilters(), active: 1, idModule: 163, idApp: 5 }))
      .then((MotivesTypes) => this.motivesTypes = MotivesTypes.sort((a, b) => a.name.localeCompare(b.name)))
      .then(() => this._coinsService.getCoinxCompanyList({ idCompany: 1 }).toPromise())
      .then(coins => {
        this.currencyXcompany = coins.filter(c => c.active).sort((a, b) => a.name.localeCompare(b.name))
        // this.coinsOptions = this.coins.map(c => ({
        //   label: `${c.name} - ${c.legalCurrency ? 'Moneda base' : 'Moneda conversión'}`,
        //   value: c.id,
        // }))
      })
      .then(() => this._coinsService.getCoinsList().toPromise())
      .then(coins => {
        this.currency = coins.filter(c => c.active).sort((a, b) => a.name.localeCompare(b.name))
        // this.coinsOptions = this.coins.map(c => ({
        //   label: `${c.name} - ${c.legalCurrency ? 'Moneda base' : 'Moneda conversión'}`,
        //   value: c.id,
        // }))
      })
      .then(() => this._bankAccountsService.GetBankAccountExchangeRateByCurrency(-1).toPromise())
      .then((bankAccountExchangeRateByCurrencys) => {
        this.bankAccountExchangeRateByCurrency = bankAccountExchangeRateByCurrencys.sort((a, b) => a.exchangeType.localeCompare(b.exchangeType))
        this.rateTypes = this.bankAccountExchangeRateByCurrency
          .filter((value, index) => this.bankAccountExchangeRateByCurrency.findIndex(t => t.exchangeTypeId == value.exchangeTypeId) == index)
          .map(t => ({
            label: t.exchangeType,
            value: t.exchangeTypeId,
          }))
      })

      .finally(() => {
        this.loading = false
      })
  }

  new() {
    this.viewMode = false;
    this.showDialog = true;
  }

  showModalDialog() {

    this.displayModal = true;

  }
  back() {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea regresar? perderá los cambios realizados.',
      accept: () => {
        this.saving = true
        this.router.navigate(["/financial/banks/bank-transactions"])
      }
    });
  }



  Cancel() {

    this.confirmationService.confirm({
      message: '¿Está seguro que desea cancelar? luego no se podran editar los datos.',
      accept: () => {

        this._bankTransactionService.PostTransactionsDetailCancel(this.oldBankAdjustment, this.idItem).subscribe((data: number) => {
          if (data > 0) {
            this.showDialog = false;
            this.submitted = false;
            this.saving = false;
            this.router.navigate(["/financial/banks/bank-transactions"])
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });

          } else if (data == -1) {

            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
            this.saving = false;

          }
          else if (data == -3) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Este registro no existe" });
          }
          else {
            this.saving = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });

          }
        });

      }
    });
  }

  filteredDistributions = () => this.distributions.filter(d => d)

  ToRecord() {
    debugger
   this.record =true;
    this.submitted = true;
    if (this.transact.bankAdjustmentTypeId >0
      && this.transact.transactionDate
      && this.transact.bankPostingDate
      && this.transact.bankId >0
      && this.transact.bankAccountId >0
     && this.transact.bankAccountCurrencyId >0
     && this.transact.bankReasonId >0
     && this.transact.taxeChangeId >0
     //&& this.transact.typetaxeChangeId >0
     
     && this.transact.reference 
    //  && (this.transact.converTypeTaxeChangeId >0 && !this.indCurrency)
    //  && (this.transact.converTaxeChangeId >0 && !this.indCurrency)
     && this.accountCode
     && this.transact.amount >0  
    

    ) {


      // if(this.indClasi==this.article.claseArticuloId || this.indTipo==this.article.tipoArticuloId || this.indCentro==this.article.centroCostoId ){

      //   if(this.indClasi==this.article.claseArticuloId){
      //     this.messageService.add({ severity: 'error', summary: 'Error', detail: "La clasificación asociada al artículo se encuentra inactiva." });
      //   }

      //   if(this.indTipo==this.article.tipoArticuloId){
      //     this.messageService.add({ severity: 'error', summary: 'Error', detail: "El tipo se encuentra inactivo." });
      //   }

      //   if(this.indCentro==this.article.centroCostoId){
      //     this.messageService.add({ severity: 'error', summary: 'Error', detail: "El centro de costo se encuentra inactivo." });
      //   }
      //         this.saving = false;
      //         return
      // }




      this.messageService.clear();
      this.saving = true

      this.transact.accountingAccount = this.accountCode;


      this.confirmationService.confirm({
        message: '¿Está seguro que desea contabilizar? luego no se podran editar los datos.',
        accept: () => {




          // this.send(1)
          const model = { ...this.transact, detalle: this.getDistributions() }

          this._bankTransactionService.postTransaction(this.transact).subscribe((data) => {
            if (data > 0) {
              this._bankTransactionService.PostTransactionsDetailToRecord(model, this.idItem).subscribe((data: number) => {
                if (data > 0) {
                  this.showDialog = false;
                  this.submitted = false;
                  this.saving = false;
                  this.router.navigate(["/financial/banks/bank-transactions"])
                  this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });

                } else if (data == -1) {

                  this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
                  this.saving = false;

                }
                else if (data == -3) {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: "Este registro no existe" });
                }
                else {
                  this.saving = false;
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });

                }
              });
            }
          })
        }
      });
    }

  }

  Revoke() {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea anular el ajuste? Esta acción no es reversible.',
      accept: () => {
        this._bankTransactionService.PostTransactionsDetailRevoke(this.oldBankAdjustment, this.idItem).subscribe((data: number) => {
          if (data > 0) {
            this.showDialog = false;
            this.submitted = false;
            this.saving = false;
            this.router.navigate(["/financial/banks/bank-transactions"])
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });

          } else if (data == -1) {

            this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
            this.saving = false;
            //this.article.associatedAccount = asso
          }
          else if (data == -3) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Este registro no existe" });
          }
          else {
            this.saving = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });

          }
        });
      }
    });

  }


  send(indSave: number = 0) {
    this.submitted = true;
    if (this.transact.bankAdjustmentTypeId > 0
      && this.transact.bankId > 0
      && this.transact.bankAccountCurrencyId > 0
      && this.transact.bankAccountId > 0
      // && this.article.costoArt > 0
      // && this.article.estatuArticuloId > 0

    ) {


      // if(this.indClasi==this.article.claseArticuloId || this.indTipo==this.article.tipoArticuloId || this.indCentro==this.article.centroCostoId ){

      //   if(this.indClasi==this.article.claseArticuloId){
      //     this.messageService.add({ severity: 'error', summary: 'Error', detail: "La clasificación asociada al artículo se encuentra inactiva." });
      //   }

      //   if(this.indTipo==this.article.tipoArticuloId){
      //     this.messageService.add({ severity: 'error', summary: 'Error', detail: "El tipo se encuentra inactivo." });
      //   }

      //   if(this.indCentro==this.article.centroCostoId){
      //     this.messageService.add({ severity: 'error', summary: 'Error', detail: "El centro de costo se encuentra inactivo." });
      //   }
      //         this.saving = false;
      //         return
      // }




      this.messageService.clear();
      this.saving = true

      this.transact.accountingAccount = this.accountCode;
      this._bankTransactionService.postTransaction(this.transact).subscribe((data) => {
        if (data > 0) {
          this.showDialog = false;
          this.submitted = false;
          this.saving = false;
          if (indSave == 0) {
            this.router.navigate(["/financial/banks/bank-transactions"])
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
          }
        } else if (data == -1) {

          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El nombre ya se encuentra registrado." });
          this.saving = false;
        }
        else if (data == -3) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Este registro no existe" });
        }
        else {
          this.saving = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
        }
      });

    }

  }
}
