import { Component, Input, Output, OnInit, EventEmitter } from "@angular/core";
import { CollectionTransactionCharges } from "src/app/models/financial/collectiontransactions";
import { Coins } from "src/app/models/masters/coin";

function uuidv4() {
  return `${[1e7]}${-1e3}${-4e3}${-8e3}${-1e11}`.replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
}

@Component({
  selector: "app-sale-transactions-payment-tree",
  templateUrl: "./sale-transactions-payment-tree.component.html",
  styleUrls: ["./sale-transactions-payment-tree.component.scss"],
})
export class SaleTransactionsPaymentTreeComponent implements OnInit {
  count: number = 0;
  chargesData: CollectionTransactionCharges[] = [];
  displayModal: boolean;
  isUpdating: boolean = false;
  editObject = new SaleTransactionPaymentDataTable();
  chargeEdit = new CollectionTransactionCharges();
  @Input() payments = [] as SaleTransactionPaymentDataTable[];
  @Output() paymentsChange = new EventEmitter<
    SaleTransactionPaymentDataTable[]
  >();

  @Input() currencyMap: Coins[];
  @Input() currency: Coins;
  @Input() currencyRate: number;

  getCurrency = (id: number) => this.currencyMap.find((c) => c.id == id);

  getPrice = (payment: SaleTransactionPaymentDataTable) => {
    const fromSys = Boolean(
      this.currencyMap.find((c) => c.id == payment.currencyId)
    );
    const isBase = this.currencyMap.find(
      (c) => c.id == payment.currencyId
    )?.legalCurrency;
    const baseCurrency = this.currencyMap.find((c) => c.legalCurrency);
    const conversionCurrency = this.currencyMap.find((c) => !c.legalCurrency);
    const cost = payment.amount;
    const format = (s: string, n: number) =>
      s +
      " " +
      n.toLocaleString("es", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });

    let convRate = 1;
    let baseRate = 1;
    if (fromSys) {
      convRate = !isBase ? 1 : this.currencyRate;
      baseRate = isBase ? 1 : this.currencyRate;
    } else {
    }
    return {
      conversion: format(conversionCurrency.symbology, cost / convRate),
      base: format(baseCurrency.symbology, cost * baseRate),
    };
  };

  constructor() {}

  cols = [
    {
      template: (p) => p.paymentMethod,
      field: "paymentMethodId",
      header: "Forma de pago",
      display: "table-cell",
    },
    {
      template: (p) => p.bank,
      field: "bankId",
      header: "Banco",
      display: "table-cell",
    },
    {
      template: (p) => p.bankAccount,
      field: "bankAccountId",
      header: "Cuenta bancaria",
      display: "table-cell",
    },
    {
      template: (p) => p.currency,
      field: "currencyId",
      header: "Moneda",
      display: "table-cell",
    },
    {
      template: (p) => p.reference,
      field: "reference",
      header: "Referencia",
      display: "table-cell",
    },
    {
      template: () => null,
      field: "amount",
      header: "Monto",
      display: "table-cell",
    },
  ];

  ngOnInit(): void {}

  edit(data: any): void {
    this.editObject = { ...data };
    this.isUpdating = true;
    this.displayModal = true;
  }

  table = () => this.payments.filter((p) => p.indActive);

  showModalDialog() {
    this.displayModal = true;
  }

  outputter() {
    this.paymentsChange.emit(this.payments);
  }

  create(data: SaleTransactionPaymentDataTable) {
    data.uid = uuidv4();
    data.id = -1;
    data.indActive = true;
    console.log(data);
    this.payments = [...this.payments, data];
    this.outputter();
  }

  update(data: SaleTransactionPaymentDataTable) {
    const idx = this.payments.findIndex((p) => p.uid == data.uid);
    this.payments[idx] = {
      ...data,
      uid: this.payments[idx].uid,
      indActive: true,
      id: this.payments[idx].id,
    };
    this.isUpdating = false;
    this.editObject = new SaleTransactionPaymentDataTable();
    this.outputter();
  }

  delete(data: SaleTransactionPaymentDataTable) {
    const idx = this.payments.findIndex((p) => p.uid == data.uid);
    this.payments[idx].indActive = false;
    this.outputter();
  }

  getPaymentTotal() {
    return this.transformAmount(
      this.payments.reduce(
        (previousValue, actualValue) => previousValue + actualValue.amount,
        0
      )
    );
  }

  transformAmount(value: number): string {
    return "$" + value + " - " + "Bs." + (value * 2500000).toLocaleString("es");
  }
}

export class SaleTransactionPaymentDataTable {
  id: number = -1;
  uid?: string;
  saleTransactionPaymentId: number = -1;
  bankId: number = -1;
  bankAccountId: number = -1;
  accountingAccountId? = -1;
  accountingAccount? = "";
  currencyPaymentMethodId: number = -1;
  paymentMethodId: number = -1;
  currencyId: number = -1;
  currency: string = "";
  taxeChangeId: number = -1;
  converTaxeChangeId: number = -1;
  amount: number = 0;
  reference: string = "";
  indActive: boolean = false;
  bank: string;
  bankAccount: string;
  paymentMethod: string;
}
