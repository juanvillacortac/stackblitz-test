import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Bank } from 'src/app/models/masters/bank';
import { Coins } from 'src/app/models/masters/coin';
import { SupplierBankAccount } from 'src/app/models/masters/supplier-extend';
import { BankAccountTypeFMS } from 'src/app/modules/hcm/shared/models/masters/bank-account-type';
import { BankAccountTypeService } from 'src/app/modules/hcm/shared/services/bank-account-type.service';
import { BankService } from 'src/app/modules/masters/bank/shared/services/bank.service';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';

@Component({
  selector: 'app-bank-account-suppliers-modal',
  templateUrl: './bank-account-suppliers-modal.component.html',
  styleUrls: ['./bank-account-suppliers-modal.component.scss']
})
export class BankAccountSuppliersModalComponent implements OnInit {

  @Input("viewMode") viewMode: boolean;
  @Input("showDialog") showDialog: boolean;
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output() onCreate = new EventEmitter<SupplierBankAccount>();
  @Output() onUpdate = new EventEmitter<SupplierBankAccount>();
  @Input("_data") _data: SupplierBankAccount = new SupplierBankAccount();
  //@Output("onSubmit") onSubmit = new EventEmitter<{address: Address, identifier: number}>();
  @Output("onToggle") onToggle = new EventEmitter<boolean>();
  @Input() currencies: SelectItem<number>[] = []
  submitted: boolean;
  saving: boolean;

  coins: Coins[]
  bank: Bank[];
  coinsOptions: SelectItem<number>[]
  types: BankAccountTypeFMS[];
  typesList: SelectItem<number>[];
  constructor(public _bankAccountTypeService: BankAccountTypeService, private messageService: MessageService, private coinService: CoinsService, private _bankService: BankService) { }

  ngOnInit(): void {
    this.fetchData()

    // if (this._data.accountingAccount!="") {
    //   this.NombreCuenta=this._data.accountNumber;
    // }
    // if (this._data.bankId>0) {
    //   this.AuxiliarID = this._data.bankId;

    //  }

    //  if (this._data.currencyId>0) {
    //   this.AuxiliarID = this._data.currencyId;

    //  }
  }

  ClearData() {
    this._data = new SupplierBankAccount()
  }

  async fetchData() {
    const coins = await this.coinService.getCoinsList({
      id: -1,
      name: "",
      idtype: -1,
      abbreviation: "",
      active: 1,
    }).toPromise()

    this.coins = coins.sort((a, b) => a.name.localeCompare(b.name))
    this.coinsOptions = this.coins.map(coin => ({
      label: coin.name,
      value: coin.id,
    }))

    this.types = (await this._bankAccountTypeService.GetBankAccountTypeFMS().toPromise())
    this.typesList = this.types.filter(type => type.active || type.id == this._data.accountTypeId).map(type => ({
      label: type.name,
      value: type.id,
    })).sort((a, b) => a.label.localeCompare(b.label))

    const banks = await this._bankService.getBanks().toPromise()
    this.bank = banks.sort((a, b) => a.name.localeCompare(b.name))
  }

  onShow() {
    this.submitted = false;
    this.emitVisible();
    this.ngOnInit();
  }

  onHide() {
    this.submitted = false;
    this.emitVisible();
    this.bank = null;
    this.coinsOptions = null;
    // this.address = new Address(); 
    // this.identifierToEdit = -1;
  }

  emitVisible() {
    this.onToggle.emit(this.showDialog);
  }

  submit() {
    this.submitted = true;
    if (
      this._data.bankId > -1
      && this._data.accountNumber != ""
      && this._data.currencyId > -1
      && this._data.accountTypeId > -1
    ) {
      const type = this.types.find(type => this._data.accountTypeId == type.id)
      if (!type.active) {
        this.messageService.clear()
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El tipo de cuenta seleccionado se encuentra inactivo" });
        return
      }
      const bank = this.bank.find(b => this._data.bankId == b.id)
      if (!bank.active) {
        this.messageService.clear()
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El banco seleccionado se encuentra inactivo" });
        return
      }

      this.submitted = false;
      this.saving = false;
      this.messageService.clear();

      debugger
      if (this.viewMode) {
        this.onUpdate.emit(this._data);
      } else {
        this.onCreate.emit(this._data);
      }
      this.showDialog = false;
      this.showDialogChange.emit(this.showDialog);
    }
  }
}
