import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Coins } from 'src/app/models/masters/coin';
import { ExchangeRates } from 'src/app/models/masters/exchange-rates';
import { PackingByBranchOffice } from 'src/app/models/products/packingbybranchoffice';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { ExchangeRatesFilter } from 'src/app/modules/masters/exchange-rates/shared/filters/exchange-rates-filter';
import { ExchangeRatesService } from 'src/app/modules/masters/exchange-rates/shared/service/exchange-rates.service';
import { PackingByBranchOfficeFilter } from '../../../shared/filters/packingbybranchoffice-filter';
import { ProductbranchofficeService } from '../../../shared/services/productbranchofficeservice/productbranchoffice.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { ValidationFactor } from 'src/app/models/products/validationfactor';
import { ValidationFactorFilter } from '../../../shared/filters/validationfactorfilter';

@Component({
  selector: 'app-packing',
  templateUrl: './packing.component.html',
  styleUrls: ['./packing.component.scss']
})
export class PackingComponent implements OnInit {

  packingBranchOfficeList: PackingByBranchOffice[] = [];
  packingBranchOffice: PackingByBranchOffice = new PackingByBranchOffice();
  @Input("productPacking") productPacking: PackingByBranchOffice = new PackingByBranchOffice();
  selectedPricesCost: PackingByBranchOffice = new PackingByBranchOffice();
  exchangeRate: number = 0;
  submitted: boolean = false;
  basesymbolcoin: string = "";
  coinsList: SelectItem[];
  baseCoin: string = "";
  conversionCoin: string = "";
  showCosts: boolean = false;
  showPrices: boolean = false;
  disabledCosts: boolean = false;
  disabledPrices: boolean = false;
  disabledNetCost: boolean = false;
  disabledNetSalesCost: boolean = false;
  disabledPVP: boolean = false;
  disabledSaleFactor: boolean = false;
  permissionsIDs = { ...Permissions };
  minSaleFactor: number = 0;
  midSaleFactor: number = 0;
  maxSaleFactor: number = 0;
  @ViewChild("in2") in2: ElementRef;
  @ViewChild("in3") in3: ElementRef;
  @ViewChild("in4") in4: ElementRef;
  @ViewChild("in5") in5: ElementRef;
  @ViewChild("in6") in6: ElementRef;
  @ViewChild("in7") in7: ElementRef;
  @ViewChild("in8") in8: ElementRef;
  @ViewChild("in9") in9: ElementRef;
  @ViewChild("in10") in10: ElementRef;
  @ViewChild("in11") in11: ElementRef;
  @ViewChild("in12") in12: ElementRef;
  @ViewChild("in13") in13: ElementRef;
  @ViewChild("in14") in14: ElementRef;

  constructor(private productBrachOfficeService: ProductbranchofficeService,
    private exchangeRatesService: ExchangeRatesService,
    private coinsService: CoinsService,
    public userPermissions: UserPermissions,
    private messageService: MessageService) { }

  ngOnInit(): void {
  }

