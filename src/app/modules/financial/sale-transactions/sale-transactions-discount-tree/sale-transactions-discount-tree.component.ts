import { Component, Input, Output, OnInit, EventEmitter } from "@angular/core";
import { SalesTransactionDiscount } from "src/app/models/financial/sale-transactions";
import { Coins } from "src/app/models/masters/coin";

@Component({
  selector: "app-sale-transactions-discount-tree",
  templateUrl: "./sale-transactions-discount-tree.component.html",
  styleUrls: ["./sale-transactions-discount-tree.component.scss"],
})
export class SaleTransactionsDiscountTreeComponent implements OnInit {
  @Input("discountsOutput") discountsOutput =
    [] as transactionSalesDiscountDataTable[];
  @Output() discountsOutputChange = new EventEmitter<
    transactionSalesDiscountDataTable[]
  >();
  @Input() subTotal = 0;
  displayModal: boolean;
  isUpdating = false;
  table: any[] = [];
  count: number = 0;
  editObject = new transactionSalesDiscountDataTable();
  _transactions = [] as transactionSalesDiscountDataTable[];
  @Input() idName = "transactionSalesDiscountId";
  @Input() idTypeName = "transactionSalesDiscountId";
  @Input("discounts")
  set discounts(value: SalesTransactionDiscount[]) {
    this.discounts = value;
    this.table = this.formatTable(value);
  }
  constructor() {}

  @Input() currencyMap: Coins[];
  @Input() currency: Coins;
  @Input() currencyRate: number;

  getPrice = (discount: transactionSalesDiscountDataTable) => {
    const isBase = this.currencyMap.find(
      (c) => c.id == this.currency.id
    )?.legalCurrency;
    const baseCurrency = this.currencyMap.find((c) => c.legalCurrency);
    const conversionCurrency = this.currencyMap.find((c) => !c.legalCurrency);
    const cost =
      discount.discountTypeId == 1
        ? this.subTotal * (discount.discountValue / 100)
        : discount.discountValue;
    const format = (s: string, n: number) =>
      s +
      " " +
      n.toLocaleString("es", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });

    const convRate = !isBase ? 1 : this.currencyRate;
    const baseRate = isBase ? 1 : this.currencyRate;
    return {
      conversion: format(conversionCurrency.symbology, cost / convRate),
      base: format(baseCurrency.symbology, cost * baseRate),
    };
  };

  cols = [
    {
      template: (p) => p.description,
      field: "description",
      header: "Descripción",
      display: "table-cell",
    },
    {
      template: (p) => this.getDiscountFormat(p),
      field: "value",
      header: "Valor",
      display: "table-cell",
    },
    {
      template: (p) => p.discountTypeApplication,
      field: "module",
      header: "Aplicación",
      display: "table-cell",
    },
    {
      template: () => null,
      // template: (p) => this.getDiscountAmountSingle(this.subTotal, p),
      field: "total",
      header: "Total",
      display: "table-cell",
    },
  ];

  ngOnInit(): void {
    this._transactions = this.discountsOutput;
    this.outputter();
  }

  formatTable(discounts: SalesTransactionDiscount[] = []) {
    const arr = discounts?.map((t) => t) || [];
    const transformed = arr.map((obj) => {
      // tslint:disable-next-line: forin
      for (const key in obj) {
        // tslint:disable-next-line: triple-equals
        const col = this.cols.find((c) => c.field == key);
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

  create(data: transactionSalesDiscountDataTable) {
    data.id = this.count;
    data.indActivo = true;
    this._transactions.push(data);
    this._transactions = [...this._transactions];
    this.count++;
    this.outputter();
    console.log(this._transactions);
  }

  edit(data: transactionSalesDiscountDataTable) {
    this.editObject = { ...data };
    this.isUpdating = true;
    this.showModalDialog();
  }

  transactions = () => this._transactions.filter((t) => t.indActivo);

  delete(data: transactionSalesDiscountDataTable) {
    const idx = this._transactions.findIndex((p) => p.id === data.id);
    this._transactions[idx].indActivo = false;
    this.outputter();
  }

  update(data: transactionSalesDiscountDataTable) {
    console.log("updating");
    let index = this._transactions.findIndex((row) => row.id === data.id);
    this._transactions[index] = { ...data };
    this.isUpdating = false;
    this.outputter();
  }

  outputter() {
    this.discountsOutput = this._transactions.map((p) => ({ ...p }));
    this.discountsOutputChange.emit(this.discountsOutput);
  }

  getDiscountAmount(value: number, rate: number) {
    return;
  }

  getDiscountFormat(p: transactionSalesDiscountDataTable) {
    if (p.discountTypeId == 2) {
      return this.currency.symbology + p.discountValue;
    } else {
      return p.discountValue + "%";
    }
  }

  getDiscountAmountSingle(
    value: number,
    object: transactionSalesDiscountDataTable
  ) {
    if (object.discountTypeId == 1) {
      return this.transformAmount(value * (object.discountValue / 100));
    } else {
      return this.transformAmount(object.discountValue);
    }
  }

  transformAmount(value: number): string {
    return (
      "$ " +
      value.toLocaleString("es") +
      " - " +
      "Bs. " +
      (value * 2500000).toLocaleString("es")
    );
  }
}

export class transactionSalesDiscountDataTable {
  id: number = -1;
  // transactionSalesDiscountId: number;
  discountTypeApplicationId: number = 1;
  discountTypeApplication: string = "Factura";
  discountTypeId: number;
  description: string = "";
  discountValue: number = 0;
  indActivo: boolean;
}
