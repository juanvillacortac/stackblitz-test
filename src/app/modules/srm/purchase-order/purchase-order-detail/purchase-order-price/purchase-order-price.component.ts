import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Coins } from 'src/app/models/masters/coin';
import { ExchangeRates } from 'src/app/models/masters/exchange-rates';
import { Deductible } from 'src/app/models/srm/deductible';
import { Groupingpurchaseorders } from 'src/app/models/srm/groupingpurchaseorders';
import { PurchaseOrderProduct } from 'src/app/models/srm/purchase-order-product';
import { Resumeordertotal } from 'src/app/models/srm/resumeordertotal';
import { Taxable } from 'src/app/models/srm/taxable';
import { Taxabledeductible } from 'src/app/models/srm/taxabledeductible';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { ExchangeRatesFilter } from 'src/app/modules/masters/exchange-rates/shared/filters/exchange-rates-filter';
import { ExchangeRatesService } from 'src/app/modules/masters/exchange-rates/shared/service/exchange-rates.service';
import { EnumPackingType } from '../../../shared/Utils/enum-packing-type';
import { StatusPurchase } from '../../../shared/Utils/status-purchase';

@Component({
  selector: 'app-purchase-order-price',
  templateUrl: './purchase-order-price.component.html',
  styleUrls: ['./purchase-order-price.component.scss']
})
export class PurchaseOrderPriceComponent implements OnInit {
  isIndividual: boolean = true;
  exchangeRate: number = 0;
  indhardcurrency: boolean = false;
  coinsList: SelectItem[];
  basesymbolcoin: string = "";
  baseCoin: string = "";
  conversionCoin: string = "";
  conversionsymbolcoin: string = "";
  compare: string = " ";
  statuspurchase: typeof StatusPurchase = StatusPurchase;
  activeIndexPrice: number = 0;


  @Input('showPrice') showPrice: boolean = false;
  @Input('showTabPrice') showTabPrice: boolean;
  @Input("isSave") isSave: boolean = true;
  @Output("isSaveChange") isSaveChange = new EventEmitter<boolean>();
  @Input("PucharseOrderHeader") PucharseOrderHeader: Groupingpurchaseorders = new Groupingpurchaseorders();
  disabledCosts: boolean = false;
  disabledPrices: boolean = false;
  disabledNetCost: boolean = false;
  disabledNetSalesCost: boolean = false;
  disabledPVP: boolean = false;
  disabledSaleFactor: boolean = false;
  EnumPackingType: typeof EnumPackingType = EnumPackingType;
  @Input("_PurchaseOrderProduct") _PurchaseOrderProduct: PurchaseOrderProduct = new PurchaseOrderProduct();
  @Input("_PurchaseOrderProductCopy") _PurchaseOrderProductCopy: PurchaseOrderProduct = new PurchaseOrderProduct();
  @Output("_RecalculateTotals") _RecalculateTotals = new EventEmitter<{ resumeTotal: Resumeordertotal, products: any }>();
  //emitir deducibles e imponibles
  @Output("_sendTaxablescost") _sendTaxablescost = new EventEmitter<{ TaxableListSave: Taxabledeductible, indtabtaxable: boolean }>();
  @Output("saveChange") saveChange = new EventEmitter<{ product: PurchaseOrderProduct }>();
  TaxableListCost: Taxabledeductible = new Taxabledeductible();
  ischange: boolean = false;
  resumeTotal: Resumeordertotal = new Resumeordertotal();
  products: any;
  indtabtaxable: boolean = true;
  taxables: Taxable[] = [];
  iduserlogin: number = -1;
  applycostsales: boolean = false;
  apply: boolean = false;


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

  constructor(private exchangeRatesService: ExchangeRatesService,
    private coinsService: CoinsService,
    private messageService: MessageService,
    private _httpClient: HttpClient) { }
  _Authservice: AuthService = new AuthService(this._httpClient);

  ngOnInit(): void {
    this.searchCoinsxCompany();
    this.isIndividual = this.showPrice;
    this.iduserlogin = this._Authservice.storeUser.id;

  }

  clear(event) {
    if (event.target.value == "0,0000" || event.target.value == "0,00") {
      event.target.value = "";
    }
  }


