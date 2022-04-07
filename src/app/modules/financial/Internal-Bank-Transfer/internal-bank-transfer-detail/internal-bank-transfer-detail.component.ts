import { HttpErrorResponse } from '@angular/common/http';
import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { AccountingAccount } from 'src/app/models/financial/AccountingAccount';
import { InternalBankTransfer, InternalBankTransferDetail, InternalBankTransferFilter } from 'src/app/models/financial/Internal-bank-transfer';
import { Bank } from 'src/app/models/masters/bank';
import { bankAccounts } from 'src/app/models/masters/bankAccounts';
import { Coins } from 'src/app/models/masters/coin';
import { ExchangeRateByCurrency } from 'src/app/models/masters/exchangeRateByCurrency';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { BankAccountsService } from 'src/app/modules/masters/bank-accounts/shared/services/bank-accounts.service';
import { BankService } from 'src/app/modules/masters/bank/shared/services/bank.service';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { AccountingAccountService } from '../../AccountingAccounts/shared/services/accounting-account.service';
import { AccountingPlanBase } from '../../initial-setup/shared/accounting-plan-base.component';
import { InternalBankTransferService } from '../shared/services/internal-bank-transfer.service';

type Distribution = {
  accountId: number
  account: string
  accountCode: string
  auxiliaryId: number
  auxiliary: string
  indAux: boolean
  direction: 'credit' | 'debit'
}

type Distribution2 = {
  description: string
  accountCode?: string
  accountId?: number
  auxiliary?: string
  auxiliaryId?: number
  indAux?: boolean
  debit?: number
  credit?: number
}
@Component({
  selector: 'app-internal-bank-transfer-detail',
  templateUrl: './internal-bank-transfer-detail.component.html',
  styleUrls: ['./internal-bank-transfer-detail.component.scss']
})
export class InternalBankTransferDetailComponent extends AccountingPlanBase implements OnInit {

  transfer = new InternalBankTransfer()

  TranferFilter = new InternalBankTransferFilter();
  record: boolean = false;
  submitted: boolean = false;
  saving: boolean = false;
  bank: Bank[];
  bankAccountListOrigin: bankAccounts[];
  bankAccountListDestination: bankAccounts[];
  currencyList: Coins[];
  bankAccount: bankAccounts[];
  currency: Coins[];
  currencyXcompany: Coins[];
  bankAccountExchangeRateByCurrency: ExchangeRateByCurrency[];
  bankAccountExchangeRate: SelectItem[];
  bankAccountExchangeRateConver: SelectItem[];
  rateTypes: SelectItem<number>[]

  distributions: [Distribution, Distribution] = [null, null]

  distributionsCols: ColumnD<Distribution2>[] = [
    { template: d => d.description, header: 'Descripción' },
    { template: d => d.accountCode ? this.formatCode(d.accountCode) : null, header: 'Cuenta contable' },
    { template: d => 'Transferencia bancaria', header: 'Tipo' },
    { template: d => d.indAux ? d.auxiliary || 'Sin auxiliar' : 'N/A', header: 'Auxiliar' },
    { template: d => this.formatAmount(d.debit || 0), header: 'Débito', textAlign: 'right' },
    { template: d => this.formatAmount(d.credit || 0), header: 'Crédito', textAlign: 'right' },
  ]

