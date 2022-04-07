import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfirmationService, ConfirmEventType, MessageService, SelectItem } from 'primeng/api';
import { Coins } from 'src/app/models/masters/coin';
import { ExchangeRates } from 'src/app/models/masters/exchange-rates';
import { Packing } from 'src/app/models/products/packing';
import { PackingByBranchOffice } from 'src/app/models/products/packingbybranchoffice';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { CompanyService } from 'src/app/modules/masters/companies/shared/services/company.service';
import { ExchangeRatesFilter } from 'src/app/modules/masters/exchange-rates/shared/filters/exchange-rates-filter';
import { ExchangeRatesService } from 'src/app/modules/masters/exchange-rates/shared/service/exchange-rates.service';
import { PackingFilter } from '../../../shared/filters/packing-filter';
import { PackingService } from '../../../shared/services/packingservice/packing.service';
import { ProductbranchofficeService } from '../../../shared/services/productbranchofficeservice/productbranchoffice.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { PermissionByUserByModule } from 'src/app/models/security/PermissionByUserByModule';
import { ValidationFactorFilter } from '../../../shared/filters/validationfactorfilter';
import { ValidationFactor } from 'src/app/models/products/validationfactor';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';

@Component({
  selector: 'app-new-prices-costs',
  templateUrl: './new-prices-costs.component.html',
  styleUrls: ['./new-prices-costs.component.scss']
})
export class NewPricesCostsComponent implements OnInit {

  @Input("showDialog") showDialog : boolean = false;
  @Input("idproduct") idproduct : number = 0;
  @Input("idBranchOffice") idBranchOffice : number = 0;
  @Input("packingBranchOfficeListDB") packingBranchOfficeListDB: PackingByBranchOffice[];
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output("refreshPackingBranchOffice") refreshPackingBranchOffice = new EventEmitter();
  @Input("availableCompaniesBranchOfficeApp") availableCompaniesBranchOfficeApp: PermissionByUserByModule[] = [];
  coinsList: SelectItem[];
  packingList: SelectItem[];
  @Input("packingBranchOffice") packingBranchOffice: PackingByBranchOffice;
  packingBranchOfficeTemp: PackingByBranchOffice = new PackingByBranchOffice();
  submitted: boolean = false;
  packingFilter: PackingFilter = new PackingFilter();  
  baseCoin: string = "";
  conversionCoin: string = "";
  exchangeRate: number = 0;
  provisionalExchangeRate = 0;
  indhardcurrency: boolean = false;
  validations: Validations = new Validations();
  basesymbolcoin: string = "";
  permissionsIDs = {...Permissions};
  showCosts: boolean = false;
  showPrices: boolean = false;
  disabledCosts: boolean = false;
  disabledPrices: boolean = false;
  disabledNetCost: boolean = false;
  disabledNetSalesCost: boolean = false;
  disabledPVP: boolean = false;
  disabledSaleFactor: boolean = false;
  confirmExchangeRateChange: boolean = false;
  showDialogProvisionalExchangeRate: boolean = false;
  minSaleFactor: number = 0;
  midSaleFactor: number = 0;
  maxSaleFactor: number = 0;
  value: string = "";
  type: number = 0;
  indType: boolean = false;
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
  saving: boolean = false;
  
  constructor(private messageService: MessageService,
    private productBrachOfficeService: ProductbranchofficeService,
    private packingService : PackingService,
    private coinsService: CoinsService,
    private exchangeRatesService: ExchangeRatesService,
    public userPermissions: UserPermissions,
    private confirmationService: ConfirmationService,
    private readonly loadingService: LoadingService,
    private authservice: AuthService) { }

  ngOnInit(): void {
    
  }