  activate(event, value: string, type: number, indType: boolean, idPackagingType: number, product: any, productcopy:any,indtaxable=true) {
    console.log(this._PurchaseOrderProductCopy)
    if (event != undefined)
      event.target.value = (type == 2 || type == 4 || type == 6) && event.target.value == "" ? "0,00" : event.target.value == "" ? "0,0000" : event.target.value;

    if (type == 1 || type == 3 || type == 5 || type == 7) {
      let val = "0,0000"
      var split = event != undefined ? event.target.value.split(",") : val.split(",");
      split[0] = split[0].replace(/[.]/gi, "");
      if (split[0].length > 18) {
        event.target.value = event != undefined ? "0,0000" : "0,0000";
        value = "0,0000"
        this._PurchaseOrderProduct.masterPrices.baseCostNew = type == 1 ? 0 : this._PurchaseOrderProduct.masterPrices.baseCostNew;
        this._PurchaseOrderProduct.masterPrices.netCost = type == 3 ? 0 : this._PurchaseOrderProduct.masterPrices.netCost;
        this._PurchaseOrderProduct.masterPrices.salesNetCost = type == 5 ? 0 : this._PurchaseOrderProduct.masterPrices.salesNetCost;
        this._PurchaseOrderProduct.masterPrices.pvpBaseNew = type == 7 ? 0 : this._PurchaseOrderProduct.masterPrices.pvpBaseNew;
        this._PurchaseOrderProduct.masterPrices.convertionCost = type == 1 ? 0 : this._PurchaseOrderProduct.masterPrices.convertionCost;
        this._PurchaseOrderProduct.masterPrices.netCostConversion = type == 3 ? 0 : this._PurchaseOrderProduct.masterPrices.netCostConversion;
        this._PurchaseOrderProduct.masterPrices.salesNetCostConvertion = type == 5 ? 0 : this._PurchaseOrderProduct.masterPrices.salesNetCostConvertion;
        this._PurchaseOrderProduct.masterPrices.pvpConversionNew = type == 7 ? 0 : this._PurchaseOrderProduct.masterPrices.pvpConversionNew;

        this._PurchaseOrderProduct.individualPrices.baseCostNew = type == 1 ? 0 : this._PurchaseOrderProduct.masterPrices.baseCostNew;
        this._PurchaseOrderProduct.individualPrices.netCost = type == 3 ? 0 : this._PurchaseOrderProduct.masterPrices.netCost;
        this._PurchaseOrderProduct.individualPrices.salesNetCost = type == 5 ? 0 : this._PurchaseOrderProduct.masterPrices.salesNetCost;
        this._PurchaseOrderProduct.individualPrices.pvpBaseNew = type == 7 ? 0 : this._PurchaseOrderProduct.masterPrices.pvpBaseNew;
        this._PurchaseOrderProduct.individualPrices.convertionCost = type == 1 ? 0 : this._PurchaseOrderProduct.masterPrices.convertionCost;
        this._PurchaseOrderProduct.individualPrices.netCostConversion = type == 3 ? 0 : this._PurchaseOrderProduct.masterPrices.netCostConversion;
        this._PurchaseOrderProduct.individualPrices.salesNetCostConvertion = type == 5 ? 0 : this._PurchaseOrderProduct.masterPrices.salesNetCostConvertion;
        this._PurchaseOrderProduct.individualPrices.pvpConversionNew = type == 7 ? 0 : this._PurchaseOrderProduct.masterPrices.pvpConversionNew;

      }
    }
  
    if (product != undefined) {
      this._PurchaseOrderProduct = product;
    }
    if(productcopy !=undefined )
       this._PurchaseOrderProductCopy=productcopy;


    var bc = this._PurchaseOrderProduct.masterPrices.baseCostNew == null || this._PurchaseOrderProduct.masterPrices.baseCostNew == undefined ? 0 : this._PurchaseOrderProduct.masterPrices.baseCostNew;
    this.disabledNetCost = this.disabledCosts == false ? bc == 0 ? true : false : true;
    var bnc = this._PurchaseOrderProduct.masterPrices.netCost == null || this._PurchaseOrderProduct.masterPrices.netCost == undefined ? 0 : this._PurchaseOrderProduct.masterPrices.netCost;
    this.disabledNetSalesCost = this.disabledCosts == false ? bnc == 0 ? true : false : true;
    var bnsc = this._PurchaseOrderProduct.masterPrices.salesNetCostConvertion == null || this._PurchaseOrderProduct.masterPrices.salesNetCostConvertion == undefined ? 0 : this._PurchaseOrderProduct.masterPrices.salesNetCostConvertion;
    this.disabledPVP = this.disabledPrices == false ? bnsc == 0 ? true : false : true;

    this._PurchaseOrderProduct.masterPrices.baseCostNew = this._PurchaseOrderProduct.masterPrices.baseCostNew == null || this._PurchaseOrderProduct.masterPrices.baseCostNew == undefined ? 0 : this._PurchaseOrderProduct.masterPrices.baseCostNew;//agregado por sergio 21/0/201  prueba cuando limpio todo el  campo de precio y salgo
    this._PurchaseOrderProduct.masterPrices.netFactor = this._PurchaseOrderProduct.masterPrices.netFactor == null || this._PurchaseOrderProduct.masterPrices.netFactor.toString() == "" ? 0 : this._PurchaseOrderProduct.masterPrices.netFactor;
    this._PurchaseOrderProduct.masterPrices.salesFactorNew = this._PurchaseOrderProduct.masterPrices.salesFactorNew == null || this._PurchaseOrderProduct.masterPrices.salesFactorNew.toString() == "" ? 0 : this._PurchaseOrderProduct.masterPrices.salesFactorNew;
    this._PurchaseOrderProduct.masterPrices.netSalesFactor = this._PurchaseOrderProduct.masterPrices.netSalesFactor == null || this._PurchaseOrderProduct.masterPrices.netSalesFactor.toString() == "" ? 0 : this._PurchaseOrderProduct.masterPrices.netSalesFactor;
    //this._PurchaseOrderProduct.individualPrices.salesNetCost = this._PurchaseOrderProduct.individualPrices.salesNetCost == null || this._PurchaseOrderProduct.individualPrices.salesNetCost.toString() =="" ? 0 : this._PurchaseOrderProduct.individualPrices.salesNetCost;

    this._PurchaseOrderProduct.individualPrices.baseCostNew = this._PurchaseOrderProduct.individualPrices.baseCostNew == null || this._PurchaseOrderProduct.individualPrices.baseCostNew == undefined ? 0 : this._PurchaseOrderProduct.individualPrices.baseCostNew;//agregado por sergio 21/0/201  prueba cuando limpio todo el  campo de precio y salgo
    this._PurchaseOrderProduct.individualPrices.netFactor = this._PurchaseOrderProduct.individualPrices.netFactor == null || this._PurchaseOrderProduct.individualPrices.netFactor.toString() == "" ? 0 : this._PurchaseOrderProduct.individualPrices.netFactor;
    this._PurchaseOrderProduct.individualPrices.salesFactorNew = this._PurchaseOrderProduct.individualPrices.salesFactorNew == null || this._PurchaseOrderProduct.individualPrices.salesFactorNew.toString() == "" ? 0 : this._PurchaseOrderProduct.individualPrices.salesFactorNew;
    this._PurchaseOrderProduct.individualPrices.netSalesFactor = this._PurchaseOrderProduct.individualPrices.netSalesFactor == null || this._PurchaseOrderProduct.individualPrices.netSalesFactor.toString() == "" ? 0 : this._PurchaseOrderProduct.individualPrices.netSalesFactor;
    // this._PurchaseOrderProduct.individualPrices.salesNetCost = this._PurchaseOrderProduct.individualPrices.salesNetCost == null || this._PurchaseOrderProduct.individualPrices.salesNetCost.toString() =="" ? 0 : this._PurchaseOrderProduct.individualPrices.salesNetCost;
    if (idPackagingType == EnumPackingType.Master) {
      this.isSave = false;
      this.calculationValueMaster(value, type, indType, this._PurchaseOrderProduct.internExchangeRate, idPackagingType);
      this.resumeTotal =
      {
        baseCostNew: this._PurchaseOrderProduct.masterPrices.baseCostNew,
        baseCostOld: this._PurchaseOrderProductCopy.masterPrices.baseCostNew,
        baseDiference: this._PurchaseOrderProduct.masterPrices.baseCostNew - this._PurchaseOrderProductCopy.masterPrices.baseCostNew,
        convertionCostNew: this._PurchaseOrderProduct.masterPrices.convertionCost,
        convertionCostOld: this._PurchaseOrderProductCopy.masterPrices.convertionCost,
        convertionDiference: this._PurchaseOrderProduct.masterPrices.convertionCost - this._PurchaseOrderProductCopy.masterPrices.convertionCost,
        netCostNew: this._PurchaseOrderProduct.masterPrices.netCost,
        netCostConversionNew: this._PurchaseOrderProduct.masterPrices.netCostConversion,
        netCostOld: this._PurchaseOrderProductCopy.masterPrices.netCost,
        netCostConversionOld: this._PurchaseOrderProductCopy.masterPrices.netCostConversion,
        netcostDiference: this._PurchaseOrderProduct.masterPrices.netCost - this._PurchaseOrderProductCopy.masterPrices.netCost,
        netcostConversionDiference: this._PurchaseOrderProduct.masterPrices.netCostConversion - this._PurchaseOrderProductCopy.masterPrices.netCostConversion,
        salesnetCostNew: this._PurchaseOrderProduct.masterPrices.salesNetCost,
        salesnetCostOld: this._PurchaseOrderProductCopy.masterPrices.salesNetCost,
        pvpBaseNew: this._PurchaseOrderProduct.masterPrices.pvpBaseNew,
        pvpConversionNew: this._PurchaseOrderProduct.masterPrices.pvpConversionNew,
        pvpBaseOld: this._PurchaseOrderProductCopy.masterPrices.pvpBaseNew,
        pvpConversionOld: this._PurchaseOrderProductCopy.masterPrices.pvpConversionNew,
        packingNumber: this._PurchaseOrderProduct.masterPrices.packingNumbers,
        indAdded: this._PurchaseOrderProductCopy.masterPrices.indAdded,
        taxableBase: this._PurchaseOrderProduct.masterPrices.taxableBase - this._PurchaseOrderProductCopy.masterPrices.taxableBase,
        deductibleBase: this._PurchaseOrderProduct.masterPrices.deductibleBase - this._PurchaseOrderProductCopy.masterPrices.deductibleBase,
        indApply:this.apply,
        indtaxable:indtaxable
      }
      this.isSaveChange.emit(this.isSave);
    } else if (idPackagingType == EnumPackingType.Individual) {
      this.isSave = false;
      this.calculationValueIndividual(value, type, indType, this._PurchaseOrderProduct.internExchangeRate, idPackagingType);
      // if(product!=undefined)
      //     this._PurchaseOrderProductCopy= product;
      this.resumeTotal =
      {
        baseCostNew: this._PurchaseOrderProduct.individualPrices.baseCostNew,
        baseCostOld: this._PurchaseOrderProductCopy.individualPrices.baseCostNew,
        baseDiference: this._PurchaseOrderProduct.individualPrices.baseCostNew - this._PurchaseOrderProductCopy.individualPrices.baseCostNew,
        convertionCostNew: this._PurchaseOrderProduct.individualPrices.convertionCost,
        convertionCostOld: this._PurchaseOrderProductCopy.individualPrices.convertionCost,
        convertionDiference: this._PurchaseOrderProduct.individualPrices.convertionCost - this._PurchaseOrderProductCopy.individualPrices.convertionCost,
        netCostNew: this._PurchaseOrderProduct.individualPrices.netCost,
        netCostConversionNew: this._PurchaseOrderProduct.individualPrices.netCostConversion,
        netCostOld: this._PurchaseOrderProductCopy.individualPrices.netCost,
        salesnetCostNew: this._PurchaseOrderProduct.individualPrices.salesNetCost,
        salesnetCostOld: this._PurchaseOrderProductCopy.individualPrices.salesNetCost,
        netCostConversionOld: this._PurchaseOrderProductCopy.individualPrices.netCostConversion,
        netcostDiference: this._PurchaseOrderProduct.individualPrices.netCost - this._PurchaseOrderProductCopy.individualPrices.netCost,
        netcostConversionDiference: this._PurchaseOrderProduct.individualPrices.netCostConversion - this._PurchaseOrderProductCopy.individualPrices.netCostConversion,
        pvpBaseNew: this._PurchaseOrderProduct.individualPrices.pvpBaseNew,
        pvpConversionNew: this._PurchaseOrderProduct.individualPrices.pvpConversionNew,
        pvpBaseOld: this._PurchaseOrderProductCopy.individualPrices.pvpBaseNew,
        pvpConversionOld: this._PurchaseOrderProductCopy.individualPrices.pvpConversionNew,
        packingNumber: this._PurchaseOrderProduct.individualPrices.packingNumbers,
        indAdded: this._PurchaseOrderProductCopy.individualPrices.indAdded,
        taxableBase: this._PurchaseOrderProduct.individualPrices.taxableBase - this._PurchaseOrderProductCopy.individualPrices.taxableBase,
        deductibleBase: this._PurchaseOrderProduct.individualPrices.deductibleBase - this._PurchaseOrderProductCopy.individualPrices.deductibleBase,
        indApply:this.apply,
        indtaxable:indtaxable

      }
      this.isSaveChange.emit(this.isSave);
    }
    /// valores fijos  imponibles//
    //  this._PurchaseOrderProduct.individualPrices.netcostfijo= this._PurchaseOrderProduct.individualPrices.netCost;
    //  this._PurchaseOrderProduct.individualPrices.salesnetcostfijo =  this._PurchaseOrderProduct.individualPrices.salesNetCost;

    //   //valores fijos imponbles//
    //   this._PurchaseOrderProduct.masterPrices.netcostfijo= this._PurchaseOrderProduct.masterPrices.netCost;
    //   this._PurchaseOrderProduct.masterPrices.salesnetcostfijo = this._PurchaseOrderProduct.masterPrices.salesNetCost;
    //////////////////////////////
    if (product != undefined)
       this.products = product
    else 
       this.products= undefined
          
    this._RecalculateTotals.emit({
      resumeTotal: this.resumeTotal,
      products: this.products
    });
    
    if (this._PurchaseOrderProduct.taxables.length > 0 || this._PurchaseOrderProduct.deductibles.length > 0) {
      
      if(indtaxable ==false)
        this.indtabtaxable=indtaxable;

      ///actualiza el nuevo monto de imponibles 
      if (this.indtabtaxable) {
        this.SetModels();
        this._sendTaxablescost.emit({
          TaxableListSave: this.TaxableListCost,
          indtabtaxable: this.indtabtaxable
        });
      }
    }
  
    //this.iscost=true;
  }


