import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { SupplierBankAccount } from 'src/app/models/masters/supplier-extend';

@Component({
  selector: 'app-bank-account-suppliers',
  templateUrl: './bank-account-suppliers.component.html',
  styleUrls: ['./bank-account-suppliers.component.scss']
})
export class BankAccountSuppliersComponent implements OnInit {

  @Input() companies: any[]
  bankAccount = new SupplierBankAccount();
  @Input() currencies: SelectItem<number>[]
  @Input() banks: SelectItem<number>[]
  @Input() bankAccounts: { [key: number]: SupplierBankAccount[] } = {};
  @Output() bankAccountsChange = new EventEmitter<{ [key: number]: SupplierBankAccount[] }>();
  displayedColumns: ColumnD<SupplierBankAccount>[] =
    [

      { template: (data) => this.banks.find(c => c.value == data.bankId)?.label, field: 'bank', header: 'Banco', display: 'table-cell' },
      { template: (data) => data.accountNumber, field: 'accountNumber', header: 'Número de cuenta', display: 'table-cell' },
      { template: (data) => this.currencies.find(c => c.value == data.currencyId).label, field: 'currency', header: 'Moneda', display: 'table-cell' },
    ];
  showDialog: boolean = false;
  indChange: boolean;
  accountNumber: string = "";
  viewMode: boolean;

  accountIdx = -1
  idCompany = -1

  constructor(private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
  }

  edit(idCompany: number, idx: number): void {
    this.idCompany = idCompany
    this.accountIdx = idx
    this.bankAccount = { ...new SupplierBankAccount(), ...this.bankAccounts[this.idCompany][this.accountIdx] }
    this.viewMode = true;
    this.showDialog = true;
  }

  delete(idCompany: number, idx: number) {
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que eliminar el registro?',
      accept: () => {
        this.idCompany = idCompany
        this.accountIdx = idx
        this.bankAccounts[this.idCompany]?.splice(this.accountIdx, 1)
        this.bankAccounts[this.idCompany] = [...(this.bankAccounts[this.idCompany] || [])];
        this.indChange = true
        this.accountIdx = -1
      },
    })
  }

  onUpdate(data: SupplierBankAccount) {
    this.bankAccounts[this.idCompany][this.accountIdx] = data
    this.bankAccounts[this.idCompany] = [...this.bankAccounts[this.idCompany]];
    this.indChange = true
    this.accountIdx = -1
    this.bankAccountsChange.emit(this.bankAccounts)
  }

  onCreate(data: SupplierBankAccount) {
    this.bankAccounts[this.idCompany] = [...(this.bankAccounts[this.idCompany] || []), data]
    this.indChange = true
    this.accountIdx = -1
    this.bankAccountsChange.emit(this.bankAccounts)
  }

  new(idCompany: number) {
    this.bankAccount = new SupplierBankAccount()
    this.accountIdx = -1
    this.idCompany = idCompany
    this.viewMode = false;
    this.showDialog = true;
  }

  onToggle(visible: boolean) {
    this.showDialog = visible;
  }
}