  ngOnShow(){
    this.minSaleFactor = 0;
    this.maxSaleFactor = 0;
    this.disabledSaleFactor = false;
    this.packingBranchOfficeTemp.idPacking = this.packingBranchOffice.idPacking;
    this.packingFilter.productId = this.idproduct;
    this.disabledNetCost = false;
    this.disabledNetSalesCost = false;
    this.disabledPVP = false;
    this.showCosts = this.availableCompaniesBranchOfficeApp.filter(x => x.idBranchOffice == this.idBranchOffice && (x.idAccessModule == this.permissionsIDs.CHECK_COSTS_PERMISSION_ID || x.idAccessModule == this.permissionsIDs.EDIT_COSTS_PERMISSION_ID)).length > 0 ? true : false;
    this.showPrices = this.availableCompaniesBranchOfficeApp.filter(x => x.idBranchOffice == this.idBranchOffice && (x.idAccessModule == this.permissionsIDs.CHECK_PRICES_PERMISSION_ID || x.idAccessModule == this.permissionsIDs.EDIT_PRICES_PERMISSION_ID)).length > 0 ? true : false;
    this.disabledCosts = this.availableCompaniesBranchOfficeApp.filter(x => x.idBranchOffice == this.idBranchOffice && x.idAccessModule == this.permissionsIDs.EDIT_COSTS_PERMISSION_ID).length == 0 ? true : false;
    this.disabledPrices = this.availableCompaniesBranchOfficeApp.filter(x => x.idBranchOffice == this.idBranchOffice && x.idAccessModule == this.permissionsIDs.EDIT_PRICES_PERMISSION_ID).length == 0 ? true : false;
    if (this.packingBranchOffice.idProduct <= 0) {
      
      this.disabledNetCost = true;
      this.disabledNetSalesCost = true;
      this.disabledPVP = true;
    }
    if (this.packingBranchOffice.idProductBranchOfficePacking > 0) {
      this.searchValidationFactor(this.idBranchOffice,this.packingBranchOffice.idPacking,this.idproduct)
    }
    if (this.disabledCosts) {
      this.disabledNetCost = true;
      this.disabledNetSalesCost = true;
    }else{
      var bc = this.packingBranchOffice.baseCost == null || this.packingBranchOffice.baseCost == undefined ? 0 : this.packingBranchOffice.baseCost;
      this.disabledNetCost = this.disabledCosts == false ?  bc == 0 ? true : false : true;
      var bnc = this.packingBranchOffice.baseNetCost == null || this.packingBranchOffice.baseNetCost == undefined ? 0 : this.packingBranchOffice.baseNetCost;
      this.disabledNetSalesCost = this.disabledCosts == false ? bnc == 0 ? true : false : true;
    }
    if (this.disabledPrices) {
      this.disabledPVP = true;
    }else{
      var bnsc = this.packingBranchOffice.netSellingCostBase == null || this.packingBranchOffice.netSellingCostBase == undefined ? 0 : this.packingBranchOffice.netSellingCostBase;
      this.disabledPVP = this.disabledPrices == false ? bnsc == 0 ? true : false : true;
    }
    this.searchPackingProduct();
    this.searchCoinsxCompany();
    //this.searchExchangeRates();
    
  }
  
  hideDialog(){
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
  }

  clear(event){
    if (event.target.value == "0,0000" || event.target.value == "0,00") {
      event.target.value = "";
    }
  }

  changeValidationFactor(){
    this.searchValidationFactor(this.idBranchOffice,this.packingBranchOffice.idPacking,this.idproduct)
  }
  
