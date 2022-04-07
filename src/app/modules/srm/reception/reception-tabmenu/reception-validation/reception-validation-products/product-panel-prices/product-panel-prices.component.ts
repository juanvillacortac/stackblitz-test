import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Coins } from 'src/app/models/masters/coin';
import { ExchangeRates } from 'src/app/models/masters/exchange-rates';
import { Productdetailvalidation } from 'src/app/models/srm/reception/productdetailvalidation';
import { PurchaseValidation } from 'src/app/models/srm/reception/purchasevalidation';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { ExchangeRatesFilter } from 'src/app/modules/masters/exchange-rates/shared/filters/exchange-rates-filter';
import { ExchangeRatesService } from 'src/app/modules/masters/exchange-rates/shared/service/exchange-rates.service';
import { EnumPackingType } from 'src/app/modules/srm/shared/Utils/enum-packing-type';

@Component({
  selector: 'app-product-panel-prices',
  templateUrl: './product-panel-prices.component.html',
  styleUrls: ['./product-panel-prices.component.scss']
})
export class ProductPanelPricesComponent implements OnInit {
  isIndividual: boolean = true;
  exchangeRate: number = 0;
  indhardcurrency: boolean = false;
  coinsList: SelectItem[];
  basesymbolcoin: string = "";
  baseCoin: string = "";
  conversionCoin: string = "";
  conversionsymbolcoin: string = "";
  compare: string = " ";
  //statuspurchase: typeof StatusPurchase = StatusPurchase;
  activeIndexPrice: number = 0;
  iduserlogin: number = -1;

//Factores Individuales
@ViewChild("in1") in1: ElementRef;
@ViewChild("in2") in2: ElementRef;
@ViewChild("in3") in3: ElementRef;
//Valores Base Individuales
@ViewChild("in4") in4: ElementRef;
@ViewChild("in5") in5: ElementRef;
@ViewChild("in6") in6: ElementRef;
@ViewChild("in7") in7: ElementRef;
//Valores Conversion Individuales
@ViewChild("inC4") inC4: ElementRef;
@ViewChild("inC5") inC5: ElementRef;
@ViewChild("inC6") inC6: ElementRef;
@ViewChild("inC7") inC7: ElementRef;
//Factores Master
@ViewChild("ma1") ma1: ElementRef;
@ViewChild("ma2") ma2: ElementRef;
@ViewChild("ma3") ma3: ElementRef;
//Valores Base Master
@ViewChild("ma4") ma4: ElementRef;
@ViewChild("ma5") ma5: ElementRef;
@ViewChild("ma6") ma6: ElementRef;
@ViewChild("ma7") ma7: ElementRef;
//Valores Conversion Master
@ViewChild("maC4") maC4: ElementRef;
@ViewChild("maC5") maC5: ElementRef;
@ViewChild("maC6") maC6: ElementRef;
@ViewChild("maC7") maC7: ElementRef;

  @Input('showPrice') showPrice: boolean = false;
  @Input('showTabPrice') showTabPrice: boolean;
  @Input("_ProductDetail") _ProductDetail: Productdetailvalidation = new Productdetailvalidation();
  @Input("PucharseValidation") PucharseValidation: PurchaseValidation = new PurchaseValidation();
  @Input("isSave") isSave: boolean = true;
  @Output("isSaveChange") isSaveChange = new EventEmitter<boolean>();
  disabledCosts: boolean = false;
  disabledPrices: boolean = false;
  disabledNetCost: boolean = false;
  disabledNetSalesCost: boolean = false;
  disabledPVP: boolean = false;
  disabledSaleFactor: boolean = false;
  EnumPackingType: typeof EnumPackingType = EnumPackingType;

  applycostsales: boolean = false;
  apply: boolean = false;
  indtabtaxable: boolean = true;
  ischange: boolean = false;


  //#region calculo total 
  @Output("_RecalculateTotals") _RecalculateTotals = new EventEmitter<{ products: Productdetailvalidation }>();
  //#endregion
  constructor(private exchangeRatesService: ExchangeRatesService,
    private coinsService: CoinsService,
    private messageService: MessageService,
    private _httpClient: HttpClient,
    private _Authservice: AuthService) { }

  ngOnInit(): void {

    this.isIndividual = this.showPrice;//
    this.iduserlogin = this._Authservice.storeUser.id;
    this.searchCoinsxCompany();
    if(this._ProductDetail!=null){
        if(this._ProductDetail.individual.indAdded ==1 || this._ProductDetail.master.indAdded==1){
             this.RecalculateInit(this._ProductDetail);
             console.log("calculos");
        }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes._ProductDetail!=undefined)
         this.RecalculateInit(this._ProductDetail);
    // console.log(changes._ProductDetail.currentValue);
    // console.log("cambio");
    // console.log(this._ProductDetail);
    
}

  ShowIndividualOrMasterPrice(isIndividual: boolean, idPackagingType: number) {
    this.isIndividual = isIndividual;
    //this.iduserlogin = this._Authservice.storeUser.id;
    this.calculationOnChange(idPackagingType)
  }

  // Metodo para calcular costos al momento de hacer el cambio.
  calculationOnChange(idPackagingType: number) {

    if (idPackagingType == EnumPackingType.Master) {
    //   this._ProductDetail.master.baseCostNew = this._ProductDetail.individual.baseCostNew * this._ProductDetail.individual.unitsNumberPacking;
    //   this._ProductDetail.master.convertionCost = this._ProductDetail.individual.convertionCost * this._ProductDetail.individual.unitsNumberPacking;
    //   this._ProductDetail.master.netCost = this._ProductDetail.individual.netCost * this._ProductDetail.individual.unitsNumberPacking;
    //   this._ProductDetail.master.netCostConversion =  this._ProductDetail.individual.netCostConversion * this._ProductDetail.individual.unitsNumberPacking;
    //   this._ProductDetail.master.salesNetCost =  this._ProductDetail.individual.salesNetCost * this._ProductDetail.individual.unitsNumberPacking;
    //   this._ProductDetail.master.salesNetCostConvertion =  this._ProductDetail.individual.salesNetCostConvertion * this._ProductDetail.individual.unitsNumberPacking;
    //   //pvpBaseNew es PVPBase de la compra
    //   this._ProductDetail.master.pVPBase =  this._ProductDetail.individual.pVPBase * this._ProductDetail.master.unitsNumberPacking;
    //  // this._ProductDetail.master.pvpConversionNew =  this._ProductDetail.individual.pvpConversionNew * this._PurchaseOrderProduct.unitPerPackaging;

    //   this._ProductDetail.master.netFactor = this._ProductDetail.individual.netFactor;
    //   this._ProductDetail.master.salesFactorNew = this._ProductDetail.individual.salesFactorNew;
    //   this._ProductDetail.master.netSalesFactor = this._ProductDetail.individual.netSalesFactor;

    } else if (idPackagingType == EnumPackingType.Individual) {
      this._ProductDetail.individual.baseCost = this._ProductDetail.master.baseCost / this._ProductDetail.master.unitsNumber;
      this._ProductDetail.individual.convertionCost = this._ProductDetail.master.convertionCost /  this._ProductDetail.master.unitsNumber;
      this._ProductDetail.individual.netCost = this._ProductDetail.master.netCost /  this._ProductDetail.master.unitsNumber;
      this._ProductDetail.individual.netCostConversion = this._ProductDetail.master.netCostConversion /  this._ProductDetail.master.unitsNumber;
      this._ProductDetail.individual.salesNetCost = this._ProductDetail.master.salesNetCost /  this._ProductDetail.master.unitsNumber
      this._ProductDetail.individual.salesNetCostConvertion = this._ProductDetail.master.salesNetCostConvertion /  this._ProductDetail.master.unitsNumber
      //pvpBaseNew por pvpBase
      //this._ProductDetail.individual.pvpBaseNew = this._ProductDetail.master.pvpBaseNew /  this._ProductDetail.master.unitsNumberPacking;
      this._ProductDetail.individual.pvpBase = this._ProductDetail.master.pvpBase /  this._ProductDetail.master.unitsNumber;
      
      //pvpConversionNew por pvpConversion
      //this._ProductDetail.individual.pvpConversionNew = this._ProductDetail.master.pvpConversionNew /  this._ProductDetail.master.unitsNumberPacking;
      this._ProductDetail.individual.pvpConversion = this._ProductDetail.master.pvpConversion /  this._ProductDetail.master.unitsNumber;

      this._ProductDetail.individual.netFactor = this._ProductDetail.master.netFactor;
      this._ProductDetail.individual.netSalesFactor = this._ProductDetail.master.netSalesFactor;
      this._ProductDetail.individual.salesFactor= this._ProductDetail.individual.mediumFactor; // Aqui no entiendo
      //this._ProductDetail.individual.salesFactorNew = this._ProductDetail.individual.mediumFactor;

    }
  }

