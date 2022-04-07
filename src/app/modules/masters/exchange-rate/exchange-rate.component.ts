import { Component, OnInit } from '@angular/core';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { ExchangeRates } from 'src/app/models/masters/exchange-rates';
import { ExchangeRatesFilter } from '../exchange-rates/shared/filters/exchange-rates-filter';
import { ExchangeRatesService } from '../exchange-rates/shared/service/exchange-rates.service';
import { LoadingService } from '../../common/components/loading/shared/loading.service';
import { DialogsService } from '../../common/services/dialogs.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-exchange-rate',
  templateUrl: './exchange-rate.component.html',
  styleUrls: ['./exchange-rate.component.scss'],
  providers: [DatePipe]
})
export class ExchangeRateComponent implements OnInit {

  permissionsIDs = {...Permissions};

  showDetail: boolean = false;
  showFilters: boolean = false;

  cols = [];

  filters: ExchangeRatesFilter = new ExchangeRatesFilter();
  exchangeRate: ExchangeRates = new ExchangeRates;
  exchangeRates: ExchangeRates[] = [];

  constructor(private readonly exchangeRateService: ExchangeRatesService,
    private readonly loadingService: LoadingService, 
    private readonly dialogService: DialogsService,
    private readonly datePipe: DatePipe,
    public userPermissions: UserPermissions) { }

  ngOnInit(): void {
    this.loadColumns();
    this.search(this.filters);
  }

  openNew() {
    this.clearExchangeRateModel();
    this.showDetail = true;
  }

  edit(exchangeRate: ExchangeRates) {
    this.exchangeRate = exchangeRate;
    this.showDetail = true;
  }

  search(filters) {
    this.loadingService.startLoading();
    this.exchangeRateService.getExchangeRatesbyFilter(filters).toPromise()
    .then(data => this.exchangeRates = data)
    .then(() => this.loadingService.stopLoading())
    .catch(error => this.handleError(error));
  }

  childCallBack(reload: boolean) {
    this.showDetail = false;
    if (reload) {
      this.clearFilters();
      this.search(this.getProperties());
    }
  }

   private getProperties() {
    const filters = {...this.filters}
    filters.idExchangeRateType = this.filters.idExchangeRateType ?? -1;
    filters.idOriginCurrency = this.filters.idOriginCurrency ?? -1;
    filters.idDestinationCurrency = this.filters.idDestinationCurrency ?? -1;
    filters.date = this.datePipe.transform(this.filters.date, 'yyyyMMdd');

    return filters;
  }

  private clearFilters() {
    this.filters = new ExchangeRatesFilter();
    this.filters.date = undefined;
    this.filters.idOriginCurrency = undefined;
    this.filters.idDestinationCurrency = undefined;
    this.filters.idExchangeRateType = undefined;
    this.filters.withDate = false;
  }

  private loadColumns() {
    this.cols = [
      { field: 'exchangeRateType', header: this.getTranslateLabel("exchange_rate_type"), display: 'table-cell',
      dataType: 'string' },
      { field: 'originCurrency', header: this.getTranslateLabel("currency_of"), display: 'table-cell',
      dataType: 'string' },
      { field: 'destinationCurrency', header: this.getTranslateLabel("currency_to"), display: 'table-cell',
      dataType: 'string' },
      { field: 'conversionFactor', header: this.getTranslateLabel("conversion_factor"), display: 'table-cell',
      dataType: 'number' },
      { field: 'effectiveDate', header: "date", display: 'table-cell',
      dataType: 'date' },
      { field: 'effectiveDate', header: "time", display: 'table-cell',
      dataType: 'time' },
      { field: 'userId', header: "operator", display: 'table-cell',
      dataType: 'user' },
    ];
  }
  
  private getTranslateLabel(key: string) {
    return `masters.exchange_rate.${key}`
  }

  private clearExchangeRateModel() {
    this.exchangeRate = new ExchangeRates();
    this.exchangeRate.idExchangeRate = -1;
  }

  private handleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.dialogService.errorMessage('error', error?.message ?? 'error_service');
  }

}
