import { Component, Injector, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { ColumnD } from "src/app/models/common/columnsd";
import { GeneralBalanceDistribution } from "src/app/models/financial/general-balance-distribution";
import { AccountingPlanBase } from "../../initial-setup/shared/accounting-plan-base.component";

@Component({
  selector: "app-general-balance-table",
  templateUrl: "./general-balance-table.component.html",
  styleUrls: ["./windi.css"],
  encapsulation: ViewEncapsulation.None,
})
export class GeneralBalanceTableComponent
  extends AccountingPlanBase
  implements OnInit
{
  @Input() name: string
  @Input() accounts: GeneralBalanceDistribution[] = []

  get total() {
    return this.accounts.map(a => +a.debit - +a.credit).reduce((a, b) => a + b, 0)
  }

  cols: ColumnD<GeneralBalanceDistribution>[] = [
    {
      template: (a) => a.accountingAccountName,
      header: 'Nombre',
      field: 'accountingAccountName',
    },
    {
      template: (a) => this.formatCode(a.accountingAccountCode),
      header: 'Código',
      field: 'accountingAccountCode',
      class: 'font-mono',
    },
    {
      template: (a) => +a.debit,
      header: 'Debe',
      textAlign: 'right',
      style: 'font-weight: bold;',
      class: 'font-mono',
    },
    {
      template: (a) => +a.credit,
      header: 'Haber',
      textAlign: 'right',
      style: 'font-weight: bold;',
      class: 'font-mono',
    },
    {
      template: (a) => +a.debit - +a.credit,
      header: 'Saldo',
      textAlign: 'right',
      style: 'font-weight: bold;',
      class: 'font-mono',
    },
  ]

  constructor(
    injector: Injector,
  ) {
    super(injector);
  }
  ngOnInit() {
  }
}