  searchCoinsxCompany() {
    var filter = new CoinxCompanyFilter();
    filter.idCompany = 1;
    this.coinsService.getCoinxCompanyList(filter).subscribe((data: Coins[]) => {
      this.coinsList = data.map((item) => ({
        label: item.name,
        value: item.id
      }));
      var baseC: number;
      var conversionC: number;
      data.forEach(coin => {
        if (coin.legalCurrency == true) {
          this.basesymbolcoin = coin.symbology;
          this.baseCoin = coin.name + " " + coin.symbology;
          baseC = coin.id;
        } else {
          this.conversionsymbolcoin = coin.symbology;
          this.conversionCoin = coin.name + " " + coin.symbology;
          conversionC = coin.id;
        }
      });
      this.searchExchangeRates(baseC, conversionC);
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando las monedas." });
    });
  }

  searchExchangeRates(base: number, conversion: number) {

    var filter = new ExchangeRatesFilter();
    filter.idOriginCurrency = conversion;
    filter.idDestinationCurrency = base;
    filter.idExchangeRateType = 1;
    this.exchangeRatesService.getExchangeRatesbyFilter(filter).subscribe((data: ExchangeRates[]) => {
      this.exchangeRate = data[0].conversionFactor;
      if (data[0].conversionFactor > 1) {
        this.indhardcurrency = true;
      }
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando la tasa de cambio" });
    });
  }

  clear(event) {
    if (event.target.value == "0,0000" || event.target.value == "0,00") {
      event.target.value = "";
    }
  }

