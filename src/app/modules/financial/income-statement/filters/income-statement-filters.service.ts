import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { AccountingAccount } from "src/app/models/financial/AccountingAccount";
import { AccountingAccountFilter } from "src/app/models/financial/AccountingAccountFilter";
import { FISCAL_YEAR_FILTER_LIST_DEFAULT } from "src/app/models/financial/fiscalYear/filters/fiscalYearFilter";
import { FiscalYear } from "src/app/models/financial/fiscalYear/FiscalYear";
import { AccountingAccountService } from "../../AccountingAccounts/shared/services/accounting-account.service";
import { FiscalYearService } from "../../fiscal-year/shared/services/fiscal-year.service";

@Injectable({
  providedIn: "root",
})
export class IncomeStatementFiltersService {
  constructor(
    private accountsService: AccountingAccountService,
    public fiscalYearService: FiscalYearService
  ) {}

  loaded = false;

  private _years: BehaviorSubject<FiscalYear[]> = new BehaviorSubject(
    undefined
  );

  private _accounts: BehaviorSubject<AccountingAccount[]> = new BehaviorSubject(
    undefined
  );

  private _errors: BehaviorSubject<{ message: string; error: any }[]> =
    new BehaviorSubject([]);

  get accounts$() {
    return new Observable<AccountingAccount[]>((fn) =>
      this._accounts.subscribe(fn)
    );
  }

  get years$() {
    return new Observable<FiscalYear[]>((fn) => this._years.subscribe(fn));
  }

  get errors() {
    return new Observable<{ message: string; error: any }[]>((fn) =>
      this._errors.subscribe(fn)
    );
  }

  getFiscalYearById(id: number) {
    return this._years.getValue()?.find((y) => y.id == id);
  }

  loadData() {
    this._errors.next([]);
    this.accountsService
      .getAccountingAccountList({
        ...new AccountingAccountFilter(),
        active: 1,
      })
      .subscribe(
        (res) => {
          this._accounts.next(
            res.sort((a, b) =>
              a.accountingAccountCode.localeCompare(b.accountingAccountCode)
            )
          );
        },
        (err) => {
          const error = {
            message: "Error obteniendo las cuentas contables",
            error: err,
          };
          this._errors.next([...this._errors.getValue(), error]);
        }
      );

    this.fiscalYearService
      .getList({ ...FISCAL_YEAR_FILTER_LIST_DEFAULT, active: 1 })
      .subscribe(
        (data) => {
          this._years.next(data.sort((a, b) => a.year.localeCompare(b.year)));
        },
        (err) => {
          const error = {
            message: "Error obteniendo los ejercicios fiscales",
            error: err,
          };
          this._errors.next([...this._errors.getValue(), error]);
        }
      );

    combineLatest([this._accounts, this._years]).subscribe((data) => {
      this.loaded = data.every((obj) => Boolean(obj));
    });
  }
}
