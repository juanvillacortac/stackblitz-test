import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { GeneralBalance } from "src/app/models/financial/general-balance";
import { GeneralBalanceFilter } from "src/app/models/financial/general-balance-filter";
import { environment } from "src/environments/environment";
import { HttpHelpersService } from "../../common/services/http-helpers.service";

@Injectable({
  providedIn: "root",
})
export class GeneralBalanceService {
  constructor(
    private _httpClient: HttpClient,
    private _httpHelpersService: HttpHelpersService
  ) {}

  private _data: BehaviorSubject<GeneralBalance> = new BehaviorSubject(
    undefined
  );
  private _error: BehaviorSubject<{ message: string; error: any }> =
    new BehaviorSubject(undefined);

  get store$() {
    return new Observable<GeneralBalance>((fn) => this._data.subscribe(fn));
  }

  get error() {
    return new Observable<{ message: string; error: any }>((fn) =>
      this._error.subscribe(fn)
    );
  }

  loadData(filter = new GeneralBalanceFilter()) {
    this._error.next(undefined);
    return this.getGeneralBalance(filter).subscribe(
      (res) => {
        this._data.next(res);
      },
      (err) => {
        const error = {
          message: "Error obteniendo el balance general",
          error: err,
        };
        this._error.next(error);
      }
    );
  }

  getGeneralBalance(filter = new GeneralBalanceFilter()) {
    return this._httpClient.get<GeneralBalance>(
      environment.API_BASE_URL_RECEIVABLE_ACCOUNTS + "/general-balances",
      {
        params: this._httpHelpersService.getHttpParamsFromPlainObject(
          filter,
          false
        ),
      }
    );
  }
}