  Cost(value: string, indType: boolean, exchangeRate: number, idPackagingType: number) {
    if (idPackagingType == EnumPackingType.Master) {
      if (indType == true) {
        this._PurchaseOrderProduct.masterPrices.baseCostNew = parseFloat(value) * parseFloat(exchangeRate.toString());
      } else {
        this._PurchaseOrderProduct.masterPrices.convertionCost = parseFloat(value) / parseFloat(exchangeRate.toString());
      }
    } else if (idPackagingType == EnumPackingType.Individual) {
      if (indType == true) {
        this._PurchaseOrderProduct.individualPrices.baseCostNew = parseFloat(value) * parseFloat(exchangeRate.toString());
      } else {
        this._PurchaseOrderProduct.individualPrices.convertionCost = parseFloat(value) / parseFloat(exchangeRate.toString());
      }
    }
  }

  NetCost(value: string, indType: boolean, exchangeRate: number, idPackagingType: number) {
    if (idPackagingType == EnumPackingType.Master) {
      if (indType == true) {
        this._PurchaseOrderProduct.masterPrices.netCost = parseFloat(value) * parseFloat(exchangeRate.toString());
        // this._PurchaseOrderProduct.masterPrices.netcostfijo=this._PurchaseOrderProduct.masterPrices.netCost;
      } else {
        this._PurchaseOrderProduct.masterPrices.netCostConversion = parseFloat(value) / parseFloat(exchangeRate.toString());
      }
    } else if (idPackagingType == EnumPackingType.Individual) {
      if (indType == true) {
        this._PurchaseOrderProduct.individualPrices.netCost = parseFloat(value) * parseFloat(exchangeRate.toString());
      } else {
        this._PurchaseOrderProduct.individualPrices.netCostConversion = parseFloat(value) / parseFloat(exchangeRate.toString());
      }
    }

  }

  NetSellingCost(value: string, indType: boolean, exchangeRateNetSaleCost: number, idPackagingType: number) {
    if (idPackagingType == EnumPackingType.Master) {
      if (indType == true) {
        this._PurchaseOrderProduct.masterPrices.salesNetCost = parseFloat(value) * parseFloat(exchangeRateNetSaleCost.toString());
        this._PurchaseOrderProduct.masterPrices.salesNetCostConvertion = parseFloat(value)
      } else {
        this._PurchaseOrderProduct.masterPrices.salesNetCostConvertion = parseFloat(value) / parseFloat(exchangeRateNetSaleCost.toString());
        this._PurchaseOrderProduct.masterPrices.salesNetCost = parseFloat(value);
      }
    } else if (idPackagingType == EnumPackingType.Individual) {
      if (indType == true) {
        this._PurchaseOrderProduct.individualPrices.salesNetCost = parseFloat(value) * parseFloat(exchangeRateNetSaleCost.toString());
        this._PurchaseOrderProduct.individualPrices.salesNetCostConvertion = parseFloat(value)
      } else {
        this._PurchaseOrderProduct.individualPrices.salesNetCostConvertion = parseFloat(value) / parseFloat(exchangeRateNetSaleCost.toString());
        this._PurchaseOrderProduct.individualPrices.salesNetCost = parseFloat(value);
      }

    }
  }

  PVP(value: string, indType: boolean, idPackagingType: number, exchangeRate: number) {
    if (idPackagingType == EnumPackingType.Master) {
      if (indType == true) {
        this._PurchaseOrderProduct.masterPrices.pvpBaseNew = parseFloat(value) * parseFloat(exchangeRate.toString());
      } else {
        this._PurchaseOrderProduct.masterPrices.pvpConversionNew = parseFloat(value) / parseFloat(exchangeRate.toString());
      }
    } else if (idPackagingType == EnumPackingType.Individual) {
      if (indType == true) {
        this._PurchaseOrderProduct.individualPrices.pvpBaseNew = parseFloat(value) * parseFloat(exchangeRate.toString());
      } else {
        this._PurchaseOrderProduct.individualPrices.pvpConversionNew = parseFloat(value) / parseFloat(exchangeRate.toString());
      }
    }
  }

