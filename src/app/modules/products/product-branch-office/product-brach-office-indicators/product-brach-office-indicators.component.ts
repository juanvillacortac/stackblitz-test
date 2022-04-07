import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { PackingByBranchOffice } from 'src/app/models/products/packingbybranchoffice';
import { CompaniesBranchOffice } from 'src/app/models/security/CompaniesBranchOffice';
import { PackingByBranchOfficeFilter } from '../../shared/filters/packingbybranchoffice-filter';
import { ProductbranchofficeService } from '../../shared/services/productbranchofficeservice/productbranchoffice.service';
import { ProductBranchOfficeViewModel } from '../../shared/view-models/productbranchoffice.viewmodel';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { PermissionByUserByModule } from 'src/app/models/security/PermissionByUserByModule';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';

@Component({
  selector: 'app-product-brach-office-indicators',
  templateUrl: './product-brach-office-indicators.component.html',
  styleUrls: ['./product-brach-office-indicators.component.scss']
})
export class ProductBrachOfficeIndicatorsComponent implements OnInit {

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
  selectedIndicators: PackingByBranchOffice = new PackingByBranchOffice();
  productBranchOfficeList: ProductBranchOfficeViewModel[] = [];
  branchexpanded: number = 0;
  permissionsIDs = {...Permissions};
  saveLot: boolean = false;
  
  displayedColumnspackingBranchOffice: ColumnD<PackingByBranchOffice>[] =
  [
   {template: (data) => { return data.packingPresentation.name; }, header: 'Empaque',field: 'packingPresentation.name', display: 'table-cell'},
   {template: (data) => { return data.packingType.name ; },field: 'packingType.name', header: 'Tipo de empaque', display: 'table-cell'},
   {template: (data) => { return data.indActiveBuy; },field: 'indActiveBuy', header: 'Compra activa', display: 'table-cell'},
   {template: (data) => { return data.indActiveSale; },field: 'indActiveSale', header: 'Venta activa', display: 'table-cell'},
   {template: (data) => { return data.indConsignment; },field: 'indConsignment', header: 'Producto consignación', display: 'table-cell'},
   {template: (data) => { return data.indOnline; },field: 'indOnline', header: 'Venta online', display: 'table-cell'},
   {template: (data) => { return data.indIVA; },field: 'indIVA', header: 'IVA', display: 'table-cell'},
   {template: (data) => { return data.indShelf; },field: 'indShelf', header: 'Anaquel', display: 'table-cell'},
   {template: (data) => { return data.indTower; },field: 'indTower', header: 'Torre', display: 'table-cell'},
   {template: (data) => { return data.idStatus; },field: 'idStatus', header: 'Estatus', display: 'table-cell'},
  ];
  
  constructor(private productBrachOfficeService: ProductbranchofficeService,
    private messageService: MessageService,
    public userPermissions: UserPermissions,
    private readonly loadingService: LoadingService) { }