  activate(event, value: string, type: number, indType: boolean, idPackagingType: number, product: any) {
    if (event != undefined)
      event.target.value = (type == 2 || type == 4 || type == 6) && event.target.value == "" ? "0,00" : event.target.value == "" ? "0,0000" : event.target.value;

    if (type == 1 || type == 3 || type == 5 || type == 7) {
      let val = "0,0000"
      var split = event != undefined ? event.target.value.split(",") : val.split(",");
      split[0] = split[0].replace(/[.]/gi, "");
      if (split[0].length > 18) {
        event.target.value = event != undefined ? "0,0000" : "0,0000";
        value = "0,0000"
        //this._ProductDetail.master.baseCostNew = type == 1 ? 0 : this._ProductDetail.master.baseCostNew;
        this._ProductDetail.master.baseCost = type == 1 ? 0 : this._ProductDetail.master.baseCost;
        this._ProductDetail.master.netCost = type == 3 ? 0 : this._ProductDetail.master.netCost;
        this._ProductDetail.master.salesNetCost = type == 5 ? 0 : this._ProductDetail.master.salesNetCost;
        this._ProductDetail.master.pvpBase = type == 7 ? 0 : this._ProductDetail.master.pvpBase;
        this._ProductDetail.master.convertionCost = type == 1 ? 0 : this._ProductDetail.master.convertionCost;
        this._ProductDetail.master.netCostConversion = type == 3 ? 0 : this._ProductDetail.master.netCostConversion;
        this._ProductDetail.master.salesNetCostConvertion = type == 5 ? 0 : this._ProductDetail.master.salesNetCostConvertion;
        //this._ProductDetail.master.pvpConversionNew = type == 7 ? 0 : this._ProductDetail.master.pvpConversionNew;

        //this._ProductDetail.individual.baseCostNew = type == 1 ? 0 : this._ProductDetail.master.baseCostNew;
        this._ProductDetail.individual.baseCost = type == 1 ? 0 : this._ProductDetail.master.baseCost;
        this._ProductDetail.individual.netCost = type == 3 ? 0 : this._ProductDetail.master.netCost;
        this._ProductDetail.individual.salesNetCost = type == 5 ? 0 : this._ProductDetail.master.salesNetCost;
        //this._ProductDetail.individual.pvpBaseNew = type == 7 ? 0 : this._ProductDetail.master.pvpBaseNew;
        this._ProductDetail.individual.convertionCost = type == 1 ? 0 : this._ProductDetail.master.convertionCost;
        this._ProductDetail.individual.netCostConversion = type == 3 ? 0 : this._ProductDetail.master.netCostConversion;
        this._ProductDetail.individual.salesNetCostConvertion = type == 5 ? 0 : this._ProductDetail.master.salesNetCostConvertion;
        //this._ProductDetail.individual.pvpConversionNew = type == 7 ? 0 : this._ProductDetail.master.pvpConversionNew;

      }
    }
    // if (product != undefined) {
    //   this._PurchaseOrderProduct = product;
    // }
    //var bc = this._ProductDetail.master.baseCostNew == null || this._ProductDetail.master.baseCostNew == undefined ? 0 : this._ProductDetail.master.baseCostNew;
    
    var bc = this._ProductDetail.master.baseCost == null || this._ProductDetail.master.baseCost == undefined ? 0 : this._ProductDetail.master.baseCost;
    this.disabledNetCost = this.disabledCosts == false ? bc == 0 ? true : false : true;
    var bnc = this._ProductDetail.master.netCost == null || this._ProductDetail.master.netCost == undefined ? 0 : this._ProductDetail.master.netCost;
    this.disabledNetSalesCost = this.disabledCosts == false ? bnc == 0 ? true : false : true;
    var bnsc = this._ProductDetail.master.salesNetCostConvertion == null || this._ProductDetail.master.salesNetCostConvertion == undefined ? 0 : this._ProductDetail.master.salesNetCostConvertion;
    this.disabledPVP = this.disabledPrices == false ? bnsc == 0 ? true : false : true;

    //this._ProductDetail.master.baseCostNew = this._ProductDetail.master.baseCostNew == null || this._ProductDetail.master.baseCostNew == undefined ? 0 : this._ProductDetail.master.baseCostNew;//agregado por sergio 21/0/201  prueba cuando limpio todo el  campo de precio y salgo
    this._ProductDetail.master.baseCost = this._ProductDetail.master.baseCost == null || this._ProductDetail.master.baseCost == undefined ? 0 : this._ProductDetail.master.baseCost;
    this._ProductDetail.master.netFactor = this._ProductDetail.master.netFactor == null || this._ProductDetail.master.netFactor.toString() == "" ? 0 : this._ProductDetail.master.netFactor;
    this._ProductDetail.master.salesFactor = this._ProductDetail.master.salesFactor == null || this._ProductDetail.master.salesFactor.toString() == "" ? 0 : this._ProductDetail.master.salesFactor;
    //Old Line  this._ProductDetail.master.salesFactorNew = this._ProductDetail.master.salesFactorNew == null || this._ProductDetail.master.salesFactorNew.toString() == "" ? 0 : this._ProductDetail.master.salesFactorNew;
    this._ProductDetail.master.netSalesFactor = this._ProductDetail.master.netSalesFactor == null || this._ProductDetail.master.netSalesFactor.toString() == "" ? 0 : this._ProductDetail.master.netSalesFactor;
    //this._ProductDetail.individual.salesNetCost = this._ProductDetail.individual.salesNetCost == null || this._ProductDetail.individual.salesNetCost.toString() =="" ? 0 : this._ProductDetail.individual.salesNetCost;

    //this._ProductDetail.individual.baseCostNew = this._ProductDetail.individual.baseCostNew == null || this._ProductDetail.individual.baseCostNew == undefined ? 0 : this._ProductDetail.individual.baseCostNew;//agregado por sergio 21/0/201  prueba cuando limpio todo el  campo de precio y salgo
    this._ProductDetail.individual.baseCost = this._ProductDetail.individual.baseCost == null || this._ProductDetail.individual.baseCost == undefined ? 0 : this._ProductDetail.individual.baseCost;
    this._ProductDetail.individual.netFactor = this._ProductDetail.individual.netFactor == null || this._ProductDetail.individual.netFactor.toString() == "" ? 0 : this._ProductDetail.individual.netFactor;
    this._ProductDetail.individual.salesFactor = this._ProductDetail.individual.salesFactor == null || this._ProductDetail.individual.salesFactor.toString() == "" ? 0 : this._ProductDetail.individual.salesFactor;
    this._ProductDetail.individual.netSalesFactor = this._ProductDetail.individual.netSalesFactor == null || this._ProductDetail.individual.netSalesFactor.toString() == "" ? 0 : this._ProductDetail.individual.netSalesFactor;
    // this._ProductDetail.individual.salesNetCost = this._ProductDetail.individual.salesNetCost == null || this._ProductDetail.individual.salesNetCost.toString() =="" ? 0 : this._ProductDetail.individual.salesNetCost;
    if (idPackagingType == EnumPackingType.Master) {
      this.isSave = false;
      this.calculationValueMaster(value, type, indType, this._ProductDetail.internalExchangeRate, idPackagingType);
      // this.resumeTotal =
      // {
      //   baseCostNew: this._ProductDetail.master.baseCostNew,
      //   baseCostOld: this._PurchaseOrderProductCopy.masterPrices.baseCostNew,
      //   baseDiference: this._ProductDetail.master.baseCostNew - this._PurchaseOrderProductCopy.masterPrices.baseCostNew,
      //   convertionCostNew: this._ProductDetail.master.convertionCost,
      //   convertionCostOld: this._PurchaseOrderProductCopy.masterPrices.convertionCost,
      //   convertionDiference: this._ProductDetail.master.convertionCost - this._PurchaseOrderProductCopy.masterPrices.convertionCost,
      //   netCostNew: this._ProductDetail.master.netCost,
      //   netCostConversionNew: this._ProductDetail.master.netCostConversion,
      //   netCostOld: this._PurchaseOrderProductCopy.masterPrices.netCost,
      //   netCostConversionOld: this._PurchaseOrderProductCopy.masterPrices.netCostConversion,
      //   netcostDiference: this._ProductDetail.master.netCost - this._PurchaseOrderProductCopy.masterPrices.netCost,
      //   netcostConversionDiference: this._ProductDetail.master.netCostConversion - this._PurchaseOrderProductCopy.masterPrices.netCostConversion,
      //   salesnetCostNew: this._ProductDetail.master.salesNetCost,
      //   salesnetCostOld: this._PurchaseOrderProductCopy.masterPrices.salesNetCost,
      //   pvpBaseNew: this._ProductDetail.master.pvpBaseNew,
      //   pvpConversionNew: this._ProductDetail.master.pvpConversionNew,
      //   pvpBaseOld: this._PurchaseOrderProductCopy.masterPrices.pvpBaseNew,
      //   pvpConversionOld: this._PurchaseOrderProductCopy.masterPrices.pvpConversionNew,
      //   packingNumber: this._ProductDetail.master.packingNumbers,
      //   indAdded: this._PurchaseOrderProductCopy.masterPrices.indAdded,
      //   taxableBase: this._ProductDetail.master.taxableBase - this._PurchaseOrderProductCopy.masterPrices.taxableBase,
      //   deductibleBase: this._ProductDetail.master.deductibleBase - this._PurchaseOrderProductCopy.masterPrices.deductibleBase,
      //   indApply:this.apply
      // }
      this.isSaveChange.emit(this.isSave);
    } else if (idPackagingType == EnumPackingType.Individual) {
      this.isSave = false;
      this.calculationValueIndividual(value, type, indType, this._ProductDetail.internalExchangeRate, idPackagingType);
      // if(product!=undefined)
      //     this._PurchaseOrderProductCopy= product;
      // this.resumeTotal =
      // {
      //   baseCostNew: this._ProductDetail.individual.baseCostNew,
      //  // baseCostOld: this._PurchaseOrderProductCopy.individualPrices.baseCostNew,
      //  // baseDiference: this._ProductDetail.individual.baseCostNew - this._PurchaseOrderProductCopy.individualPrices.baseCostNew,
      //   convertionCostNew: this._ProductDetail.individual.convertionCost,
      //   //convertionCostOld: this._PurchaseOrderProductCopy.individualPrices.convertionCost,
      //   //convertionDiference: this._ProductDetail.individual.convertionCost - this._PurchaseOrderProductCopy.individualPrices.convertionCost,
      //   netCostNew: this._ProductDetail.individual.netCost,
      //   netCostConversionNew: this._ProductDetail.individual.netCostConversion,
      //   //netCostOld: this._PurchaseOrderProductCopy.individualPrices.netCost,
      //   salesnetCostNew: this._ProductDetail.individual.salesNetCost,
      //   //salesnetCostOld: this._PurchaseOrderProductCopy.individualPrices.salesNetCost,
      //   //netCostConversionOld: this._PurchaseOrderProductCopy.individualPrices.netCostConversion,
      //   //netcostDiference: this._ProductDetail.individual.netCost - this._PurchaseOrderProductCopy.individualPrices.netCost,
      //   ///netcostConversionDiference: this._ProductDetail.individual.netCostConversion - this._PurchaseOrderProductCopy.individualPrices.netCostConversion,
      //   //pvpBaseNew: this._ProductDetail.individual.pvpBaseNew,
      //   //pvpConversionNew: this._ProductDetail.individual.pvpConversionNew,
      //   //pvpBaseOld: this._PurchaseOrderProductCopy.individualPrices.pvpBaseNew,
      //   //pvpConversionOld: this._PurchaseOrderProductCopy.individualPrices.pvpConversionNew,
      //   packingNumber: this._ProductDetail.individual.packingNumbers,
      //   //indAdded: this._PurchaseOrderProductCopy.individualPrices.indAdded,
      //   //taxableBase: this._ProductDetail.individual.taxableBase - this._PurchaseOrderProductCopy.individualPrices.taxableBase,
      //   //deductibleBase: this._ProductDetail.individual.deductibleBase - this._PurchaseOrderProductCopy.individualPrices.deductibleBase,
      //   //indApply:this.apply

      // }
      this.isSaveChange.emit(this.isSave);
    }
    /// valores fijos  imponibles//
    //  this._ProductDetail.individual.netcostfijo= this._ProductDetail.individual.netCost;
    //  this._ProductDetail.individual.salesnetcostfijo =  this._ProductDetail.individual.salesNetCost;

    //   //valores fijos imponbles//
    //   this._ProductDetail.master.netcostfijo= this._ProductDetail.master.netCost;
    //   this._ProductDetail.master.salesnetcostfijo = this._ProductDetail.master.salesNetCost;
    //////////////////////////////
    // if (product != undefined)
    //    this.products = product
    // else 
    //    this.products= undefined
          
    this._RecalculateTotals.emit({
       products: this._ProductDetail
    }); 
    
    // if (this._PurchaseOrderProduct.taxables.length > 0 || this._PurchaseOrderProduct.deductibles.length > 0) {

    //   ///actualiza el nuevo monto de imponibles 
    //   if (this.indtabtaxable) {
    //     this.SetModels();
    //     this._sendTaxablescost.emit({
    //       TaxableListSave: this.TaxableListCost,
    //       indtabtaxable: this.indtabtaxable
    //     });
    //   }
    }