  // Metodo para calcular costos en el MASTER
  calculationValueMaster(value: string, type: number, indType: boolean, exchangeRate: number, idPackagingType: number) {
    value = value == "" ? "0" : value;
    this.compare = value.toString();
    if (this.compare.indexOf(".") != -1)
      value = value.replace(/[.]/gi, "");

    if (this.compare.indexOf(",") != -1)
      value = value.replace(",", ".");
    if (type == 1) {
      this.Cost(value, indType, this._PurchaseOrderProduct.supplierExchangeRate, idPackagingType);
      if (indType) {
        this._PurchaseOrderProduct.masterPrices.netCostConversion = parseFloat(value.toString()) * parseFloat(this._PurchaseOrderProduct.masterPrices.netFactor.toString());
        this._PurchaseOrderProduct.masterPrices.netCost = parseFloat(this._PurchaseOrderProduct.masterPrices.baseCostNew.toString()) * parseFloat(this._PurchaseOrderProduct.masterPrices.netFactor.toString());

      } else {
        this._PurchaseOrderProduct.masterPrices.netCostConversion = parseFloat(this._PurchaseOrderProduct.masterPrices.convertionCost.toString()) * parseFloat(this._PurchaseOrderProduct.masterPrices.netFactor.toString());
        this._PurchaseOrderProduct.masterPrices.netCost = parseFloat(value.toString()) * parseFloat(this._PurchaseOrderProduct.masterPrices.netFactor.toString());
      }
    }
    if (type == 2) {
      this._PurchaseOrderProduct.masterPrices.netCostConversion = parseFloat(this._PurchaseOrderProduct.masterPrices.convertionCost.toString()) * parseFloat(value);
      this._PurchaseOrderProduct.masterPrices.netCost = parseFloat(this._PurchaseOrderProduct.masterPrices.baseCostNew.toString()) * parseFloat(value);
    }
    if (type == 3) {
      this.NetCost(value, indType, this._PurchaseOrderProduct.supplierExchangeRate, idPackagingType);
      if (indType) {
        this._PurchaseOrderProduct.masterPrices.netFactor = parseFloat(value) / parseFloat(this._PurchaseOrderProduct.masterPrices.convertionCost.toString());
        this._PurchaseOrderProduct.masterPrices.salesNetCostConvertion = parseFloat(value) * parseFloat(this._PurchaseOrderProduct.masterPrices.netSalesFactor.toString());
        this._PurchaseOrderProduct.masterPrices.salesNetCost = parseFloat(this._PurchaseOrderProduct.masterPrices.netCost.toString()) * parseFloat(this._PurchaseOrderProduct.masterPrices.netSalesFactor.toString());
        this.NetSellingCost(indType ? this._PurchaseOrderProduct.masterPrices.salesNetCostConvertion.toString() : this._PurchaseOrderProduct.masterPrices.salesNetCost.toString(), indType, exchangeRate, idPackagingType);
      } else {
        if (this._PurchaseOrderProduct.masterPrices.baseCostNew == 0)//condicion agregada por sergio cuando el costo base este en 0
          this._PurchaseOrderProduct.masterPrices.netFactor = 1
        else
          this._PurchaseOrderProduct.masterPrices.netFactor = parseFloat(value) / parseFloat(this._PurchaseOrderProduct.masterPrices.baseCostNew.toString());

        this._PurchaseOrderProduct.masterPrices.salesNetCostConvertion = parseFloat(this._PurchaseOrderProduct.masterPrices.netCostConversion.toString()) * parseFloat(this._PurchaseOrderProduct.masterPrices.netSalesFactor.toString());
        this._PurchaseOrderProduct.masterPrices.salesNetCost = parseFloat(value) * parseFloat(this._PurchaseOrderProduct.masterPrices.netSalesFactor.toString());
        this.NetSellingCost(indType ? this._PurchaseOrderProduct.masterPrices.salesNetCostConvertion.toString() : this._PurchaseOrderProduct.masterPrices.salesNetCost.toString(), indType, exchangeRate, idPackagingType);
      }
    }
    if (type < 3) {
      this._PurchaseOrderProduct.masterPrices.salesNetCostConvertion = parseFloat(this._PurchaseOrderProduct.masterPrices.netCostConversion.toString()) * parseFloat(this._PurchaseOrderProduct.masterPrices.netSalesFactor.toString());
      this._PurchaseOrderProduct.masterPrices.salesNetCost = parseFloat(this._PurchaseOrderProduct.masterPrices.netCost.toString()) * parseFloat(this._PurchaseOrderProduct.masterPrices.netSalesFactor.toString());
      this.NetSellingCost(indType ? this._PurchaseOrderProduct.masterPrices.salesNetCostConvertion.toString() : this._PurchaseOrderProduct.masterPrices.salesNetCost.toString(), indType, exchangeRate, idPackagingType);
    }
    if (type == 4) {
      this._PurchaseOrderProduct.masterPrices.salesNetCostConvertion = parseFloat(this._PurchaseOrderProduct.masterPrices.netCostConversion.toString()) * parseFloat(value);
      this._PurchaseOrderProduct.masterPrices.salesNetCost = parseFloat(this._PurchaseOrderProduct.masterPrices.netCost.toString()) * parseFloat(value);
    }
    if (type == 5) {
      this.NetSellingCost(value, indType, exchangeRate, idPackagingType);
      if (indType) {
        this._PurchaseOrderProduct.masterPrices.netSalesFactor = parseFloat(value) / parseFloat(this._PurchaseOrderProduct.masterPrices.netCostConversion.toString());
        this._PurchaseOrderProduct.masterPrices.convertionCost = parseFloat(value) * parseFloat(this._PurchaseOrderProduct.masterPrices.salesFactorNew.toString());
        this._PurchaseOrderProduct.masterPrices.pvpBaseNew = parseFloat(this._PurchaseOrderProduct.masterPrices.salesNetCost.toString()) * parseFloat(this._PurchaseOrderProduct.masterPrices.salesFactorNew.toString());
      } else {
        this._PurchaseOrderProduct.masterPrices.netSalesFactor = parseFloat(value) / parseFloat(this._PurchaseOrderProduct.masterPrices.netCost.toString());
        this._PurchaseOrderProduct.masterPrices.pvpConversionNew = parseFloat(this._PurchaseOrderProduct.masterPrices.salesNetCostConvertion.toString()) * parseFloat(this._PurchaseOrderProduct.masterPrices.salesFactorNew.toString());
        this._PurchaseOrderProduct.masterPrices.pvpBaseNew = parseFloat(value) * parseFloat(this._PurchaseOrderProduct.masterPrices.salesFactorNew.toString());
      }
    }
    if (type < 5) {
      this._PurchaseOrderProduct.masterPrices.pvpConversionNew = parseFloat(this._PurchaseOrderProduct.masterPrices.salesNetCostConvertion.toString()) * parseFloat(this._PurchaseOrderProduct.masterPrices.salesFactorNew.toString());
      this._PurchaseOrderProduct.masterPrices.pvpBaseNew = parseFloat(this._PurchaseOrderProduct.masterPrices.salesNetCost.toString()) * parseFloat(this._PurchaseOrderProduct.masterPrices.salesFactorNew.toString());
      this.PVP(indType ? this._PurchaseOrderProduct.masterPrices.pvpConversionNew.toString() : this._PurchaseOrderProduct.masterPrices.pvpBaseNew.toString(), indType, idPackagingType, exchangeRate);
    }
    if (type == 6) {
      this._PurchaseOrderProduct.masterPrices.pvpConversionNew = parseFloat(this._PurchaseOrderProduct.masterPrices.salesNetCostConvertion.toString()) * parseFloat(value);
      this._PurchaseOrderProduct.masterPrices.pvpBaseNew = parseFloat(this._PurchaseOrderProduct.masterPrices.salesNetCost.toString()) * parseFloat(value);
    }
    if (type == 7) {
      this.PVP(value, indType, idPackagingType, exchangeRate);
      if (indType) {
        this._PurchaseOrderProduct.masterPrices.salesFactorNew = parseFloat(value) / parseFloat(this._PurchaseOrderProduct.masterPrices.salesNetCostConvertion.toString());
        this.ValidateFactorFromPVP(value, this._PurchaseOrderProduct.masterPrices.salesFactorNew.toLocaleString(), 6, indType, idPackagingType)
      } else {
        this._PurchaseOrderProduct.masterPrices.salesFactorNew = parseFloat(value) / parseFloat(this._PurchaseOrderProduct.masterPrices.salesNetCost.toString());
        this.ValidateFactorFromPVP(value, this._PurchaseOrderProduct.masterPrices.salesFactorNew.toLocaleString(), 6, indType, idPackagingType)
      }
    }
  }