  getDistributions = (): InternalBankTransferDetail[] => {
    return this.distributions.map(dist => ({
      ...new InternalBankTransferDetail(),
      bankTransaction: this.transfer.bankTransferId,
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

  getDistTotals() {
    const dists = this.getDistributions2()
    const debit = dists.map(d => d.debit).reduce((a, b) => a + b, 0)
    const credit = dists.map(d => d.credit).reduce((a, b) => a + b, 0)
    const diff = debit - credit
    const format = (number: number) => this.formatAmount(number)
    return {
      debit: format(debit),
      credit: format(credit),
      diff: format(diff),
      color: diff === 0 ? 'green' : 'red',
    }
  }

  getDistributions2() {
    const dists: Distribution2[] = []

    const account = this.bankAccount.find(b => b.bankAccountId == this.transfer.originBankAccountId)

    if (account) {
      const aa = this.accountingAccounts.find(aa => account.accountingAccountId == aa.accountingAccountId)
      dists.push({
        description: aa.accountingAccountName,
        accountId: aa.accountingAccountId,
        accountCode: aa.accountingAccountCode,
        indAux: aa.indPermiteAuxiliar,
        auxiliaryId: account.auxiliaryId,
        auxiliary: account.auxiliary || 'Ninguno',
        credit: this.transfer.amount,
        debit: 0,
      })
    }

    const destAccount = this.bankAccount.find(b => b.bankAccountId == this.transfer.destinationBankAccountId)

    if (destAccount) {
      const aa = this.accountingAccounts.find(aa => destAccount.accountingAccountId == aa.accountingAccountId)
      dists.push({
        description: aa.accountingAccountName,
        accountCode: aa.accountingAccountCode,
        accountId: aa.accountingAccountId,
        indAux: aa.indPermiteAuxiliar,
        auxiliaryId: destAccount.auxiliaryId,
        auxiliary: destAccount.auxiliary || 'Ninguno',
        debit: this.transfer.amount,
        credit: 0,
      })
    }

    const folded: Distribution2[] = []
    dists.forEach(d => {
      const idx = folded.findIndex(f => d.accountCode == f.accountCode)
      if (idx >= 0) {
        folded[idx] = {
          ...folded[idx],
          credit: d.credit + folded[idx].debit
        }
      } else {
        folded.push(d)
      }
    })
    console.log(folded)
    return dists
  }

  cols: ColumnD<Distribution>[] = [
    { template: p => p.account, header: 'Descripción', display: 'table-cell' },
    { template: p => this.formatCode(p.accountCode), header: 'Cuenta contable', display: 'table-cell' },
    { template: p => 'Transacción bancaria', header: 'Tipo', display: 'table-cell' },
    { template: p => p.indAux ? p.auxiliary : 'N/A', header: 'Auxiliar', display: 'table-cell' },
    { template: p => this.getFormatedDistAmount(p, 'debit'), field: 'debit', header: 'Débito', display: 'table-cell', textAlign: 'right' },
    { template: p => this.getFormatedDistAmount(p, 'credit'), field: 'credit', header: 'Crédito', display: 'table-cell', textAlign: 'right' },
  ];
  indCurrency: boolean;
  formatAmount(amount: number) {
    return ((this.currency || [])?.find(c => c.id == this.transfer.originBankAccountCurrencyId)?.symbology || '') + '' + amount.toLocaleString('es-Ve', { minimumFractionDigits: 4 })
  }

  getFormatedDistAmount = (dist: Distribution, direction: 'credit' | 'debit') => this.formatAmount(this.getDistAmount(dist, direction))
  showDialog: boolean;
  idItem: any;
  loading: any;
  requiredd: string;
  maxPostingDate: Date;
  accountingAccounts: AccountingAccount[];
  constructor(
    private actRoute: ActivatedRoute,
    public breadcrumbService: BreadcrumbService,
    private messageService: MessageService,
    public userPermissions: UserPermissions,
    private router: Router,
    private confirmationService: ConfirmationService,
    private loadingService: LoadingService,
    private _internalBankTransferService: InternalBankTransferService,
    private _bankService: BankService,
    private _bankAccountsService: BankAccountsService,
    private _coinsService: CoinsService,
    private accountingAccountService: AccountingAccountService,
    injector: Injector
  ) {
    super(injector)
    this.breadcrumbService.setItems([
      { label: 'FMS' },
      { label: 'Bancos' },
      { label: 'Transferencias bancarias internas', routerLink: ['/financial/banks/bank-transfer-internal'] }
    ])
  }

  loaded = false

  ngOnInit(): void {
    this.loadingService.startLoading();
    this.maxPostingDate = new Date()
    this.accountingAccountService.getAccountingAccountList().subscribe((aa: AccountingAccount[]) => {

      this.accountingAccounts = aa

    })
    this.fetchInitialSetup()
      .then(() => this.fetchData())
      .then(() => this.loaded = true)
      .finally(() => {
        this.loadingService.stopLoading();
      })

  }

  assertPostingDate() {
    if (!this.transfer?.bankPostingDate || !this.transfer?.transactionDate) {
      return
    }
    if (new Date(this.transfer.transactionDate) > new Date(this.transfer.bankPostingDate)) {
      this.transfer.bankPostingDate = null
    }
  }

  async fetchData() {
    try {

      await this.fetchData2()

      this.idItem = this.actRoute.snapshot.params['id'];
      debugger
      if (this.idItem != 0 && this.idItem != undefined) {

        this.getBankAdjustmentDetails();

        if (this.transfer.typeEstatusTransactionId == 2)
          this.saving = true;

        if (this.transfer.typeEstatusTransactionId == 1)
          this.saving = false;

      }
      else {
        this.transfer.active = true;
        this.requiredd = "";

        // this.Total = (this.currency.find(c => c.id == this.transfer.bankAccountCurrencyId)?.symbology || '') + '' + (this.transfer.amount * 2).toLocaleString('es-Ve', { minimumFractionDigits: 4 });
      }
    } catch (err) {
      console.error(err)
    }

    //this.dataLoaded = true
  }

  onChangebankAccount(event, ind) {
    debugger
    const f = this.bankAccount.filter(b => b.bankAccountId == event.value).map(a => a.currencyId)
    this.setAccountInDist(this.bankAccount.find(b => b.bankAccountId == event.value))

    this.currencyList = this.currency;
    //this.LegacyCurrency = this.currency.find(f => f.id == f[0])?.legalCurrency
    if (ind) {
      this.transfer.originBankAccountCurrencyId = this.transfer.originBankAccountId > 0 ? f[0] : this.transfer.originBankAccountCurrencyId;

      this.indCurrency = (this.currencyXcompany.filter(f => f.id == this.transfer.originBankAccountCurrencyId)).length ? true : false
    } else {
      this.transfer.destinationBankAccountCurrencyId = this.transfer.destinationBankAccountId > 0 ? f[0] : this.transfer.destinationBankAccountCurrencyId;

      this.indCurrency = (this.currencyXcompany.filter(f => f.id == this.transfer.destinationBankAccountCurrencyId)).length ? true : false
    }

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
      direction: 'credit',
    }
  }

  onChangeBankDestination(event) {
    debugger
    this.bankAccountListDestination = this.bankAccount.filter(b => b.bankId == event.value)
    //this.bankAccountExchangeRateConver=[];
    // this.currencyList = [];
    //this.transact.bankAccountId = -1
    //this.transact.bankAccountCurrencyId=-1
    this.onChangebankAccount({ value: -1 }, false)
  }

  onChangeBankOrigin(event) {
    debugger
    this.bankAccountListOrigin = this.bankAccount.filter(b => b.bankId == event.value)
    //this.bankAccountExchangeRateConver=[];
    // this.currencyList = [];
    //this.transact.bankAccountId = -1
    //this.transact.bankAccountCurrencyId=-1
    this.onChangebankAccount({ value: -1 }, true)
  }

  validateAccountingAccount(bankAccountId: number, accountingAccountId: number) {
    if (!this.bankAccount?.length) {
      return false
    }
    const bankAccount = this.bankAccount.find(ba => ba.bankAccountId == bankAccountId)
    const accountingAccount = this.accountingAccounts.find(aa => aa.accountingAccountId == accountingAccountId)
    const invalid = accountingAccount?.accountingAccountId == bankAccount?.accountingAccountId
    if (invalid) {
      this.messageService.add({ severity: 'error', summary: 'Cuenta contable duplicada', detail: "La cuenta contable asociada a la cuenta bancaria no puede ser igual a la cuenta de registro." });
    }
    return invalid
  }

  validateAuxiliary(bankAccountId: number, auxiliaryId: number) {
    if (!this.bankAccount?.length) {
      return false
    }
    const bankAccount = this.bankAccount.find(ba => ba.bankAccountId == bankAccountId)
    const invalid = auxiliaryId == bankAccount?.auxiliaryId
    if (invalid) {
      this.messageService.add({ severity: 'error', summary: 'Auxiliar duplicado', detail: "El auxiliar asociado a la cuenta bancaria no puede ser igual al auxiliar seleccionado." });
    }
    return invalid
  }
  setBankAccount(id: any, ind: boolean) {
    const invalidAA = this.transfer.detalle.some(d => this.validateAccountingAccount(+id, d.accountingAccountingId))// this.validateAccountingAccount(+id, this.transfer.deta)
    const invalidBA = this.transfer.detalle.some(d => this.validateAuxiliary(+id, d.auxiliarIdDetail)) // this.validateAuxiliary(+id, this.transfer?.auxiliarId)
    if (invalidAA || invalidBA) {
      if (ind) {
        this.transfer.originBankAccountId = -1
      } else {
        this.transfer.destinationBankAccountCurrencyId = -1
      }
      return
    }
    if (ind) {
      this.transfer.originBankAccountId = +id
    } else {
      this.transfer.destinationBankAccountId = +id
    }

    this.onChangebankAccount({ value: +id }, ind)
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

  getBankAdjustmentDetails() {

    if (this.loading)
      return;
    this.loading = true;
    this.TranferFilter.bankTransferId = this.idItem;
    this._internalBankTransferService.getTransactionsDetail(this.TranferFilter).subscribe((data: InternalBankTransfer) => {
      this.transfer = {
        ...data,
        ...(data?.bankPostingDate ? { bankPostingDate: new Date(data.bankPostingDate) } : {}),
        ...(data?.transactionDate ? { transactionDate: new Date(data.transactionDate) } : {}),
      };
      if ((this.transfer.bankPostingDate as Date)?.getFullYear() === 1900) {
        this.transfer.bankPostingDate = null
      }
      if (data == null) {
        this.messageService.clear();
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar el detalle del ajuste bancario." });
        this.loading = false;
        return;
      }

      this.loading = false;
      // const queryParams: any = {};
      // queryParams.filters = JSON.stringify(this.transfer);

      this.onChangeBankOrigin({ value: this.transfer.originBankId })
      this.onChangeBankDestination({ value: this.transfer.destinationBankId })

      this.setBankAccount(this.transfer.originBankAccountId, true)
      this.setBankAccount(this.transfer.destinationBankAccountId, false)




      // this.onChangeBank({ value: this.transact.bankId })
      // this.onChangebankAccount({ value: this.transact.bankAccountId })
      // this.Total = (this.currencyList.find(c => c.id == this.transact.bankAccountCurrencyId)?.symbology || '') + '' + (this.transact.amount * 2).toLocaleString('es-Ve', { minimumFractionDigits: 4 });

      // this.bankAccountExchangeRate = this.bankAccountExchangeRateByCurrency
      //   .filter(b => b.exchangeTypeId == this.transact.taxeChangeId).map(c => ({
      //     label: c.destinationCurrencySymbol + c.conversionFactor,
      //     value: c.exchangeTypeId
      //   }))

      // this.bankAccountExchangeRateConver = this.bankAccountExchangeRateByCurrency
      //   .filter(b => b.exchangeTypeId == this.transact.converTaxeChangeId).map(c => ({
      //     label: c.destinationCurrencySymbol + c.conversionFactor,
      //     value: c.exchangeTypeId
      //   }))



    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar el detalle del ajuste bancario." });

    });

  }

  fetchData2() {
    return this._bankService.getBanks().toPromise()
      .then((banks) => this.bank = banks.filter(b => b.active && b.accountingAccountId > 0).sort((a, b) => a.name.localeCompare(b.name)))
      .then(() => this._bankAccountsService.getbankAccountsList().toPromise())
      .then((bankAccountss) => this.bankAccount = bankAccountss.sort((a, b) => a.accountNumber.localeCompare(b.accountNumber)))
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

  getDistAmount = (dist: Distribution, direction: 'credit' | 'debit') =>
    (dist.direction != direction ? 0 : this.transfer?.amount)
      ? this.transfer.amount : 0

  back() {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea regresar? perderá los cambios realizados.',
      accept: () => {
        this.saving = true
        this.router.navigate(["/financial/banks/bank-transfer-internal"])
      }
    });
  }

  getTotal = () => this.distributions
    .map(d => [d ? this.getDistAmount(d, 'debit') : 0, d ? this.getDistAmount(d, 'credit') : 0])
    .reduce<[number, number]>(([aa, ab], [ba, bb]) => [aa + ab, ba + bb], [0, 0])


  Cancel() {

    this.confirmationService.confirm({
      message: '¿Está seguro que desea cancelar? luego no se podran editar los datos.',
      accept: () => {

        this._internalBankTransferService.PostTransferDetailCancel(this.transfer, this.idItem).subscribe((data: number) => {
          if (data > 0) {
            this.showDialog = false;
            this.submitted = false;
            this.saving = false;
            this.router.navigate(["/financial/banks/bank-transfer-internal"])
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
    this.record = true;
    this.submitted = true;
    if (
      //this.transfer.bankAdjustmentTypeId >0
      // && this.transfer.transferionDate
      //&& 
      this.transfer.bankPostingDate
      // && this.transfer.bankId >0
      // && this.transfer.bankAccountId >0
      // && this.transfer.bankAccountCurrencyId >0

      && this.transfer.taxeChangeId > 0
      //&& this.transfer.typetaxeChangeId >0

      && this.transfer.reference
      //  && (this.transfer.converTypeTaxeChangeId >0 && !this.indCurrency)
      //  && (this.transfer.converTaxeChangeId >0 && !this.indCurrency)

      && this.transfer.amount > 0


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




      this.confirmationService.confirm({
        message: '¿Está seguro que desea contabilizar? luego no se podran editar los datos.',
        accept: () => {

          // this.send(1)
          const model: InternalBankTransfer = {
            ...this.transfer, detalle: this.getDistributions2().map(dist => ({
              ...new InternalBankTransferDetail(),
              ...dist,
              bankTransaction: this.transfer.bankTransferId,
              accountingAccountingId: dist.accountId,
              auxiliarIdDetail: dist.auxiliaryId,
              codeAccountingAcccount: dist.accountCode,
              typeEntriesId: 1,
              idTypeEstatusTransaction: 1,
              indPermiteAuxiliar: dist.indAux,
              typeEstatusTransactionDetail: '',
            }))
          }

         //  this._internalBankTransferService.postTransfer(this.transfer).subscribe((data) => {
         //    if (data > 0) {
              this._internalBankTransferService.PostTransferDetailToRecord(model, this.idItem).subscribe((data: number) => {
                if (data > 0) {
                  this.showDialog = false;
                  this.submitted = false;
                  this.saving = false;
                  this.router.navigate(["/financial/banks/bank-transfer-internal"])
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
          //   }
          // })
        }
      });
    }

  }

  Revoke() {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea anular el ajuste? Esta acción no es reversible.',
      accept: () => {
        this._internalBankTransferService.PostTransferDetailRevoke(this.transfer, this.idItem).subscribe((data: number) => {
          if (data > 0) {
            this.showDialog = false;
            this.submitted = false;
            this.saving = false;
            this.router.navigate(["/financial/banks/bank-transfer-internal"])
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
    debugger
    this.submitted = true;
    if (
      this.transfer.originBankId > 0
      && this.transfer.originBankAccountId > 0
      && this.transfer.originBankAccountCurrencyId > 0
      && this.transfer.destinationBankId > 0
      && this.transfer.destinationBankAccountId > 0
      && this.transfer.destinationBankAccountCurrencyId > 0
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

      //this.transact.accountingAccount = this.accountCode;
      this._internalBankTransferService.postTransfer({ ...this.transfer, descriptionBankTransfer: this.transfer.descriptionBankTransfer || '' }).subscribe((data) => {
        console.log(data)
        if (data > 0) {
          this.showDialog = false;
          this.submitted = false;
          this.saving = false;
          if (indSave == 0) {
            this.router.navigate(["/financial/banks/bank-transfer-internal"])
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