    //this.iscost=true;

    ValidateFactor(event, value: string, type: number, indType: boolean, idPackagingType: number) {
      value = value == "" ? "0" : value;
      this.compare = value.toString();
      if (this.compare.indexOf(".") != -1)
        value = value.replace(/[.]/gi, "");
      if (this.compare.indexOf(",") != -1)
        value = value.replace(",", ".");
      //var valueNumber = parseFloat(event.target.value);
      var valueNumber = parseFloat(value);
      if (idPackagingType === EnumPackingType.Individual) {
        if (this._ProductDetail.individual.minimunFactor <= 0 ||
          this._ProductDetail.individual.mediumFactor <= 0 ||
          this._ProductDetail.individual.maximunFactor <= 0) {
          this._ProductDetail.individual.salesFactor = 0;
          event.target.value = "0,00"
          this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "No puede colocar factor de venta porque no tiene factores de validación configurados." });
        } else if (valueNumber < this._ProductDetail.individual.minimunFactor) {
          event.target.value = parseFloat(String(this._ProductDetail.individual.mediumFactor)).toFixed(2).replace(".", ",");
          this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "El factor de venta no puede ser menor que el mínimo configurado" });
        } else if (valueNumber > this._ProductDetail.individual.maximunFactor) {
          event.target.value = parseFloat(String(this._ProductDetail.individual.mediumFactor)).toFixed(2).replace(".", ",");
          this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "El factor de venta no puede ser mayor que el máximo configurado" });
        } else {
          this.activate(event, event.target.value.toString(), type, indType, idPackagingType, undefined)
        }
      } else {
        if (this._ProductDetail.master.minimunFactor <= 0 ||
          this._ProductDetail.master.mediumFactor <= 0 ||
          this._ProductDetail.master.maximunFactor <= 0) {
          this._ProductDetail.master.salesFactor = 0;
          event.target.value = "0,00"
          this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "No puede colocar factor de venta porque no tiene factores de validación configurados." });
        } else if (valueNumber < this._ProductDetail.master.minimunFactor) {
          event.target.value = parseFloat(String(this._ProductDetail.master.mediumFactor)).toFixed(2).replace(".", ",");
          this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "El factor de venta no puede ser menor que el minimo configurado" });
        } else if (valueNumber > this._ProductDetail.master.maximunFactor) {
          event.target.value = parseFloat(String(this._ProductDetail.master.mediumFactor)).toFixed(2).replace(".", ",");
          this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "El factor de venta no puede ser mayor que el máximo configurado" });
        } else {
          this.activate(event, event.target.value.toString(), type, indType, idPackagingType, undefined)
        }
      }
    }
  
    ValidateFactorFromPVP(OldValue: string, value: string, type: number, indType: boolean, idPackagingType: number) {
      value = value == "" ? "0" : value;
      this.compare = value.toString();
      if (this.compare.indexOf(".") != -1)
        value = value.replace(/[.]/gi, "");
      if (this.compare.indexOf(",") != -1)
        value = value.replace(",", ".");
      var valueNumber = parseFloat(value);
      if (idPackagingType === EnumPackingType.Individual) {
        if (this._ProductDetail.individual.minimunFactor <= 0 ||
          this._ProductDetail.individual.mediumFactor <= 0 ||
          this._ProductDetail.individual.maximunFactor <= 0) {
          this._ProductDetail.individual.salesFactor = 0.00;
          ///this._ProductDetail.individual.pvpConversionNew = parseFloat(this._ProductDetail.individual.salesNetCostConvertion.toString() * parseFloat(value);
          this._ProductDetail.individual.pvpBase = parseFloat(this._ProductDetail.individual.salesNetCost.toString()) * parseFloat(value);
          this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "No puede colocar factor de venta porque no tiene factores de validación configurados." });
        } else if (valueNumber < this._ProductDetail.individual.minimunFactor) {
  
          this._ProductDetail.individual.salesFactor = this._ProductDetail.individual.mediumFactor;
          this._ProductDetail.individual.pvpConversion = this._ProductDetail.individual.salesNetCostConvertion * this._ProductDetail.individual.salesFactor;
          this._ProductDetail.individual.pvpBase = this._ProductDetail.individual.salesNetCost * this._ProductDetail.individual.salesFactor;
          this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "El factor de venta no puede ser menor que el mínimo configurado" });
        } else if (valueNumber > this._ProductDetail.individual.maximunFactor) {
          this._ProductDetail.individual.salesFactor = this._ProductDetail.individual.mediumFactor;
          this._ProductDetail.individual.pvpConversion = this._ProductDetail.individual.salesNetCostConvertion * this._ProductDetail.individual.salesFactor;
          this._ProductDetail.individual.pvpBase = this._ProductDetail.individual.salesNetCost * this._ProductDetail.individual.salesFactor;
          this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "El factor de venta no puede ser mayor que el máximo configurado" });
        } else {
          //this.activate(event,event.target.value.toString(),type,indType,idPackagingType)
        }
      } else {
        if (this._ProductDetail.master.minimunFactor <= 0 ||
          this._ProductDetail.master.mediumFactor <= 0 ||
          this._ProductDetail.master.maximunFactor <= 0) {
          this._ProductDetail.master.salesFactor = 0.00;
          this._ProductDetail.master.pvpConversion = parseFloat(this._ProductDetail.individual.salesNetCostConvertion.toString()) * parseFloat(value);
          this._ProductDetail.master.pvpBase = parseFloat(this._ProductDetail.individual.salesNetCost.toString()) * parseFloat(value);
          this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "No puede colocar factor de venta porque no tiene factores de validación configurados." });
        } else if (valueNumber < this._ProductDetail.master.minimunFactor) {
          this._ProductDetail.master.salesFactor = this._ProductDetail.master.mediumFactor;
          this._ProductDetail.master.pvpConversion = this._ProductDetail.master.salesNetCostConvertion * this._ProductDetail.master.salesFactor;
          this._ProductDetail.master.pvpBase = this._ProductDetail.master.salesNetCost * this._ProductDetail.master.salesFactor;
          this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "El factor de venta no puede ser menor que el minimo configurado" });
        } else if (valueNumber > this._ProductDetail.master.maximunFactor) {
          this._ProductDetail.master.salesFactor = this._ProductDetail.master.mediumFactor;
          this._ProductDetail.master.pvpConversion = parseFloat(this._ProductDetail.master.salesNetCostConvertion.toString()) * this._ProductDetail.master.salesFactor;
          this._ProductDetail.master.pvpBase = parseFloat(this._ProductDetail.master.salesNetCost.toString()) * this._ProductDetail.master.salesFactor;
          this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "El factor de venta no puede ser mayor que el máximo configurado" });
        } else {
          // this.activate(event,event.target.value.toString(),type,indType,idPackagingType)
        }
      }
    }
  
  
  
    clearPrices(idPackagingType: number) {
      if (idPackagingType == EnumPackingType.Master) {
        this._ProductDetail.master.baseCostNew = 0.00;
        this._ProductDetail.master.convertionCost = 0.00;
        this._ProductDetail.master.netCost = 0.00;
        this._ProductDetail.master.netCostConversion = 0.00;
        this._ProductDetail.master.salesNetCost = 0.00;
        this._ProductDetail.master.salesNetCostConvertion = 0.00;
        this._ProductDetail.master.pvpBase = 0.00;
        this._ProductDetail.master.pvpConversion = 0.00
        this._ProductDetail.master.salesFactor = this._ProductDetail.master.mediumFactor;
      } else if (idPackagingType == EnumPackingType.Individual) {
        this._ProductDetail.individual.baseCost = 0.00;
        this._ProductDetail.individual.convertionCost = 0.00;
        this._ProductDetail.individual.netCost = 0.00;
        this._ProductDetail.individual.netCostConversion = 0.00;
        this._ProductDetail.individual.salesNetCost = 0.00;
        this._ProductDetail.individual.salesNetCostConvertion = 0.00;
        this._ProductDetail.individual.pvpBase = 0.00;
        this._ProductDetail.individual.pvpConversion = 0.00;
        this._ProductDetail.individual.salesFactor= this._ProductDetail.individual.mediumFactor;
      }
    }

    Cost(value: string, indType: boolean, exchangeRate: number, idPackagingType: number) {
      if (idPackagingType == EnumPackingType.Master) {
        if (indType == true) {
          // this._ProductDetail.master.baseCostNew = parseFloat(value) * parseFloat(exchangeRate.toString());
          this._ProductDetail.master.baseCost = parseFloat(value) * parseFloat(exchangeRate.toString());
        } else {
          this._ProductDetail.master.convertionCost = parseFloat(value) / parseFloat(exchangeRate.toString());
        }
      } else if (idPackagingType == EnumPackingType.Individual) {
        if (indType == true) {
          this._ProductDetail.individual.baseCost= parseFloat(value) * parseFloat(exchangeRate.toString());
          // this._ProductDetail.individual.baseCostNew = parseFloat(value) * parseFloat(exchangeRate.toString());
        } else {
          this._ProductDetail.individual.convertionCost = parseFloat(value) / parseFloat(exchangeRate.toString());
        }
      }
    }
  
    NetCost(value: string, indType: boolean, exchangeRate: number, idPackagingType: number) {
      if (idPackagingType == EnumPackingType.Master) {
        if (indType == true) {
          this._ProductDetail.master.netCost = parseFloat(value) * parseFloat(exchangeRate.toString());
          // this._ProductDetail.master.netcostfijo=this._ProductDetail.master.netCost;
        } else {
          this._ProductDetail.master.netCostConversion = parseFloat(value) / parseFloat(exchangeRate.toString());
        }
      } else if (idPackagingType == EnumPackingType.Individual) {
        if (indType == true) {
          this._ProductDetail.individual.netCost = parseFloat(value) * parseFloat(exchangeRate.toString());
        } else {
          this._ProductDetail.individual.netCostConversion = parseFloat(value) / parseFloat(exchangeRate.toString());
        }
      }
  
    }
  
    NetSellingCost(value: string, indType: boolean, exchangeRateNetSaleCost: number, idPackagingType: number) {
      if (idPackagingType == EnumPackingType.Master) {
        if (indType == true) {
          this._ProductDetail.master.salesNetCost = parseFloat(value) * parseFloat(exchangeRateNetSaleCost.toString());
          this._ProductDetail.master.salesNetCostConvertion = parseFloat(value)
        } else {
          this._ProductDetail.master.salesNetCostConvertion = parseFloat(value) / parseFloat(exchangeRateNetSaleCost.toString());
          this._ProductDetail.master.salesNetCost = parseFloat(value);
        }
      } else if (idPackagingType == EnumPackingType.Individual) {
        if (indType == true) {
          this._ProductDetail.individual.salesNetCost = parseFloat(value) * parseFloat(exchangeRateNetSaleCost.toString());
          this._ProductDetail.individual.salesNetCostConvertion = parseFloat(value)
        } else {
          this._ProductDetail.individual.salesNetCostConvertion = parseFloat(value) / parseFloat(exchangeRateNetSaleCost.toString());
          this._ProductDetail.individual.salesNetCost = parseFloat(value);
        }
  
      }
    }
  
    PVP(value: string, indType: boolean, idPackagingType: number, exchangeRate: number) {
      if (idPackagingType == EnumPackingType.Master) {
        if (indType == true) {
          this._ProductDetail.master.pvpBase= parseFloat(value) * parseFloat(exchangeRate.toString());
          // this._ProductDetail.master.pvpBaseNew = parseFloat(value) * parseFloat(exchangeRate.toString());
        } else {
          this._ProductDetail.master.pvpConversion = parseFloat(value) / parseFloat(exchangeRate.toString());
          // this._ProductDetail.master.pvpConversionNew = parseFloat(value) / parseFloat(exchangeRate.toString());
        }
      } else if (idPackagingType == EnumPackingType.Individual) {
        if (indType == true) {
          // this._ProductDetail.individual.pvpBaseNew = parseFloat(value) * parseFloat(exchangeRate.toString());
           this._ProductDetail.individual.pvpBase = parseFloat(value) * parseFloat(exchangeRate.toString());
        } else {
          this._ProductDetail.individual.pvpConversion = parseFloat(value) / parseFloat(exchangeRate.toString());
          // this._ProductDetail.individual.pvpConversionNew = parseFloat(value) / parseFloat(exchangeRate.toString());
        }
      }
    }
  