  // Metodo para calcular costos en el INDIVIDUAL
  calculationValueIndividual(value: string, type: number, indType: boolean, exchangeRate: number, idPackagingType: number) {
    value = value == "" ? "0" : value;
    this.compare = value.toString();
    if (this.compare.indexOf(".") != -1)
      value = value.replace(/[.]/gi, "");

    if (this.compare.indexOf(",") != -1)
      value = value.replace(",", ".");

    if (type == 1) {
      this.Cost(value, indType, this._PurchaseOrderProduct.supplierExchangeRate, idPackagingType);
      if (indType) {
        this._PurchaseOrderProduct.individualPrices.netCostConversion = parseFloat(value.toString()) * parseFloat(this._PurchaseOrderProduct.individualPrices.netFactor.toString());
        this._PurchaseOrderProduct.individualPrices.netCost = parseFloat(this._PurchaseOrderProduct.individualPrices.baseCostNew.toString()) * parseFloat(this._PurchaseOrderProduct.individualPrices.netFactor.toString());
      } else {
        this._PurchaseOrderProduct.individualPrices.netCostConversion = parseFloat(this._PurchaseOrderProduct.individualPrices.convertionCost.toString()) * parseFloat(this._PurchaseOrderProduct.individualPrices.netFactor.toString());
        this._PurchaseOrderProduct.individualPrices.netCost = parseFloat(value.toString()) * parseFloat(this._PurchaseOrderProduct.individualPrices.netFactor.toString());

      }
    }
    if (type == 2) {
      this._PurchaseOrderProduct.individualPrices.netCostConversion = parseFloat(this._PurchaseOrderProduct.individualPrices.convertionCost.toString()) * parseFloat(value);
      this._PurchaseOrderProduct.individualPrices.netCost = parseFloat(this._PurchaseOrderProduct.individualPrices.baseCostNew.toString()) * parseFloat(value);
    }
    if (type == 3) {

      this.NetCost(value, indType, this._PurchaseOrderProduct.supplierExchangeRate, idPackagingType);
      if (indType) {
        this._PurchaseOrderProduct.individualPrices.netFactor = parseFloat(value) / parseFloat(this._PurchaseOrderProduct.individualPrices.convertionCost.toString());
        this._PurchaseOrderProduct.individualPrices.salesNetCostConvertion = parseFloat(value) * parseFloat(this._PurchaseOrderProduct.individualPrices.netSalesFactor.toString());
        this._PurchaseOrderProduct.individualPrices.salesNetCost = parseFloat(this._PurchaseOrderProduct.individualPrices.netCost.toString()) * parseFloat(this._PurchaseOrderProduct.individualPrices.netSalesFactor.toString());
        this.NetSellingCost(indType ? this._PurchaseOrderProduct.individualPrices.salesNetCostConvertion.toString() : this._PurchaseOrderProduct.individualPrices.salesNetCost.toString(), indType, exchangeRate, idPackagingType);
      } else {
        if (this._PurchaseOrderProduct.individualPrices.baseCostNew == 0)//condicion agregada por sergio  cuando el costo base este en 0
          this._PurchaseOrderProduct.individualPrices.netFactor = 1
        else
          this._PurchaseOrderProduct.individualPrices.netFactor = parseFloat(value) / parseFloat(this._PurchaseOrderProduct.individualPrices.baseCostNew.toString());

        this._PurchaseOrderProduct.individualPrices.salesNetCostConvertion = parseFloat(this._PurchaseOrderProduct.individualPrices.netCostConversion.toString()) * parseFloat(this._PurchaseOrderProduct.individualPrices.netSalesFactor.toString());
        this._PurchaseOrderProduct.individualPrices.salesNetCost = parseFloat(value) * parseFloat(this._PurchaseOrderProduct.individualPrices.netSalesFactor.toString());
        this.NetSellingCost(indType ? this._PurchaseOrderProduct.individualPrices.salesNetCostConvertion.toString() : this._PurchaseOrderProduct.individualPrices.salesNetCost.toString(), indType, exchangeRate, idPackagingType);
      }
    }
    if (type < 3) {
      this._PurchaseOrderProduct.individualPrices.salesNetCostConvertion = parseFloat(this._PurchaseOrderProduct.individualPrices.netCostConversion.toString()) * parseFloat(this._PurchaseOrderProduct.individualPrices.netSalesFactor.toString());
      this._PurchaseOrderProduct.individualPrices.salesNetCost = parseFloat(this._PurchaseOrderProduct.individualPrices.netCost.toString()) * parseFloat(this._PurchaseOrderProduct.individualPrices.netSalesFactor.toString());
      this.NetSellingCost(indType ? this._PurchaseOrderProduct.individualPrices.salesNetCostConvertion.toString() : this._PurchaseOrderProduct.individualPrices.salesNetCost.toString(), indType, exchangeRate, idPackagingType);
    }
    if (type == 4) {
      this._PurchaseOrderProduct.individualPrices.salesNetCostConvertion = parseFloat(this._PurchaseOrderProduct.individualPrices.netCostConversion.toString()) * parseFloat(value);
      this._PurchaseOrderProduct.individualPrices.salesNetCost = parseFloat(this._PurchaseOrderProduct.individualPrices.netCost.toString()) * parseFloat(value);
    }
    if (type == 5) {
      this.NetSellingCost(value, indType, exchangeRate, idPackagingType);
      if (indType) {
        this._PurchaseOrderProduct.individualPrices.netSalesFactor = parseFloat(value) / parseFloat(this._PurchaseOrderProduct.individualPrices.netCostConversion.toString());
        this._PurchaseOrderProduct.individualPrices.convertionCost = parseFloat(value) * parseFloat(this._PurchaseOrderProduct.individualPrices.salesFactorNew.toString());
        this._PurchaseOrderProduct.individualPrices.pvpBaseNew = parseFloat(this._PurchaseOrderProduct.individualPrices.salesNetCost.toString()) * parseFloat(this._PurchaseOrderProduct.individualPrices.salesFactorNew.toString());
      } else {
        this._PurchaseOrderProduct.individualPrices.netSalesFactor = parseFloat(value) / parseFloat(this._PurchaseOrderProduct.individualPrices.netCost.toString());
        this._PurchaseOrderProduct.individualPrices.pvpConversionNew = parseFloat(this._PurchaseOrderProduct.individualPrices.salesNetCostConvertion.toString()) * parseFloat(this._PurchaseOrderProduct.individualPrices.salesFactorNew.toString());
        this._PurchaseOrderProduct.individualPrices.pvpBaseNew = parseFloat(value) * parseFloat(this._PurchaseOrderProduct.individualPrices.salesFactorNew.toString());
      }
    }
    if (type < 5) {
      this._PurchaseOrderProduct.individualPrices.pvpConversionNew = parseFloat(this._PurchaseOrderProduct.individualPrices.salesNetCostConvertion.toString()) * parseFloat(this._PurchaseOrderProduct.individualPrices.salesFactorNew.toString());
      this._PurchaseOrderProduct.individualPrices.pvpBaseNew = parseFloat(this._PurchaseOrderProduct.individualPrices.salesNetCost.toString()) * parseFloat(this._PurchaseOrderProduct.individualPrices.salesFactorNew.toString());
      this.PVP(indType ? this._PurchaseOrderProduct.individualPrices.pvpConversionNew.toString() : this._PurchaseOrderProduct.individualPrices.pvpBaseNew.toString(), indType, idPackagingType, exchangeRate);
    }
    if (type == 6) {
      this._PurchaseOrderProduct.individualPrices.pvpConversionNew = parseFloat(this._PurchaseOrderProduct.individualPrices.salesNetCostConvertion.toString()) * parseFloat(value);
      this._PurchaseOrderProduct.individualPrices.pvpBaseNew = parseFloat(this._PurchaseOrderProduct.individualPrices.salesNetCost.toString()) * parseFloat(value);
    }
    if (type == 7) {
      this.PVP(value, indType, idPackagingType, exchangeRate);
      if (indType) {
        this._PurchaseOrderProduct.individualPrices.salesFactorNew = parseFloat(value) / parseFloat(this._PurchaseOrderProduct.individualPrices.salesNetCostConvertion.toString());
        this.ValidateFactorFromPVP(value, this._PurchaseOrderProduct.individualPrices.salesFactorNew.toLocaleString(), 6, indType, idPackagingType)
      } else {
        this._PurchaseOrderProduct.individualPrices.salesFactorNew = parseFloat(value) / parseFloat(this._PurchaseOrderProduct.individualPrices.salesNetCost.toString());
        this.ValidateFactorFromPVP(value, this._PurchaseOrderProduct.individualPrices.salesFactorNew.toLocaleString(), 6, indType, idPackagingType)
      }
    }
  }

