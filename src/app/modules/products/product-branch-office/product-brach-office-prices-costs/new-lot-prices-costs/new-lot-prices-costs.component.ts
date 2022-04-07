import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfirmationService, ConfirmEventType, MessageService, SelectItem } from 'primeng/api';
import { Coins } from 'src/app/models/masters/coin';
import { ExchangeRates } from 'src/app/models/masters/exchange-rates';
import { Packing } from 'src/app/models/products/packing';
import { PackingByBranchOffice } from 'src/app/models/products/packingbybranchoffice';
import { CompaniesBranchOffice } from 'src/app/models/security/CompaniesBranchOffice';
import { PermissionByUserByModule } from 'src/app/models/security/PermissionByUserByModule';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { ExchangeRatesFilter } from 'src/app/modules/masters/exchange-rates/shared/filters/exchange-rates-filter';
import { ExchangeRatesService } from 'src/app/modules/masters/exchange-rates/shared/service/exchange-rates.service';
import { PackingFilter } from '../../../shared/filters/packing-filter';
import { PackingService } from '../../../shared/services/packingservice/packing.service';
import { ProductbranchofficeService } from '../../../shared/services/productbranchofficeservice/productbranchoffice.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { ValidationFactorFilter } from '../../../shared/filters/validationfactorfilter';
import { ValidationFactor } from 'src/app/models/products/validationfactor';
import { PackingByBranchOfficeFilter } from '../../../shared/filters/packingbybranchoffice-filter';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';

@Component({
  selector: 'app-new-lot-prices-costs',
  templateUrl: './new-lot-prices-costs.component.html',
  styleUrls: ['./new-lot-prices-costs.component.scss']
})
export class NewLotPricesCostsComponent implements OnInit {

