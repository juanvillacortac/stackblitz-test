import { HttpErrorResponse } from '@angular/common/http';
import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Auxiliary } from 'src/app/models/financial/auxiliary';
import { AUXILIAR_ALL_ACTIVES_FILTER } from 'src/app/models/financial/AuxiliaryFilter';
import { Bank } from 'src/app/models/masters/bank';
import { BankFilters } from 'src/app/models/masters/bank-filters';
import { bankAccounts, bankAccountsFilter } from 'src/app/models/masters/bankAccounts';
import { Coins } from 'src/app/models/masters/coin';
import { ExchangeRateByCurrency } from 'src/app/models/masters/exchangeRateByCurrency';
import { AuxiliaryService } from 'src/app/modules/financial/auxiliaries/shared/services/auxiliary.service';
import { BankAccountType, BankAccountTypeFMS, BankAccountTypeFMSFilter } from 'src/app/modules/hcm/shared/models/masters/bank-account-type';
import { BankAccountTypeService } from 'src/app/modules/hcm/shared/services/bank-account-type.service';

import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { BankService } from '../../bank/shared/services/bank.service';
import { CoinsService } from '../../coin/shared/service/coins.service';
import { BankAccountsService } from '../shared/services/bank-accounts.service';

@Component({
  selector: 'app-bank-accounts-list',
  templateUrl: './bank-accounts-list.component.html',
  styleUrls: ['./bank-accounts-list.component.scss']
})
export class BankAccountsListComponent implements OnInit {


  showDialog = false;
  showFilters: boolean = false;
  loading: boolean = false;
  bankAccount = new bankAccounts();
  bankAccounts: bankAccounts[] = [];
  bankAccountsFilter = new bankAccountsFilter();

  bank: Bank[];
  auxiliary:Auxiliary[];
  bankAccountType: BankAccountTypeFMS[];
  bankAccountExchangeRateByCurrency:ExchangeRateByCurrency[];
  currency: Coins[];

  displayedColumns: ColumnD<bankAccounts>[] =
    [

      { template: (data) => { return data.bank; }, field: 'bank', header: 'Banco', display: 'table-cell' },
      { template: (data) => { return data.accountNumber; }, field: 'accountNumber', header: 'Número de cuenta', display: 'table-cell' },
      { template: (data) => { return data.bankAccountType; }, field: 'bankAccountType', header: 'Tipo de cuenta', display: 'table-cell' },
      { template: (data) => { return data.currency; }, field: 'currency', header: 'Moneda', display: 'table-cell' },
     // { template: (data) => { return data.symbol+''+ data.minimumPayment; }, field: 'minimumPayment', header: 'Pago mínimo', display: 'table-cell' },
      { template: (data) => { return data.symbol+''+ data.minimumPayment; }, field: 'minimumPaymentSTR', header: 'Pago mínimo', display: 'table-cell' },
      { template: (data) => { return null; }, field: 'active', header: 'Estatus', display: 'table-cell' },
      { template: (data) => { return data.createdByUser; }, field: 'createdByUser', header: 'Creado por', display: 'table-cell' },
      { template: (data) => { return data.updatedByUser; }, field: 'updateByUser', header: 'Actualizado por', display: 'table-cell' },

    ];

  constructor( public _bankAccountTypeService: BankAccountTypeService,  public _coinsService: CoinsService,public _auxiliaryService: AuxiliaryService,public _bankService: BankService, public _bankAccountService: BankAccountsService, public breadcrumbService: BreadcrumbService, private messageService: MessageService, public userPermissions: UserPermissions, private router: Router, injector: Injector) {
    this.breadcrumbService.setItems([
      { label: 'Configuración' },
      { label: 'Maestros generales' },
      { label: 'Cuentas bancarias', routerLink: ['/masters/bank-accounts-list'] }
    ]);
   }

  ngOnInit(): void {
    this.fetchData();
  }

  edit(_bankAccount: bankAccounts): void {
    debugger
    this.bankAccount.bankAccountId = _bankAccount.bankAccountId;
    this.bankAccount.accountNumber = _bankAccount.accountNumber;
    this.bankAccount.bankId = _bankAccount.bankId;
    this.bankAccount.accountingAccount = _bankAccount.accountingAccount;
    this.bankAccount.auxiliaryId = _bankAccount.auxiliaryId;
    this.bankAccount.currencyId = _bankAccount.currencyId;
    this.bankAccount.bankAccountTypeId = _bankAccount.bankAccountTypeId;
    this.bankAccount.exchangeRatePaymentId = _bankAccount.exchangeRatePaymentId;
    this.bankAccount.depositExchangeRateId = _bankAccount.depositExchangeRateId;
    this.bankAccount.descripcionBankAccount = _bankAccount.descripcionBankAccount;
    this.bankAccount.minimumPayment = _bankAccount.minimumPayment;
    this.bankAccount.active = _bankAccount.active;
    this.showDialog = true;
  
  }

  fetchData() {
    return this.search()
      .then(() => this._bankService.getBanks({...new BankFilters(), active:1}).toPromise())
      .then((banks) => this.bank = banks.sort((a, b) => a.name.localeCompare(b.name)))
      .then(() => this._auxiliaryService.getAuxiliariesList(AUXILIAR_ALL_ACTIVES_FILTER).toPromise())
      .then((auxi)=> this.auxiliary=auxi.sort((a, b) => a.auxilliaryName.localeCompare(b.auxilliaryName)))
      .then(() => this._coinsService.getCoinsList().toPromise())
      .then(coins => {
    debugger
        this.currency = coins.filter(c => c.active).sort((a, b) => a.name.localeCompare(b.name))
        // this.coinsOptions = this.coins.map(c => ({
        //   label: `${c.name} - ${c.legalCurrency ? 'Moneda base' : 'Moneda conversión'}`,
        //   value: c.id,
        // }))
      })
      .then(() => this._bankAccountTypeService.GetBankAccountTypeFMS({...new BankAccountTypeFMSFilter(), active:1}).toPromise())
      .then((bankAccountTypes) => this.bankAccountType = bankAccountTypes.sort((a, b) => a.name.localeCompare(b.name)))
      
      .finally(() => {
        this.loading = false
      })
  }

  search() {
    if (this.loading)
      return;
    this.loading = true;
    return this._bankAccountService
      .getbankAccountsList(this.bankAccountsFilter)
      .toPromise()
      .then((data: bankAccounts[]) => {
        debugger
        this.bankAccounts = data.sort((a, b) => 0 - (a.bankAccountId < b.bankAccountId ? -1 : 1)).map(aa => ({
          ...aa,       
          minimumPaymentSTR: aa.symbol+''+ aa.minimumPayment || '',
        }));
        this.loading = false;
      },(error: HttpErrorResponse) => {
          this.loading = false;
          this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar las cuentas bancarias." });
      });


  }


}