  // Metodo para calcular costos al momento de hacer el cambio.
  calculationOnChange(idPackagingType: number) {

    if (idPackagingType == EnumPackingType.Master) {
      // this._PurchaseOrderProduct.masterPrices.baseCostNew = this._PurchaseOrderProduct.individualPrices.baseCostNew * this._PurchaseOrderProduct.unitPerPackaging;
      // this._PurchaseOrderProduct.masterPrices.convertionCost = this._PurchaseOrderProduct.individualPrices.convertionCost * this._PurchaseOrderProduct.unitPerPackaging;
      // this._PurchaseOrderProduct.masterPrices.netCost = this._PurchaseOrderProduct.individualPrices.netCost * this._PurchaseOrderProduct.unitPerPackaging;
      // this._PurchaseOrderProduct.masterPrices.netCostConversion =  this._PurchaseOrderProduct.individualPrices.netCostConversion * this._PurchaseOrderProduct.unitPerPackaging;
      // this._PurchaseOrderProduct.masterPrices.salesNetCost =  this._PurchaseOrderProduct.individualPrices.salesNetCost * this._PurchaseOrderProduct.unitPerPackaging;
      // this._PurchaseOrderProduct.masterPrices.salesNetCostConvertion =  this._PurchaseOrderProduct.individualPrices.salesNetCostConvertion * this._PurchaseOrderProduct.unitPerPackaging;
      //this._PurchaseOrderProduct.masterPrices.pvpBaseNew =  this._PurchaseOrderProduct.individualPrices.pvpBaseNew * this._PurchaseOrderProduct.unitPerPackaging;
      //this._PurchaseOrderProduct.masterPrices.pvpConversionNew =  this._PurchaseOrderProduct.individualPrices.pvpConversionNew * this._PurchaseOrderProduct.unitPerPackaging;

      // this._PurchaseOrderProduct.masterPrices.netFactor = this._PurchaseOrderProduct.individualPrices.netFactor;
      // this._PurchaseOrderProduct.masterPrices.salesFactorNew = this._PurchaseOrderProduct.individualPrices.salesFactorNew;
      // this._PurchaseOrderProduct.masterPrices.netSalesFactor = this._PurchaseOrderProduct.individualPrices.netSalesFactor;

    } else if (idPackagingType == EnumPackingType.Individual) {
      this._PurchaseOrderProduct.individualPrices.baseCostNew = this._PurchaseOrderProduct.masterPrices.baseCostNew / this._PurchaseOrderProduct.unitPerPackaging;
      this._PurchaseOrderProduct.individualPrices.convertionCost = this._PurchaseOrderProduct.masterPrices.convertionCost / this._PurchaseOrderProduct.unitPerPackaging;
      this._PurchaseOrderProduct.individualPrices.netCost = this._PurchaseOrderProduct.masterPrices.netCost / this._PurchaseOrderProduct.unitPerPackaging;
      this._PurchaseOrderProduct.individualPrices.netCostConversion = this._PurchaseOrderProduct.masterPrices.netCostConversion / this._PurchaseOrderProduct.unitPerPackaging;
      this._PurchaseOrderProduct.individualPrices.salesNetCost = this._PurchaseOrderProduct.masterPrices.salesNetCost / this._PurchaseOrderProduct.unitPerPackaging;
      this._PurchaseOrderProduct.individualPrices.salesNetCostConvertion = this._PurchaseOrderProduct.masterPrices.salesNetCostConvertion / this._PurchaseOrderProduct.unitPerPackaging;
      this._PurchaseOrderProduct.individualPrices.pvpBaseNew = this._PurchaseOrderProduct.masterPrices.pvpBaseNew / this._PurchaseOrderProduct.unitPerPackaging;
      this._PurchaseOrderProduct.individualPrices.pvpConversionNew = this._PurchaseOrderProduct.masterPrices.pvpConversionNew / this._PurchaseOrderProduct.unitPerPackaging;

      this._PurchaseOrderProduct.individualPrices.netFactor = this._PurchaseOrderProduct.masterPrices.netFactor;
      this._PurchaseOrderProduct.individualPrices.netSalesFactor = this._PurchaseOrderProduct.masterPrices.netSalesFactor;
      this._PurchaseOrderProduct.individualPrices.salesFactorNew = this._PurchaseOrderProduct.individualPrices.mediumFactor;

    }
  }