// Metodo para calcular costos en el INDIVIDUAL
calculationValueIndividual(value: string, type: number, indType: boolean, exchangeRate: number, idPackagingType: number) {
  value = value == "" ? "0" : value.toString(); //Modif kate
  this.compare = value.toString();
  // if (this.compare.indexOf(".") != -1)
  //   value = value.replace(/[.]/gi, ""); //Esto para que es?

  if (this.compare.indexOf(",") != -1)
    value = value.replace(",", ".");

  if (type == 1) {
    this.Cost(value, indType, this._ProductDetail.supplierExchangeRate, idPackagingType);
    if (indType) {
      this._ProductDetail.individual.netCostConversion = parseFloat(value.toString()) * parseFloat(this._ProductDetail.individual.netFactor.toString());
      this._ProductDetail.individual.netCost = parseFloat(this._ProductDetail.individual.baseCost.toString()) * parseFloat(this._ProductDetail.individual.netFactor.toString());
    } else {
      this._ProductDetail.individual.netCostConversion = parseFloat(this._ProductDetail.individual.convertionCost.toString()) * parseFloat(this._ProductDetail.individual.netFactor.toString());
      this._ProductDetail.individual.netCost = parseFloat(value.toString()) * parseFloat(this._ProductDetail.individual.netFactor.toString());

    }
  }
  if (type == 2) {
    this._ProductDetail.individual.netCostConversion = parseFloat(this._ProductDetail.individual.convertionCost.toString()) * parseFloat(value);
    this._ProductDetail.individual.netCost = parseFloat(this._ProductDetail.individual.baseCost.toString()) * parseFloat(value);
  }
  if (type == 3) {

    this.NetCost(value, indType, this._ProductDetail.supplierExchangeRate, idPackagingType);
    if (indType) {
      this._ProductDetail.individual.netFactor = parseFloat(value) / parseFloat(this._ProductDetail.individual.convertionCost.toString());
      this._ProductDetail.individual.salesNetCostConvertion = parseFloat(value) * parseFloat(this._ProductDetail.individual.netSalesFactor.toString());
      this._ProductDetail.individual.salesNetCost = parseFloat(this._ProductDetail.individual.netCost.toString()) * parseFloat(this._ProductDetail.individual.netSalesFactor.toString());
      this.NetSellingCost(indType ? this._ProductDetail.individual.salesNetCostConvertion.toString() : this._ProductDetail.individual.salesNetCost.toString(), indType, exchangeRate, idPackagingType);
    } else {
      if (this._ProductDetail.individual.baseCost == 0)// this._ProductDetail.individual.baseCostNew condicion agregada por sergio  cuando el costo base este en 0
        this._ProductDetail.individual.netFactor = 1
      else
        this._ProductDetail.individual.netFactor = parseFloat(value) / parseFloat(this._ProductDetail.individual.baseCost.toString());

      this._ProductDetail.individual.salesNetCostConvertion = parseFloat(this._ProductDetail.individual.netCostConversion.toString()) * parseFloat(this._ProductDetail.individual.netSalesFactor.toString());
      this._ProductDetail.individual.salesNetCost = parseFloat(value) * parseFloat(this._ProductDetail.individual.netSalesFactor.toString());
      this.NetSellingCost(indType ? this._ProductDetail.individual.salesNetCostConvertion.toString() : this._ProductDetail.individual.salesNetCost.toString(), indType, exchangeRate, idPackagingType);
    }
  }
  if (type < 3) {
    this._ProductDetail.individual.salesNetCostConvertion = parseFloat(this._ProductDetail.individual.netCostConversion.toString()) * parseFloat(this._ProductDetail.individual.netSalesFactor.toString());
    this._ProductDetail.individual.salesNetCost = parseFloat(this._ProductDetail.individual.netCost.toString()) * parseFloat(this._ProductDetail.individual.netSalesFactor.toString());
    this.NetSellingCost(indType ? this._ProductDetail.individual.salesNetCostConvertion.toString() : this._ProductDetail.individual.salesNetCost.toString(), indType, exchangeRate, idPackagingType);
  }
  if (type == 4) {
    this._ProductDetail.individual.salesNetCostConvertion = parseFloat(this._ProductDetail.individual.netCostConversion.toString()) * parseFloat(value);
    this._ProductDetail.individual.salesNetCost = parseFloat(this._ProductDetail.individual.netCost.toString()) * parseFloat(value);
  }
  if (type == 5) {
    this.NetSellingCost(value, indType, exchangeRate, idPackagingType);
    if (indType) {
      this._ProductDetail.individual.netSalesFactor = parseFloat(value) / parseFloat(this._ProductDetail.individual.netCostConversion.toString());
      this._ProductDetail.individual.convertionCost = parseFloat(value) * parseFloat(this._ProductDetail.individual.salesFactor.toString());
     // this._ProductDetail.individual.pvpBaseNew = parseFloat(this._ProductDetail.individual.salesNetCost.toString()) * parseFloat(this._ProductDetail.individual.salesFactorNew.toString());
     this._ProductDetail.individual.pvpBase = parseFloat(this._ProductDetail.individual.salesNetCost.toString()) * parseFloat(this._ProductDetail.individual.salesFactor.toString());
    } else {
      this._ProductDetail.individual.netSalesFactor = parseFloat(value) / parseFloat(this._ProductDetail.individual.netCost.toString());
      // this._ProductDetail.individual.pvpConversionNew = parseFloat(this._ProductDetail.individual.salesNetCostConvertion.toString()) * parseFloat(this._ProductDetail.individual.salesFactorNew.toString());
      // this._ProductDetail.individual.pvpBaseNew = parseFloat(value) * parseFloat(this._ProductDetail.individual.salesFactorNew.toString());
      this._ProductDetail.individual.pvpConversion = parseFloat(this._ProductDetail.individual.salesNetCostConvertion.toString()) * parseFloat(this._ProductDetail.individual.salesFactor.toString());
      this._ProductDetail.individual.pvpBase = parseFloat(value) * parseFloat(this._ProductDetail.individual.salesFactor.toString());
    }
  }
  if (type < 5) {
    // this._ProductDetail.individual.pvpConversionNew = parseFloat(this._ProductDetail.individual.salesNetCostConvertion.toString()) * parseFloat(this._ProductDetail.individual.salesFactorNew.toString());
    // this._ProductDetail.individual.pvpBaseNew = parseFloat(this._ProductDetail.individual.salesNetCost.toString()) * parseFloat(this._ProductDetail.individual.salesFactorNew.toString());
    // this.PVP(indType ? this._ProductDetail.individual.pvpConversionNew.toString() : this._ProductDetail.individual.pvpBaseNew.toString(), indType, idPackagingType, exchangeRate);
    this._ProductDetail.individual.pvpConversion = parseFloat(this._ProductDetail.individual.salesNetCostConvertion.toString()) * parseFloat(this._ProductDetail.individual.salesFactor.toString());
    this._ProductDetail.individual.pvpBase = parseFloat(this._ProductDetail.individual.salesNetCost.toString()) * parseFloat(this._ProductDetail.individual.salesFactor.toString());
    this.PVP(indType ? this._ProductDetail.individual.pvpConversion.toString() : this._ProductDetail.individual.pvpBase.toString(), indType, idPackagingType, exchangeRate);
  }
  if (type == 6) {
   // this._ProductDetail.individual.pvpConversionNew = parseFloat(this._ProductDetail.individual.salesNetCostConvertion.toString()) * parseFloat(value);
   // this._ProductDetail.individual.pvpBaseNew = parseFloat(this._ProductDetail.individual.salesNetCost.toString()) * parseFloat(value);
    this._ProductDetail.individual.pvpConversion = parseFloat(this._ProductDetail.individual.salesNetCostConvertion.toString()) * parseFloat(value);
    this._ProductDetail.individual.pvpBase = parseFloat(this._ProductDetail.individual.salesNetCost.toString()) * parseFloat(value);
  }
  if (type == 7) {
    this.PVP(value, indType, idPackagingType, exchangeRate);
    if (indType) {
      // this._ProductDetail.individual.salesFactorNew = parseFloat(value) / parseFloat(this._ProductDetail.individual.salesNetCostConvertion.toString());
      // this.ValidateFactorFromPVP(value, this._ProductDetail.individual.salesFactorNew.toLocaleString(), 6, indType, idPackagingType)
      this._ProductDetail.individual.salesFactor = parseFloat(value) / parseFloat(this._ProductDetail.individual.salesNetCostConvertion.toString());
      this.ValidateFactorFromPVP(value, this._ProductDetail.individual.salesFactor.toLocaleString(), 6, indType, idPackagingType)
    } else {
      // this._ProductDetail.individual.salesFactorNew = parseFloat(value) / parseFloat(this._ProductDetail.individual.salesNetCost.toString());
      // this.ValidateFactorFromPVP(value, this._ProductDetail.individual.salesFactorNew.toLocaleString(), 6, indType, idPackagingType)
      this._ProductDetail.individual.salesFactor = parseFloat(value) / parseFloat(this._ProductDetail.individual.salesNetCost.toString());
      this.ValidateFactorFromPVP(value, this._ProductDetail.individual.salesFactor.toLocaleString(), 6, indType, idPackagingType)
    }
  }
}

