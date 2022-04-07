import { Component, Injector, OnInit, ViewEncapsulation } from "@angular/core";
import { MessageService } from "primeng/api";
import { BreadcrumbService } from "src/app/design/breadcrumb.service";
import { LoadingService } from "../../common/components/loading/shared/loading.service";
import { AccountingPlanBase } from "../initial-setup/shared/accounting-plan-base.component";
import { IncomeStatementService } from "./income-statement.service";

@Component({
  selector: "app-income-statement",
  templateUrl: "./income-statement.component.html",
  styleUrls: ["./windi.css"],
  encapsulation: ViewEncapsulation.None,
})
export class IncomeStatementComponent
  extends AccountingPlanBase
  implements OnInit
{
  constructor(
    private service: IncomeStatementService,
    private messageService: MessageService,
    private breadcrumbService: BreadcrumbService,
    public loadingService: LoadingService,
    injector: Injector
  ) {
    super(injector);
    this.breadcrumbService.setItems([
      { label: "Financiero" },
      { label: "Reportes" },
      {
        label: "Estado de resultados",
        routerLink: ["/financial/reports/income-statements"],
      },
    ]);
  }

  data$ = this.service.store$;
  total = 0;

  ngOnInit() {
    this.fetchInitialSetup();
    this.loadingService.startLoading();
    this.data$.subscribe((data) => {
      if (data !== undefined) {
        this.loadingService.stopLoading();
      }

      if (
        data === null ||
        (data !== undefined &&
          !data?.expenseRoot &&
          !data?.incomeRoot)
      ) {
        this.messageService.clear();
        this.messageService.add({
          severity: "info",
          summary: "Sin datos",
          detail: "No se ha encontrado información",
        });
        return;
      }

      this.total = [...(data?.expenseRoot || []), ...(data?.incomeRoot || [])]
        .map((a) => +a.debit - +a.credit)
        .reduce((a, b) => a + b, 0);
    });
    this.service.error.subscribe((err) => {
      if (!err) return;
      this.loadingService.stopLoading();
      this.messageService.clear();
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: err.message,
      });
    });

    this.service.loadData();
  }
}
