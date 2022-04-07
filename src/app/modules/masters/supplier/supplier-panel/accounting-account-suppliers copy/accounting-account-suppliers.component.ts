import { Component, EventEmitter, Input, OnInit, Output, Injector } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { AssociatedAccounts } from 'src/app/models/financial/AssociatedAccounts';
import { SupplierAccountingAccount } from 'src/app/models/masters/supplier-extend';
import { AccountingPlanBase } from 'src/app/modules/financial/initial-setup/shared/accounting-plan-base.component';

@Component({
  selector: 'app-accounting-account-suppliers',
  templateUrl: './accounting-account-suppliers.component.html',
  styleUrls: ['./accounting-account-suppliers.component.scss']
})
export class AccountingAccountSuppliersComponent extends AccountingPlanBase implements OnInit {

  @Input() companies: any[]
  data = new AssociatedAccounts();
  @Input() currencies: SelectItem<number>[]
  @Input() banks: SelectItem<number>[]
  @Input() accounts: { [key: number]: SupplierAccountingAccount[] } = {};
  @Output() accountsChange = new EventEmitter<{ [key: number]: SupplierAccountingAccount[] }>();
  displayedColumns: ColumnD<SupplierAccountingAccount>[] =
    [
      { template: (data) => data?.use, field: 'tipoUsoCuenta', header: 'Uso', display: 'table-cell' },
      { template: (data) => data?.accountingAccountCode ? this.formatCode(data.accountingAccountCode) : null, field: 'accountingAccountCode', header: 'Número de cuenta', display: 'table-cell' },
      { template: (data) => data?.accountingAccount, field: 'accountingAccount', header: 'Nombre de la cuenta', display: 'table-cell' },
      { template: (data) => data?.indAuxiliar ? data?.auxiliar : 'N/A', field: 'auxiliar', header: 'Auxiliar', display: 'table-cell' },
    ];
  showDialog: boolean = false;
  indChange: boolean;
  accountNumber: string = "";
  viewMode: boolean;

  accountIdx = -1
  idCompany = -1

  constructor(private confirmationService: ConfirmationService, injector: Injector, private messageService: MessageService) {
    super(injector)
  }

  ngOnInit(): void {
    this.fetchInitialSetup()
  }

  edit(idCompany: number, idx: number): void {
    this.idCompany = idCompany
    this.accountIdx = idx
    this.data = { ...new AssociatedAccounts(), ...this.accounts[this.idCompany][this.accountIdx] }
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
        this.accounts[this.idCompany][this.accountIdx].active = false
        this.indChange = true
        this.accountIdx = -1
      },
    })
  }

  onUpdate(data: AssociatedAccounts) {
    const account: SupplierAccountingAccount = {
      ...new SupplierAccountingAccount(),
      ...this.accounts[this.idCompany][this.accountIdx],
      ...data,
      indAuxiliar: data.indPermiteAuxiliar,
      accountingAccountId: data.idAssociate,
      useId: data.tipoUsoCuentaId,
      use: data.tipoUsoCuenta,
    }
    this.accounts[this.idCompany][this.accountIdx] = account

    this.accounts[this.idCompany] = [...this.accounts[this.idCompany]];
    this.indChange = true
    this.accountIdx = -1
    this.accountsChange.emit(this.accounts)
  }

  getList(idBusiness: number) {
    return this.accounts[idBusiness]?.filter(aa => aa.active)
  }

  onCreate(data: AssociatedAccounts) {
    const account: SupplierAccountingAccount = {
      ...new SupplierAccountingAccount(),
      ...data,
      indAuxiliar: data.indPermiteAuxiliar,
      accountingAccountId: data.idAssociate,
      useId: data.tipoUsoCuentaId,
      use: data.tipoUsoCuenta,
    }
    if (this.accounts[this.idCompany]?.find(aa => aa.useId == account.useId)) {
      this.messageService.clear()
      this.messageService.add({ severity: 'error', summary: 'Uso duplicado', detail: "Ya existe una cuenta contable con el mismo uso" });
      return
    }
    this.accounts[this.idCompany] = [
      ...this.accounts[this.idCompany] || [],
      account,
    ]
    this.indChange = true
    this.accountIdx = -1
    this.accountsChange.emit(this.accounts)
  }

  new(idCompany: number) {
    this.data = new AssociatedAccounts()
    this.accountIdx = -1
    this.idCompany = idCompany
    this.viewMode = false;
    this.showDialog = true;
  }

  onToggle(visible: boolean) {
    this.showDialog = visible;
  }
}
