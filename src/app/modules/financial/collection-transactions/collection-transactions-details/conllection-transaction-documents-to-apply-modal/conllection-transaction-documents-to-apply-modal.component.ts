import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { CollectionTransactionCharges, CollectionTransactionDocument, CollectionTransactionDocumentFilter, CollectionTransactionDocumentModal } from 'src/app/models/financial/collectiontransactions';
import { PaymentMethodByCurrency } from 'src/app/models/financial/paymentMethodByCurrency';
import { Bank } from 'src/app/models/masters/bank';
import { bankAccounts } from 'src/app/models/masters/bankAccounts';
import { Coins } from 'src/app/models/masters/coin';
import { ExchangeRateByCurrency } from 'src/app/models/masters/exchangeRateByCurrency';
import { SupplierExtend } from 'src/app/models/masters/supplier-extend';
import { BankAccountsService } from 'src/app/modules/masters/bank-accounts/shared/services/bank-accounts.service';
import { BankService } from 'src/app/modules/masters/bank/shared/services/bank.service';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';

import { SaleTransactionService } from '../../../sale-transactions/shared/sale-transaction.service';

@Component({
  selector: 'app-conllection-transaction-documents-to-apply-modal',
  templateUrl: './conllection-transaction-documents-to-apply-modal.component.html',
  styleUrls: ['./conllection-transaction-documents-to-apply-modal.component.scss']
})
export class ConllectionTransactionDocumentsToApplyModalComponent implements OnInit {

  // tslint:disable-next-line: no-input-rename
  @Input('displayModal') displayModal: boolean;
  @Input() isUpdating :boolean= false;
  @Input() payment =  new CollectionTransactionCharges();
  @Input() client: SupplierExtend;
  @Output() displayModalChange = new EventEmitter<boolean>();
  @Output() onSelect = new EventEmitter<CollectionTransactionDocument>();
  requiredd = '*';
  banks: Bank[];
  banksBoxes: SelectItem[];
  bankAccount : bankAccounts[];
  currencyXcompany: Coins[];
  currency: Coins[];
  bankAccountExchangeRateByCurrency: ExchangeRateByCurrency[];
  typeExchangeRate:  SelectItem[];
  paymentMethodList :PaymentMethodByCurrency[];
  submitted : boolean; 
  accountingDate: string | Date = "";
  documentTypes: SelectItem[];
  filters: CollectionTransactionDocumentFilter = new CollectionTransactionDocumentFilter();
  dateRange: Date[]
  documents : CollectionTransactionDocumentModal[]  = [];


  columns = [
    { template: p => p.socialReason, field: 'proveedor', header: 'Proveedor', display: 'table-cell' },
    { template: p => p.clientSupplierDocumentNumber, field: 'N° de Identificacion', header: 'N° de Identificacion', display: 'table-cell' },
    { template: p => p.documentNumber, field: 'N° de Documento', header: 'N° de Documento', display: 'table-cell' },
    { template: p => this.formatCurrenciesAmount(p.amount), field: 'Monto total', header: 'Monto Total', display: 'table-cell' },
    { template: p => this.formatCurrenciesAmount(p.appliedAmount), field: 'Monto Aplicado', header: 'Monto Aplicado', display: 'table-cell' },
    { template: p => this.formatCurrenciesAmount(p.remainingAmount), field: 'Monto Por Aplicar', header: 'Monto Por Aplicar', display: 'table-cell' },
    
  ];


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
    private _paymentMethodService: SaleTransactionService,
    private salesService: SaleTransactionService,
  ) { }

  details: any = {} ;

  ngOnInit(): void {
    console.log(this.client);
    this.fetchData();
    this.filters.clientSupplierId = this.client ? this.client.idclientsupplier : null
  }


  async fetchData() {

    await Promise.all([
       this.fetchDocumentTypes()
    ])


  }

  hideDialog() {
    this.displayModal = false;
    this.submitted = false;
    this.displayModalChange.emit(this.displayModal);
    this.filters = new CollectionTransactionDocumentFilter()
    this.documents = [];
  }

 

  async fetchDocumentTypes(){
    this.documentTypes = (await this.salesService.getDocumentTypes().toPromise())
          .filter(p =>  (p.name.toLocaleLowerCase() == "factura" || p.name.toLocaleLowerCase() == "nota de crédito") )
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(pc => ({
          value: pc.id,
      label: pc.name,
    }));
    console.log(this.documentTypes);

  }


  selectDateRange( $event:any ){

    if (!this.dateRange[0] || !this.dateRange[1] ){
      return;
    }
    
    this.filters.initialCreationDate = this.formatDate(this.dateRange[0])
    this.filters.finalCreationDate = this.formatDate(this.dateRange[1])
    console.log(this.filters);
    
    //console.log(this.dateRange);
  } 


  search(){
    this.salesService.getTransactionsCharge(this.filters)
      .subscribe(data => { this.documents = data; console.log(this.documents)})
    

  }

  formatDate(date: Date){
    return `${date.getFullYear()}${ String(date.getDate()).padStart(2, '0') }${String(date.getMonth() + 1).padStart(2, '0')}`
  }
  
  resetFields(){
    this.filters = new CollectionTransactionDocumentFilter();
    this.dateRange = [];
  }

  formatCurrenciesAmount(value: number):string{
    return `$${value}`
  } 

  selected(data : CollectionTransactionDocumentModal){ 
    console.log(data)
    const output = {
      activeInd: data.activeInd,
      totalAmount: data.amount,
      amountToApply  : 0,
      amountApplied : data.appliedAmount,
      creationDate : data.creationDate,
      documentNumber: data.documentNumber,
      remainingAmount : data.remainingAmount,
      saleTransactionId: data.saleTransactionId,
      expirationDate : data.expirationDate,
      documentType: data.documentType,
      documentTypeId: data.documentTypeId,
    } as CollectionTransactionDocument ;

    this.onSelect.emit(output);
    this.hideDialog();
  }


}
