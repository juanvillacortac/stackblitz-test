import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { PackingByBranchOffice } from 'src/app/models/products/packingbybranchoffice';
import { CompaniesBranchOffice } from 'src/app/models/security/CompaniesBranchOffice';
import { PackingByBranchOfficeFilter } from '../../shared/filters/packingbybranchoffice-filter';
import { ProductbranchofficeService } from '../../shared/services/productbranchofficeservice/productbranchoffice.service';
import { DecimalPipe } from '@angular/common';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { Coins } from 'src/app/models/masters/coin';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { ProductBranchOfficeViewModel } from '../../shared/view-models/productbranchoffice.viewmodel';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { PermissionByUserByModule } from 'src/app/models/security/PermissionByUserByModule';
import { ValidationFactorFilter } from '../../shared/filters/validationfactorfilter';
import { ValidationFactor } from 'src/app/models/products/validationfactor';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';

@Component({
  selector: 'app-product-brach-office-prices-costs',
  templateUrl: './product-brach-office-prices-costs.component.html',
  styleUrls: ['./product-brach-office-prices-costs.component.scss'],
  providers: [DecimalPipe]
})
export class ProductBrachOfficePricesCostsComponent implements OnInit {

  @Input("idproduct") idproduct : number = 0;
  @Input("availableCompaniesBranchOfficeApp") availableCompaniesBranchOfficeApp: PermissionByUserByModule[] = [];
  branchOffices: PermissionByUserByModule[] = [];
  idBranchOffice : number = 0;
  ShowDialog: boolean = false;
  showDialogLot: boolean = false;
  packingBranchOfficeFilter: PackingByBranchOfficeFilter = new PackingByBranchOfficeFilter();
  packingBranchOfficeList: PackingByBranchOffice[] = [];
  packingBranchOfficeListDB: PackingByBranchOffice[] = [];
  selectedBranchOffices: any[] = [];
  packingBranchOffice: PackingByBranchOffice = new PackingByBranchOffice();
  selectedPackingBranchOffice: PackingByBranchOffice = new PackingByBranchOffice();
  productBranchOfficeList: ProductBranchOfficeViewModel[] = [];
  branchexpanded: number = -1;
  basesymbolcoin: string = "";
  conversionsymbolcoin: string = "";
  permissionsIDs = {...Permissions};
  saveLot: boolean = false;
  
  displayedColumnspackingBranchOffice: ColumnD<PackingByBranchOffice>[] =
  [
   {template: (data) => { return data.packingPresentation.name; }, header: 'Empaque',field: 'packingPresentation.name', display: 'table-cell'},
   {template: (data) => { return data.units; },field: 'units', header: 'Unidades', display: 'table-cell'},
   {template: (data) => { return data.packingType.name ; },field: 'packingTyp.name', header: 'Tipo de empaque', display: 'table-cell'},
   {template: (data) => { return this.decimalPipe.transform(data.baseCost, '.4'); },field: 'baseCost', header: 'Costo base', display: 'table-cell'},
   {template: (data) => { return this.decimalPipe.transform(data.conversionCost, '.4'); },field: 'conversionCost', header: 'Costo conversión', display: 'table-cell'},
   {template: (data) => { return this.decimalPipe.transform(data.netFactor, '.4'); },field: 'netFactor', header: 'Factor neto', display: 'table-cell'},
   {template: (data) => { return this.decimalPipe.transform(data.baseNetCost, '.4'); },field: 'baseNetCost', header: 'Costo neto base', display: 'table-cell'},
   {template: (data) => { return this.decimalPipe.transform(data.conversionNetCost, '.4'); },field: 'conversionNetCost', header: 'Costo neto conversión', display: 'table-cell'},
   {template: (data) => { return this.decimalPipe.transform(data.netSalesFactor, '.4'); },field: 'netSalesFactor', header: 'Factor neto venta', display: 'table-cell'},
   {template: (data) => { return this.decimalPipe.transform(data.netSellingCostBase, '.4'); },field: 'netSellingCostBase', header: 'Costo venta base', display: 'table-cell'},
   {template: (data) => { return this.decimalPipe.transform(data.netSellingCostConversion, '.4'); },field: 'netSellingCostConversion', header: 'Costo venta conversión', display: 'table-cell'},
   {template: (data) => { return this.decimalPipe.transform(data.sellingFactor, '.4'); },field: 'sellingFactor', header: 'Factor de venta', display: 'table-cell'},
   {template: (data) => { return this.decimalPipe.transform(data.basePVP, '.4'); },field: 'basePVP', header: 'PVP base', display: 'table-cell'},
   {template: (data) => { return this.decimalPipe.transform(data.conversionPVP, '.4'); },field: 'conversionPVP', header: 'PVP conversión', display: 'table-cell'},
  ];
  