  ngOnInit(): void {
    this.saveLot = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.MANAGE_INDICATORS_BRANCH_PRODUCT_PERMISSION_ID).length >= 2;
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
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los indicadores"});
    });
  }

  showAddPanelPricesCosts(event, idBranchOffice: number){
    event.stopPropagation();
    this.packingBranchOffice = new PackingByBranchOffice();
    this.packingBranchOffice.idStatus = 1;
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
      this.branchexpanded = idBranchOffice == -1 ? -1 : this.branchexpanded;
      this.branchOffices = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.MANAGE_INDICATORS_BRANCH_PRODUCT_PERMISSION_ID);
      this.branchOffices.forEach(branchoffice => {
        var a = new ProductBranchOfficeViewModel();
        a.idBranchOffice = branchoffice.idBranchOffice;
        a.branchOffice = branchoffice.branchOffice;
        a.validationsFactor = [];
        a.manageIndicators = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.MANAGE_INDICATORS_BRANCH_PRODUCT_PERMISSION_ID && x.idBranchOffice == branchoffice.idBranchOffice).length > 0 ? true : false,
        this.productBranchOfficeList.push(a);
      });
      this.productBranchOfficeList.forEach(branchoffice => {
        branchoffice.pricesCosts = data.filter(x => x.idBranchOffice == branchoffice.idBranchOffice);
      });
      this.loadingService.stopLoading();
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los indicadores"});
      this.loadingService.stopLoading();
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
      this.branchOffices = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.MANAGE_INDICATORS_BRANCH_PRODUCT_PERMISSION_ID);
      this.branchOffices.forEach(branchoffice => {
        var a = new ProductBranchOfficeViewModel();
        a.idBranchOffice = branchoffice.idBranchOffice;
        a.branchOffice = branchoffice.branchOffice;
        a.validationsFactor = [];
        a.manageIndicators = this.availableCompaniesBranchOfficeApp.filter(x => x.idAccessModule == this.permissionsIDs.MANAGE_INDICATORS_BRANCH_PRODUCT_PERMISSION_ID && x.idBranchOffice == branchoffice.idBranchOffice).length > 0 ? true : false,
        this.productBranchOfficeList.push(a);
      });
      this.productBranchOfficeList.forEach(branchoffice => {
        branchoffice.pricesCosts = data.filter(x => x.idBranchOffice == branchoffice.idBranchOffice);
      });
      this.branchexpanded = this.idBranchOffice;
      this.packingBranchOfficeList = this.idBranchOffice == 0 ? data : data.filter(x => x.idBranchOffice == this.idBranchOffice);
      this.loadingService.stopLoading();
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los indicadores"});
      this.loadingService.stopLoading();
    });
  }

  onRowSelect(event){
    var pbo = new PackingByBranchOffice();
    pbo.idProductBranchOfficePacking = this.selectedIndicators.idProductBranchOfficePacking;
    pbo.idProduct = this.selectedIndicators.idProduct;
    pbo.idPacking = this.selectedIndicators.idPacking;
    pbo.idBranchOffice = this.selectedIndicators.idBranchOffice;
    pbo.idStatus = this.selectedIndicators.idStatus;
    pbo.idReason = this.selectedIndicators.idReason;
    pbo.idSuplier = this.selectedIndicators.idSuplier;
    pbo.baseCost = this.selectedIndicators.baseCost;
    pbo.baseNetCost = this.selectedIndicators.baseNetCost;
    pbo.basePVP = this.selectedIndicators.basePVP;
    pbo.netSellingCostBase = this.selectedIndicators.netSellingCostBase;
    pbo.conversionCost = this.selectedIndicators.conversionCost;
    pbo.conversionNetCost = this.selectedIndicators.conversionNetCost;
    pbo.conversionPVP = this.selectedIndicators.conversionPVP;
    pbo.netSellingCostConversion = this.selectedIndicators.netSellingCostConversion;
    pbo.netFactor = this.selectedIndicators.netFactor;
    pbo.sellingFactor = this.selectedIndicators.sellingFactor;
    pbo.netSalesFactor = this.selectedIndicators.netSalesFactor;
    pbo.indActiveSale = this.selectedIndicators.indActiveSale;
    pbo.indActiveBuy = this.selectedIndicators.indActiveBuy;
    pbo.indConsignment = this.selectedIndicators.indConsignment;
    pbo.indIVA = this.selectedIndicators.indIVA;
    pbo.indOnline = this.selectedIndicators.indOnline;
    pbo.indShelf = this.selectedIndicators.indShelf;
    pbo.indTower = this.selectedIndicators.indTower;
    this.packingBranchOffice = pbo;
    this.idBranchOffice = this.selectedIndicators.idBranchOffice;
    this.branchexpanded = this.selectedIndicators.idBranchOffice;
    this.ShowDialog = true;
  }
}
