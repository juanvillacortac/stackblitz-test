import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ColumnD } from 'src/app/models/common/columnsd';
import { CollectionTransactionCharges, CollectionTransactionDocument } from 'src/app/models/financial/collectiontransactions';
import { SalesTransactionPayment } from 'src/app/models/financial/sale-transactions';
import { SupplierExtend } from 'src/app/models/masters/supplier-extend';


@Component({
  selector: 'app-collection-transactions-documents-to-apply-tree',
  templateUrl: './collection-transactions-documents-to-apply-tree.component.html',
  styleUrls: ['./collection-transactions-documents-to-apply-tree.component.scss']
})
export class CollectionTransactionsDocumentsToApplyTreeComponent implements OnInit {

  count: number = 0;
  // displayData: CollectionTransactionDocument[] = [];
  displayModal: boolean;
  isUpdating: boolean = false;
  table: any[] = [];
  editObject = new CollectionTransactionDocument();
  @Input() documents = [] as CollectionTransactionDocument[];
  @Input() client: SupplierExtend;
  @Output() documentsChange = new EventEmitter<CollectionTransactionDocument[]>();
  @Output() updateAmounts = new EventEmitter<Number>();
  // @Input('documents')
  // set discounts(value: CollectionTransactionDocument[]) {
  //   this.discounts = value;
  //   this.table = this.formatTable(value);
  // }
  CollectionTransactionCharges

  constructor() { }

  cols: ColumnD<CollectionTransactionDocument>[] =
    [
      { template: p => p.documentNumber, field: 'documentNumber', header: 'Número de documento', display: 'table-cell' },
      { template: p => String(p.expirationDate).split("T")[0], header: 'Fecha de vencimiento', display: 'table-cell' },
      { template: p => p.documentType, field: 'documentTypeId', header: 'Tipo', display: 'table-cell' },
      { template: p => p.totalAmount, field: 'totalAmount', header: 'Monto total', display: 'table-cell' },
      { template: p => p.amountApplied, header: 'Monto aplicado', display: 'table-cell' },
      { template: p => p.amountToApply, header: 'Monto a aplicar', display: 'table-cell' },
      { template: p => p.remainingAmount - p.amountToApply, field: 'remainingAmount', header: 'Restante por aplicar', display: 'table-cell' },
    ];

  colsDetails: ColumnD<any>[] = [
    { template: p =>  p.paymentMethod,field:'paymentMethod', header: 'Forma de pago', display: 'table-cell' },
    { template: p => p.bank,field:'bank', header: 'Banco', display: 'table-cell' },
    { template: p => p.bankAccount, field: 'bankAccount', header: 'Cuenta bancaria', display: 'table-cell' },
    { template: p => p.currency, field: 'currency', header: 'Moneda', display: 'table-cell' },
    { template: p => `$ ${p.amount}` , field: 'amount', header: 'Monto', display: 'table-cell' },
    { template: p => `$ ${p.amountToApply}` , field: 'amountToApply', header: 'Monto a aplicar', display: 'table-cell' },
    { template: p => `$ ${p.remainingAmount}` , field: 'remainingAmount', header: 'Restante por aplicar', display: 'table-cell' },
    //{ template: p => p.currency, field: 'currency', header: 'Moneda', display: 'table-cell' },
    //{ template: p => p.amount, field: 'amount', header: 'Monto', display: 'table-cell' },
  ];

  expanded = {}

  ngOnInit(): void {
  }

  // formatTable(discounts: CollectionTransactionDocument[] = []) {
  //   const arr = discounts?.map(t => t) || [];
  //   const transformed = arr.map((obj) => {
  //     // tslint:disable-next-line: forin
  //     for (const key in obj) {
  //       // tslint:disable-next-line: triple-equals
  //       const col = this.cols.find(c => c.field == key);
  //       if (col) {
  //         obj[key] = col.template(obj);
  //       }
  //     }
  //     return obj;
  //   });
  //   console.log(transformed);
  //   return transformed;
  // }

  private toDate = (str: string | Date) => {
    const d = new Date(str);
    const padLeft = (n: number) => ('00' + n).slice(-2);
    const dformat = [
      padLeft(d.getDate()),
      padLeft(d.getMonth() + 1),
      d.getFullYear(),
    ].join('/');
    return dformat;
  }


  appendToList($event: CollectionTransactionDocument) {

    const search = this.documents.find(p => (p.saleTransactionId == $event.saleTransactionId));
    if (search){
      return;
    }
    this.documents = [...this.documents, $event];
    console.log(this.documents);
    this.expanded[$event.saleTransactionId] = false
    this.documentsChange.emit(this.documents);
  }

  showModalDialog() {
    this.displayModal = true;
  }

  // outputter() {
  //   this.documents = this.displayData.map<CollectionTransactionDocument>(p => ({ ...p }));
  //   console.log(this.documents);
  //   this.documentsChange.emit(this.documents);
  // }

  create(data: CollectionTransactionDocument) {
    // data.id = this.count;
    // this.displayData.push(data)
    // this.displayData = [...this.displayData]
    // this.count++;
    // this.outputter();
  }

  update(data: CollectionTransactionDocument) {
    // let index = this.displayData.findIndex(row => row.id === data.id);
    // this.displayData[index] = { ...data };
    // this.isUpdating = false;
    // this.editObject = new collectionDocuments();
    // this.outputter();
  }

  delete(data: CollectionTransactionDocument) {
    this.documents = this.documents.filter(p => {
      return p.transactionCollectionChargeId !== data.transactionCollectionChargeId;
    });
    this.documentsChange.emit(this.documents);
  }

  // getPaymentTotal(){
  //   return this.transformAmount( this.displayData.reduce((previousValue, actualValue) => previousValue + actualValue.amount,0) )
  // }

  transformAmount(value: number): string {
    return "$" + value + " - " + "Bs." + (value * 2500000).toLocaleString('es')
  }

  updateChargeAmount(i:number ){ 
    console.log(i);
    this.updateAmounts.emit(i);
  }

  
}

// export class collectionDocuments {
//   id = -1;
//   transactionCollectionChargeId = -1;
//   documentTypeId = -1;
//   amountApplied = -1;
//   amountToApply = -1;
//   remainingAmount = -1;
//   totalAmount = -1;
//   documentNumber = '';
//   indActive: boolean;
//   chargesApplied: collectionCharges[];
// }


// export class collectionCharges {
//   id = -1;
//   transactionCollectionChargeId = -1;
//   transactionSalesChargeId = -1;
//   bankId = -1;
//   accountBankId = -1;
//   auxiliaryBankAccountOriginId = -1;
//   currencyId = -1;
//   amount = -1;
// }
