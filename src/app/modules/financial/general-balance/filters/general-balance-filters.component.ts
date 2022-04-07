import { Component, Injector, OnInit, ViewEncapsulation } from "@angular/core";
import { SelectItem } from "primeng/api";
import { AccountingPlanBase } from "../../initial-setup/shared/accounting-plan-base.component";
import { GeneralBalanceFiltersService } from "./general-balance-filters.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { GeneralBalanceFilter } from "src/app/models/financial/general-balance-filter";
import { GeneralBalanceService } from "../general-balance.service";
import { FiscalYear } from "src/app/models/financial/fiscalYear/FiscalYear";

@Component({
  selector: "app-general-balance-filters",
  templateUrl: "./general-balance-filters.component.html",
  styleUrls: ["./windi.css"],
  encapsulation: ViewEncapsulation.None,
})
export class GeneralBalanceFiltersComponent
  extends AccountingPlanBase
  implements OnInit
{

  toDate = (str: string) => str ? new Date(str) : null

  fiscalYears: SelectItem<number>[];

  fiscalYear: number;
  initAccount: string;
  endAccount: string;
  initDate: Date;
  endDate: Date;

  get accounts$() {
    return new Observable<SelectItem<string>[]>((fn) =>
      this.filtersService.accounts$
        .pipe(
          map((data) =>
            data.map<SelectItem<string>>((a) => ({
              label: this.formatCode(a.accountingAccountCode),
              value: a.accountingAccountCode,
            }))
          )
        )
        .subscribe(fn)
    );
  }

  get year() {
    if (!this.fiscalYear) return null
    return this.filtersService.getFiscalYearById(this.fiscalYear)
  }

  print() {
    window.print()
  }

  constructor(
    private dataService: GeneralBalanceService,
    public filtersService: GeneralBalanceFiltersService,
    injector: Injector
  ) {
    super(injector);
  }
  ngOnInit() {
    this.filtersService.loadData();
  }

  clear() {
    this.initAccount = null;
    this.endAccount = null;
    this.initDate = null;
    this.endDate = null;
    this.fiscalYear = null;
    this.dataService.loadData();
  }

  search() {
    const defaultFilters = new GeneralBalanceFilter();
    this.dataService.loadData({
      idBusiness: defaultFilters.idBusiness,
      initDate: this.initDate || defaultFilters.initDate,
      endDate: this.endDate || defaultFilters.endDate,
      initAccountingAccount:
        this.initAccount || defaultFilters.initAccountingAccount,
      endAccountingAccount:
        this.endAccount || defaultFilters.endAccountingAccount,
      fiscalYearId: this.fiscalYear || defaultFilters.fiscalYearId,
    });
  }
}
