import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { Coins } from 'src/app/models/masters/coin';
import { ExchangeRateType } from 'src/app/models/masters/exchange-rate-type';
import { ExchangeRates } from 'src/app/models/masters/exchange-rates';
import { CalculationBasis } from 'src/app/models/srm/common/calculation-basis';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { ExchangeRateTypeService } from 'src/app/modules/masters/exchange-rate-type/service/exchange-rate-type.service';
import { ExchangeRatesFilter } from 'src/app/modules/masters/exchange-rates/shared/filters/exchange-rates-filter';
import { ExchangeRatesService } from 'src/app/modules/masters/exchange-rates/shared/service/exchange-rates.service';

@Component({
  selector: 'app-reception-calculation-basis',
  templateUrl: './reception-calculation-basis.component.html',
  styleUrls: ['./reception-calculation-basis.component.scss']
})
export class ReceptionCalculationBasisComponent implements OnInit {

  @Input() calculationBasis: CalculationBasis;

  @Input() currenciesBase: Coins[] = [];
  @Input() legalCurrencyId: number = 0;
  @Input() conversionCurrencyId: number = 0;

  ratePaymentTypes: ExchangeRateType[] = [];
  exchangeRatesSystem: ExchangeRates[] = [];
  
  constructor(private readonly exchangeRateTypeService: ExchangeRateTypeService,
    private readonly exchangeRatesService: ExchangeRatesService,
    private readonly dialogService: DialogsService) { }

  ngOnInit(): void {
    this.loadExchangeRateType();
    this.loadRateValuesSystem();
  }

  save() {
    
  }

  private loadExchangeRateType() {
    this.exchangeRateTypeService.getExchangeRateTypebyFilter().toPromise()
    .then(data => this.ratePaymentTypes = data)
    .catch(error => this.handleError(error));
    
  }

  private loadRateValuesSystem() {
    var filter = new ExchangeRatesFilter();
    filter.idOriginCurrency = this.conversionCurrencyId;
    filter.idDestinationCurrency = this.legalCurrencyId;
    filter.idExchangeRateType = 1;//sistema

    this.exchangeRatesService.getExchangeRatesbyFilter().toPromise()
    .then(data => this.loadRateValuesSystemSuccessed(data))
    .catch(error => this.handleError(error));
  }

  private loadRateValuesSystemSuccessed(data: ExchangeRates[]) {
    this.exchangeRatesSystem = data;

    this.calculationBasis.rateValue = data[0].conversionFactor;
  }

  private handleError(error: HttpErrorResponse) {
    this.dialogService.errorMessage('error', error?.error?.message ?? 'error_service');
  }
}
