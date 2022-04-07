import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { CollectionTransactionCharges } from 'src/app/models/financial/collectiontransactions';
import { SalesTransactionPayment } from 'src/app/models/financial/sale-transactions';

@Component({
  selector: 'app-collection-transactions-payment-tree',
  templateUrl: './collection-transactions-payment-tree.component.html',
  styleUrls: ['./collection-transactions-payment-tree.component.scss']
})
export class CollectionTransactionsPaymentTreeComponent implements OnInit {


  editingIndex = -1;
  count: number = 0;
  displayData: PaymentDataTable[] = [];
  chargesData: CollectionTransactionCharges[] = [];
  displayModal: boolean;
  isUpdating: boolean = false;
  table: any[] = [];
  editObject = new CollectionTransactionCharges();
  chargeEdit = new CollectionTransactionCharges();
  @Input() payments = [] as CollectionTransactionCharges[];
  @Output() paymentsChange = new EventEmitter<CollectionTransactionCharges[]>();
  @Input() collectionCharges = [] as CollectionTransactionCharges[];


  @Input('discounts')
  set discounts(value: SalesTransactionPayment[]) {
    this.discounts = value;
    this.table = this.formatTable(value);
  }



  constructor() { }

  cols = [
    { template: p => p.paymentMethod, field: 'paymentMethod', header: 'Forma de pago', display: 'table-cell' },
    { template: p => p.bank, field: 'bankId', header: 'Banco', display: 'table-cell' },
    { template: p => p.bankAccount, field: 'bankAccountId', header: 'Cuenta bancaria', display: 'table-cell' },
    { template: p => p.currency, field: 'currencyId', header: 'Moneda', display: 'table-cell' },
    { template: p => p.reference, field: 'reference', header: 'Referencia', display: 'table-cell' },
    { template: p => this.transformAmount(p.amount), field: 'amount', header: 'Monto', display: 'table-cell' },
  ];

  ngOnInit(): void {
    console.log(this.payments);
    this.paymentsChange.subscribe((data) => console.log(data))
  }

  edit(_displayData: any, i:number,): void {



    this.editObject = { ..._displayData }
    this.isUpdating = true;
    this.displayModal = true;
    this.editingIndex = i;
    /*
        this.displayData = {
          ...this.displayData,
          ..._displayData
       };


       this.TipoUso=(_articleClassification as any).tipoUsoCuentaId
       this.viewMode=true;
       this.showDialog = true;*/

  }

  formatTable(discounts: SalesTransactionPayment[] = []) {
    const arr = discounts?.map(t => t) || [];
    const transformed = arr.map((obj) => {
      // tslint:disable-next-line: forin
      for (const key in obj) {
        // tslint:disable-next-line: triple-equals
        const col = this.cols.find(c => c.field == key);
        if (col) {
          obj[key] = col.template(obj);
        }
      }
      return obj;
    });
    console.log(transformed);
    return transformed;
  }

  showModalDialog() {
    this.displayModal = true;
  }

  outputter() {
    // this.payments = this.displayData.map<SalesTransactionPayment>(p => ({ ...p }));
    console.log(this.payments);
    this.paymentsChange.emit(this.payments);
  }

  create(data: CollectionTransactionCharges) {
    this.payments = [...this.payments,data];
    console.log(this.payments);
    this.outputter();
  }

  update(data: CollectionTransactionCharges) {

    if (this.editingIndex == -1){
      return;
    }
  
      this.payments[this.editingIndex] = { ...data };
      this.editObject = new CollectionTransactionCharges();
      this.isUpdating = false;
      this.chargeEdit = new CollectionTransactionCharges();

      this.editingIndex = -1;
      console.log(this.payments);
    
  }

  delete(data: CollectionTransactionCharges, i :number) {
    this.payments.splice(i,1)
    this.outputter();
  }

  getPaymentTotal() {
    return this.transformAmount(this.payments.reduce((previousValue, actualValue) => previousValue + actualValue.amount, 0))
  }


  transformAmount(value: number): string {
    return "$" + value + " - " + "Bs." + (value * 2500000).toLocaleString('es')

  }


}

export class PaymentDataTable {
  id: number = -1;
  saleTransactionPaymentId: number = -1;
  bankId: number;
  bankAccountId: number;
  currencyPaymentMethodId: number;
  paymentMethodId: number;
  currencyId: number;
  currency: string = "";
  taxeChangeId: number;
  converTaxeChangeId: number;
  amount: number;
  reference: string = "";
  indActive: boolean = false;
  bank: string;
  bankAccount: string;
  paymentMethod: string;
}

