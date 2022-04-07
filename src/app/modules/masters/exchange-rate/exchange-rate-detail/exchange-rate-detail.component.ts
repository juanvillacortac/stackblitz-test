import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Coins } from 'src/app/models/masters/coin';
import { ExchangeRateType } from 'src/app/models/masters/exchange-rate-type';
import { ExchangeRates } from 'src/app/models/masters/exchange-rates';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { CoinFilter } from '../../coin/shared/filters/CoinFilter';
import { CoinsService } from '../../coin/shared/service/coins.service';
import { ExchangeRateTypeFilter } from '../../exchange-rate-type/filters/exchange-rate-type-filter';
import { ExchangeRateTypeService } from '../../exchange-rate-type/service/exchange-rate-type.service';
import { ExchangeRatesService } from '../../exchange-rates/shared/service/exchange-rates.service';

@Component({
  selector: 'app-exchange-rate-detail',
  templateUrl: './exchange-rate-detail.component.html',
  styleUrls: ['./exchange-rate-detail.component.scss']
})
export class ExchangeRateDetailComponent implements OnInit {

  constructor(private readonly exchangeRateService: ExchangeRatesService,
    private readonly exchangeRateTypeService: ExchangeRateTypeService,
    private readonly currencyService: CoinsService,
    private readonly loadingService: LoadingService,
    private readonly dialogService: DialogsService) { }

  @Input() showPanel: boolean = false;
  @Input() exchangeRate: ExchangeRates = new ExchangeRates();

  @Output() hideDialogEvent = new EventEmitter<boolean>();

  submitted: boolean = false;

  exchangeRateTypes: ExchangeRateType[] = [];
  currencies: Coins[] = [];

  validations: any[] = [];

  ngOnInit(): void {
    this.getCurrencies();
    this.getExchangeRateTypes();
  }

  save() {
    this.submitted = true;
    this.validateForm();

    if(this.isValidForm()) {
      this.loadingService.startLoading('saving');
      this.exchangeRateService.saveExchangeRate(this.exchangeRate)
      .then(result => this.saveSuccess(result))
      .catch(error => this.handleError(error));
    }
  }

  hideDialog() {
    this.showPanel = false;
    this.submitted = false;
    this.hideDialogEvent.emit(false);
  }

  getTextTranslateKey(key) {
    return `masters.exchange_rate.${key}`
  }

  validateForm() {
    if (this.submitted) {
      this.validations.length = 0;
      this.validations = [];
      this.validateExchangeRateType();
      this.validateOiriginCurrency();
      this.validateDestinationCurrency();
      this.validateConversionFactor();
    }
  }

  isValidForm() {
    return  this.submitted && this.validations.filter(x => !x.isValid).length === 0;
  }

  getResultErrorValues(id, result, message) {
    return { id: id, isValid: result, error: message };
  }

  private saveSuccess(result) {
    if(result) {
      this.dialogService.successMessage(this.getTextTranslateKey('edit_title'), 'saved');
      this.showPanel = false;
      this.submitted = false;
      this.hideDialogEvent.emit(true);
    } else {
      this.dialogService.errorMessage('error', 'error_service');
    }

  }

  private validateExchangeRateType() {
    let result = true;
    if(!this.exchangeRate.idExchangeRateType || this.exchangeRate.idExchangeRateType <= 0) {
      result = false;
    } 

    this.validations.push(this.getResultErrorValues(0, result, this.getTextTranslateKey('exchange_rate_type_required')));
  }

  private validateOiriginCurrency() {
    let result = true;
    let message = '';

    if(!this.exchangeRate.idOiriginCurrency || this.exchangeRate.idOiriginCurrency <= 0) {
      result = false;
      message = this.getTextTranslateKey('currency_of_required');
    }

    this.validations.push(this.getResultErrorValues(1, result, message));
  }

  private validateDestinationCurrency() {
    let result = true;
    let message = '';

    if(!this.exchangeRate.idDestinationCurrency || this.exchangeRate.idDestinationCurrency <= 0) {
      result = false;
      message = this.getTextTranslateKey('currency_to_required');
    } else {
      if(this.exchangeRate.idOiriginCurrency === this.exchangeRate.idDestinationCurrency) {
        result = false;
        message = this.getTextTranslateKey('currency_to_must_be_different');
      }
    }

    this.validations.push(this.getResultErrorValues(2, result, message));
  }

  private validateConversionFactor() {
    if(!this.exchangeRate.conversionFactor || this.exchangeRate.conversionFactor <= 0) {
      this.validations.push(this.getResultErrorValues(3, false, this.getTextTranslateKey('conversion_factor_required')));
    }
  }
  
  private getCurrencies() {
    this.loadingService.startLoading();
    const filters = new CoinFilter();
    
    this.currencyService.getCoinsList(filters).toPromise()
    .then(data => this.currencies = data)
    .then(() => this.loadingService.stopLoading())
    .then(() => this.exchangeRate.idOiriginCurrency = undefined)
    .then(() => this.exchangeRate.idDestinationCurrency = undefined)
    .catch(error => this.handleError(error));
  }

  private getExchangeRateTypes() {
    this.loadingService.startLoading();
    const filters = new ExchangeRateTypeFilter();

    this.exchangeRateTypeService.getExchangeRateTypebyFilter(filters).toPromise()
    .then(data => this.exchangeRateTypes = data)
    .then(() => this.exchangeRate.idExchangeRateType = undefined)
    .then(() => this.loadingService.stopLoading())
    .catch(error => this.handleError(error));
  }

  private handleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.dialogService.errorMessage('error', error?.message ?? 'error_service');
  }
}
