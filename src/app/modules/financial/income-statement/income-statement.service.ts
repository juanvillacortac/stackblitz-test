import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { IncomeStatement } from "src/app/models/financial/income-statement";
import { IncomeStatementFilter } from "src/app/models/financial/income-statement-filter";
import { environment } from "src/environments/environment";
import { HttpHelpersService } from "../../common/services/http-helpers.service";

@Injectable({
  providedIn: "root",
})
export class IncomeStatementService {
  constructor(
    private _httpClient: HttpClient,
    private _httpHelpersService: HttpHelpersService
  ) {}

  private _data: BehaviorSubject<IncomeStatement> = new BehaviorSubject(
    undefined
  );
  private _error: BehaviorSubject<{ message: string; error: any }> =
    new BehaviorSubject(undefined);

  get store$() {
    return new Observable<IncomeStatement>((fn) => this._data.subscribe(fn));
  }

  get error() {
    return new Observable<{ message: string; error: any }>((fn) =>
      this._error.subscribe(fn)
    );
  }

  loadData(filter = new IncomeStatementFilter()) {
    this._error.next(undefined);
    return this.getGeneralBalance(filter).subscribe(
      (res) => {
        this._data.next(res);
      },
      (err) => {
        const error = {
          message: "Error obteniendo el estado de resultados",
          error: err,
        };
        this._error.next(error);
      }
    );
  }

  getGeneralBalance(filter = new IncomeStatementFilter()) {
    return this._httpClient.get<IncomeStatement>(
      environment.API_BASE_URL_RECEIVABLE_ACCOUNTS + "/income-statements",
      {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(
          filter,
          false
        ),
      }
    );
  }
}
