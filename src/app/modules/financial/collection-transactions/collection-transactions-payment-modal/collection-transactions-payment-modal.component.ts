import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { AccountingAccount } from 'src/app/models/financial/AccountingAccount';
import { PaymentMethodByCurrency } from 'src/app/models/financial/paymentMethodByCurrency';
import { CollectionTransactionCharges } from 'src/app/models/financial/collectiontransactions';

import { Bank } from 'src/app/models/masters/bank';
import { bankAccounts } from 'src/app/models/masters/bankAccounts';
import { Coins } from 'src/app/models/masters/coin';
import { ExchangeRateByCurrency } from 'src/app/models/masters/exchangeRateByCurrency';
import { BankAccountsService } from 'src/app/modules/masters/bank-accounts/shared/services/bank-accounts.service';
import { BankService } from 'src/app/modules/masters/bank/shared/services/bank.service';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { SaleTransactionService } from '../../sale-transactions/shared/sale-transaction.service';
import { StringDecoder } from 'string_decoder';

@Component({
  selector: 'app-collection-transactions-payment-modal',
  templateUrl: './collection-transactions-payment-modal.component.html',
  styleUrls: ['./collection-transactions-payment-modal.component.scss']
})
export class CollectionTransactionsPaymentModalComponent implements OnInit {

  // tslint:disable-next-line: no-input-rename
  @Input('displayModal') displayModal: boolean;
  @Input() isUpdating :boolean= false; 
  @Input() _payment =  new CollectionTransactionCharges();

  @Input()
  set payment(p: CollectionTransactionCharges) {
    this._payment = p
    this.fetchData().then(() => {
    this.onChangeBankBox({ value: p.bankId })    
    this.onChangebankAccount({ value: p.bankAccountId })
    this.onChangeExchangeRateByCurrency({ value: p.exchangeRateId })
    this.onChangeExchangeRateByCurrencyConver({ value: p.exchangeRateConvertionId })
      })
    
  }
  @Output() displayModalChange = new EventEmitter<boolean>();
  @Output() onCreate = new EventEmitter<CollectionTransactionCharges>();
  @Output() onUpdate = new EventEmitter<CollectionTransactionCharges>();
  requiredd = '*';

  get amount():String{
    return "Bs " + String(this.payment.amount);
  }
  set amount(val) {
    this.payment.amount = +val;
  }

  constructor(
    private messageService: MessageService,
    private _bankAccountsService: BankAccountsService,
    private _bankService: BankService,
    private _coinsService: CoinsService,
    private _paymentMethodService: SaleTransactionService
  ) { }

  details: any = {} ; 
  banksBoxes: SelectItem[];
  typeExchangeRate: SelectItem[];
  bankAccountExchangeRate: SelectItem[];
  bankAccountExchangeRateConver: SelectItem[];
  bankAccountList: SelectItem[];
  paymentMethods: SelectItem[];

  banks: Bank[];
  bankAccount: bankAccounts[];
  bankAccountExchangeRateByCurrency: ExchangeRateByCurrency[];
  paymentMethodList: PaymentMethodByCurrency[];
  currencyList: Coins[];
  currency: Coins[];
  currencyXcompany: Coins[];

  submitted = false;
  LegacyCurrency: boolean;
  indCurrency: boolean;
  accountingAccounts: AccountingAccount[];


  ngOnInit(): void {
    this.fetchData();
  }


  async fetchData() {
    return this._bankService.getBanks().toPromise()
      .then((banks) =>{
        this.banks = banks.filter(b => b.active && b.accountingAccountId > 0).sort((a, b) => a.name.localeCompare(b.name));
        this.banksBoxes = this.banks.map(b => ({
          label: b.name,
          value: b.id
        }));
      })
      .then(() => this._bankAccountsService.getbankAccountsList().toPromise())
      .then((bankAccountss) => this.bankAccount = bankAccountss.filter(p=> p.active).sort((a, b) => a.accountNumber.localeCompare(b.accountNumber)))
      .then(() => this._coinsService.getCoinxCompanyList({ idCompany: 1 }).toPromise())
      .then(coins => {
        this.currencyXcompany = coins.filter(c => c.active).sort((a, b) => a.name.localeCompare(b.name));
      })
      .then(() => this._coinsService.getCoinsList().toPromise())
      .then(coins => {
        this.currency = coins.filter(c => c.active).sort((a, b) => a.name.localeCompare(b.name));
      })
      .then(() => this._bankAccountsService.GetBankAccountExchangeRateByCurrency(-1).toPromise())
      .then((bankAccountExchangeRateByCurrencys) => {
        this.bankAccountExchangeRateByCurrency = bankAccountExchangeRateByCurrencys.sort((a, b) => a.exchangeType.localeCompare(b.exchangeType));
        this.typeExchangeRate = this.bankAccountExchangeRateByCurrency
          .filter((value, index) => this.bankAccountExchangeRateByCurrency.findIndex(t => t.exchangeTypeId === value.exchangeTypeId) === index)
          .map(t => ({
            label: t.exchangeType,
            value: t.exchangeTypeId,
          }));
      })
      .then(() => this._paymentMethodService.getPaymentMethodByCurrency().toPromise()).
      then((paymentMethod) => {
        this.paymentMethodList = paymentMethod.sort((a,b) => a.paymentMethod.localeCompare(b.paymentMethod));
      });
  }

