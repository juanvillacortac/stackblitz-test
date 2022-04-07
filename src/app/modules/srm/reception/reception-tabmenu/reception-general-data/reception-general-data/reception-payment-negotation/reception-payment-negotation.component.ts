import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Coins } from 'src/app/models/masters/coin';
import { Cointype } from 'src/app/models/masters/coinType';
import { DiscountRate } from 'src/app/models/masters/discountRate';
import { ExchangeRateType } from 'src/app/models/masters/exchange-rate-type';
import { ExchangeRates } from 'src/app/models/masters/exchange-rates';
import { ExchangeRatesSupplier } from 'src/app/models/masters/exchange-rates-suppliers';
import { PaymentCondition } from 'src/app/models/masters/payment-condition';
import { PaymentMethodResult } from 'src/app/models/masters/payment-method';
import { PaymentMethodFilters } from 'src/app/models/masters/payment-method-filters';
import { PaymentNegotiation } from 'src/app/models/srm/common/payment-negotiation';
import { TypeNegotiation } from 'src/app/models/srm/common/type-negotiation';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CoinFilter } from 'src/app/modules/masters/coin/shared/filters/CoinFilter';
import { CoinTypeFilter } from 'src/app/modules/masters/coin/shared/filters/CoinTypeFilter';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { DiscountRateService } from 'src/app/modules/masters/discountrate/shared/discountrate.service';
import { ExchangeRateTypeService } from 'src/app/modules/masters/exchange-rate-type/service/exchange-rate-type.service';
import { ExchangeRatesSupplierFilter } from 'src/app/modules/masters/exchange-rates-suppliers/filter/exchange-rates-supplier-filter';
import { ExchangeRatesFilter } from 'src/app/modules/masters/exchange-rates/shared/filters/exchange-rates-filter';
import { ExchangeRatesService } from 'src/app/modules/masters/exchange-rates/shared/service/exchange-rates.service';
import { PaymentconditionService } from 'src/app/modules/masters/payment-conditions/shared/paymentcondition.service';
import { PaymentMethodService } from 'src/app/modules/masters/payment-method/shared/services/payment-method.service';
import { PaymentConditionFilter } from 'src/app/modules/masters/shared/filters/payment-condition-filter';
import { TypeNegotiationFilter } from 'src/app/modules/srm/shared/filters/common/type-negotiation-filter';
import { CommonsrmService } from 'src/app/modules/srm/shared/services/common/commonsrm.service';

@Component({
  selector: 'app-reception-payment-negotation',
  templateUrl: './reception-payment-negotation.component.html',
  styleUrls: ['./reception-payment-negotation.component.scss']
})
export class ReceptionPaymentNegotationComponent implements OnInit {

  @Input() paymentNegotiation: PaymentNegotiation;
  @Input() legalCurrencyId: number = 0;
  @Input() submitted: boolean;

  rateSupplierVisible = false;
  ratesupplierFilters: ExchangeRatesSupplierFilter = new ExchangeRatesSupplierFilter();

  paymentTerms: PaymentCondition[] = [];
  negotiationTypes: TypeNegotiation[] = [];
  currencyTypes: Cointype[] = [];
  negotationCurrencies: Coins[] = [];
  paymentMethods: PaymentMethodResult[] = [];
  rateValues: ExchangeRates[] = [];
  ratePaymentTypes: ExchangeRateType[] = [];
  typeDiscountList: SelectItem[] = [];
  constructor(private readonly paymentConditionService: PaymentconditionService,
    private readonly dialogService: DialogsService,
    private readonly currencyService: CoinsService,
    private readonly paymentMethodService: PaymentMethodService,
    private readonly exchangeRatesService: ExchangeRatesService,
    private readonly exchangeRateTypeService: ExchangeRateTypeService,
    private readonly commonSRMService: CommonsrmService,
    private _discountType: DiscountRateService,
    private _httpClient: HttpClient) { }
    _Authservice: AuthService = new AuthService(this._httpClient);

  ngOnInit(): void {
    this.loadPaymentTerms();
    this.loadNegotiationTypes();
    this.loadCurrencyTypes();
    this.loadExchangeRateType();
    this.getCurrenciesByCurrencyType(false);
    this.getPaymentMethod(false);
    this.getRateValues(false);
    this.GetTypeDiscount();
  }

  toggleRate(visible: boolean) {
    this.rateSupplierVisible = visible;
  }
  GetTypeDiscount() {
    var filter = new DiscountRate()
    filter.id = -1;
    this._discountType.getDiscountRateList(filter).subscribe((data: DiscountRate[]) => {
      this.typeDiscountList = data.map((item) => ({
        label: item.name,
        value: item.id
      }));
  })}

  showSupplierRateModal() {
    this.ratesupplierFilters.idCurrency = this.paymentNegotiation.paymentCurrencyId;
    this.rateSupplierVisible = true;
  }

  supplierRateChange(item: ExchangeRatesSupplier) {
    this.paymentNegotiation.paymentExchangeRate = item.exchangeRate;
  }
  