  @Input("showDialog") showDialog : boolean = false;
  @Input("idproduct") idproduct : number = 0;
  @Input("idBranchOffice") idBranchOffice : number = 0;
  @Input("availableCompaniesBranchOfficeApp") availableCompaniesBranchOfficeApp: PermissionByUserByModule[] = [];
  @Input("packingBranchOfficeListDB") packingBranchOfficeListDB: PackingByBranchOffice[];
  @Output() showDialogChange = new EventEmitter<boolean>();
  branchOffices: PermissionByUserByModule[] = [];
  branchOfficeList: PermissionByUserByModule[] = [];
  selectedBranchOffices: PermissionByUserByModule[] = [];
  coinsList: SelectItem[];
  packingList: SelectItem[];
  packingBranchOffice: PackingByBranchOffice = new PackingByBranchOffice();
  submitted: boolean = false;
  packingFilter: PackingFilter = new PackingFilter();  
  baseCoin: string = "";
  conversionCoin: string = "";
  exchangeRate: number = 0;
  indhardcurrency: boolean = false;
  validations: Validations = new Validations();
  @Output("refreshLotPackingBranchOffice") refreshLotPackingBranchOffice = new EventEmitter();
  basesymbolcoin: string = "";
  permissionsIDs = {...Permissions};
  disabledNetCost: boolean = false;
  disabledNetSalesCost: boolean = false;
  disabledPVP: boolean = false;
  provisionalExchangeRate: number = 0;
  showDialogProvisionalExchangeRate: boolean = false;
  value: string = "";
  type: number = 0;
  indType: boolean = false;
  checkAllBranchOffice:boolean = false;
  validationFactorList: ValidationFactor[] = [];
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
    private readonly loadingService: LoadingService) { }

  ngOnInit(): void {
    
  }

  ngOnShow(){
    this.branchOfficeList = [];
    this.branchOffices = [];
    var branchs = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.EDIT_PRICES_PERMISSION_ID);
    branchs.forEach(item => {
      if (this.branchOffices.filter(x => x.idBranchOffice == item.idBranchOffice).length == 0) {
        this.branchOffices.push(item);
      }
    });
    branchs = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.EDIT_COSTS_PERMISSION_ID);
    branchs.forEach(item => {
      if (this.branchOffices.filter(x => x.idBranchOffice == item.idBranchOffice).length == 0) {
        this.branchOffices.push(item);
      }
    });
    this.packingFilter.productId = this.idproduct;
    if (this.packingBranchOffice.idProduct <= 0) {
      this.packingBranchOffice = new PackingByBranchOffice();
    }
    this.disabledNetCost = true;
    this.disabledNetSalesCost = true;
    this.disabledPVP = true;
    this.searchPackingProduct();
    this.searchCoinsxCompany();
    //this.searchExchangeRates();
  }

  checkAllBranchOffices(){
    if (this.checkAllBranchOffice) {
      this.selectedBranchOffices = [];
      var branchselected: PermissionByUserByModule[] = [];
      this.branchOfficeList.forEach(branchoffice => {
        branchselected.push(branchoffice);
      });
      this.selectedBranchOffices = branchselected;
    }else{
      this.selectedBranchOffices = [];
    }
    
  }

  activate(event,value: string, type: number, indType: boolean){
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
    this.disabledNetCost = bc == 0 ? true : false;
    var bnc = this.packingBranchOffice.baseNetCost == null || this.packingBranchOffice.baseNetCost == undefined ? 0 : this.packingBranchOffice.baseNetCost;
    this.disabledNetSalesCost = bnc == 0 ? true : false;
    var bnsc = this.packingBranchOffice.netSellingCostBase == null || this.packingBranchOffice.netSellingCostBase == undefined ? 0 : this.packingBranchOffice.netSellingCostBase;
    this.disabledPVP = bnsc == 0 ? true : false;
    this.calculationValue(value,type,indType, this.exchangeRate, this.exchangeRate);
  }
  next(input){
    var bc = this.packingBranchOffice.baseCost == null || this.packingBranchOffice.baseCost == undefined ? 0 : this.packingBranchOffice.baseCost;
    this.disabledNetCost = bc == 0 ? true : false;
    var bnc = this.packingBranchOffice.baseNetCost == null || this.packingBranchOffice.baseNetCost == undefined ? 0 : this.packingBranchOffice.baseNetCost;
    this.disabledNetSalesCost = bnc == 0 ? true : false;
    var bnsc = this.packingBranchOffice.netSellingCostBase == null || this.packingBranchOffice.netSellingCostBase == undefined ? 0 : this.packingBranchOffice.netSellingCostBase;
    this.disabledPVP = bnsc == 0 ? true : false;
    input.input.nativeElement.focus();
  }
  
  hideDialog(){
    this.checkAllBranchOffice = false;
    this.selectedBranchOffices = [];
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
  }

  clear(event){
    if (event.target.value == "0,0000" || event.target.value == "0,00") {
      event.target.value = "";
    }
  }

  changeValidationFactor(){
    this.searchValidationFactor(-1,this.packingBranchOffice.idPacking,this.idproduct)
    this.searchPricesCosts(this.packingBranchOffice.idPacking,this.idproduct);
  }

  searchPricesCosts(idPacking: number, idProduct: number){
    var filter = new PackingByBranchOfficeFilter();
    filter.idBranchOffice = -1;
    filter.idPacking = idPacking;
    filter.idProduct = idProduct;
    this.productBrachOfficeService.getPackingBranchOfficebyfilter(filter).subscribe((data: PackingByBranchOffice[]) => {
      this.branchOfficeList = [];
      this.branchOffices.forEach(bo => {
        if (data.filter(x => x.idBranchOffice == bo.idBranchOffice && x.idPacking == idPacking).length == 0) {
          this.branchOfficeList.push(bo);
        }
      });
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando las sucursales"});
    });
  }
  
  searchValidationFactor(idBranchOffice: number, idPacking: number, idProduct: number){
    var filter = new ValidationFactorFilter();
    filter.idBranchOffice = idBranchOffice;
    filter.idProduct = parseInt(idProduct.toString());
    filter.idPacking = parseInt(idPacking.toString());
    this.productBrachOfficeService.getValidationFactorbyfilter(filter).subscribe((data: ValidationFactor[]) => {
      this.validationFactorList = data;
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los factores de validacion"});
    });
  }

  searchPackingProduct(){
    this.packingService.getPackingbyfilter(this.packingFilter).subscribe((data: Packing[]) => {
      data = data.sort((a, b) => a.packagingPresentation.name.localeCompare(b.packagingPresentation.name));
      var packings:Packing[] = [];
      var branchs = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.MANAGE_VALIDATION_FACTOR_PERMISSION_ID);
      data.forEach(element => {
        var a = this.packingBranchOfficeListDB.filter(x => x.idPacking == element.id);
        if (a.length < branchs.length) {
          packings.push(element)
        }
      });
      this.packingList = packings.map((item)=>({
        label: item.packagingPresentation.name + " X " + item.units,
        value: item.id
      }));
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los tipos de empaques"});
    });
  }

  searchExchangeRates(base: number, conversion: number){
    var filter = new ExchangeRatesFilter();
    filter.idExchangeRateType = 1;
    filter.idOriginCurrency = conversion;
    filter.idDestinationCurrency = base;
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
    filter.idCompany = 1;
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

  Cost(value: string, indType: boolean, exchangeRate: number){
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
        this.Cost(value, indType,exchangeRate);
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

  savePointOrder(){
    this.saving = true;
    this.submitted = true;
    this.loadingService.startLoading('wait_saving');
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
    var exist: boolean = false;
    this.packingBranchOfficeListDB.forEach(pointorder => {
      if (this.selectedBranchOffices.filter(x => x.idBranchOffice == pointorder.idBranchOffice).length > 0 &&
      this.packingBranchOffice.idPacking == pointorder.idPacking) {
        exist = true;
      }
    });
    if (!exist) {
      if (this.selectedBranchOffices.length > 0) {
        if (this.packingBranchOffice.idPacking > 0) {
          var packingBranchOfficelist: PackingByBranchOffice[] = [];
          this.selectedBranchOffices.forEach(branchoffice => {
            var validationfactor = this.validationFactorList.find(x => x.idBranchOffice == branchoffice.idBranchOffice);

            var po = new PackingByBranchOffice();
            po.idProductBranchOfficePacking = -1;
            po.idProduct = parseInt(this.idproduct.toString());
            po.idPacking = this.packingBranchOffice.idPacking;
            po.idStatus = this.packingBranchOffice.idStatus = 1;
            po.idBranchOffice = parseInt(branchoffice.idBranchOffice.toString());
            po.idReason = 0;
            po.baseCost = this.packingBranchOffice.baseCost;
            po.baseNetCost = this.packingBranchOffice.baseNetCost;
            po.basePVP = validationfactor == null || validationfactor == undefined ? 0 : this.packingBranchOffice.sellingFactor >= validationfactor.minFactor && this.packingBranchOffice.sellingFactor <= validationfactor.maxFactor ? this.packingBranchOffice.basePVP : 0;//this.packingBranchOffice.basePVP;
            po.netSellingCostBase = this.packingBranchOffice.netSellingCostBase;
            po.conversionCost = this.packingBranchOffice.conversionCost;
            po.conversionNetCost = this.packingBranchOffice.conversionNetCost;
            po.conversionPVP = validationfactor == null || validationfactor == undefined ? 0 : this.packingBranchOffice.sellingFactor >= validationfactor.minFactor && this.packingBranchOffice.sellingFactor <= validationfactor.maxFactor ? this.packingBranchOffice.conversionPVP : 0;//this.packingBranchOffice.conversionPVP;
            po.netSellingCostConversion = this.packingBranchOffice.netSellingCostConversion;
            po.netFactor = this.packingBranchOffice.netFactor;
            po.sellingFactor = validationfactor == null || validationfactor == undefined ? 0 : this.packingBranchOffice.sellingFactor >= validationfactor.minFactor && this.packingBranchOffice.sellingFactor <= validationfactor.maxFactor ? this.packingBranchOffice.sellingFactor : 0;
            po.netSalesFactor = validationfactor == null || validationfactor == undefined ? 0 : this.packingBranchOffice.sellingFactor >= validationfactor.minFactor && this.packingBranchOffice.sellingFactor <= validationfactor.maxFactor ? this.packingBranchOffice.netSalesFactor : 0;
            po.idSuplier = 0;
            packingBranchOfficelist.push(po);
          });
          this.productBrachOfficeService.postPackingBranchOffice(packingBranchOfficelist).subscribe((data)=>{
            if (data > 0) {
              this.loadingService.stopLoading();
              this.messageService.add({severity:'success', summary:'Guardado', detail: "Guardado exitoso"});
              this.showDialog = false;
              this.submitted = false;
              this.saving = false;
              this.refreshLotPackingBranchOffice.emit();
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
      }else{
        this.saving = false;
        this.messageService.add({severity:'error', summary:'Error', detail: "Seleccione por lo menos una sucursal"});
      }
    }else{
      this.saving = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Existen sucursales registradas con el empaque seleccionado"});
    }
    this.loadingService.stopLoading();
  }

  refreshPackingBranchOffice(){

  }

}