  searchPricesCostsbyBranchOffice(idBranchOffice: number, idProduct: number, idPacking: number) {
    //this.showCosts = this.userPermissions.allowed(this.permissionsIDs.CHECK_COSTS_PERMISSION_ID) || this.userPermissions.allowed(this.permissionsIDs.EDIT_COSTS_PERMISSION_ID);
    //this.showPrices = this.userPermissions.allowed(this.permissionsIDs.CHECK_PRICES_PERMISSION_ID) || this.userPermissions.allowed(this.permissionsIDs.EDIT_PRICES_PERMISSION_ID);
    this.disabledCosts = !this.userPermissions.allowed(this.permissionsIDs.EDIT_COSTS_PERMISSION_ID);
    this.disabledPrices = !this.userPermissions.allowed(this.permissionsIDs.EDIT_PRICES_PERMISSION_ID);

    var packingBranchOfficeFilter: PackingByBranchOfficeFilter = new PackingByBranchOfficeFilter();
    packingBranchOfficeFilter.idBranchOffice = parseInt(idBranchOffice.toString());
    packingBranchOfficeFilter.idProduct = parseInt(idProduct.toString());
    packingBranchOfficeFilter.idPacking = parseInt(idPacking.toString());
    this.productBrachOfficeService.getPackingBranchOfficebyfilter(packingBranchOfficeFilter).subscribe((data: PackingByBranchOffice[]) => {
      this.packingBranchOfficeList = data;
      this.packingBranchOffice = data[0];
      if (this.disabledCosts) {
        this.disabledNetCost = true;
        this.disabledNetSalesCost = true;
      } else {
        var bc = this.packingBranchOffice.baseCost == null || this.packingBranchOffice.baseCost == undefined ? 0 : this.packingBranchOffice.baseCost;
        this.disabledNetCost = this.disabledCosts == false ? bc == 0 ? true : false : true;
        var bnc = this.packingBranchOffice.baseNetCost == null || this.packingBranchOffice.baseNetCost == undefined ? 0 : this.packingBranchOffice.baseNetCost;
        this.disabledNetSalesCost = this.disabledCosts == false ? bnc == 0 ? true : false : true;
      }
      if (this.disabledPrices) {
        this.disabledPVP = true;
      } else {
        var bnsc = this.packingBranchOffice.netSellingCostBase == null || this.packingBranchOffice.netSellingCostBase == undefined ? 0 : this.packingBranchOffice.netSellingCostBase;
        this.disabledPVP = this.disabledPrices == false ? bnsc == 0 ? true : false : true;
      }
      this.searchCoinsxCompany();
      this.searchValidationFactor(parseInt(idBranchOffice.toString()), parseInt(idPacking.toString()), parseInt(idProduct.toString()));
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los indicadores" });
    });
  }

  onRowSelect(event) {
    var po = new PackingByBranchOffice();
  }

  searchExchangeRates(base: number, conversion: number) {
    var filter = new ExchangeRatesFilter();
    filter.idOriginCurrency = conversion;
    filter.idDestinationCurrency = base;
    filter.idExchangeRateType = 1;
    this.exchangeRatesService.getExchangeRatesbyFilter(filter).subscribe((data: ExchangeRates[]) => {
      this.exchangeRate = data[0].conversionFactor;
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
          this.conversionCoin = coin.name + " " + coin.symbology;
          conversionC = coin.id;
        }
      });
      this.searchExchangeRates(baseC, conversionC);
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los tipos de empaques" });
    });
  }

  limit(){
    if(String(this.packingBranchOffice.baseCost).length > 14 || String(this.packingBranchOffice.conversionCost).length > 14 ||
    String(this.packingBranchOffice.baseNetCost).length > 14 || String(this.packingBranchOffice.conversionNetCost).length > 14 || String(this.packingBranchOffice.netSellingCostBase).length > 14 ||
    String(this.packingBranchOffice.netSellingCostConversion).length > 14 || String(this.packingBranchOffice.basePVP).length > 14 || String(this.packingBranchOffice.conversionPVP).length > 14 ){
        this.packingBranchOffice.baseCost = 0;
        this.packingBranchOffice.conversionCost = 0;
        this.packingBranchOffice.baseNetCost = 0;
        this.packingBranchOffice.conversionNetCost = 0;
        this.packingBranchOffice.netSellingCostBase = 0;
        this.packingBranchOffice.netSellingCostConversion = 0;
        this.packingBranchOffice.basePVP = 0;
        this.packingBranchOffice.conversionPVP = 0;
    }
  }