// Metodo para calcular costos en el MASTER
calculationValueMaster(value: string, type: number, indType: boolean, exchangeRate: number, idPackagingType: number) {
  value = value == "" ? "0" : value;
  this.compare = value.toString();
  //PREGUNTAR A SERGIO.
  // if (this.compare.indexOf(".") != -1)
  //   value = value.replace(/[.]/gi, "");

  if (this.compare.indexOf(",") != -1)
    value = value.replace(",", ".");
  if (type == 1) {
    this.Cost(value, indType, this._ProductDetail.supplierExchangeRate, idPackagingType);
    if (indType) {
      this._ProductDetail.master.netCostConversion = parseFloat(value.toString()) * parseFloat(this._ProductDetail.master.netFactor.toString());
      this._ProductDetail.master.netCost = parseFloat(this._ProductDetail.master.baseCost.toString()) * parseFloat(this._ProductDetail.master.netFactor.toString());

    } else {
      this._ProductDetail.master.netCostConversion = parseFloat(this._ProductDetail.master.convertionCost.toString()) * parseFloat(this._ProductDetail.master.netFactor.toString());
      this._ProductDetail.master.netCost = parseFloat(value.toString()) * parseFloat(this._ProductDetail.master.netFactor.toString());
    }
  }
  if (type == 2) {
    this._ProductDetail.master.netCostConversion = parseFloat(this._ProductDetail.master.convertionCost.toString()) * parseFloat(value);
    this._ProductDetail.master.netCost = parseFloat(this._ProductDetail.master.baseCost.toString()) * parseFloat(value);
  }
  if (type == 3) {
    this.NetCost(value, indType, this._ProductDetail.supplierExchangeRate, idPackagingType);
    if (indType) {
      this._ProductDetail.master.netFactor = parseFloat(value) / parseFloat(this._ProductDetail.master.convertionCost.toString());
      this._ProductDetail.master.salesNetCostConvertion = parseFloat(value) * parseFloat(this._ProductDetail.master.netSalesFactor.toString());
      this._ProductDetail.master.salesNetCost = parseFloat(this._ProductDetail.master.netCost.toString()) * parseFloat(this._ProductDetail.master.netSalesFactor.toString());
      this.NetSellingCost(indType ? this._ProductDetail.master.salesNetCostConvertion.toString() : this._ProductDetail.master.salesNetCost.toString(), indType, exchangeRate, idPackagingType);
    } else {
      if (this._ProductDetail.master.baseCost== 0)//condicion agregada por sergio cuando el costo base este en 0  if (this._ProductDetail.master.baseCostNew == 0)
        this._ProductDetail.master.netFactor = 1
      else
        this._ProductDetail.master.netFactor = parseFloat(value) / parseFloat(this._ProductDetail.master.baseCost.toString());

      this._ProductDetail.master.salesNetCostConvertion = parseFloat(this._ProductDetail.master.netCostConversion.toString()) * parseFloat(this._ProductDetail.master.netSalesFactor.toString());
      this._ProductDetail.master.salesNetCost = parseFloat(value) * parseFloat(this._ProductDetail.master.netSalesFactor.toString());
      this.NetSellingCost(indType ? this._ProductDetail.master.salesNetCostConvertion.toString() : this._ProductDetail.master.salesNetCost.toString(), indType, exchangeRate, idPackagingType);
    }
  }
  if (type < 3) {
    this._ProductDetail.master.salesNetCostConvertion = parseFloat(this._ProductDetail.master.netCostConversion.toString()) * parseFloat(this._ProductDetail.master.netSalesFactor.toString());
    this._ProductDetail.master.salesNetCost = parseFloat(this._ProductDetail.master.netCost.toString()) * parseFloat(this._ProductDetail.master.netSalesFactor.toString());
    this.NetSellingCost(indType ? this._ProductDetail.master.salesNetCostConvertion.toString() : this._ProductDetail.master.salesNetCost.toString(), indType, exchangeRate, idPackagingType);
  }
  if (type == 4) {
    this._ProductDetail.master.salesNetCostConvertion = parseFloat(this._ProductDetail.master.netCostConversion.toString()) * parseFloat(value);
    this._ProductDetail.master.salesNetCost = parseFloat(this._ProductDetail.master.netCost.toString()) * parseFloat(value);
  }
  if (type == 5) {
    this.NetSellingCost(value, indType, exchangeRate, idPackagingType);
    if (indType) {
      this._ProductDetail.master.netSalesFactor = parseFloat(value) / parseFloat(this._ProductDetail.master.netCostConversion.toString());
      this._ProductDetail.master.convertionCost = parseFloat(value) * parseFloat(this._ProductDetail.master.salesFactorNew.toString());
      this._ProductDetail.master.pvpBase = parseFloat(this._ProductDetail.master.salesNetCost.toString()) * parseFloat(this._ProductDetail.master.salesFactor.toString());
    } else {
      this._ProductDetail.master.netSalesFactor = parseFloat(value) / parseFloat(this._ProductDetail.master.netCost.toString());
      this._ProductDetail.master.pvpConversion = parseFloat(this._ProductDetail.master.salesNetCostConvertion.toString()) * parseFloat(this._ProductDetail.master.salesFactor.toString());
      this._ProductDetail.master.pvpBase = parseFloat(value) * parseFloat(this._ProductDetail.master.salesFactor.toString());
    }
  }
  if (type < 5) {
    this._ProductDetail.master.pvpConversion = parseFloat(this._ProductDetail.master.salesNetCostConvertion.toString()) * parseFloat(this._ProductDetail.master.salesFactor.toString());
    this._ProductDetail.master.pvpBase = parseFloat(this._ProductDetail.master.salesNetCost.toString()) * parseFloat(this._ProductDetail.master.salesFactor.toString());
    this.PVP(indType ? this._ProductDetail.master.pvpConversion.toString() : this._ProductDetail.master.pvpBase.toString(), indType, idPackagingType, exchangeRate);
  }
  if (type == 6) {
    this._ProductDetail.master.pvpConversion = parseFloat(this._ProductDetail.master.salesNetCostConvertion.toString()) * parseFloat(value);
    this._ProductDetail.master.pvpBase = parseFloat(this._ProductDetail.master.salesNetCost.toString()) * parseFloat(value);
  }
  if (type == 7) {
    this.PVP(value, indType, idPackagingType, exchangeRate);
    if (indType) {
      this._ProductDetail.master.salesFactor = parseFloat(value) / parseFloat(this._ProductDetail.master.salesNetCostConvertion.toString());
      this.ValidateFactorFromPVP(value, this._ProductDetail.master.salesFactor.toLocaleString(), 6, indType, idPackagingType)
    } else {
      this._ProductDetail.master.salesFactor = parseFloat(value) / parseFloat(this._ProductDetail.master.salesNetCost.toString());
      this.ValidateFactorFromPVP(value, this._ProductDetail.master.salesFactor.toLocaleString(), 6, indType, idPackagingType)
    }
  }
}