  getCurrenciesByCurrencyType(isedit:boolean) {
    const filters = new CoinFilter();
    filters.id = -1;
    filters.active = 1;
 
    filters.idtype = this.paymentNegotiation.currencyTypeId;

    if(isedit){
    this.paymentNegotiation.paymentCurrencyId = undefined;
    this.paymentNegotiation.paymentRateTypeId = undefined;
    this.paymentNegotiation.exchangeRateId = undefined;
    this.paymentNegotiation.exchangeRateValue = undefined;
    this.paymentNegotiation.paymentExchangeRate = undefined;}

    this.currencyService.getCoinsList({...filters})
    .subscribe((data) => {
      this.negotationCurrencies = data.sort((a, b) => a.name.localeCompare(b.name));
    }, (error) => {
      console.log(error);
    });
    //.then(data => this.negotationCurrencies = data)
    //.catch(error => this.handleError(error));

   
  }

  getPaymentMethod(isedit:boolean) {
    //reset values
    // this.paymentNegotiation.paymentRateTypeId = undefined;
    // this.paymentNegotiation.exchangeRateId = undefined;
    // this.paymentNegotiation.exchangeRateValue = undefined;
    // this.paymentNegotiation.paymentExchangeRate = undefined;

    if (this.paymentNegotiation.paymentCurrencyId > 0) {

      if(isedit){
        this.paymentNegotiation.paymentRateTypeId = undefined;
        this.paymentNegotiation.exchangeRateId = undefined;
        this.paymentNegotiation.exchangeRateValue = undefined;
        this.paymentNegotiation.paymentExchangeRate = undefined;}

      var filter = new PaymentMethodFilters();
      filter.id = -1;
      filter.active = 1;
      filter.currencyId = this.paymentNegotiation.paymentCurrencyId;
      this.paymentMethodService.getPaymentMethods(filter)
      .subscribe((data) => {
        this.paymentMethods = data.sort((a, b) => a.name.localeCompare(b.name));
      }, (error) => {
        console.log(error);
      });
      //.toPromise()
      ////.then(data => this.paymentMethods = data)
      //.catch(error => this.handleError(error));
    }
  }

  getRateValues(isedit:boolean) {
      //reset values
    if(isedit){
    this.paymentNegotiation.exchangeRateId = undefined;
    this.paymentNegotiation.exchangeRateValue = undefined;
    this.paymentNegotiation.paymentExchangeRate = undefined;}

    if(!this.paymentRateTypeIdIsCustom() && this.paymentNegotiation.paymentCurrencyId > 0 && this.paymentNegotiation.paymentRateTypeId > 0) {
      var filter = new ExchangeRatesFilter();
      filter.idOriginCurrency =this.paymentNegotiation.paymentCurrencyId ;
      filter.idDestinationCurrency = this.legalCurrencyId==0?1:this.legalCurrencyId;
      filter.idExchangeRateType = this.paymentNegotiation.paymentRateTypeId;
      this.exchangeRatesService.getExchangeRatesbyFilter(filter).toPromise()
      .then(data =>{ 
        let value :ExchangeRates[]=[]
        value.push(data[0]);
        this.rateValues = value})
      .catch(error => this.handleError(error));
    }
  }

  isPaymentCurrencySelected() {
    return this.paymentNegotiation?.paymentCurrencyId > 0;
  }

  paymentRateTypeIdIsCustom() {
    return this.paymentNegotiation?.paymentRateTypeId === 3;
  }

  save() {
    
  }

  getPaymentTermSelected() {
    if (this.paymentNegotiation.paymentConditionId > 0) {
      const paymentTerm = this.paymentTerms.find(x => x.idPaymentCondition === this.paymentNegotiation.paymentConditionId);
      this.paymentNegotiation.discount = paymentTerm.discount;
      this.paymentNegotiation.paymentDeadlinesDays = paymentTerm.amounterm;
      this.paymentNegotiation.idDiscountType = paymentTerm.idDiscountType;
      this.GetTypeDiscount();
    } else {
      this.paymentNegotiation.discount = undefined;
      this.paymentNegotiation.paymentDeadlinesDays = undefined;
    }
  }

  exchangeRateIsvalid() {
    return this.submitted ? this.paymentNegotiation.exchangeRateValue > 0 : true;
  }

  private loadPaymentTerms() {
     this.paymentConditionService.getPaymentconditionbyFilter({
       idPaymentCondition: -1,
       name: "",
       amounterm: -1,
       idDiscountType: -1,
       active: 1,
      }).toPromise()
     .then(data => this.paymentTerms = data )
     .catch(error => this.handleError(error));
  }


  private loadExchangeRateType() {
    this.exchangeRateTypeService.getExchangeRateTypebyFilter().toPromise()
    .then(data => this.ratePaymentTypes = data)
    .catch(error => this.handleError(error));
    
  }

  private loadNegotiationTypes() {
    var filters = new TypeNegotiationFilter();
    filters.id = -1;
    
    this.commonSRMService.gettypeNegotiation({...filters}).toPromise()
    .then(data => this.negotiationTypes = data)
    .catch(error => this.handleError(error));
  }

  private loadCurrencyTypes() {
    const filters = new CoinTypeFilter();
    filters.id = -1;
    this.currencyService.getCoinTypesList({...filters}).toPromise()
    .then(data => this.currencyTypes = data)
    .catch(error => this.handleError(error));
  }

  private handleError(error: HttpErrorResponse) {
    this.dialogService.errorMessage('error', error?.error?.message ?? 'error_service');
  }
}