  constructor(private productBrachOfficeService: ProductbranchofficeService,
    private messageService: MessageService,
    private decimalPipe: DecimalPipe,
    private coinsService: CoinsService,
    public userPermissions: UserPermissions,
    private readonly loadingService: LoadingService) { }

  ngOnInit(): void {
    var branchoffice: PermissionByUserByModule[] = [];
    var branchofficeeditcosts = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.EDIT_PRICES_PERMISSION_ID);
    var branchofficeeditprices = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.EDIT_PRICES_PERMISSION_ID);
    branchoffice = branchofficeeditcosts;
    branchofficeeditprices.forEach(element => {
      if (branchoffice.filter(x => x.idBranchOffice == element.idBranchOffice).length == 0) {
        branchoffice.push(element);
      }
    });
    this.saveLot = branchoffice.length >= 2;
    this.searchCoinsxCompany();
    this.searchPricesCosts(-1);
  }

  showAddLotPricesCosts(){
    this.showDialogLot = true;
  }

  searchPricesCostsbyBranchOffice(idBranchOffice: number){
    this.idBranchOffice = idBranchOffice;
    this.packingBranchOfficeFilter.idBranchOffice = parseInt(idBranchOffice.toString());
    this.packingBranchOfficeFilter.idProduct = parseInt(this.idproduct.toString());
    this.productBrachOfficeService.getPackingBranchOfficebyfilter(this.packingBranchOfficeFilter).subscribe((data: PackingByBranchOffice[]) => {
      this.packingBranchOfficeList = data;
      //this.packingBranchOfficeListDB = data;
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los precios y costos"});
    });
  }

  showAddPanelPricesCosts(event, idBranchOffice: number){
    event.stopPropagation();
    this.packingBranchOffice = new PackingByBranchOffice();
    this.packingBranchOffice.idProductBranchOfficePacking = -1;
    this.packingBranchOffice.idProduct = -1;
    this.idBranchOffice = idBranchOffice;
    this.ShowDialog = true;
  }

  showEditPanelPricesCosts(packingBranchOffice: PackingByBranchOffice, idBranchOffice: number){
    var pbo = new PackingByBranchOffice();
    pbo.idProductBranchOfficePacking = packingBranchOffice.idProductBranchOfficePacking;
    pbo.idProduct = packingBranchOffice.idProduct;
    pbo.idPacking = packingBranchOffice.idPacking;
    pbo.idBranchOffice = packingBranchOffice.idBranchOffice;
    pbo.idStatus = packingBranchOffice.idStatus;
    pbo.idReason = packingBranchOffice.idReason;
    pbo.idSuplier = packingBranchOffice.idSuplier;
    pbo.baseCost = packingBranchOffice.baseCost;
    pbo.baseNetCost = packingBranchOffice.baseNetCost;
    pbo.basePVP = packingBranchOffice.basePVP;
    pbo.netSellingCostBase = packingBranchOffice.netSellingCostBase;
    pbo.conversionCost = packingBranchOffice.conversionCost;
    pbo.conversionNetCost = packingBranchOffice.conversionNetCost;
    pbo.conversionPVP = packingBranchOffice.conversionPVP;
    pbo.netSellingCostConversion = packingBranchOffice.netSellingCostConversion;
    pbo.netFactor = packingBranchOffice.netFactor;
    pbo.sellingFactor = packingBranchOffice.sellingFactor;
    pbo.netSalesFactor = packingBranchOffice.netSalesFactor;
    pbo.indActiveSale = packingBranchOffice.indActiveSale;
    pbo.indActiveBuy = packingBranchOffice.indActiveBuy;
    pbo.indConsignment = packingBranchOffice.indConsignment;
    pbo.indIVA = packingBranchOffice.indIVA;
    pbo.indOnline = packingBranchOffice.indOnline;
    pbo.indShelf = packingBranchOffice.indShelf;
    pbo.indTower = packingBranchOffice.indTower;
    this.packingBranchOffice = pbo;
    this.idBranchOffice = idBranchOffice;
    this.branchexpanded = idBranchOffice;
    this.ShowDialog = true;
  }

  searchPricesCosts(idBranchOffice: number){
    this.loadingService.startLoading('wait_loading');
    this.packingBranchOfficeFilter.idBranchOffice = parseInt(idBranchOffice.toString());
    this.packingBranchOfficeFilter.idProduct = parseInt(this.idproduct.toString());
    this.productBrachOfficeService.getPackingBranchOfficebyfilter(this.packingBranchOfficeFilter).subscribe((data: PackingByBranchOffice[]) => {
      this.packingBranchOfficeList = data;
      this.packingBranchOfficeListDB = data;
      this.productBranchOfficeList = [];
      this.branchOffices = [];
      this.branchexpanded = idBranchOffice == -1 ? -1 : this.branchexpanded;
      var branchs = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.CHECK_PRICES_PERMISSION_ID);
      branchs.forEach(item => {
        if (this.branchOffices.filter(x => x.idBranchOffice == item.idBranchOffice).length == 0) {
          this.branchOffices.push(item);
        }
      });
      branchs = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.CHECK_COSTS_PERMISSION_ID);
      branchs.forEach(item => {
        if (this.branchOffices.filter(x => x.idBranchOffice == item.idBranchOffice).length == 0) {
          this.branchOffices.push(item);
        }
      });
      branchs = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.EDIT_PRICES_PERMISSION_ID);
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
      this.branchOffices.forEach(branchoffice => {
        var a = new ProductBranchOfficeViewModel();
        a.idBranchOffice = branchoffice.idBranchOffice;
        a.branchOffice = branchoffice.branchOffice;
        a.pricesCosts = [];
        a.checkPrices = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.CHECK_PRICES_PERMISSION_ID && x.idBranchOffice == branchoffice.idBranchOffice).length > 0 ? true : false,
        a.checkCosts = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.CHECK_COSTS_PERMISSION_ID && x.idBranchOffice == branchoffice.idBranchOffice).length > 0 ? true : false,
        a.editPrices = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.EDIT_PRICES_PERMISSION_ID && x.idBranchOffice == branchoffice.idBranchOffice).length > 0 ? true : false,
        a.editCosts = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.EDIT_COSTS_PERMISSION_ID && x.idBranchOffice == branchoffice.idBranchOffice).length > 0 ? true : false,
        this.productBranchOfficeList.push(a);
      });
      this.productBranchOfficeList.forEach(branchoffice => {
        branchoffice.pricesCosts = data.filter(x => x.idBranchOffice == branchoffice.idBranchOffice);
      });
      this.loadingService.stopLoading();
    }, (error: HttpErrorResponse)=>{
      this.loadingService.stopLoading();
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los precios y costos"});
    });
  }


  refreshLotPackingBranchOffice(){
    this.loadingService.startLoading('wait_loading');
    this.packingBranchOfficeFilter.idBranchOffice = -1;
    this.packingBranchOfficeFilter.idProduct = parseInt(this.idproduct.toString());
    this.productBrachOfficeService.getPackingBranchOfficebyfilter(this.packingBranchOfficeFilter).subscribe((data: PackingByBranchOffice[]) => {
      this.packingBranchOfficeList = data;
      this.packingBranchOfficeListDB = data;
      this.productBranchOfficeList = [];
      this.branchOffices = [];
      var branchs = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.CHECK_PRICES_PERMISSION_ID);
      branchs.forEach(item => {
        if (this.branchOffices.filter(x => x.idBranchOffice == item.idBranchOffice).length == 0) {
          this.branchOffices.push(item);
        }
      });
      branchs = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.CHECK_COSTS_PERMISSION_ID);
      branchs.forEach(item => {
        if (this.branchOffices.filter(x => x.idBranchOffice == item.idBranchOffice).length == 0) {
          this.branchOffices.push(item);
        }
      });
      branchs = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.EDIT_PRICES_PERMISSION_ID);
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
      this.branchOffices.forEach(branchoffice => {
        var a = new ProductBranchOfficeViewModel();
        a.idBranchOffice = branchoffice.idBranchOffice;
        a.branchOffice = branchoffice.branchOffice;
        a.pricesCosts = [];
        a.checkPrices = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.CHECK_PRICES_PERMISSION_ID && x.idBranchOffice == branchoffice.idBranchOffice).length > 0 ? true : false,
        a.checkCosts = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.CHECK_COSTS_PERMISSION_ID && x.idBranchOffice == branchoffice.idBranchOffice).length > 0 ? true : false,
        a.editPrices = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.EDIT_PRICES_PERMISSION_ID && x.idBranchOffice == branchoffice.idBranchOffice).length > 0 ? true : false,
        a.editCosts = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.EDIT_COSTS_PERMISSION_ID && x.idBranchOffice == branchoffice.idBranchOffice).length > 0 ? true : false,
        this.productBranchOfficeList.push(a);
      });
      this.productBranchOfficeList.forEach(branchoffice => {
        branchoffice.pricesCosts = data.filter(x => x.idBranchOffice == branchoffice.idBranchOffice);
      });
      this.branchexpanded = this.idBranchOffice;
      this.packingBranchOfficeList = this.idBranchOffice == 0 ? data : data.filter(x => x.idBranchOffice == this.idBranchOffice);
      this.loadingService.stopLoading();
    }, (error: HttpErrorResponse)=>{
      this.loadingService.stopLoading();
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los precios y costos"});
    });
  }

  searchCoinsxCompany(){
    var filter = new CoinxCompanyFilter();
    filter.idCompany = 1;
    this.coinsService.getCoinxCompanyList(filter).subscribe((data: Coins[]) => {
      data.forEach(coin => {
        if (coin.legalCurrency == true) {
          this.basesymbolcoin = coin.symbology;
          this.displayedColumnspackingBranchOffice.forEach(column => {
            column.header = column.header.includes("base") ? column.header + " " + coin.symbology : column.header;
          });
        }else{
          this.conversionsymbolcoin = coin.symbology;
          this.displayedColumnspackingBranchOffice.forEach(column => {
            column.header = column.header.includes("conversión") ? column.header + " " + coin.symbology : column.header;
          });
        }
      });
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los tipos de empaques"});
    });
  }

  onRowSelect(event){
    var pbo = new PackingByBranchOffice();
    pbo.idProductBranchOfficePacking = this.selectedPackingBranchOffice.idProductBranchOfficePacking;
    pbo.idProduct = this.selectedPackingBranchOffice.idProduct;
    pbo.idPacking = this.selectedPackingBranchOffice.idPacking;
    pbo.idBranchOffice = this.selectedPackingBranchOffice.idBranchOffice;
    pbo.idStatus = this.selectedPackingBranchOffice.idStatus;
    pbo.idReason = this.selectedPackingBranchOffice.idReason;
    pbo.idSuplier = this.selectedPackingBranchOffice.idSuplier;
    pbo.baseCost = this.selectedPackingBranchOffice.baseCost;
    pbo.baseNetCost = this.selectedPackingBranchOffice.baseNetCost;
    pbo.basePVP = this.selectedPackingBranchOffice.basePVP;
    pbo.netSellingCostBase = this.selectedPackingBranchOffice.netSellingCostBase;
    pbo.conversionCost = this.selectedPackingBranchOffice.conversionCost;
    pbo.conversionNetCost = this.selectedPackingBranchOffice.conversionNetCost;
    pbo.conversionPVP = this.selectedPackingBranchOffice.conversionPVP;
    pbo.netSellingCostConversion = this.selectedPackingBranchOffice.netSellingCostConversion;
    pbo.netFactor = this.selectedPackingBranchOffice.netFactor;
    pbo.sellingFactor = this.selectedPackingBranchOffice.sellingFactor;
    pbo.netSalesFactor = this.selectedPackingBranchOffice.netSalesFactor;
    pbo.indActiveSale = this.selectedPackingBranchOffice.indActiveSale;
    pbo.indActiveBuy = this.selectedPackingBranchOffice.indActiveBuy;
    pbo.indConsignment = this.selectedPackingBranchOffice.indConsignment;
    pbo.indIVA = this.selectedPackingBranchOffice.indIVA;
    pbo.indOnline = this.selectedPackingBranchOffice.indOnline;
    pbo.indShelf = this.selectedPackingBranchOffice.indShelf;
    pbo.indTower = this.selectedPackingBranchOffice.indTower;
    this.packingBranchOffice = pbo;
    this.idBranchOffice = this.selectedPackingBranchOffice.idBranchOffice;
    this.branchexpanded = this.selectedPackingBranchOffice.idBranchOffice;
    this.ShowDialog = true;
  }
}