truntNumber(exchangeRate: number)
{

  var  numdecimal=parseFloat(exchangeRate.toString()).toFixed(4);
  return numdecimal;
}
  Cost(value: string, indType: boolean, exchangeRate: number) {
    var  numdecimal=parseFloat(exchangeRate.toString()).toFixed(4);
    if (indType == true) {
      this.packingBranchOffice.baseCost = parseFloat(value) * parseFloat(this.truntNumber(exchangeRate));
    } else {
      this.packingBranchOffice.conversionCost = parseFloat(value) / parseFloat(this.truntNumber(exchangeRate));
    }
  }

  NetCost(value: string, indType: boolean, exchangeRate: number) {
    if (indType == true) {
      this.packingBranchOffice.baseNetCost = parseFloat(value) * parseFloat(exchangeRate.toString());
    } else {
      this.packingBranchOffice.conversionNetCost = parseFloat(value) / parseFloat(exchangeRate.toString());
    }
  }

  NetSellingCost(value: string, indType: boolean, exchangeRateNetSaleCost: number) {
    if (indType == true) {
      this.packingBranchOffice.netSellingCostBase = parseFloat(value) * parseFloat(exchangeRateNetSaleCost.toString());
    } else {
      this.packingBranchOffice.netSellingCostConversion = parseFloat(value) / parseFloat(exchangeRateNetSaleCost.toString());
    }
  }

  PVP(value: string, indType: boolean) {
    if (indType == true) {
      this.packingBranchOffice.basePVP = parseFloat(value) * parseFloat(this.exchangeRate.toString());
    } else {
      this.packingBranchOffice.conversionPVP = parseFloat(value) / parseFloat(this.exchangeRate.toString());
    }
  }

  clear(event) {
    if (event.target.value == "0,0000" || event.target.value == "0,00") {
      event.target.value = "";
    }
  }

  calculationValue(value: string, type: number, indType: boolean, exchangeRate: number, exchangeRateNetSaleCost: number) {
    value = value == "" ? "0" : value;
    value = value.replace(/[.]/gi, "");
    value = value.replace(",", ".");
    if (type == 1) {
      this.Cost(value, indType, exchangeRate);
      if (indType) {
        this.packingBranchOffice.conversionNetCost = parseFloat(value.toString()) * parseFloat(this.packingBranchOffice.netFactor.toString());
        this.packingBranchOffice.baseNetCost = parseFloat(this.packingBranchOffice.baseCost.toString()) * parseFloat(this.packingBranchOffice.netFactor.toString());
      } else {
        this.packingBranchOffice.conversionNetCost = parseFloat(this.packingBranchOffice.conversionCost.toString()) * parseFloat(this.packingBranchOffice.netFactor.toString());
        this.packingBranchOffice.baseNetCost = parseFloat(value.toString()) * parseFloat(this.packingBranchOffice.netFactor.toString());
      }
    }
    if (type == 2) {
      this.packingBranchOffice.conversionNetCost = parseFloat(this.packingBranchOffice.conversionCost.toString()) * parseFloat(value);
      this.packingBranchOffice.baseNetCost = parseFloat(this.packingBranchOffice.baseCost.toString()) * parseFloat(value);
    }
    if (type == 3) {
      this.NetCost(value, indType, exchangeRate);
      if (indType) {
        this.packingBranchOffice.netFactor = parseFloat(value) / parseFloat(this.packingBranchOffice.conversionCost.toString());
        this.packingBranchOffice.netSellingCostConversion = parseFloat(value) * parseFloat(this.packingBranchOffice.netSalesFactor.toString());
        this.packingBranchOffice.netSellingCostBase = parseFloat(this.packingBranchOffice.baseNetCost.toString()) * parseFloat(this.packingBranchOffice.netSalesFactor.toString());
      } else {
        this.packingBranchOffice.netFactor = parseFloat(value) / parseFloat(this.packingBranchOffice.baseCost.toString());
        this.packingBranchOffice.netSellingCostConversion = parseFloat(this.packingBranchOffice.conversionNetCost.toString()) * parseFloat(this.packingBranchOffice.netSalesFactor.toString());
        this.packingBranchOffice.netSellingCostBase = parseFloat(value) * parseFloat(this.packingBranchOffice.netSalesFactor.toString());
      }
    }
    if (type < 3) {
      this.packingBranchOffice.netSellingCostConversion = parseFloat(this.packingBranchOffice.conversionNetCost.toString()) * parseFloat(this.packingBranchOffice.netSalesFactor.toString());
      this.packingBranchOffice.netSellingCostBase = parseFloat(this.packingBranchOffice.baseNetCost.toString()) * parseFloat(this.packingBranchOffice.netSalesFactor.toString());
    }
    if (type == 4) {
      this.packingBranchOffice.netSellingCostConversion = parseFloat(this.packingBranchOffice.conversionNetCost.toString()) * parseFloat(value);
      this.packingBranchOffice.netSellingCostBase = parseFloat(this.packingBranchOffice.baseNetCost.toString()) * parseFloat(value);
    }
    if (type == 5) {
      this.NetSellingCost(value, indType, exchangeRateNetSaleCost);
      if (indType) {
        this.packingBranchOffice.netSalesFactor = parseFloat(value) / parseFloat(this.packingBranchOffice.conversionNetCost.toString());
        this.packingBranchOffice.conversionPVP = parseFloat(value) * parseFloat(this.packingBranchOffice.sellingFactor.toString());
        this.packingBranchOffice.basePVP = parseFloat(this.packingBranchOffice.netSellingCostBase.toString()) * parseFloat(this.packingBranchOffice.sellingFactor.toString());
      } else {
        this.packingBranchOffice.netSalesFactor = parseFloat(value) / parseFloat(this.packingBranchOffice.baseNetCost.toString());
        this.packingBranchOffice.conversionPVP = parseFloat(this.packingBranchOffice.netSellingCostConversion.toString()) * parseFloat(this.packingBranchOffice.sellingFactor.toString());
        this.packingBranchOffice.basePVP = parseFloat(value) * parseFloat(this.packingBranchOffice.sellingFactor.toString());
      }
    }
    if (type < 5) {
      this.packingBranchOffice.conversionPVP = parseFloat(this.packingBranchOffice.netSellingCostConversion.toString()) * parseFloat(this.packingBranchOffice.sellingFactor.toString());
      this.packingBranchOffice.basePVP = parseFloat(this.packingBranchOffice.netSellingCostBase.toString()) * parseFloat(this.packingBranchOffice.sellingFactor.toString());
    }
    if (type == 6) {
      this.packingBranchOffice.conversionPVP = parseFloat(this.packingBranchOffice.netSellingCostConversion.toString()) * parseFloat(value);
      this.packingBranchOffice.basePVP = parseFloat(this.packingBranchOffice.netSellingCostBase.toString()) * parseFloat(value);
    }
    if (type == 7) {
      this.PVP(value, indType);
      if (indType) {
        this.packingBranchOffice.sellingFactor = parseFloat(value) / parseFloat(this.packingBranchOffice.netSellingCostConversion.toString());
      } else {
        this.packingBranchOffice.sellingFactor = parseFloat(value) / parseFloat(this.packingBranchOffice.netSellingCostBase.toString());
      }

    }

  }

  searchValidationFactor(idBranchOffice: number, idPacking: number, idProduct: number) {
    var filter = new ValidationFactorFilter();
    filter.idBranchOffice = idBranchOffice;
    filter.idProduct = parseInt(idProduct.toString());
    filter.idPacking = parseInt(idPacking.toString());
    this.productBrachOfficeService.getValidationFactorbyfilter(filter).subscribe((data: ValidationFactor[]) => {
      if (data.length == 0) {
        this.packingBranchOffice.sellingFactor = 0;
        this.midSaleFactor = 0;
        this.minSaleFactor = 0;
        this.maxSaleFactor = 0;
        this.disabledSaleFactor = true;
      } else {
        this.disabledSaleFactor = false;
        this.packingBranchOffice.sellingFactor = this.packingBranchOffice.idProductBranchOfficePacking <= 0 ? data[0].midFactor : this.packingBranchOffice.sellingFactor;
        this.midSaleFactor = data[0].midFactor;
        this.minSaleFactor = data[0].minFactor;
        this.maxSaleFactor = data[0].maxFactor;
        /* if (this.packingBranchOffice.netSellingCostBase > 0) {
          this.packingBranchOffice.conversionPVP = parseFloat(this.packingBranchOffice.netSellingCostConversion.toString()) * parseFloat(this.packingBranchOffice.sellingFactor.toString());
          this.packingBranchOffice.basePVP = parseFloat(this.packingBranchOffice.netSellingCostBase.toString()) * parseFloat(this.packingBranchOffice.sellingFactor.toString());
        } */
      }
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los factores de validacion" });
    });
  }

  activate(event, value: string, type: number, indType: boolean) {
    debugger
    event.target.value = (type == 2 || type == 4 || type == 6) && event.target.value == "" ? "0,00" : event.target.value == "" ? "0,0000" : event.target.value;
    if (type == 1 || type == 3 || type == 5 || type == 7) {
      var split = event.target.value.split(",");
      split[0] = split[0].replace(/[.]/gi, "");
      if (split[0].length > 14) {
        event.target.value = "0,0000";
        value = "0,0000"
        this.packingBranchOffice.baseCost = type == 1 ? 0 : this.packingBranchOffice.baseCost;
        this.packingBranchOffice.baseNetCost = type == 3 ? 0 : this.packingBranchOffice.baseNetCost;
        this.packingBranchOffice.netSellingCostBase = type == 5 ? 0 : this.packingBranchOffice.netSellingCostBase;
        this.packingBranchOffice.basePVP = type == 7 ? 0 : this.packingBranchOffice.basePVP;
        this.packingBranchOffice.conversionCost = type == 1 ? 0 : this.packingBranchOffice.conversionCost;
        this.packingBranchOffice.conversionNetCost = type == 3 ? 0 : this.packingBranchOffice.conversionNetCost;
        this.packingBranchOffice.netSellingCostConversion = type == 5 ? 0 : this.packingBranchOffice.netSellingCostConversion;
        this.packingBranchOffice.conversionPVP = type == 7 ? 0 : this.packingBranchOffice.conversionPVP;
      }
    }

    var bc = this.packingBranchOffice.baseCost == null || this.packingBranchOffice.baseCost == undefined ? 0 : this.packingBranchOffice.baseCost;
    this.disabledNetCost = this.disabledCosts == false ? bc == 0 ? true : false : true;
    var bnc = this.packingBranchOffice.baseNetCost == null || this.packingBranchOffice.baseNetCost == undefined ? 0 : this.packingBranchOffice.baseNetCost;
    this.disabledNetSalesCost = this.disabledCosts == false ? bnc == 0 ? true : false : true;
    var bnsc = this.packingBranchOffice.netSellingCostBase == null || this.packingBranchOffice.netSellingCostBase == undefined ? 0 : this.packingBranchOffice.netSellingCostBase;
    this.disabledPVP = this.disabledPrices == false ? bnsc == 0 ? true : false : true;

    this.packingBranchOffice.netFactor = this.packingBranchOffice.netFactor == null || this.packingBranchOffice.netFactor.toString() == "" ? 0 : this.packingBranchOffice.netFactor;
    this.packingBranchOffice.sellingFactor = this.packingBranchOffice.sellingFactor == null || this.packingBranchOffice.sellingFactor.toString() == "" ? 0 : this.packingBranchOffice.sellingFactor;
    this.packingBranchOffice.netSalesFactor = this.packingBranchOffice.netSalesFactor == null || this.packingBranchOffice.netSalesFactor.toString() == "" ? 0 : this.packingBranchOffice.netSalesFactor;
    /* if (value != "") {
      this.confirmExhangeRate(value,type,indType)
    } */
    this.calculationValue(value, type, indType, this.exchangeRate, this.exchangeRate);
  }
  next(input) {
    var bc = this.packingBranchOffice.baseCost == null || this.packingBranchOffice.baseCost == undefined ? 0 : this.packingBranchOffice.baseCost;
    this.disabledNetCost = this.disabledCosts == false ? bc == 0 ? true : false : true;
    var bnc = this.packingBranchOffice.baseNetCost == null || this.packingBranchOffice.baseNetCost == undefined ? 0 : this.packingBranchOffice.baseNetCost;
    this.disabledNetSalesCost = this.disabledCosts == false ? bnc == 0 ? true : false : true;
    var bnsc = this.packingBranchOffice.netSellingCostBase == null || this.packingBranchOffice.netSellingCostBase == undefined ? 0 : this.packingBranchOffice.netSellingCostBase;
    this.disabledPVP = this.disabledPrices == false ? bnsc == 0 ? true : false : true;
    input.input.nativeElement.focus();
  }

  savePricesCosts() {
    debugger
    /* if(String(this.packingBranchOffice.baseCost).length > 14 || String(this.packingBranchOffice.conversionCost).length > 14 ||
    String(this.packingBranchOffice.baseNetCost).length > 14 || String(this.packingBranchOffice.conversionNetCost).length > 14 || String(this.packingBranchOffice.netSellingCostBase).length > 14 ||
    String(this.packingBranchOffice.netSellingCostConversion).length > 14 || String(this.packingBranchOffice.basePVP).length > 14 || String(this.packingBranchOffice.conversionPVP).length > 14 ){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Exiten valores mayores a 14, por favor verifique." });
    }else{ */
      this.submitted = true;
      if (this.packingBranchOffice.sellingFactor >= this.minSaleFactor && this.packingBranchOffice.sellingFactor <= this.maxSaleFactor) {
        this.packingBranchOffice.baseCost = this.packingBranchOffice.baseCost == null || this.packingBranchOffice.baseCost.toString() == "" ? 0 : this.packingBranchOffice.baseCost;
        this.packingBranchOffice.baseNetCost = this.packingBranchOffice.baseNetCost == null || this.packingBranchOffice.baseNetCost.toString() == "" ? 0 : this.packingBranchOffice.baseNetCost;
        this.packingBranchOffice.netSellingCostBase = this.packingBranchOffice.netSellingCostBase == null || this.packingBranchOffice.netSellingCostBase.toString() == "" ? 0 : this.packingBranchOffice.netSellingCostBase;
        this.packingBranchOffice.basePVP = this.packingBranchOffice.basePVP == null || this.packingBranchOffice.basePVP.toString() == "" ? 0 : this.packingBranchOffice.basePVP;
        this.packingBranchOffice.conversionCost = this.packingBranchOffice.conversionCost == null || this.packingBranchOffice.conversionCost.toString() == "" ? 0 : this.packingBranchOffice.conversionCost;
        this.packingBranchOffice.conversionNetCost = this.packingBranchOffice.conversionNetCost == null || this.packingBranchOffice.conversionNetCost.toString() == "" ? 0 : this.packingBranchOffice.conversionNetCost;
        this.packingBranchOffice.netSellingCostConversion = this.packingBranchOffice.netSellingCostConversion == null || this.packingBranchOffice.netSellingCostConversion.toString() == "" ? 0 : this.packingBranchOffice.netSellingCostConversion;
        this.packingBranchOffice.conversionPVP = this.packingBranchOffice.conversionPVP == null || this.packingBranchOffice.conversionPVP.toString() == "" ? 0 : this.packingBranchOffice.conversionPVP;
        this.packingBranchOffice.netFactor = this.packingBranchOffice.netFactor == null || this.packingBranchOffice.netFactor.toString() == "" ? 0 : this.packingBranchOffice.netFactor;
        this.packingBranchOffice.sellingFactor = this.packingBranchOffice.sellingFactor == null || this.packingBranchOffice.sellingFactor.toString() == "" ? 0 : this.packingBranchOffice.sellingFactor;
        this.packingBranchOffice.netSalesFactor = this.packingBranchOffice.netSalesFactor == null || this.packingBranchOffice.netSalesFactor.toString() == "" ? 0 : this.packingBranchOffice.netSalesFactor;
  
        var packingBranchOfficelist: PackingByBranchOffice[] = [];
  
        this.packingBranchOffice.idProduct = parseInt(this.packingBranchOffice.idProduct.toString());
        this.packingBranchOffice.idPacking = this.packingBranchOffice.idPacking;
        this.packingBranchOffice.idBranchOffice = parseInt(this.packingBranchOffice.idBranchOffice.toString());
        this.packingBranchOffice.idReason = 0;
        this.packingBranchOffice.description = "";
        this.packingBranchOffice.idSuplier = this.packingBranchOffice.idSuplier == -1 ? 0 : this.packingBranchOffice.idSuplier;
        this.packingBranchOffice.idStatus = this.packingBranchOffice.idStatus == -1 ? 1 : this.packingBranchOffice.idStatus;
        packingBranchOfficelist.push(this.packingBranchOffice);
  
        this.productBrachOfficeService.postPackingBranchOffice(packingBranchOfficelist).subscribe((data) => {
          if (data > 0) {
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
            this.submitted = false;
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los precios y costos" });
          }
        }, (error) => {
          console.log(error);
        });
      } else {
        this.submitted = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "El factor de venta debe estar entre los valores mínimo y máximo de los factores de validación." });
      }
    //}
    

  }

}