  searchValidationFactor(idBranchOffice: number, idPacking: number, idProduct: number){
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
      }else{
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
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los factores de validacion"});
    });
  }
  
  activate(event, value: string, type: number, indType: boolean){
    debugger
    event.target.value = (type == 2 || type == 4 || type == 6) && event.target.value == "" ? "0,00" : event.target.value == "" ? "0,0000" : event.target.value;
    if (type == 1 || type == 3 || type == 5 || type == 7) {
      var split = event.target.value.split(",");
      split[0] = split[0].replace(/[.]/gi,"");
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
    this.disabledNetCost = this.disabledCosts == false ?  bc == 0 ? true : false : true;
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
    this.calculationValue(value,type,indType, this.exchangeRate, this.exchangeRate);
  }
  next(input){
    debugger
    var bc = this.packingBranchOffice.baseCost == null || this.packingBranchOffice.baseCost == undefined ? 0 : this.packingBranchOffice.baseCost;
    this.disabledNetCost = this.disabledCosts == false ?  bc == 0 ? true : false : true;
    var bnc = this.packingBranchOffice.baseNetCost == null || this.packingBranchOffice.baseNetCost == undefined ? 0 : this.packingBranchOffice.baseNetCost;
    this.disabledNetSalesCost = this.disabledCosts == false ? bnc == 0 ? true : false : true;
    var bnsc = this.packingBranchOffice.netSellingCostBase == null || this.packingBranchOffice.netSellingCostBase == undefined ? 0 : this.packingBranchOffice.netSellingCostBase;
    this.disabledPVP = this.disabledPrices == false ? bnsc == 0 ? true : false : true;
    input.input.nativeElement.focus();
  }

  searchPackingProduct(){
    this.packingService.getPackingbyfilter(this.packingFilter).subscribe((data: Packing[]) => {
      data = data.sort((a, b) => a.packagingPresentation.name.localeCompare(b.packagingPresentation.name));
      this.packingList = data.map((item)=>({
        label: item.packagingPresentation.name + " X " + item.units,
        value: item.id
      }));
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los tipos de empaques"});
    });
  }

  searchExchangeRates(base: number, conversion: number){
    var filter = new ExchangeRatesFilter();
    filter.idOriginCurrency = conversion;
    filter.idDestinationCurrency = base;
    filter.idExchangeRateType = 1;
    this.exchangeRatesService.getExchangeRatesbyFilter(filter).subscribe((data: ExchangeRates[]) => {
      this.exchangeRate = data[0].conversionFactor;
      if (data[0].conversionFactor > 1) {
        this.indhardcurrency = true;
      }
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando la tasa de cambio"});
    });
  }

  searchCoinsxCompany(){
    var filter = new CoinxCompanyFilter();
    filter.idCompany = this.authservice.currentCompany;
    this.coinsService.getCoinxCompanyList(filter).subscribe((data: Coins[]) => {
      this.coinsList = data.map((item)=>({
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
        }else{
          this.conversionCoin = coin.name + " " + coin.symbology;
          conversionC = coin.id;
        }
      });
      this.searchExchangeRates(baseC, conversionC);
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los tipos de empaques"});
    });
  }

  Cost(value: string, indType: boolean, exchangeRate: number){
    debugger
    if (indType == true) {
      this.packingBranchOffice.baseCost = parseFloat(value) * parseFloat(exchangeRate.toString());
    }else{
      this.packingBranchOffice.conversionCost = parseFloat(value) / parseFloat(exchangeRate.toString());
    }
  }

  NetCost(value: string, indType: boolean, exchangeRate: number){
    if (indType == true) {
      this.packingBranchOffice.baseNetCost = parseFloat(value) * parseFloat(exchangeRate.toString());
    }else{
      this.packingBranchOffice.conversionNetCost = parseFloat(value) / parseFloat(exchangeRate.toString());
    }
  }

  NetSellingCost(value: string, indType: boolean,exchangeRateNetSaleCost: number){
    if (indType == true) {
      this.packingBranchOffice.netSellingCostBase = parseFloat(value) * parseFloat(exchangeRateNetSaleCost.toString());
    }else{
      this.packingBranchOffice.netSellingCostConversion = parseFloat(value) / parseFloat(exchangeRateNetSaleCost.toString());
    }
  }

  PVP(value: string, indType: boolean){
    if (indType == true) {
      this.packingBranchOffice.basePVP = parseFloat(value) * parseFloat(this.exchangeRate.toString());
    }else{
      this.packingBranchOffice.conversionPVP = parseFloat(value) / parseFloat(this.exchangeRate.toString());
    }
  }

  calculationValue(value: string, type: number, indType: boolean, exchangeRate: number, exchangeRateNetSaleCost: number){
      value = value == "" ? "0" : value;
      value = value.replace(/[.]/gi,"");
      value = value.replace(",",".");
      if (type == 1) {
        this.Cost(value, indType, exchangeRate);
        if (indType) {
          this.packingBranchOffice.conversionNetCost = parseFloat(value.toString()) * parseFloat(this.packingBranchOffice.netFactor.toString());
          this.packingBranchOffice.baseNetCost = parseFloat(this.packingBranchOffice.baseCost.toString()) * parseFloat(this.packingBranchOffice.netFactor.toString());
        }else{
          this.packingBranchOffice.conversionNetCost = parseFloat(this.packingBranchOffice.conversionCost.toString()) * parseFloat(this.packingBranchOffice.netFactor.toString());
          this.packingBranchOffice.baseNetCost = parseFloat(value.toString()) * parseFloat(this.packingBranchOffice.netFactor.toString());
        }
      }
      if (type == 2) {
          this.packingBranchOffice.conversionNetCost = parseFloat(this.packingBranchOffice.conversionCost.toString()) * parseFloat(value);
          this.packingBranchOffice.baseNetCost = parseFloat(this.packingBranchOffice.baseCost.toString()) * parseFloat(value);
      }
      if (type == 3) {
        this.NetCost(value, indType,exchangeRate);
        if (indType) {
          this.packingBranchOffice.netFactor = parseFloat(value) / parseFloat(this.packingBranchOffice.conversionCost.toString());
          this.packingBranchOffice.netSellingCostConversion = parseFloat(value) * parseFloat(this.packingBranchOffice.netSalesFactor.toString());
          this.packingBranchOffice.netSellingCostBase = parseFloat(this.packingBranchOffice.baseNetCost.toString()) * parseFloat(this.packingBranchOffice.netSalesFactor.toString());
        }else{
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
        this.NetSellingCost(value, indType,exchangeRateNetSaleCost);
        if (indType) {
          this.packingBranchOffice.netSalesFactor = parseFloat(value) / parseFloat(this.packingBranchOffice.conversionNetCost.toString());
          this.packingBranchOffice.conversionPVP =  parseFloat(value) * parseFloat(this.packingBranchOffice.sellingFactor.toString());
          this.packingBranchOffice.basePVP = parseFloat(this.packingBranchOffice.netSellingCostBase.toString()) * parseFloat(this.packingBranchOffice.sellingFactor.toString());
        }else{
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
        }else{
          this.packingBranchOffice.sellingFactor = parseFloat(value) / parseFloat(this.packingBranchOffice.netSellingCostBase.toString());
        }
        
      }
  }

  confirmExhangeRate(value: string, type: number, indType: boolean){
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Desea realizar los cálculos con la tasa actual?',
      accept: () => {
        this.calculationValue(value,type,indType, this.exchangeRate, this.exchangeRate)
      },
      reject: (type) => {
        switch(type) {
          case ConfirmEventType.REJECT:
            this.value = value;
            this.type = type;
            this.indType = indType;
            this.showDialogProvisionalExchangeRate = true;
          break;
          case ConfirmEventType.CANCEL:
          break;
        }
      }
    })
  }

  confirmNetSalesCostExhangeRate(value: string, type: number, indType: boolean){
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Desea actualizar el costo neto venta conversión con la nueva tasa?',
      accept: () => {
        //this.calculationValue(value,type,indType)
      },
      reject: (type) => {
        switch(type) {
          case ConfirmEventType.REJECT:
            debugger;
            this.calculationValue(value,type,indType, this.provisionalExchangeRate,this.exchangeRate)
          break;
          case ConfirmEventType.CANCEL:
          break;
        }
        
      }
    })
  }

  refreshCalculePricesCosts(){
    if (this.type < 4) {
      this.confirmNetSalesCostExhangeRate(this.value,this.type,this.indType);
    }else{
      this.calculationValue(this.value,this.type,this.indType, this.provisionalExchangeRate, this.exchangeRate)
    }
  }

  savePricesCosts(){
    this.saving = true;
    this.submitted = true;
    this.loadingService.startLoading('wait_saving');
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
      if (this.packingBranchOffice.idProduct > 0 && this.packingBranchOffice.idPacking == this.packingBranchOfficeTemp.idPacking && this.packingBranchOffice.idBranchOffice == this.idBranchOffice) {
        this.packingBranchOfficeListDB = this.packingBranchOfficeListDB.filter(x => x.idPacking != this.packingBranchOffice.idPacking && this.packingBranchOffice.idBranchOffice != this.idBranchOffice);
      }
      if (this.packingBranchOfficeListDB.filter(x => x.idPacking == this.packingBranchOffice.idPacking && x.idBranchOffice == this.idBranchOffice).length == 0) {
        if (this.packingBranchOffice.idPacking > 0) {
          var packingBranchOfficelist: PackingByBranchOffice[] = [];

          this.packingBranchOffice.idProduct = parseInt(this.idproduct.toString());
          this.packingBranchOffice.idPacking = this.packingBranchOffice.idPacking;
          this.packingBranchOffice.idBranchOffice = parseInt(this.idBranchOffice.toString());
          this.packingBranchOffice.idReason = 0;
          this.packingBranchOffice.idSuplier = this.packingBranchOffice.idSuplier == -1 ? 0 : this.packingBranchOffice.idSuplier;
          this.packingBranchOffice.idStatus = this.packingBranchOffice.idStatus == -1 ? 1 : this.packingBranchOffice.idStatus;
          packingBranchOfficelist.push(this.packingBranchOffice);
          
          this.productBrachOfficeService.postPackingBranchOffice(packingBranchOfficelist).subscribe((data)=>{
            if (data > 0) {
              this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
              this.showDialog = false;
              this.submitted = false;
              this.saving = false;
              this.refreshPackingBranchOffice.emit();
              this.showDialogChange.emit(this.showDialog);
            }else{
              this.saving = false;
              this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar los precios y costos"});
            }
          },(error)=>{
            this.saving = false;
          });
        }else{
          this.saving = false;
        }
        this.loadingService.stopLoading();
      }else{
        this.loadingService.stopLoading();
        this.saving = false;
        this.submitted = false;
        this.messageService.add({severity:'error', summary:'Error', detail: "Este empaque ya tiene un precio y costo registrado"});
      }
    }else{
      this.loadingService.stopLoading();
      this.saving = false;
        this.submitted = false;
        this.messageService.add({severity:'error', summary:'Error', detail: "El factor de venta debe estar entre los valores Mín y Máx de los Factores de validación"});
    }
    
  }
}