  hideDialog() {
    this.displayModal = false;
    this.isUpdating = false
    this.submitted = false;
    this.payment = new CollectionTransactionCharges();
    this.displayModalChange.emit(this.displayModal);
  }

  onChangeBankBox(event) {
    this.bankAccountList = this.bankAccount
      .filter(b => b.bankId === event.value ).map(b => ({
        label: b.accountNumber,
        value: b.bankAccountId
      }));
    this.currencyList = [];
    this.onChangebankAccount({ value: -1 });
  }

  onChangebankAccount(event) {
    console.log(event);
    const f = this.bankAccount.filter(b => b.bankAccountId === event.value).map(a => a.currencyId);
    this.currencyList = this.currency;
    console.log(f);
    this.LegacyCurrency = this.currency.find(f => f.id === f[0])?.legalCurrency;
    this.paymentMethods = this.paymentMethodList.filter(p => p.idCurrency === f[0]).map(p => ({
      label: p.paymentMethod,
      value: p.idPaymentMethodByCurrency
    }));
  }

  onChangeExchangeRateByCurrency(event) {
    this.bankAccountExchangeRate = this.bankAccountExchangeRateByCurrency
      .filter(b => b.exchangeTypeId === event.value).map(c => ({
        label: c.destinationCurrencySymbol + c.conversionFactor,
        value: c.exchangeTypeId
      }));
  }

  onChangeExchangeRateByCurrencyConver(event) {
    this.bankAccountExchangeRateConver = this.bankAccountExchangeRateByCurrency
      .filter(b => b.exchangeTypeId === event.value).map(c => ({
        label: c.destinationCurrencySymbol + c.conversionFactor,
        value: c.exchangeTypeId
      }));
  }

  currencyOnchange(event) {
    this._bankAccountsService.GetBankAccountExchangeRateByCurrency(event.value).subscribe((data) => {
      this.bankAccountExchangeRateByCurrency = data;
      this.typeExchangeRate = data
        .filter((value, index) => data.findIndex(t => t.exchangeTypeId === value.exchangeTypeId) === index)
        .map(t => ({
          label: t.exchangeType,
          value: t.exchangeTypeId,
        }));
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los tipos tasa de cambio." });
    });
  }

  AddSaleTransactionPayment() { 
    this.submitted = true;
    console.log(this._payment)
    if(
      this._payment.reference.trim() === '' ||
      this._payment.bankId === -1 ||
      this._payment.bankAccountId === -1 ||
      this._payment.exchangeRateConvertionId === -1 ||
      this._payment.paymentMethodByCurrency === -1  ||
      this._payment.amount === undefined ||
      this._payment.exchangeRateId === -1){
      console.log("no paso")
      return;
      

    }
    this._payment.bank = this.banksBoxes.filter( p => p.value == this._payment.bankId)[0].label;
    let bankAuxiliar = this.bankAccount.filter( p => p.bankAccountId == this._payment.bankAccountId)[0];
    this._payment.bankAccount  = bankAuxiliar.accountNumber
    this._payment.bankAccountId  = bankAuxiliar.bankAccountId
    this._payment.currencyId = bankAuxiliar.currencyId;
    this._payment.currency = bankAuxiliar.currency
    this._payment.paymentMethod = this.paymentMethods.filter( p => this._payment.paymentMethodByCurrency )[0].label;
    
    console.log(this.isUpdating);
    if ( this.isUpdating  == false){
      this.onCreate.emit(this._payment);
    }
    else{
      this.onUpdate.emit(this._payment);
    }
    
    this._payment = new CollectionTransactionCharges();
    this.hideDialog();
  
  }

}