  ShowIndividualOrMasterPrice(isIndividual: boolean, idPackagingType: number) {
    this.isIndividual = isIndividual;
    this.iduserlogin = this._Authservice.storeUser.id;
    this.calculationOnChange(idPackagingType)
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
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los tipos de empaques" });
    });
  }

  refreshViewFromTable(isindividual: boolean) {
    this.isIndividual = isindividual;
    this.iduserlogin = this._Authservice.storeUser.id;
  }

  onChanceTaxableDeductibles(data) {
    let e: any;
    if (data != null) {
      this.ischange = data.ischange;
      this.indtabtaxable = data.indtabtaxable;
      this.applycostsales = data.applycostsales;
      
      let netcost = data.product.individualPrices.indAdded == 1 ? data.product.individualPrices.netCost : data.product.masterPrices.netCost;
      let salesnetcost = data.product.individualPrices.indAdded == 1 ? data.product.individualPrices.salesNetCost : data.product.masterPrices.salesNetCost

      if (data.selecteds != undefined) {
        if (data.selecteds.length > 0) {
          if (data.product.individualPrices.indAdded == 1) {
            this.activate(e, netcost, 3, false, data.product.individualPrices.idPackingType, data.product,undefined);
            this.apply=true
          }
          else {
            this.activate(e, netcost, 3, false, data.product.masterPrices.idPackingType, data.product,undefined);
            this.apply=true
          }
        }
      } else {
        if (data.product.individualPrices.indAdded == 1) {
          this.activate(e, netcost, 3, false, data.product.individualPrices.idPackingType, undefined,undefined);
          this.apply=true
        }
        else {
          this.activate(e, netcost, 3, false, data.product.masterPrices.idPackingType, undefined,undefined);
          this.apply=true
        }
      }

      let previous = 0;
      if (data.selecteds != undefined) {
        if (data.selecteds.length > 0)
          previous = this._PurchaseOrderProduct.individualPrices.indAdded == 1 ? this._PurchaseOrderProduct.individualPrices.salesNetCost : this._PurchaseOrderProduct.masterPrices.salesNetCost
      } else {
        previous = this._PurchaseOrderProduct.individualPrices.indAdded == 1 ? this._PurchaseOrderProductCopy.individualPrices.salesNetCost : this._PurchaseOrderProductCopy.masterPrices.salesNetCost
      }
      if (data.product.individualPrices.indAdded == 1) {
        if (salesnetcost != previous){
          this.activate(e, salesnetcost, 5, false, data.product.individualPrices.idPackingType, data.product,undefined);
          this.apply=true}
      }
      else {
        if (salesnetcost != previous){
          this.activate(e, salesnetcost, 5, false, data.product.masterPrices.idPackingType, data.product,undefined);
          this.apply=true}
      }
      if (this.ischange) {
        this.saveChange.emit({ product: this._PurchaseOrderProduct });
        this.ischange = false;
      }

      this.indtabtaxable = true;
      this.applycostsales = false;
      this.apply=false
    }


  }

  //Setear modelo 
  SetModels() {
    this.TaxableListCost.taxables = [];

    this.TaxableListCost.deductibles = [];
    for (let i = 0; i < this._PurchaseOrderProduct.taxables.length; i++) {
      var a = new Taxable();
      a.idPurchaseOrderTaxableDeductible = this._PurchaseOrderProduct.taxables[i].id;
      a.idPurchaseOrder = this._PurchaseOrderProduct.taxables[i].idPurchaseOrder
      a.idPurchaseOrderDetail = this._PurchaseOrderProduct.taxables[i].idPurchaseOrderDetail;
      a.idRate = this._PurchaseOrderProduct.taxables[i].idRate;
      a.indDeductible = this._PurchaseOrderProduct.taxables[i].indDeductible;
      a.indTaxable = this._PurchaseOrderProduct.taxables[i].indTaxable;
      a.rate = this._PurchaseOrderProduct.taxables[i].rate;
      a.amount = this._PurchaseOrderProduct.taxables[i].amount;
      a.taxableDeductibleBaseId = this._PurchaseOrderProduct.taxables[i].taxableDeductibleBaseId;
      a.indPurchaseTaxable = this._PurchaseOrderProduct.taxables[i].indPurchaseTaxable;
      a.indPurchaseTaxableDetail = this._PurchaseOrderProduct.taxables[i].indPurchaseTaxableDetail;
      a.idTaxableType = this._PurchaseOrderProduct.taxables[i].idTaxableType;
      a.taxableType = this._PurchaseOrderProduct.taxables[i].taxableType;
      a.idApply = this._PurchaseOrderProduct.taxables[i].idApply;
      a.applyCost = this._PurchaseOrderProduct.taxables[i].applyCost;
      a.distributionCalculationId = this._PurchaseOrderProduct.taxables[i].distributionCalculationId;
      a.idTaxType = this._PurchaseOrderProduct.taxables[i].idTaxType;
      a.idTax = this._PurchaseOrderProduct.taxables[i].idTax;
      a.taxableDeductibleBase = this._PurchaseOrderProduct.taxables[i].taxableDeductibleBase;
      a.indFixedTax = this._PurchaseOrderProduct.taxables[i].indFixedTax;
      a.indProductsAll = this._PurchaseOrderProduct.taxables[i].indProductsAll;
      a.indBaseNetSale = this._PurchaseOrderProduct.taxables[i].indBaseNetSale;
      a.indBaseNetCost = this._PurchaseOrderProduct.taxables[i].indBaseNetCost;
      a.rate = this._PurchaseOrderProduct.taxables[i].rate;
      a.amount = this._PurchaseOrderProduct.taxables[i].amount;
      this.TaxableListCost.taxables.push(a);
    }
    for (let i = 0; i < this._PurchaseOrderProduct.deductibles.length; i++) {
      var d = new Deductible();
      d.idPurchaseOrderTaxableDeductible = this._PurchaseOrderProduct.deductibles[i].id;
      d.idPurchaseOrder = this._PurchaseOrderProduct.deductibles[i].idPurchaseOrder
      d.idPurchaseOrderDetail = this._PurchaseOrderProduct.deductibles[i].idPurchaseOrderDetail;
      //d.idRate = this._PurchaseOrderProduct.deductibles[i].idRate;
      d.indDeductible = this._PurchaseOrderProduct.deductibles[i].indDeductible;
      d.indTaxable = this._PurchaseOrderProduct.deductibles[i].indTaxable;
      d.rate = this._PurchaseOrderProduct.deductibles[i].rate;
      d.amount = this._PurchaseOrderProduct.deductibles[i].amount;
      d.taxableDeductibleBaseId = this._PurchaseOrderProduct.deductibles[i].taxableDeductibleBaseId;
      d.indPurchaseTaxable = this._PurchaseOrderProduct.deductibles[i].indPurchaseTaxable;
      d.indPurchaseTaxableDetail = this._PurchaseOrderProduct.deductibles[i].indPurchaseTaxableDetail;
      d.idTaxableType = this._PurchaseOrderProduct.deductibles[i].idTaxableType;
      d.taxableType = this._PurchaseOrderProduct.deductibles[i].taxableType;
      d.idApply = this._PurchaseOrderProduct.deductibles[i].idApply;
      d.applyCost = this._PurchaseOrderProduct.deductibles[i].applyCost;
      d.distributionCalculationId = this._PurchaseOrderProduct.deductibles[i].distributionCalculationId;
      d.idTaxType = this._PurchaseOrderProduct.deductibles[i].idTaxType;
      d.idTax = this._PurchaseOrderProduct.deductibles[i].idTax;
      d.taxableDeductibleBase = this._PurchaseOrderProduct.deductibles[i].taxableDeductibleBase;
      d.indFixedTax = this._PurchaseOrderProduct.deductibles[i].indFixedTax;
      d.indProductsAll = this._PurchaseOrderProduct.deductibles[i].indProductsAll;
      d.indBaseNetSale = this._PurchaseOrderProduct.deductibles[i].indBaseNetSale;
      d.indBaseNetCost = this._PurchaseOrderProduct.deductibles[i].indBaseNetCost;
      d.rate = this._PurchaseOrderProduct.deductibles[i].rate;
      d.amount = this._PurchaseOrderProduct.deductibles[i].amount;
      this.TaxableListCost.deductibles.push(d);
    }
  }

  next(input, idPackagingType: number) {
    if (idPackagingType === EnumPackingType.Master) {
      var bc = this._PurchaseOrderProduct.masterPrices.baseCostNew == null || this._PurchaseOrderProduct.masterPrices.baseCostNew == undefined ? 0 : this._PurchaseOrderProduct.masterPrices.baseCostNew;
      this.disabledNetCost = this.disabledCosts == false ? bc == 0 ? true : false : true;
      var bnc = this._PurchaseOrderProduct.masterPrices.netCost == null || this._PurchaseOrderProduct.masterPrices.netCost == undefined ? 0 : this._PurchaseOrderProduct.masterPrices.netCost;
      this.disabledNetSalesCost = this.disabledCosts == false ? bnc == 0 ? true : false : true;
      var bnsc = this._PurchaseOrderProduct.masterPrices.salesNetCostConvertion == null || this._PurchaseOrderProduct.masterPrices.salesNetCostConvertion == undefined ? 0 : this._PurchaseOrderProduct.masterPrices.salesNetCostConvertion;
      this.disabledPVP = this.disabledPrices == false ? bnsc == 0 ? true : false : true;
      input.input.nativeElement.focus();
    } else {
      var bc = this._PurchaseOrderProduct.individualPrices.baseCostNew == null || this._PurchaseOrderProduct.individualPrices.baseCostNew == undefined ? 0 : this._PurchaseOrderProduct.individualPrices.baseCostNew;
      this.disabledNetCost = this.disabledCosts == false ? bc == 0 ? true : false : true;
      var bnc = this._PurchaseOrderProduct.individualPrices.netCost == null || this._PurchaseOrderProduct.individualPrices.netCost == undefined ? 0 : this._PurchaseOrderProduct.individualPrices.netCost;
      this.disabledNetSalesCost = this.disabledCosts == false ? bnc == 0 ? true : false : true;
      var bnsc = this._PurchaseOrderProduct.individualPrices.salesNetCostConvertion == null || this._PurchaseOrderProduct.individualPrices.salesNetCostConvertion == undefined ? 0 : this._PurchaseOrderProduct.individualPrices.salesNetCostConvertion;
      this.disabledPVP = this.disabledPrices == false ? bnsc == 0 ? true : false : true;
      input.input.nativeElement.focus();
    }
  }


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
      if (this._PurchaseOrderProduct.individualPrices.minimunFactor <= 0 ||
        this._PurchaseOrderProduct.individualPrices.mediumFactor <= 0 ||
        this._PurchaseOrderProduct.individualPrices.maximunFactor <= 0) {
        this._PurchaseOrderProduct.individualPrices.salesFactorNew = 0;
        event.target.value = "0,00"
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "No puede colocar factor de venta porque no tiene factores de validación configurados." });
      } else if (valueNumber < this._PurchaseOrderProduct.individualPrices.minimunFactor) {
        event.target.value = parseFloat(String(this._PurchaseOrderProduct.individualPrices.mediumFactor)).toFixed(2).replace(".", ",");
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "El factor de venta no puede ser menor que el mínimo configurado" });
      } else if (valueNumber > this._PurchaseOrderProduct.individualPrices.maximunFactor) {
        event.target.value = parseFloat(String(this._PurchaseOrderProduct.individualPrices.mediumFactor)).toFixed(2).replace(".", ",");
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "El factor de venta no puede ser mayor que el máximo configurado" });
      } else {
        this.activate(event, event.target.value.toString(), type, indType, idPackagingType, undefined,undefined)
      }
    } else {
      if (this._PurchaseOrderProduct.masterPrices.minimunFactor <= 0 ||
        this._PurchaseOrderProduct.masterPrices.mediumFactor <= 0 ||
        this._PurchaseOrderProduct.masterPrices.maximunFactor <= 0) {
        this._PurchaseOrderProduct.masterPrices.salesFactorNew = 0;
        event.target.value = "0,00"
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "No puede colocar factor de venta porque no tiene factores de validación configurados." });
      } else if (valueNumber < this._PurchaseOrderProduct.masterPrices.minimunFactor) {
        event.target.value = parseFloat(String(this._PurchaseOrderProduct.masterPrices.mediumFactor)).toFixed(2).replace(".", ",");
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "El factor de venta no puede ser menor que el minimo configurado" });
      } else if (valueNumber > this._PurchaseOrderProduct.masterPrices.maximunFactor) {
        event.target.value = parseFloat(String(this._PurchaseOrderProduct.masterPrices.mediumFactor)).toFixed(2).replace(".", ",");
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "El factor de venta no puede ser mayor que el máximo configurado" });
      } else {
        this.activate(event, event.target.value.toString(), type, indType, idPackagingType, undefined,undefined)
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
      if (this._PurchaseOrderProduct.individualPrices.minimunFactor <= 0 ||
        this._PurchaseOrderProduct.individualPrices.mediumFactor <= 0 ||
        this._PurchaseOrderProduct.individualPrices.maximunFactor <= 0) {
        this._PurchaseOrderProduct.individualPrices.salesFactorNew = 0.00;
        ///this._PurchaseOrderProduct.individualPrices.pvpConversionNew = parseFloat(this._PurchaseOrderProduct.individualPrices.salesNetCostConvertion.toString() * parseFloat(value);
        this._PurchaseOrderProduct.individualPrices.pvpBaseNew = parseFloat(this._PurchaseOrderProduct.individualPrices.salesNetCost.toString()) * parseFloat(value);
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "No puede colocar factor de venta porque no tiene factores de validación configurados." });
      } else if (valueNumber < this._PurchaseOrderProduct.individualPrices.minimunFactor) {

        this._PurchaseOrderProduct.individualPrices.salesFactorNew = this._PurchaseOrderProduct.individualPrices.mediumFactor;
        this._PurchaseOrderProduct.individualPrices.pvpConversionNew = this._PurchaseOrderProduct.individualPrices.salesNetCostConvertion * this._PurchaseOrderProduct.individualPrices.salesFactorNew;
        this._PurchaseOrderProduct.individualPrices.pvpBaseNew = this._PurchaseOrderProduct.individualPrices.salesNetCost * this._PurchaseOrderProduct.individualPrices.salesFactorNew;
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "El factor de venta no puede ser menor que el mínimo configurado" });
      } else if (valueNumber > this._PurchaseOrderProduct.individualPrices.maximunFactor) {
        this._PurchaseOrderProduct.individualPrices.salesFactorNew = this._PurchaseOrderProduct.individualPrices.mediumFactor;
        this._PurchaseOrderProduct.individualPrices.pvpConversionNew = this._PurchaseOrderProduct.individualPrices.salesNetCostConvertion * this._PurchaseOrderProduct.individualPrices.salesFactorNew;
        this._PurchaseOrderProduct.individualPrices.pvpBaseNew = this._PurchaseOrderProduct.individualPrices.salesNetCost * this._PurchaseOrderProduct.individualPrices.salesFactorNew;
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "El factor de venta no puede ser mayor que el máximo configurado" });
      } else {
        //this.activate(event,event.target.value.toString(),type,indType,idPackagingType)
      }
    } else {
      if (this._PurchaseOrderProduct.masterPrices.minimunFactor <= 0 ||
        this._PurchaseOrderProduct.masterPrices.mediumFactor <= 0 ||
        this._PurchaseOrderProduct.masterPrices.maximunFactor <= 0) {
        this._PurchaseOrderProduct.masterPrices.salesFactorNew = 0.00;
        this._PurchaseOrderProduct.masterPrices.pvpConversionNew = parseFloat(this._PurchaseOrderProduct.individualPrices.salesNetCostConvertion.toString()) * parseFloat(value);
        this._PurchaseOrderProduct.masterPrices.pvpBaseNew = parseFloat(this._PurchaseOrderProduct.individualPrices.salesNetCost.toString()) * parseFloat(value);
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "No puede colocar factor de venta porque no tiene factores de validación configurados." });
      } else if (valueNumber < this._PurchaseOrderProduct.masterPrices.minimunFactor) {
        this._PurchaseOrderProduct.masterPrices.salesFactorNew = this._PurchaseOrderProduct.masterPrices.mediumFactor;
        this._PurchaseOrderProduct.masterPrices.pvpConversionNew = this._PurchaseOrderProduct.masterPrices.salesNetCostConvertion * this._PurchaseOrderProduct.masterPrices.salesFactorNew;
        this._PurchaseOrderProduct.masterPrices.pvpBaseNew = this._PurchaseOrderProduct.masterPrices.salesNetCost * this._PurchaseOrderProduct.masterPrices.salesFactorNew;
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "El factor de venta no puede ser menor que el minimo configurado" });
      } else if (valueNumber > this._PurchaseOrderProduct.masterPrices.maximunFactor) {
        this._PurchaseOrderProduct.masterPrices.salesFactorNew = this._PurchaseOrderProduct.masterPrices.mediumFactor;
        this._PurchaseOrderProduct.masterPrices.pvpConversionNew = parseFloat(this._PurchaseOrderProduct.masterPrices.salesNetCostConvertion.toString()) * this._PurchaseOrderProduct.masterPrices.salesFactorNew;
        this._PurchaseOrderProduct.masterPrices.pvpBaseNew = parseFloat(this._PurchaseOrderProduct.masterPrices.salesNetCost.toString()) * this._PurchaseOrderProduct.masterPrices.salesFactorNew;
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: "El factor de venta no puede ser mayor que el máximo configurado" });
      } else {
        // this.activate(event,event.target.value.toString(),type,indType,idPackagingType)
      }
    }
  }



  clearPrices(idPackagingType: number) {
    if (idPackagingType == EnumPackingType.Master) {
      this._PurchaseOrderProduct.masterPrices.baseCostNew = 0.00;
      this._PurchaseOrderProduct.masterPrices.convertionCost = 0.00;
      this._PurchaseOrderProduct.masterPrices.netCost = 0.00;
      this._PurchaseOrderProduct.masterPrices.netCostConversion = 0.00;
      this._PurchaseOrderProduct.masterPrices.salesNetCost = 0.00;
      this._PurchaseOrderProduct.masterPrices.salesNetCostConvertion = 0.00;
      this._PurchaseOrderProduct.masterPrices.pvpBaseNew = 0.00;
      this._PurchaseOrderProduct.masterPrices.pvpConversionNew = 0.00
      this._PurchaseOrderProduct.masterPrices.salesFactorNew = this._PurchaseOrderProduct.masterPrices.mediumFactor;
    } else if (idPackagingType == EnumPackingType.Individual) {
      this._PurchaseOrderProduct.individualPrices.baseCostNew = 0.00;
      this._PurchaseOrderProduct.individualPrices.convertionCost = 0.00;
      this._PurchaseOrderProduct.individualPrices.netCost = 0.00;
      this._PurchaseOrderProduct.individualPrices.netCostConversion = 0.00;
      this._PurchaseOrderProduct.individualPrices.salesNetCost = 0.00;
      this._PurchaseOrderProduct.individualPrices.salesNetCostConvertion = 0.00;
      this._PurchaseOrderProduct.individualPrices.pvpBaseNew = 0.00;
      this._PurchaseOrderProduct.individualPrices.pvpConversionNew = 0.00;
      this._PurchaseOrderProduct.individualPrices.salesFactorNew = this._PurchaseOrderProduct.individualPrices.mediumFactor;
    }
  }
}
