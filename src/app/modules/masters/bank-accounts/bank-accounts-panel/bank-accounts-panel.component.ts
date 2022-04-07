import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { AuxiliariesAccountingAccountFilter } from 'src/app/models/financial/AuxiliariesAccountingAccount';
import { Auxiliary } from 'src/app/models/financial/auxiliary';
import { Bank } from 'src/app/models/masters/bank';
import { bankAccounts, bankAccountsFilter } from 'src/app/models/masters/bankAccounts';
import { Coins } from 'src/app/models/masters/coin';
import { ExchangeRateByCurrency } from 'src/app/models/masters/exchangeRateByCurrency';
import { ArticleClassificationService } from 'src/app/modules/financial/article-classification/shared/services/article-classification.service';
import { BankAccountTypeFMS } from 'src/app/modules/hcm/shared/models/masters/bank-account-type';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';

import { BankAccountsService } from '../shared/services/bank-accounts.service';

@Component({
  selector: 'app-bank-accounts-panel',
  templateUrl: './bank-accounts-panel.component.html',
  styleUrls: ['./bank-accounts-panel.component.scss']
})
export class BankAccountsPanelComponent implements OnInit {

  //@ViewChild('name') name: ElementRef;
  @Input("showDialog") showDialog: boolean;
  @Input("_data") _data: bankAccounts = new bankAccounts();
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output() onUpdate = new EventEmitter();
  _validations: Validations = new Validations();
  statuslist: SelectItem[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false }
  ];

  saving: boolean;
  submitted: boolean;
  nomString: boolean;
  viewMode: boolean;

  @Input() bank: Bank[];
  
  @Input() bankAccountType: BankAccountTypeFMS[];
  bankAccountExchangeRateByCurrency: ExchangeRateByCurrency[];

  @Input() currency: Coins[];
  @Input() auxiliary: Auxiliary[];
  loading: boolean;
  //auxiliaries:Auxiliary[];
  filter: AuxiliariesAccountingAccountFilter = new AuxiliariesAccountingAccountFilter();
  idCuentaContable: number;
  auxiliaries: SelectItem[];
  indPermiteAuxiliar: boolean;
  bankAccountsFilter = new bankAccountsFilter();
  bankAccounts: bankAccounts[] = [];
  constructor(public _bankAccountService: BankAccountsService,public _articleClassificationService:ArticleClassificationService, public breadcrumbService: BreadcrumbService, private messageService: MessageService) { }

  ngOnInit(): void {
    //this.onLoadAuxiliariesAssociatedList();
    this.cuentasBancarias()
     this.bank=this.bank?.filter(f=> f.accountingAccountId>0)
     this.currencyOnchange({ value: this._data.currencyId }) 
   if (this._data.bankAccountId>0) {
    this.onChangeBank({ value: this._data.bankId }) 
   }
   
  }

cuentasBancarias(){
 this._bankAccountService
        .getbankAccountsList(this.bankAccountsFilter)
        .toPromise()
        .then((data: bankAccounts[]) => {
   
        this.bankAccounts = data
        
       })
}

   
  onLoadAuxiliariesAssociatedList(_onLoad?: () => void) {
    debugger
   
    this.filter.idCuentaContable = this.idCuentaContable || -1;

    this.filter.active = 1;
debugger
    this._articleClassificationService.getAuxiliariesAssociatedList(this.filter)
      .subscribe((data) => {

        if (this.bankAccounts.length) {
          data=data.filter(a=> a.id != this.bankAccounts?.find(aa=>aa.auxiliaryId==a.id)?.auxiliaryId )
        }
        
        this.auxiliaries = data.sort((a, b) => 0 - (a.id > b.id ? -1 : 1))
        .map((item) => ({
           label: item.auxiliar,
           value: item.id,
        }))
    
        }), (error) => {
        console.log(error);
      };
  }
  
  onChangeBank(event){
    debugger
    this._data.accountingAccount=this.bank.find(f=>f.id==event.value).accountingAccountName
    this.idCuentaContable=this.bank.find(f=>f.id==event.value).accountingAccountId
    this.indPermiteAuxiliar=this.bank.find(f=>f.id==event.value).indPermiteAuxiliar
    this.onLoadAuxiliariesAssociatedList();

  }

  currencyOnchange(event) {
    if (this.loading)
      return;
    debugger
    this.loading = true;
    this._bankAccountService.GetBankAccountExchangeRateByCurrency(event.value).subscribe((data) => {
      this.bankAccountExchangeRateByCurrency = data.filter((value, index) => data.findIndex(t => t.exchangeTypeId == value.exchangeTypeId) == index)

      this.loading = false;

    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar las cuentas contables." });

    });

  }



  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    this.submitted = false;
    this.nomString = false;
    this.ClearData();
    this.viewMode = false
  }


  ClearData() {
    this._data.bankAccountId = -1
    this._data.businessId = -1
    this._data.business = ""
    this._data.descripcionBankAccount = ""
    this._data.accountNumber = ""
    this._data.bank = ""
    this._data.bankId = -1

    this._data.accountingAccount = ""
    this._data.accountingAccountId = -1
    this._data.currencyId = -1
    this._data.currency = ""
    this._data.abbreviation = ""
    this._data.symbol = ""
    this._data.exchangeRatePaymentId = -1
    this._data.exchangePaymentType = ""
    this._data.paymentCurrency = ""
    this._data.destinationPaymentCurrency = ""
    this._data.abbreviationPaymentCurrency = ""
    this._data.symbolPaymentCurrency = ""
    this._data.paymentConversionFactor = -1
    this._data.depositExchangeRateId = -1
    this._data.depositExchangeType = ""
    this._data.destinationPaymentCurrencyId = -1
    this._data.destinationDepositCurrency = ""
    this._data.abbreviationDepositCurrency = ""
    this._data.symbolDepositCurrency = ""
    this._data.depositConversionFactor = -1
    this._data.minimumPayment = 0
    this._data.auxiliaryId = -1
    this._data.auxiliary = ""
    this._data.bankAccountType = ""
    this._data.bankAccountTypeId = -1
    this._data.active = true;

  }

  save() {
    debugger

    //   if (this.idnoActivo== this._data.accountingAccountCategoryId) {
    //     this.messageService.add({ severity: 'error', summary: 'Error', detail: "La categoría se encuentra inactiva,para poder guardar cambios debe seleccionar una categoria activa" });
    //     return;
    //   }

    this.submitted = true;
debugger
    if (this._data.accountNumber != ""
      && this._data.accountNumber.trim()
      && this._data.bankId > -1
      && this._data.auxiliaryId > -1
      && this._data.currencyId > -1
      && this._data.bankAccountTypeId > -1
      // && this._data.exchangeRatePaymentId>-1
      // && this._data.depositExchangeRateId>-1
     // && this._data.minimumPayment > 0
      // && this._data.accountingAccount!= "" 
    ) {

     this._data.minimumPayment=this._data.minimumPayment||0

      this.messageService.clear();
      this.saving = true
      this._bankAccountService.postBankAccount(this._data).subscribe((data) => {
        if (data > 0) {
          this.showDialog = false;
          this.showDialogChange.emit(this.showDialog);
          this.submitted = false;
          this.saving = false;
          this.onUpdate.emit();
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
        } else if (data == -1) {

          this.messageService.add({ severity: 'error', summary: 'Error', detail: "El número ya se encuentra registrado." });
          this.saving = false;
        }
        else if (data == -3) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Este registro no existe" });
        }
        else {
          this.saving = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
        }

      }, () => {
        this.saving = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
      });
    }

  }

}


