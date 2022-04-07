import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Coins } from 'src/app/models/masters/coin';
import { ExchangeRateType } from 'src/app/models/masters/exchange-rate-type';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { CoinFilter } from '../../coin/shared/filters/CoinFilter';
import { CoinsService } from '../../coin/shared/service/coins.service';
import { ExchangeRateTypeFilter } from '../../exchange-rate-type/filters/exchange-rate-type-filter';
import { ExchangeRateTypeService } from '../../exchange-rate-type/service/exchange-rate-type.service';
import { ExchangeRatesFilter } from '../../exchange-rates/shared/filters/exchange-rates-filter';

@Component({
  selector: 'app-exchange-rate-filters',
  templateUrl: './exchange-rate-filters.component.html',
  styleUrls: ['./exchange-rate-filters.component.scss'],
  providers: [DatePipe]
})
export class ExchangeRateFiltersComponent implements OnInit {

  @Input() filters: ExchangeRatesFilter = new ExchangeRatesFilter();
  @Output() search = new EventEmitter<ExchangeRatesFilter>();

  @Input() expanded: boolean = true;

  exchangeRateTypes: ExchangeRateType[] = [];
  currencies: Coins[] = [];

  yearRange = '1950:' + (new Date).getFullYear().toString();
  todayDate = new Date();
  selectedDate = new Date();

  constructor(private readonly exchangeRateTypeService: ExchangeRateTypeService,
    private readonly currencyService: CoinsService,
    private readonly loadingService: LoadingService, 
    private readonly datePipe: DatePipe,
    private readonly dialogService: DialogsService) { }

  ngOnInit(): void {
    this.getExchangeRateTypes();
    this.getCurrencies();
    this.clearFilters();
  }

  searchExchangeRates() {
    this.search.emit(this.getProperties());
  }

  onChangeWihtDate() {
    this.filters.date = this.filters.withDate ? undefined : (new Date()).toDateString();
    
    this.selectedDate  = this.filters.date === undefined ? undefined : new Date;
  }

  clearFilters() {
    this.filters = new ExchangeRatesFilter();
    this.filters.date = this.todayDate.toString();
    this.filters.idOriginCurrency = undefined;
    this.filters.idDestinationCurrency = undefined;
    this.filters.idExchangeRateType = undefined;
    this.filters.withDate = false;
  }

  disabledCalendar() {
    return this.filters.withDate ? true: false; 
  }

  getTextTranslateKey(key) {
    return `masters.exchange_rate.${key}`
  }

  private getCurrencies() {
    this.loadingService.startLoading();
    const filters = new CoinFilter();
    
    this.currencyService.getCoinsList(filters).toPromise()
    .then(data => this.currencies = data)
    .then(() => this.loadingService.stopLoading())
    .catch(error => this.handleError(error));
  }

  private getProperties() {
    const filters = {...this.filters}; 
    filters.idExchangeRateType = this.filters.idExchangeRateType ?? -1;
    filters.idOriginCurrency = this.filters.idOriginCurrency ?? -1;
    filters.idDestinationCurrency = this.filters.idDestinationCurrency ?? -1;
    filters.date = this.datePipe.transform(this.selectedDate, 'yyyyMMdd');

    return filters;
  }

  private getExchangeRateTypes() {
    this.loadingService.startLoading();
    const filters = new ExchangeRateTypeFilter();
    
    this.exchangeRateTypeService.getExchangeRateTypebyFilter(filters).toPromise()
    .then(data => this.exchangeRateTypes = data)
    .then(() => this.loadingService.stopLoading())
    .catch(error => this.handleError(error));
  }

  private handleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.dialogService.errorMessage('error', error?.message ?? 'error_service');
  }
}
