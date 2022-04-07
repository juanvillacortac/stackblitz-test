import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Bank } from 'src/app/models/masters/bank';
import { bankAccountsFilter } from 'src/app/models/masters/bankAccounts';
import { Coins } from 'src/app/models/masters/coin';
import { BankAccountType, BankAccountTypeFMS } from 'src/app/modules/hcm/shared/models/masters/bank-account-type';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';

@Component({
  selector: 'app-bank-accounts-filters',
  templateUrl: './bank-accounts-filters.component.html',
  styleUrls: ['./bank-accounts-filters.component.scss']
})
export class BankAccountsFiltersComponent implements OnInit {


  @Input() expanded = false;
  @Input() loading = false;
  @Input() filters: bankAccountsFilter;
  @Output() onSearch = new EventEmitter<bankAccountsFilter>();
  _validations: Validations = new Validations();
  status: SelectItem[] = [
    { label: 'Todos', value: 0 },
    { label: 'Activo', value: 1 },
    { label: 'Inactivo', value: 2 }
  ];

  accountNumber: string;
  bankAccountId: number;
  bankId: number;
  bankAccountTypeId:number;
  currencyId:number;
  active:number;
  @Input() bank: Bank[];
  @Input() bankAccountType: BankAccountTypeFMS[];
  @Input() currency: Coins[];

  constructor() { }

  ngOnInit(): void {
    this.clearFilters()
  }

  search() {
 
    this.filters.accountNumber = this.accountNumber ? this.accountNumber.trim() : ''
    this.filters.bankAccountId = this.bankAccountId ? this.bankAccountId : -1
    this.filters.bankAccountTypeId = this.bankAccountTypeId ? this.bankAccountTypeId : -1
    this.filters.currencyId = this.currencyId ? this.currencyId : -1
    this.filters.bankId = this.bankId ? this.bankId : -1
    this.filters.active = this.active ? this.active === 2 ? 0 : 1 : -1;
    this.onSearch.emit(this.filters);

  }

  clearFilters() {
debugger
    this.accountNumber = null;
    this.bankAccountId = null;
    this.bankAccountTypeId = null;
    this.currencyId = null;
    this.bankId = null;
    this.active = null;

  }

}