refreshViewTabInternto(isindividual: boolean) {
  this.isIndividual = isindividual;
  this.iduserlogin = this._Authservice.storeUser.id;
}


onChanceTaxaDed(data) {

  let e: any;
  if (data != null) {
    // this.ischange = data.ischange;
    // this.indtabtaxable = data.indtabtaxable;
    // this.applycostsales = data.applycostsales;
    debugger;
    if(data.product!=undefined){
      let netcost = data.product.individual.indAdded == 1 ? data.product.individual.netCost : data.product.master.netCost;
      let salesnetcost = data.product.individual.indAdded == 1 ? data.product.individual.salesNetCost : data.product.master.salesNetCost
      if (data.product.individual.indAdded == 1) {
        this.activate(e, netcost, 3, false, data.product.individual.idPackingType, data.product);
        this.apply=true
      }
      else {
        this.activate(e, netcost, 3, false, data.product.master.idPackingType, data.product);
        this.apply=true
      }

      let previous = 0;
         previous = data.product.individual.indAdded == 1 ?  data.product.individual.salesNetCost :  data.product.master.salesNetCost
         if(data.product.individual.indAdded == 1){
          if (salesnetcost != previous){
            this.activate(e, salesnetcost, 5, false, data.product.individual.idPackingType, data.product);
            this.apply=true
          }
         }else{

          this.activate(e, salesnetcost, 5, false, data.product.master.idPackingType, data.product);
          this.apply=true
         }

    }else{

      let netcost = data.individual.indAdded == 1 ? data.individual.netCost : data.master.netCost;
      let salesnetcost = data.individual.indAdded == 1 ? data.individual.salesNetCost : data.master.salesNetCost
      if (data.individual.indAdded == 1) {
        this.activate(e, netcost, 3, false, data.individual.idPackingType, data);
        this.apply=true
      }
      else {
        this.activate(e, netcost, 3, false, data.master.idPackingType, data);
        this.apply=true
      }

      let previous = 0;
         previous = data.individual.indAdded == 1 ?  data.individual.salesNetCost :  data.master.salesNetCost
         if(data.individual.indAdded == 1){
          if (salesnetcost != previous){
            this.activate(e, salesnetcost, 5, false, data.individual.idPackingType, data);
            this.apply=true
          }
         }else{

          this.activate(e, salesnetcost, 5, false, data.master.idPackingType, data);
          this.apply=true
         }
    }

    if (this.ischange) {
     // this.saveChange.emit({ product: this._PurchaseOrderProduct });
      this.ischange = false;
    }

    this.indtabtaxable = true;
    this.applycostsales = false;
    this.apply=false
  }

  
}
//Calcular los costos y precios al momento de cargar el detalle del product
RecalculateInit(product:Productdetailvalidation){
  let e: any;
  let netcost = product.individual.indAdded == 1 ? product.individual.baseCost : product.master.baseCost;
  let pvp = product.individual.indAdded == 1 ? product.individual.pvpBase : product.master.pvpBase;
  let previous = 0;
if(pvp=0){
  if (product.individual.indAdded == 1) {
    this.activate(e, netcost.toString(), 1, false, product.individual.idPackingType, undefined);
    this.apply=true
  }
  else {
    this.activate(e, netcost.toString(), 1, false, product.master.idPackingType, undefined);
    this.apply=true

    if(product.individual.indAdded=0){
      this.activate(e, netcost.toString(), 1, false, product.individual.idPackingType, undefined);
    }
  }

}
  }


}


