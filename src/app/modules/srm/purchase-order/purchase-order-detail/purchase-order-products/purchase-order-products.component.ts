import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ColumnD } from 'src/app/models/common/columnsd';
import { SupplierCatalogModal } from 'src/app/models/common/supplier-catalog-modal';
import { Packing } from 'src/app/models/products/packing';
import { ValidateProductActive } from 'src/app/models/products/validate-product-active';
import { Groupingpurchaseorders } from 'src/app/models/srm/groupingpurchaseorders';
import { PurchaseOrderProduct } from 'src/app/models/srm/purchase-order-product';
import { PurchaseOrderProductPrice } from 'src/app/models/srm/purchase-order-product-price';
import { PackingFilter } from 'src/app/modules/products/shared/filters/packing-filter';
import { ValidateProductActiveFilter } from 'src/app/modules/products/shared/filters/validate-product-active-filter';
import { PackingService } from 'src/app/modules/products/shared/services/packingservice/packing.service';
import { ProductbranchofficeService } from 'src/app/modules/products/shared/services/productbranchofficeservice/productbranchoffice.service';
import { ProductcatalogService } from 'src/app/modules/products/shared/services/productcatalogservice/productcatalog.service';
import { ProductCatalog } from 'src/app/modules/products/shared/view-models/product-catalog.viewmodel';
import { PurchaseOrderFilter } from '../../../shared/filters/purchase-order-filter';
import { PurchaseorderService } from '../../../shared/services/purchaseorder/purchaseorder.service';
import { SuppliercatalogService } from '../../../shared/services/suppliercatalog/suppliercatalog.service';
import { EnumPackingType } from '../../../shared/Utils/enum-packing-type';
import { MenuTabOrder } from '../../../shared/Utils/menu-tab-order';
import { PurchaseOrderPriceComponent } from '../purchase-order-price/purchase-order-price.component';
import { PurchaseOrderProductEditComponent } from '../purchase-order-product-edit/purchase-order-product-edit.component';
import * as  typenegotiation from '../../../shared/filters/enum-type-negotiation';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { Coins } from 'src/app/models/masters/coin';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { StatusPurchase } from '../../../shared/Utils/status-purchase';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { TaxableDeductibleProductComponent } from '../taxable-deductible-product/taxable-deductible-product.component';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { ApplyCost } from '../../../shared/Utils/apply-cost';
import { DecimalPipe } from '@angular/common';
import { LayoutComponent } from 'src/app/modules/layout/layout/layout.component';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { PurchaseOrdertaxableDetail } from 'src/app/models/srm/purchase-order-taxable-detail';
import { PurchaseOrderdeductibleDetail } from 'src/app/models/srm/purchase-order-detail-deductible';
import { PoitnBreakSupplierCatalog } from '../../../shared/filters/common/point-break-product-supplier';
import { DataViewmodel } from '../../../shared/view-models/data';

@Component({
  selector: 'purchase-order-products',
  templateUrl: './purchase-order-products.component.html',
  styleUrls: ['./purchase-order-products.component.scss'],
  providers: [DecimalPipe]
})
export class PurchaseOrderProductsComponent implements OnInit {
  DisableNext: boolean = false;
  DisablePreviousp: boolean = false;
  rowIndex: number = 0;
  activeIndex: number = 0;
  activetab: boolean = true;
  selectedprod: boolean = true;
  ///regon moneda simbology
  conversionsymbolcoin: any;
  basesymbolcoin: any;
  isfilter:boolean=true;
  //#endregion

  //#region mostrartab
  showtaxable: boolean = false;
  showDetail: boolean = true;
  showTabPrice: boolean = false;
  showPrice: boolean = false;
  //endregion
  loading: boolean = false;
  identifierToEdit: number = -1;
  //selecteditems: PurchaseOrderProduct[];
  selecteditem: PurchaseOrderProduct;
  selecteditemAux: PurchaseOrderProduct;
  _selectedColumns: any[];
  show: boolean = false;
  @Input("isSave") isSave: boolean = true;
  @Input("_idOrderPurchase") _idOrderPurchase: number = -1;
  @Input("_idCompany") _idCompany: number = -1;
  @Input("PucharseOrderHeader") PucharseOrderHeader: Groupingpurchaseorders = new Groupingpurchaseorders();
  @Input("showproduct") showproduct: boolean = true;;
  @ViewChild('dtu') dtu: Table;
  @ViewChild(PurchaseOrderProductEditComponent) tabpaneldetail: PurchaseOrderProductEditComponent;
  @ViewChild(PurchaseOrderPriceComponent) tabpanelprices: PurchaseOrderPriceComponent;
  @ViewChild('paneldetail') paneldetail: ElementRef;
  @ViewChild(TaxableDeductibleProductComponent) tabTaxables: TaxableDeductibleProductComponent;
  @ViewChild(LayoutComponent) layoutComponent: LayoutComponent;
  _viewModel: PurchaseOrderProduct = new PurchaseOrderProduct();
  _viewModelcopy: PurchaseOrderProduct = new PurchaseOrderProduct();
  detail: PurchaseOrderProduct;
  submitted: boolean = false;
  tabselected: boolean = false;
  itemCompleted: number = 0;
  catalogDialogVisible = false;
  ProductCatalogDialogVisible = false;
  PurchaseOrderDialogVisible = false;
  MasiveConfigurationDialogVisible = false;
  productSupplierDialog =false;
  //resumenes totales
  itemsPVP: number = 0;
  itemscost: number = 0;
  costbasetotal: number = 0;
  costconvertiototal: number = 0;
  netcostbasetotal: number = 0;
  netcostconvertiototal: number = 0;
  subtotal: number = 0;
  subtotalconv: number = 0;
  totalitems: number = 0;
  taxableTotalcab: number = 0;
  deductibleTotalcab: number = 0;
  taxableTotal: number = 0;
  deductibleTotal: number = 0;
  totaldeductiblesproduct: number = 0;
  totaltaxableproduct: number = 0;
  baseCostNew: number = 0;
  baseCostOld: number = 0;
  statuspurchase: typeof StatusPurchase = StatusPurchase;
  detailCopy: PurchaseOrderProduct = new PurchaseOrderProduct();
  showButtonNext: boolean = true;
  /////
  _showdialog: boolean = false;
  _purchaseOrderDetail: PurchaseOrderProduct[] = [];
  _ProductDetailNext: PurchaseOrderProduct[] = []
  _ProductDetail: PurchaseOrderProduct[] = []
  applyCost: typeof ApplyCost = ApplyCost;
  listtaxable: PurchaseOrdertaxableDetail;
  listdeductible: PurchaseOrderdeductibleDetail;
  product: PurchaseOrderProduct;
  ischange: boolean= false;
 
  @ViewChild('btnTotalc') btnTotalc: ElementRef<HTMLElement>;
  items1: MenuItem[] = [{
    label: 'Factor de venta masivo', icon: 'pi pi-tag', command: () => {
      this.MasiveConfigurationDialogVisible = true;
    }
  }];
  items: MenuItem[] = [
    {
      label: 'Conocido', icon: 'pi pi-tag', command: () => {
        this._showdialog = true;
      }
    },
    {
      label: 'Desde otra orden', icon: 'pi pi-folder', command: () => {
        this.PurchaseOrderDialogVisible = true;
      }
    },
    {
      label: 'Catálogo del proveedor', icon: 'pi pi-id-card', command: () => {
        this.catalogDialogVisible = true;
      }
    },
    {
      label: 'Catálogo de productos', icon: 'pi pi-book', command: () => {
        this.ProductCatalogDialogVisible = true;
      }
    },
    {
      label: 'Productos en quiebre', icon: 'pi pi-book', command: () => {
        this.productSupplierDialog = true;
      }
    }

  ];

  //activeIndex: number = 0;
  ActiveIndexTab: number = 0;
  indmenuTab: number = 0;
  menuTabOrder: typeof MenuTabOrder = MenuTabOrder;
  display: boolean = false;
  packaging: Packing;
  validateActive: ValidateProductActive;
  productactive: boolean = false;
  productconsigment: boolean = false;
  contproductactive: number = 0;
  contproductconsigment: number = 0;
  contproductdesincoporate: number = 0;
  idbranchOffice: number = 1;
  listproductcatalog: ProductCatalog[];
  listproductpurchase: PurchaseOrderProduct[];
  listsupplier: SupplierCatalogModal[];
  listProductLowStock: PoitnBreakSupplierCatalog[];
  typenegotiation: number[] = [];
  typenegotiationIDs = { ...typenegotiation };
  innerWidth: number;
  innerHeight: number;

  EnumPackingType: typeof EnumPackingType = EnumPackingType;
  permissions: number[] = [];
  permissionsIDs = { ...Permissions };
  iduserlogin: number = -1;
  event: Event;
  checkAll: boolean = false;
  selectedproduct: any[] = [];


  displayedColumns: ColumnD<PurchaseOrderProduct>[] =
    [

      { template: (data) => { return data.name; }, header: 'Producto', field: 'name', display: 'table-cell' },
      { template: (data) => { return data.gtin; }, header: 'Barra', field: 'gtin', display: 'table-cell' },
      { field: 'indHeavy', header: 'Pesado', display: 'table-cell' },
      //{ field: 'status', header: 'Activo', display: 'table-cell' },
      //{ template: (data) => { return data.idPackaging; }, header: 'idPackaging',field:'idPackaging' ,display: 'none' },
      { template: (data) => { return data.packaging; }, header: 'Empaque', field: 'packaging', display: 'table-cell' },
      { template: (data) => { return data.packagingType; }, header: 'Tipo de empaque', field: 'packagingType', display: 'none' },
      { template: (data) => { return data.unitPerPackaging; }, header: 'Unidades por empaque', field: 'unitPerPackaging', display: 'table-cell' },
      { template: (data) => { if (data.individualPrices.indAdded == 1) return this.decimalPipe.transform((data.baseCostUnit = data.individualPrices.baseCostNew), '.4'); else return this.decimalPipe.transform((data.baseCostUnit = data.masterPrices.baseCostNew), '.4') }, field: 'baseCostUnit', header: 'Costo base', display: 'table-cell' },
      { template: (data) => { if (data.individualPrices.indAdded == 1) return this.decimalPipe.transform((data.convertionCostUnit = data.individualPrices.convertionCost), '.4'); else return this.decimalPipe.transform((data.convertionCostUnit = data.masterPrices.convertionCost), '.4') }, field: 'convertionCostUnit', header: 'Costo conversión', display: 'table-cell' },
      { template: (data) => { if (data.indHeavy == true) return this.decimalPipe.transform(data.packagingQuantity, '.3'); else return this.decimalPipe.transform(data.packagingQuantity, '.0') }, header: 'Cantidad de empaques', display: 'table-cell', field: 'packagingQuantity' },
      { template: (data) => { if (data.indHeavy == true) return this.decimalPipe.transform((data.totalUnits = data.packagingQuantity * data.unitPerPackaging), '.3'); else return this.decimalPipe.transform((data.totalUnits = data.packagingQuantity * data.unitPerPackaging), '.0') }, header: 'Total de unidades', display: 'table-cell', field: 'totalUnits' },
      { template: (data) => { if (data.individualPrices.indAdded == 1) return this.decimalPipe.transform((data.baseCostTotal = data.individualPrices.baseCostNew * data.packagingQuantity), '.4'); else return this.decimalPipe.transform((data.baseCostTotal = data.masterPrices.baseCostNew * data.packagingQuantity), '.4') }, field: 'baseCostTotal', header: 'Costo base total', display: 'table-cell' },
      { template: (data) => { if (data.individualPrices.indAdded == 1) return this.decimalPipe.transform((data.convertionCostTotal = data.individualPrices.convertionCost * data.packagingQuantity), '.4'); else return this.decimalPipe.transform((data.convertionCostTotal = data.masterPrices.convertionCost * data.packagingQuantity), '.4') }, field: 'convertionCostTotal', header: 'Costo conversión total', display: 'table-cell' },
      //{ template: (data) => { return data.negotiationCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}); },field: 'negotiationCost', header: 'Costo de negociación', display: 'table-cell'},  
      //{ template: (data) => { if (data.individualPrices.indAdded == 1) return (data.sellingFactor = data.individualPrices.salesFactor).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); else return (data.sellingFactor = data.masterPrices.salesFactor).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }, field: 'sellingFactor', header: 'Factor de venta', display: 'table-cell' },
      { field: 'sellingFactor', header: 'Factor de venta', display: 'table-cell' },
      { template: (data) => { if (data.individualPrices.indAdded == 1) return this.decimalPipe.transform((data.minFactor = data.individualPrices.minimunFactor), '.2'); else return this.decimalPipe.transform((data.minFactor = data.masterPrices.minimunFactor), '.2') }, field: 'minFactor', header: 'Factor mínimo', display: 'table-cell' },
      { template: (data) => { if (data.individualPrices.indAdded == 1) return this.decimalPipe.transform((data.mediumFactor = data.individualPrices.mediumFactor), '.2'); else return this.decimalPipe.transform((data.mediumFactor = data.masterPrices.mediumFactor), '.2') }, field: 'mediumFactor', header: 'Factor medio', display: 'table-cell' },
      { template: (data) => { if (data.individualPrices.indAdded == 1) return this.decimalPipe.transform((data.maxFactor = data.individualPrices.maximunFactor), '.2'); else return this.decimalPipe.transform((data.maxFactor = data.masterPrices.maximunFactor), '.2') }, field: 'maxFactor', header: 'Factor máximo', display: 'table-cell' },
      //{ template: (data) => { return  data.discount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}); },field: 'discount', header: 'Descuento', display: 'table-cell'},
      { template: (data) => { if (data.individualPrices.indAdded == 1) return this.decimalPipe.transform((data.netCost = data.individualPrices.netCost), '.4'); else return this.decimalPipe.transform((data.netCost = data.masterPrices.netCost), '.4') }, field: 'netCost', header: 'Costo neto', display: 'table-cell' },
      { template: (data) => { if (data.individualPrices.indAdded == 1) return this.decimalPipe.transform((data.netCostConversion = data.individualPrices.netCostConversion), '.4'); else return this.decimalPipe.transform((data.netCostConversion = data.masterPrices.netCostConversion), '.4') }, field: 'netCostConversion', header: 'Costo neto conversión', display: 'table-cell' },
      { template: (data) => { if (data.individualPrices.indAdded == 1) return this.decimalPipe.transform((data.salesNetCost = data.individualPrices.salesNetCost), '.4'); else return this.decimalPipe.transform((data.salesNetCost = data.masterPrices.salesNetCost), '.4') }, field: 'salesNetCost', header: 'Costo neto venta', display: 'table-cell' },
      { template: (data) => { if (data.individualPrices.indAdded == 1) return this.decimalPipe.transform((data.salesNetCostConvertion = data.individualPrices.salesNetCostConvertion), '.4'); else return this.decimalPipe.transform((data.salesNetCostConvertion = data.masterPrices.salesNetCostConvertion), '.4') }, field: 'salesNetCostConvertion', header: 'Costo neto venta conversión', display: 'table-cell' },
      { template: (data) => { if (data.individualPrices.indAdded == 1) return this.decimalPipe.transform((data.pvpBase = data.individualPrices.pvpBaseNew), '.2'); else return this.decimalPipe.transform((data.pvpBase = data.masterPrices.pvpBaseNew), '.2') }, field: 'pvpBase', header: 'PVP base', display: 'table-cell' },
      { template: (data) => { if (data.individualPrices.indAdded == 1) return this.decimalPipe.transform((data.pvpConversion = data.individualPrices.pvpConversionNew), '.2'); else return this.decimalPipe.transform((data.pvpConversion = data.masterPrices.pvpConversionNew), '.2') }, field: 'pvpConversion', header: 'PVP conversión', display: 'table-cell' },
    ];

  constructor(public _service: PurchaseorderService, private messageService: MessageService, private _packingservice: PackingService,
    private confirmationService: ConfirmationService, private _productcatalogservice: ProductcatalogService,
    private supplierservice: SuppliercatalogService, private decimalPipe: DecimalPipe,
    private coinsService: CoinsService, private _httpClient: HttpClient, public userPermissions: UserPermissions,
    private readonly loadingService: LoadingService) { }
  _Authservice: AuthService = new AuthService(this._httpClient);

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight * 0.70;
    this._selectedColumns = this.displayedColumns;
    this._idCompany = this._Authservice.currentCompany;
    this.idbranchOffice = this._Authservice.currentOffice;
    this.iduserlogin = this._Authservice.storeUser.id;
    let element: HTMLElement = document.getElementsByClassName('sidebar-pin')[0] as HTMLElement;
    element.click();

    //this.layoutComponent.onToggleMenuClick(event);
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.displayedColumns.filter(col => val.includes(col));
  }
  onShow() {
    this.search();
    this.searchCoinsxCompany();
  }

  search() {
    this.loading = true;
    let filters = new PurchaseOrderFilter();
    filters.idOrderPurchase = this._idOrderPurchase//_idOrderPurchase
    filters.idCompany = this._idCompany //_idCompany
    this.loadingService.startLoading('wait_loading');
    this._service.getPurchaseOrderProduct(filters).subscribe((data: PurchaseOrderProduct[]) => {
      this._purchaseOrderDetail = data;
      this.totalitems = data.length;
      if (data.length > 0)
        this.calculetetotalsInitial(data[data.length - 1], data.length);
      this.loading = false;
      this.loadingService.stopLoading();
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.loadingService.stopLoading();
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
  }

  calculetetotalsInitial(data: any, length: number) {
    this.itemCompleted = data.itemscompletes;
    this.itemscost = Math.round((data.itemsCost / length) * 100);
    this.itemsPVP = Math.round((data.itemsPVP / length) * 100);
    this.costbasetotal = data.totalCostbase;
    this.costconvertiototal = data.totalcostconvertion;
    this.netcostbasetotal = data.totalnetcost;
    this.netcostconvertiototal = data.totalnetcostConvertion;
    this.totaltaxableproduct = data.totaltaxables;
    this.totaldeductiblesproduct = data.totalDeductible;
    this.subtotal = data.subtotal;
    this.taxableTotal = data.puchaseTotalTaxable;
    this.deductibleTotal = data.puchaseTotalDeductible;
    this.taxableTotalcab = this.taxableTotal - this.totaltaxableproduct;
    this.deductibleTotalcab = this.deductibleTotal - this.totaldeductiblesproduct;
  }
  onSubmit(data) {
    if (data != null) {
      let _purchaseOrderDetailaux = this._purchaseOrderDetail;
      let purchaseaux: any[] = [];
      if (_purchaseOrderDetailaux.findIndex(x => x.productId == data.order.productId) == -1) {
        let price = new PurchaseOrderProductPrice();
        data.order.idOrderPurchase = this._idOrderPurchase;
        data.order.indAdd = 1;
        data.order.subtotal = this.subtotal
        data.order.subtotalConvertion = this.subtotal / this.PucharseOrderHeader.purchase.exchangeRateSupplier,
        data.order.puchaseTotalTaxable = this.taxableTotal,
        data.order.puchaseTotalDeductible = this.deductibleTotal
        data.order.totalCostbase = this.costbasetotal,
        data.order.totalcostconvertion = this.costbasetotal / this.PucharseOrderHeader.purchase.exchangeRateSupplier,
        data.order.prices = [];
        price.idPacking = data.order.idPackaging
        price.bar = data.order.gtin;
        price.idPackingType = data.order.idPackaging;
        price.unitsNumberPacking = data.order.unitPerPackaging;
        price.unitsNumber = data.order.unitPerPackaging;
        price.packingNumbers = data.order.packagingQuantity;
        price.totalUnits = data.order.totalUnits;
        price.productId = data.order.productId;
        data.order.prices.push(price);
        _purchaseOrderDetailaux.push(data.order);
        purchaseaux.push(data.order);
      }
      ///guardado
      //this._purchaseOrderDetail= _purchaseOrderDetailaux;
      this._service.savedetail(purchaseaux, false).subscribe((data: number) => {
        if (data > 0) {
          this.messageService.add({ key: "msgwarn", severity: 'success', summary: 'Guardado', detail: "Guardado exitoso." });
          this.search();
        }
      }, (error: HttpErrorResponse) => {
        this.messageService.add({ key: "msgwarn", severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
      });
    }
  }
  handleChange(e) {
    debugger
    this.ActiveIndexTab = e != 0 ? e.index : 0;
    if (this.ActiveIndexTab == 0) {
      this.indmenuTab = this.menuTabOrder.totalresume;
      this.tabselected = false;
      this.showtaxable = false;
      this.showTabPrice = false;
    }
    else if (this.ActiveIndexTab == 1) {
      this.tabselected = true;
      if (this.indmenuTab == 0) {
        this.indmenuTab = this.menuTabOrder.prices;
        this.showTabPrice = true;
        if (this._viewModel.idPackagingType == EnumPackingType.Master) {
          this.showPrice = false;
          this.tabpanelprices.refreshViewFromTable(this.showPrice);
          if (this._viewModel.masterPrices.baseCostNew <= 0)
            this.showButtonNext = false;
        }
        else {
          this.showPrice = true;
          this.tabpanelprices.refreshViewFromTable(this.showPrice);
          if (this._viewModel.individualPrices.baseCostNew <= 0)
            this.showButtonNext = false;
        }
      }
      if (this.indmenuTab == this.menuTabOrder.products) {
        this.showDetail = true;
        this.showtaxable = false;
        this.showTabPrice = false;
        this.indmenuTab = this.menuTabOrder.products;
      }
      else
        this.showDetail = false;
    }
  }

  nextPage() {
    if (this.ActiveIndexTab == 0) {

    }
    else if (this.ActiveIndexTab == 1) {
      if (this.indmenuTab == this.menuTabOrder.products) {
        this.showDetail = false;
        this.showTabPrice = true;
        this.indmenuTab = this.menuTabOrder.prices;
        if (this._viewModel.idPackagingType == EnumPackingType.Master) {
          this.showPrice = false;
          this.tabpanelprices.refreshViewFromTable(this.showPrice);
          if (this._viewModel.masterPrices.baseCostNew <= 0)
            this.showButtonNext = false;
        }
        else {
          this.showPrice = true;
          this.tabpanelprices.refreshViewFromTable(this.showPrice);
          if (this._viewModel.individualPrices.baseCostNew <= 0)
            this.showButtonNext = false;
        }
      }

      else if (this.indmenuTab == this.menuTabOrder.prices) {
        this.showtaxable = true;
        this.showTabPrice = false;
        this.indmenuTab = this.menuTabOrder.imponible
        if (this.baseCostNew != 0 && this.baseCostNew != this.baseCostOld)
          this.SaveProductOnNextButton();
        this.tabTaxables.onshow();
      }

      else if (this.indmenuTab == this.menuTabOrder.imponible) {
        this.indmenuTab = this.menuTabOrder.producttotal
        this.showtaxable = false;
      }
    }
  }

  back() {
    if (this.ActiveIndexTab == 0) {
      if (this.indmenuTab == this.menuTabOrder.totalresume) {
        this.indmenuTab = this.menuTabOrder.products;
      }
      else if (this.indmenuTab == this.menuTabOrder.imponible) {
        this.indmenuTab = this.menuTabOrder.products;
      }
    }
    else if (this.ActiveIndexTab == 1) {
      if (this.indmenuTab == this.menuTabOrder.prices) {
        this.indmenuTab = this.menuTabOrder.products;
        this.showDetail = true;
        this.showTabPrice = false;
        this.showButtonNext = true;
      }
      else if (this.indmenuTab == this.menuTabOrder.imponible) {
        this.indmenuTab = this.menuTabOrder.prices;
        this.showtaxable = false;
        this.showTabPrice = true;

      }
      else if (this.indmenuTab == this.menuTabOrder.producttotal) {
        this.indmenuTab = this.menuTabOrder.imponible;
        this.showtaxable = true;
      }
    }
  }

  SaveProductOnNextButton() {
    if (this.iduserlogin == this.PucharseOrderHeader.purchase.responsibleId) {
      let DetailProduct = this.selecteditem
      DetailProduct.subtotal = this.subtotal
      DetailProduct.subtotalConvertion = this.subtotal / this.PucharseOrderHeader.purchase.exchangeRateSupplier,
        DetailProduct.puchaseTotalTaxable = this.taxableTotal,
        DetailProduct.puchaseTotalDeductible = this.deductibleTotal
      DetailProduct.totalCostbase = this.costbasetotal,
        DetailProduct.totalcostconvertion = this.costbasetotal / this.PucharseOrderHeader.purchase.exchangeRateSupplier,
        this._ProductDetailNext.push(DetailProduct);

      this._service.savedetail(this._ProductDetailNext, true).subscribe((data: number) => {
        if (data > 0) {
          this.isSave = true;
          this.baseCostNew = 0;
          this.baseCostOld = 0;

          this.AsignPurchaseOrderCopy(DetailProduct);
        }
      }, (error: HttpErrorResponse) =>
        this.messageService.add({ key: "msgwarn", severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." }
        ));
    }
  }

  //#region carga de detalles por modales 
  onHidecatalogsupplier(visible: boolean) {
    this.catalogDialogVisible = visible;
  }

  onHideModalProductsLowStock(visible: boolean) {
    this.productSupplierDialog = visible;
  }
  onSubmitcatalogsupplier(data) {
    if (data != null) {

      let _purchaseOrderDetailaux = this._purchaseOrderDetail;
      let cont = 0;
      this.loadingService.startLoading('wait_loading');
      this.supplierservice.getSupplierCatalogExpressfilterverified(data.supplier, this.idbranchOffice).subscribe((dat: SupplierCatalogModal[]) => {
        this.listsupplier = dat;
        for (let i = 0; i < this.listsupplier.length; i++) {
          cont += 1
          this.detail = new PurchaseOrderProduct();
          let price = new PurchaseOrderProductPrice();
          this.detail.productId = this.listsupplier[i].idProduct;
          this.detail.name = this.listsupplier[i].name;
          this.detail.gtin = this.listsupplier[i].barra;
          this.detail.internalReference = this.listsupplier[i].internalRef;
          this.detail.indHeavy = this.listsupplier[i].indHeavy;
          this.detail.category = this.listsupplier[i].category;
          this.detail.idPackagingType = this.listsupplier[i].detail[0].idTipoEmpack;
          this.detail.packagingType = this.listsupplier[i].detail[0].typePacking;
          this.detail.idPackaging = this.listsupplier[i].detail[0].idPacking;
          this.detail.packaging = this.listsupplier[i].detail[0].presentationPacking;
          this.detail.unitPerPackaging = this.listsupplier[i].detail[0].unitPerPackaging;
          this.detail.status = this.listsupplier[i].status;
          this.detail.indconsigment = this.listsupplier[i].indconsigment;
          this.detail.idOrderPurchase = this._idOrderPurchase;
          this.detail.indAdd = 1;
          this.detail.subtotal = this.subtotal
          this.detail.subtotalConvertion = this.subtotal / this.PucharseOrderHeader.purchase.exchangeRateSupplier,
          this.detail.puchaseTotalTaxable = this.taxableTotal,
          this.detail.puchaseTotalDeductible = this.deductibleTotal
          this.detail.totalCostbase = this.costbasetotal,
          this.detail.totalcostconvertion = this.costbasetotal / this.PucharseOrderHeader.purchase.exchangeRateSupplier,
          this.detail.prices = [];
          price.idPacking = this.detail.idPackaging
          price.bar = this.detail.gtin;
          price.productId = this.detail.productId;
          price.idPackingType = this.detail.idPackaging;
          price.unitsNumberPacking = this.detail.unitPerPackaging;
          price.unitsNumber = this.detail.unitPerPackaging;
          price.packingNumbers = this.detail.packagingQuantity;
          price.totalUnits = this.detail.totalUnits;
          price.indAdded = 1;
          this.detail.prices.push(price);
          if (this.detail.status == 2)/// verificar si  el producto esta desincorporado en al sucursal
            this.contproductdesincoporate += 1
          if (_purchaseOrderDetailaux.findIndex(x => x.productId == this.detail.productId && this.detail.status != 2) == -1) {
            if (this.detail.status == 0)
              this.contproductactive += 1
            if (this.detail.indconsigment == 0 && this.PucharseOrderHeader.purchase.idTypeNegotiation == this.typenegotiationIDs.consignment_ID)
              this.contproductconsigment += 1

            _purchaseOrderDetailaux.push(this.detail);
          }
        }
        //this._purchaseOrderDetail = _purchaseOrderDetailaux;
        //guardado
        if (cont == this.listsupplier.length) {
          if (this.contproductdesincoporate > 0)
            this.messageService.add({ key: "msgwarn", severity: 'warn', summary: 'Advertencia', detail: "Los productos en estatus desincorporados en la sucursal no seran agregados a la orden." });
          if (_purchaseOrderDetailaux.filter(x => x.id <= 0).length > 0) {
            this._service.savedetail(_purchaseOrderDetailaux.filter(x => x.id <= 0), false).subscribe((data: number) => {
              if (data > 0) {
                this.messageService.add({ key: "msgwarn", severity: 'success', summary: 'Guardado', detail: "Guardado exitoso." });
                this.search();
                this.dtu.reset();
                if (this.contproductactive > 0)
                  this.messageService.add({ key: "msgwarn", severity: 'warn', summary: 'Advertencia', detail: "Existen productos que no se encuentran activos en la sucursal." });
                if (this.contproductconsigment > 0)
                  this.messageService.add({ key: "msgwarn", severity: 'warn', summary: 'Advertencia', detail: "Existen productos que no poseen el indicador de consignación." });

                this.contproductactive = 0
                this.contproductconsigment = 0
                this.DisableNext = false;
                this.loadingService.stopLoading();
              }
            }, (error: HttpErrorResponse) => {
              this.loadingService.stopLoading();
              this.messageService.add({ key: "msgwarn", severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." })
            });
          }
          this.contproductdesincoporate = 0
        }
      }, (error: HttpErrorResponse) => {
        this.loading = false;
        this.loadingService.stopLoading();
        this.messageService.add({ key: "msgwarn", severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los productos" });
      });
    }
  }
  onHideProductCatalogModal(visible: boolean) {
    this.ProductCatalogDialogVisible = visible;
  }

  onSubmitProductCatalogModal(data) {
    if (data != null) {
      let cont = 0;
      let _purchaseOrderDetailaux = this._purchaseOrderDetail;
      this.loadingService.startLoading('wait_loading');
      this._productcatalogservice.getProductCatalogbyfilterverified(data.Products, this.idbranchOffice)
        .subscribe((dat: ProductCatalog[]) => {
          this.listproductcatalog = dat;
          for (let i = 0; i < this.listproductcatalog.length; i++) {
            let filters: PackingFilter = new PackingFilter();
            let detail = new PurchaseOrderProduct();
            let price = new PurchaseOrderProductPrice();
            detail.productId = this.listproductcatalog[i].productId;
            detail.name = this.listproductcatalog[i].name;
            detail.gtin = this.listproductcatalog[i].barcode;
            detail.internalReference = this.listproductcatalog[i].internalRef;
            detail.indHeavy = this.listproductcatalog[i].indHeavy;
            detail.category = this.listproductcatalog[i].category;
            detail.idPackaging = this.listproductcatalog[i].packingId;
            detail.status = this.listproductcatalog[i].statusi
            detail.indconsigment = this.listproductcatalog[i].indconsigment;
            filters.active = 1;
            filters.productId = detail.productId;
            filters.id = detail.idPackaging
            this._packingservice.getPackingbyfilter(filters)
              .subscribe((data) => {
                data = data.sort((a, b) => a.packagingPresentation.name.localeCompare(b.packagingPresentation.name));
                this.packaging = data[0];
                detail.packaging = this.packaging.packagingPresentation.name;
                detail.packagingType = this.packaging.packingType.name;
                detail.idPackagingType = this.packaging.packingType.id;
                detail.unitPerPackaging = this.packaging.units;
                detail.idOrderPurchase = this._idOrderPurchase;
                detail.indAdd = 1;
                detail.subtotal = this.subtotal
                detail.subtotalConvertion = this.subtotal / this.PucharseOrderHeader.purchase.exchangeRateSupplier
                detail.puchaseTotalTaxable = this.taxableTotal
                detail.puchaseTotalDeductible = this.deductibleTotal
                detail.totalCostbase = this.costbasetotal
                detail.totalcostconvertion = this.costbasetotal / this.PucharseOrderHeader.purchase.exchangeRateSupplier
                detail.prices = [];
                price.idPacking = detail.idPackaging
                price.bar = detail.gtin;
                price.productId = detail.productId;
                price.idPackingType = detail.idPackagingType;
                price.unitsNumberPacking = detail.unitPerPackaging;
                price.unitsNumber = detail.unitPerPackaging;
                price.packingNumbers = detail.packagingQuantity;
                price.totalUnits = detail.totalUnits;
                detail.prices.push(price);
                if (detail.status == 2)
                  this.contproductdesincoporate += 1;
                if (_purchaseOrderDetailaux.findIndex(x => x.productId == detail.productId) == -1 && detail.status != 2) {
                  if (detail.status == 0)
                    this.contproductactive += 1
                  if (detail.indconsigment == 0 && this.PucharseOrderHeader.purchase.idTypeNegotiation == this.typenegotiationIDs.consignment_ID)
                    this.contproductconsigment += 1
                  _purchaseOrderDetailaux.push(detail);
                }
                cont += 1
                if (cont == this.listproductcatalog.length) {
                  if (this.contproductdesincoporate > 0)
                    this.messageService.add({ key: "msgwarn", severity: 'warn', summary: 'Advertencia', detail: "Los productos en estatus desincorporados en la sucursal no seran agregados a la orden." });
                  if (_purchaseOrderDetailaux.filter(x => x.id <= 0).length > 0) {
                    this._service.savedetail(_purchaseOrderDetailaux.filter(x => x.id <= 0), false).subscribe((data: number) => {
                      if (data > 0) {
                        this.messageService.add({ key: "msgwarn", severity: 'success', summary: 'Guardado', detail: "Guardado exitoso." });
                        this.search();
                        this.dtu.reset();
                        if (this.contproductactive > 0)
                          this.messageService.add({ key: "msgwarn", severity: 'warn', summary: 'Advertencia', detail: 'Existen productos que no se encuentran activos en la sucursal.' });
                        if (this.contproductconsigment > 0)
                          this.messageService.add({ key: "msgwarn", severity: 'warn', summary: 'Advertencia', detail: "Existen productos que no poseen el indicador de consignación." });
                        this.contproductactive = 0
                        this.contproductconsigment = 0

                      }
                    }, (error: HttpErrorResponse) =>
                      this.messageService.add({ key: "msgwarn", severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." }
                      ));
                  }
                  this.contproductdesincoporate = 0
                }
                this.DisableNext = false;
              }, (error) => {
                console.log(error);
              });

          }
          //guerdado        
          this.loadingService.stopLoading();
        }, (error: HttpErrorResponse) => {
          this.loading = false;
          this.loadingService.stopLoading();
          this.messageService.add({ key: "msgwarn", severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los productos" });
        });
    }
  }
  onHidePurchaseOrderModal(visible: boolean) {
    this.PurchaseOrderDialogVisible = visible;
  }

  onSubmitPurchaseOrderModal(data) {
    if (data != null) {
      let cont = 0;
      let _purchaseOrderDetailaux = this._purchaseOrderDetail;
      this.loadingService.startLoading('wait_loading');
      this._service.getPurchaseOrderDetailVerified(data.PurchaseOrders, this.idbranchOffice).subscribe((dat: PurchaseOrderProduct[]) => {
        this.listproductpurchase = dat;
        for (let i = 0; i < this.listproductpurchase.length; i++) {
          let detail = new PurchaseOrderProduct;
          let price = new PurchaseOrderProductPrice();
          detail.productId = this.listproductpurchase[i].productId;
          detail.name = this.listproductpurchase[i].name;
          detail.gtin = this.listproductpurchase[i].gtin;
          detail.internalReference = this.listproductpurchase[i].internalReference;
          detail.indHeavy = this.listproductpurchase[i].indHeavy;
          detail.category = this.listproductpurchase[i].category;
          detail.idPackagingType = this.listproductpurchase[i].idPackagingType;
          detail.packagingType = this.listproductpurchase[i].packagingType;
          detail.idPackaging = this.listproductpurchase[i].idPackaging;
          detail.packaging = this.listproductpurchase[i].packaging;
          detail.unitPerPackaging = this.listproductpurchase[i].unitPerPackaging;
          detail.idOrderPurchase = this._idOrderPurchase;
          detail.indAdd = 1;
          detail.status = this.listproductpurchase[i].status
          detail.indconsigment = this.listproductpurchase[i].indconsigment
          detail.subtotal = this.subtotal
          detail.subtotalConvertion = this.subtotal / this.PucharseOrderHeader.purchase.exchangeRateSupplier,
          detail.puchaseTotalTaxable = this.taxableTotal,
          detail.puchaseTotalDeductible = this.deductibleTotal
          detail.totalCostbase = this.costbasetotal,
          detail.totalcostconvertion = this.costbasetotal / this.PucharseOrderHeader.purchase.exchangeRateSupplier,
          detail.prices = [];
          price.idPacking = detail.idPackaging
          price.bar = detail.gtin;
          price.productId = detail.productId;
          price.idPackingType = detail.idPackaging;
          price.unitsNumberPacking = detail.unitPerPackaging;
          price.unitsNumber = detail.unitPerPackaging;
          price.packingNumbers = detail.packagingQuantity;
          price.totalUnits = detail.totalUnits;
          detail.prices.push(price);
          if (detail.status == 2)/// verificar si  el producto esta desincorporado en al sucursal
            this.contproductdesincoporate += 1
          if (_purchaseOrderDetailaux.findIndex(x => x.productId == detail.productId && detail.status != 2) == -1) {
            if (detail.status == 0)
              this.contproductactive += 1
            if (detail.indconsigment == 0 && this.PucharseOrderHeader.purchase.idTypeNegotiation == this.typenegotiationIDs.consignment_ID)
              this.contproductconsigment += 1


            _purchaseOrderDetailaux.push(detail);
          }
          cont += 1;
        }
        //this._purchaseOrderDetail=_purchaseOrderDetailaux;
        //guardado
        if (cont == this.listproductpurchase.length) {
          if (this.contproductdesincoporate > 0)
            this.messageService.add({ key: "msgwarn", severity: 'warn', summary: 'Advertencia', detail: "Los productos en estatus desincorporados en la sucursal no seran agregados a la orden." });
          if (_purchaseOrderDetailaux.filter(x => x.id <= 0).length > 0) {
            this._service.savedetail(_purchaseOrderDetailaux.filter(x => x.id <= 0), false).subscribe((data: number) => {
              if (data > 0) {
                this.search();
                this.dtu.reset();
                if (this.contproductactive > 0)
                  this.messageService.add({ key: "msgwarn", severity: 'warn', summary: 'Advertencia', detail: "Existen productos que no se encuentran activos en la sucursal." });
                if (this.contproductconsigment > 0)
                  this.messageService.add({ key: "msgwarn", severity: 'warn', summary: 'Advertencia', detail: "Existen productos que no poseen el indicador de consignación." });

                this.contproductactive = 0
                this.contproductconsigment = 0
                this.DisableNext = false;
                this.loadingService.stopLoading();
              }
            }, (error: HttpErrorResponse) => {
              this.loadingService.stopLoading();
              this.messageService.add({ key: "msgwarn", severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." }
              )
            });
          }
          this.contproductdesincoporate = 0
        }

      }, (error: HttpErrorResponse) => {
        this.loading = false;
        this.loadingService.stopLoading();
        this.messageService.add({ key: "msgwarn", severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los productos" });
      });
    }
  }
  //#endregion

  //#region seleccion detalle

  onRowSelect(event) {
    debugger
    //if(this.selecteditems.length ==1)
    //{
    //this.selecteditem=this.selecteditems[0]
    let taxablaprevious = 0;
    let deductibleprevious = 0;
    let e: any
    this.showButtonNext = true;
    this.tabselected = true;
    this.activetab = false;
    event.index = 1;
    this.activeIndex = 1;
    this.selectedprod = false;
    this.showtaxable = false;
    this.indmenuTab = this.indmenuTab == 0 ? this.menuTabOrder.products : this.indmenuTab;
    this._viewModel = this.selecteditem;
    this._viewModelcopy = new PurchaseOrderProduct();
    this._viewModelcopy.packagingQuantity = this.selecteditem.packagingQuantity;
    this.detailCopy = new PurchaseOrderProduct();
    // this.detailCopy.individualPrices.baseCostNew = this._viewModel.individualPrices.baseCostNew;
    // this.detailCopy.individualPrices.convertionCost = this._viewModel.individualPrices.convertionCost;
    this.AsignConfigurationFactorsValue();
    this.AsignPurchaseOrderCopy(this._viewModel);
    if (this.indmenuTab == this.menuTabOrder.prices) {
      this.showTabPrice = true;
      this.showButtonNext = true;
      if (this._viewModel.idPackagingType == EnumPackingType.Master) {
        this.showPrice = false;
        this.tabpanelprices.refreshViewFromTable(this.showPrice);
        if (this._viewModel.masterPrices.baseCostNew <= 0)
          this.showButtonNext = false;
      }
      else {
        this.showPrice = true;
        this.tabpanelprices.refreshViewFromTable(this.showPrice);
        if (this._viewModel.individualPrices.baseCostNew <= 0)
          this.showButtonNext = false;
      }

    }
    if (this.indmenuTab == this.menuTabOrder.imponible) {
      if (this._viewModel.masterPrices.baseCostNew > 0) {
        this.showtaxable = true;
        this.tabTaxables.onshow();
      }
      else {
        this.indmenuTab = this.menuTabOrder.products;
        this.showtaxable = false;
      }
    }
    this.handleChange(event);
    //}
  }


  AsignConfigurationFactorsValue() {
    if (this._viewModel.masterPrices.indAdded == 1) {
      this._viewModel.masterPrices.salesFactorNew = this._viewModel.masterPrices.salesFactorNew == 0
        ? this._viewModel.masterPrices.mediumFactor
        : this._viewModel.masterPrices.salesFactorNew;
      this._viewModel.individualPrices.salesFactorNew = this._viewModel.masterPrices.salesFactorNew;
    } else {
      this._viewModel.individualPrices.salesFactorNew = this._viewModel.individualPrices.salesFactorNew == 0
        ? this._viewModel.individualPrices.mediumFactor
        : this._viewModel.individualPrices.salesFactorNew;
    }
  }

  AsignPurchaseOrderCopy(purchaseOrder: PurchaseOrderProduct) {
    this.detailCopy = new PurchaseOrderProduct();
    if (purchaseOrder.idPackagingType == EnumPackingType.Master)
    {
      this.detailCopy.masterPrices.packingNumbers = purchaseOrder.masterPrices.packingNumbers;
      this.detailCopy.masterPrices.baseCostNew = purchaseOrder.masterPrices.baseCostNew;
      this.detailCopy.masterPrices.convertionCost = purchaseOrder.masterPrices.convertionCost;
      this.detailCopy.masterPrices.netCost = purchaseOrder.masterPrices.netCost;
      this.detailCopy.masterPrices.netCostConversion = purchaseOrder.masterPrices.netCostConversion;
      this.detailCopy.masterPrices.salesNetCost = purchaseOrder.masterPrices.salesNetCost;
      this.detailCopy.masterPrices.pvpBaseNew = purchaseOrder.masterPrices.pvpBaseNew;
      this.detailCopy.masterPrices.pvpConversionNew = purchaseOrder.masterPrices.pvpConversionNew;
      this.detailCopy.masterPrices.indAdded = purchaseOrder.masterPrices.indAdded;
      this.detailCopy.masterPrices.taxableBase = purchaseOrder.masterPrices.taxableBase;
      this.detailCopy.masterPrices.deductibleBase = purchaseOrder.masterPrices.deductibleBase;
    } else {
      this.detailCopy.individualPrices.packingNumbers = purchaseOrder.individualPrices.packingNumbers;
      this.detailCopy.individualPrices.baseCostNew = purchaseOrder.individualPrices.baseCostNew;
      this.detailCopy.individualPrices.convertionCost = purchaseOrder.individualPrices.convertionCost;
      this.detailCopy.individualPrices.netCost = purchaseOrder.individualPrices.netCost;
      this.detailCopy.individualPrices.netCostConversion = purchaseOrder.individualPrices.netCostConversion;
      this.detailCopy.individualPrices.salesNetCost = purchaseOrder.individualPrices.salesNetCost;
      this.detailCopy.individualPrices.pvpBaseNew = purchaseOrder.individualPrices.pvpBaseNew;
      this.detailCopy.individualPrices.pvpConversionNew = purchaseOrder.individualPrices.pvpConversionNew;
      this.detailCopy.individualPrices.indAdded = purchaseOrder.individualPrices.indAdded;
      this.detailCopy.individualPrices.taxableBase = purchaseOrder.individualPrices.taxableBase;
      this.detailCopy.individualPrices.deductibleBase = purchaseOrder.individualPrices.deductibleBase;
    }
  }

  remove(product: PurchaseOrderProduct) {
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea eliminar este registro?',
      accept: () => {
        let listaux = [];
        listaux.push(product)
        //this._service.removedetail(product).subscribe((data: number) => {
        this._service.removedetail(listaux).subscribe((data: number) => {
          if (data > 0) {
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Eliminación exitosa" });
            this._purchaseOrderDetail = this._purchaseOrderDetail.filter(x => x != product);
            this.RecalculateTotals(this._purchaseOrderDetail,this.PucharseOrderHeader.purchase.exchangeRateSupplier);
            this.tabselected = false;
            this.activetab = false;
            this.activeIndex = 0;
            this.ActiveIndexTab = 0;
            this.selectedprod = true;
            this.indmenuTab = this.menuTabOrder.totalresume;
            this.DisableNext = false;
            let e: any
            if (this._purchaseOrderDetail.length > 0)
              this.save(false);
            if(this._purchaseOrderDetail.length < 0)
               this.checkAll=false
          }
        }, (error: HttpErrorResponse) =>
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." }
          ));
      },
    });
  }

  // nuevo eliminacion masiva
  removeselected(product) {
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea eliminar los registros seleccionados?',
      accept: () => {
        let listaux = [];
        this._service.removedetail(this.selectedproduct).subscribe((data: number) => {
          if (data > 0) {
            this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Eliminación exitosa" });
           // listaux.push(product);

            this._purchaseOrderDetail = this._purchaseOrderDetail.filter(x => !this.selectedproduct.includes(x));
            this.RecalculateTotals(this._purchaseOrderDetail,this.PucharseOrderHeader.purchase.exchangeRateSupplier);
            this.tabselected = false;
            this.activetab = false;
            this.activeIndex = 0;
            this.ActiveIndexTab = 0;
            this.selectedprod = true;
            this.indmenuTab = this.menuTabOrder.totalresume;
            this.DisableNext = false;
            let e:any
            this.selectedproduct=[];
            if(this._purchaseOrderDetail.length>0)
                 this.save(false);

           
          }
        }, (error: HttpErrorResponse) =>
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." }
          ));
      },
    });
  }
  save(message = true) {

    if (this._purchaseOrderDetail.length > 0) {
      for (var i = 0; i < this._purchaseOrderDetail.length; i++) {
        this._purchaseOrderDetail[i].subtotal = this.subtotal
        this._purchaseOrderDetail[i].subtotalConvertion = this.subtotal / this.PucharseOrderHeader.purchase.exchangeRateSupplier
        this._purchaseOrderDetail[i].puchaseTotalTaxable = this.taxableTotal,
          this._purchaseOrderDetail[i].puchaseTotalDeductible = this.deductibleTotal,
          this._purchaseOrderDetail[i].totalCostbase = this.costbasetotal,
          this._purchaseOrderDetail[i].totalcostconvertion = this.costbasetotal /this.PucharseOrderHeader.purchase.exchangeRateSupplier
      }
      this._service.savedetail(this._purchaseOrderDetail, true).subscribe((data: number) => {
        if (data > 0) {
          if (message)
            this.messageService.add({ key: "msgwarn", severity: 'success', summary: 'Guardado', detail: "Guardado exitoso." });
          //this.search();
          //this.dtu.reset();
          this.isSave = true;
        }
        else { this.messageService.add({ key: "msgwarn", severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." }) }
      }, (error: HttpErrorResponse) =>
        this.messageService.add({ key: "msgwarn", severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." }
        ));
    }
    else
      this.messageService.add({ key: "msgwarn", severity: 'success', summary: 'Guardado', detail: "Guardado exitoso." });
  }

  searchCoinsxCompany() {
    var filter = new CoinxCompanyFilter();
    filter.idCompany = this._idCompany;
    this.coinsService.getCoinxCompanyList(filter).subscribe((data: Coins[]) => {
      var baseC: number;
      var conversionC: number;
      data.forEach(coin => {
        if (coin.legalCurrency == true) {
          this.basesymbolcoin = coin.symbology;
        } else {
          this.conversionsymbolcoin = coin.symbology;
        }
      });
      //this.searchExchangeRates(baseC, conversionC);
    }, (error: HttpErrorResponse) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando lasa monedas" });
    });
  }

  onchangeQuatity(data) {
    if (data != null) {
      this._viewModelcopy.packagingQuantity = data.detail.packagingQuantity;
      if (data.value == 1) {
        let calbasecost = data.detail.individualPrices.indAdded == 1 ? data.detail.individualPrices.baseCostNew * data.diferences : data.detail.masterPrices.baseCostNew * data.diferences;
        let calconvcost = data.detail.individualPrices.indAdded == 1 ? data.detail.individualPrices.convertionCost * data.diferences : data.detail.masterPrices.convertionCost * data.diferences;
        let calnetcost = data.detail.individualPrices.indAdded == 1 ? data.detail.individualPrices.netCost * data.diferences : data.detail.masterPrices.netCost * data.diferences;
        let calnetconvcost = data.detail.individualPrices.indAdded == 1 ? data.detail.individualPrices.netCostConversion * data.diferences : data.detail.masterPrices.netCostConversion * data.diferences;
        this.subtotal = this.subtotal + calbasecost;
        this.subtotalconv = this.subtotal / this.PucharseOrderHeader.purchase.exchangeRateSupplier;
        this.netcostbasetotal = this.netcostbasetotal + calnetcost;
        this.netcostconvertiototal = this.netcostbasetotal / this.PucharseOrderHeader.purchase.exchangeRateSupplier;
        this.taxableTotal = this.taxableTotalcab + this.totaltaxableproduct;
        this.deductibleTotal = this.deductibleTotalcab + this.totaldeductiblesproduct;
        this.costbasetotal = this.subtotal + this.taxableTotal - this.deductibleTotal;
        this.costconvertiototal = this.costbasetotal / this.PucharseOrderHeader.purchase.exchangeRateSupplier;
      }
      else if (data.value == -1) {
        let calbasecost = data.detail.individualPrices.indAdded == 1 ? data.detail.individualPrices.baseCostNew * data.diferences : data.detail.masterPrices.baseCostNew * data.diferences;
        let calconvcost = data.detail.individualPrices.indAdded == 1 ? data.detail.individualPrices.convertionCost * data.diferences : data.detail.masterPrices.convertionCost * data.diferences;
        let calnetcost = data.detail.individualPrices.indAdded == 1 ? data.detail.individualPrices.netCost * data.diferences : data.detail.masterPrices.netCost * data.diferences;
        let calnetconvcost = data.detail.individualPrices.indAdded == 1 ? data.detail.individualPrices.netCostConversion * data.diferences : data.detail.masterPrices.netCostConversion * data.diferences;
        this.subtotal = this.subtotal + calbasecost;
        this.subtotalconv = this.subtotal / this.PucharseOrderHeader.purchase.exchangeRateSupplier;
        this.netcostbasetotal = this.netcostbasetotal + calnetcost;
        this.netcostconvertiototal = this.netcostbasetotal / this.PucharseOrderHeader.purchase.exchangeRateSupplier;
        this.taxableTotal = this.taxableTotalcab + this.totaltaxableproduct;
        this.deductibleTotal = this.deductibleTotalcab + this.totaldeductiblesproduct;
        this.costbasetotal = this.subtotal + this.taxableTotal - this.deductibleTotal;
        this.costconvertiototal = this.costbasetotal / this.PucharseOrderHeader.purchase.exchangeRateSupplier;
      }
      else {
        let calbasecost = data.detail.individualPrices.indAdded == 1 ? data.detail.individualPrices.baseCostNew * data.diferences : data.detail.masterPrices.baseCostNew * data.diferences;
        let calconvcost = data.detail.individualPrices.indAdded == 1 ? data.detail.individualPrices.convertionCost * data.diferences : data.detail.masterPrices.convertionCost * data.diferences;
        let calnetcost = data.detail.individualPrices.indAdded == 1 ? data.detail.individualPrices.netCost * data.diferences : data.detail.masterPrices.netCost * data.diferences;
        let calnetconvcost = data.detail.individualPrices.indAdded == 1 ? data.detail.individualPrices.netCostConversion * data.diferences : data.detail.masterPrices.netCostConversion * data.diferences;
        this.subtotal = this.subtotal + calbasecost;
        this.subtotalconv = this.subtotal / this.PucharseOrderHeader.purchase.exchangeRateSupplier;
        this.netcostbasetotal = this.netcostbasetotal + calnetcost;
        this.netcostconvertiototal = this.netcostbasetotal / this.PucharseOrderHeader.purchase.exchangeRateSupplier;
        this.taxableTotal = this.taxableTotalcab + this.totaltaxableproduct;
        this.deductibleTotal = this.deductibleTotalcab + this.totaldeductiblesproduct;
        this.costbasetotal = this.subtotal + this.taxableTotal - this.deductibleTotal;
        this.costconvertiototal = this.costbasetotal / this.PucharseOrderHeader.purchase.exchangeRateSupplier;
      }
      this.calculategraphic();
    }
  }


  //#endregion

  setIndex(index: number) {
    this.rowIndex = index;
    let exist = this._purchaseOrderDetail.length - 1;
    if (this.rowIndex == 0) {
      this.DisablePreviousp = true;
      this.DisableNext = false;
    } else if (this.rowIndex == exist) {
      this.DisableNext = true;
      this.DisablePreviousp = false;
    } else if (this.rowIndex < exist) {
      this.DisableNext = false;
    }
    else if (this.rowIndex > exist) {
      this.DisablePreviousp = false;
    }
  }

  nextproduct(event) {
    let exist = this._purchaseOrderDetail.length - 1;
    this.rowIndex = this.selecteditem != undefined ? this.rowIndex + 1 : 0;
    if (this.rowIndex == exist) {
      this.DisableNext = true;
      this.selecteditem = this._purchaseOrderDetail[this.rowIndex];
      this.onRowSelect(event);
    } else (this.rowIndex < exist)
    {
      this.DisablePreviousp = false;
      this.selecteditem = this._purchaseOrderDetail[this.rowIndex];
      this.onRowSelect(event);
    }

  }

  previousproduct(event) {
    let exist = this._purchaseOrderDetail.length - 1;
    this.rowIndex = this.selecteditem != undefined ? this.rowIndex - 1 : 0;
    if (this.rowIndex < 0) {
      this.DisablePreviousp = true;
    } else if (this.rowIndex == 0) {
      this.DisablePreviousp = true;
      this.DisableNext = false;
      this.selecteditem = this._purchaseOrderDetail[this.rowIndex];
      this.onRowSelect(event);
    } else if (this.rowIndex > 0 && this.rowIndex < exist) {
      this.DisablePreviousp = false;
      this.DisableNext = false;
      this.selecteditem = this._purchaseOrderDetail[this.rowIndex];
      this.onRowSelect(event);
    }
  }


  RecalculateTotals(data, tax) {
    //Evaluar lista de imponibles y deducibles purchase HEADER
    if (data != null) {
      if(tax==undefined)
         tax=this.PucharseOrderHeader.purchase.exchangeRateSupplier

      if (data.resumeTotal != undefined) {
        if(data.products!=undefined){
             this._viewModel= data.products;
        }
        if (data.resumeTotal.indAdded == 1) {
          if(data.resumeTotal.indApply ==false)
          {
            if(data.resumeTotal.indtaxable==true)
            {
             let detailCopy=new PurchaseOrderProduct()
             if (this._viewModel.individualPrices.indAdded == 1)
             {
                 detailCopy.individualPrices.baseCostNew = data.resumeTotal.baseCostNew
                 detailCopy.individualPrices.netCost = data.resumeTotal.netCostNew
                 detailCopy.individualPrices.salesNetCost = data.resumeTotal.salesnetCostNew
                 detailCopy.individualPrices.taxableBase =this._viewModel.individualPrices.taxableBase;
                 detailCopy.individualPrices.deductibleBase = this._viewModel.individualPrices.deductibleBase;
                 detailCopy.individualPrices.packingNumbers = this._viewModel.individualPrices.packingNumbers;
                 detailCopy.individualPrices.pvpBaseNew = this._viewModel.individualPrices.pvpBaseNew;
                 detailCopy.individualPrices.indAdded = this._viewModel.individualPrices.indAdded;
             }
             else
             {
                 detailCopy.masterPrices.baseCostNew = data.resumeTotal.baseCostNew
                 detailCopy.masterPrices.netCost = data.resumeTotal.netCostNew
                 detailCopy.masterPrices.salesNetCost = data.resumeTotal.salesnetCostNew
                 detailCopy.masterPrices.taxableBase = this._viewModel.masterPrices.taxableBase
                 detailCopy.masterPrices.deductibleBase = this._viewModel.masterPrices.deductibleBase;
                 detailCopy.masterPrices.packingNumbers = this._viewModel.masterPrices.packingNumbers;
                 detailCopy.masterPrices.pvpBaseNew = this._viewModel.masterPrices.pvpBaseNew;
                 detailCopy.masterPrices.indAdded = this._viewModel.masterPrices.indAdded;    
             }
              this.AsignPurchaseOrderCopy(detailCopy);
            }


          let calbasecost = data.resumeTotal.baseDiference * data.resumeTotal.packingNumber;
          let calnetcost = data.resumeTotal.netcostDiference * data.resumeTotal.packingNumber;
          let calnetconvcost = data.resumeTotal.netcostConversionDiference * data.resumeTotal.packingNumber;
          this.netcostbasetotal = this.netcostbasetotal + calnetcost;
          this.netcostconvertiototal = this.netcostconvertiototal + calnetconvcost;
          this.totaltaxableproduct = this.totaltaxableproduct + data.resumeTotal.taxableBase;
          this.totaldeductiblesproduct = this.totaldeductiblesproduct + data.resumeTotal.deductibleBase;
          this.subtotal = this.subtotal + calbasecost;
          this.subtotalconv = this.subtotal / this.PucharseOrderHeader.purchase.exchangeRate;
          this.taxableTotal = this.taxableTotalcab + this.totaltaxableproduct;
          this.deductibleTotal = this.deductibleTotalcab + this.totaldeductiblesproduct;
          this.costbasetotal = this.subtotal + this.taxableTotal - this.deductibleTotal;
          this.costconvertiototal = this.costbasetotal/tax;
          this.baseCostNew = data.resumeTotal.baseCostNew;
          this.baseCostOld = data.resumeTotal.baseCostOld;
          this.calculategraphic();

          if (data.resumeTotal.baseCostNew > 0)
            this.showButtonNext = true;
          else
            this.showButtonNext = false;
        }
      }
      }
      else {
        let calbasecost = 0;
        let totaltaxableproduct = 0;
        let totaldeductiblesproduct = 0;
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            calbasecost = calbasecost + (data[i].individualPrices.indAdded == 1 ? (data[i].individualPrices.baseCostNew * data[i].individualPrices.packingNumbers) : (data[i].masterPrices.baseCostNew * data[i].masterPrices.packingNumbers))
            totaltaxableproduct = totaltaxableproduct + (data[i].individualPrices.indAdded == 1 ? data[i].individualPrices.taxableBase : data[i].masterPrices.taxableBase)
            totaldeductiblesproduct = totaldeductiblesproduct + (data[i].individualPrices.indAdded == 1 ? data[i].individualPrices.deductibleBase : data[i].masterPrices.deductibleBase)
          }
          this.totaltaxableproduct = 0;
          this.totaldeductiblesproduct = 0;
          this.subtotal = 0;
          this.totaltaxableproduct = this.totaltaxableproduct + totaltaxableproduct;
          this.totaldeductiblesproduct = this.totaldeductiblesproduct + totaldeductiblesproduct;
          this.taxableTotal = this.taxableTotalcab + this.totaltaxableproduct;
          this.deductibleTotal = this.deductibleTotalcab + this.totaldeductiblesproduct;
          this.subtotal = this.subtotal + calbasecost;
          this.subtotalconv = this.subtotal / tax;
          this.costbasetotal = this.subtotal + this.taxableTotal - this.deductibleTotal;
          this.costconvertiototal = this.costbasetotal / tax;
        }
        else {
          this.totaltaxableproduct = 0;
          this.totaldeductiblesproduct = 0;
          this.taxableTotalcab = 0;
          this.deductibleTotalcab = 0;
          this.subtotal = 0;
          this.subtotalconv = 0;
          this.taxableTotal = 0;
          this.deductibleTotal = 0;
          this.costbasetotal = 0;
          this.costconvertiototal = 0;
        }
        this.calculategraphic();

      }
    }
  }


  onHideMasiveConfigurationModal(visible: boolean) {
    this.MasiveConfigurationDialogVisible = visible;
  }

  AsignMasiveValues(data) {
    if (data != null) {

      var value = data.salesFactor;
      if (this.selectedproduct.length >= 1) {
        this.selectedproduct.forEach((detail: PurchaseOrderProduct) => {
          if(detail.individualPrices.indAdded==1)
          { 
            if(detail.individualPrices.minimunFactor > 0)
            {
             detail.individualPrices.salesFactorNew = value;
             detail.individualPrices.pvpConversionNew = parseFloat(detail.individualPrices.salesNetCostConvertion.toString()) * value;
             detail.individualPrices.pvpBaseNew = parseFloat(detail.individualPrices.salesNetCost.toString()) * value; 
            }  
          } 
          else 
          {
            if(detail.masterPrices.minimunFactor > 0)
            {
              detail.masterPrices.salesFactorNew = value;
              detail.masterPrices.pvpConversionNew = parseFloat(detail.masterPrices.salesNetCostConvertion.toString()) * value;
              detail.masterPrices.pvpBaseNew = parseFloat(detail.masterPrices.salesNetCost.toString()) * value;
            }
          }
        });
        this.isSave = false;
      }

    }
  }
  //Sendnewcost viene desde imponibles y deducibles
  onChangeTaxablesDeductibles(data) {

    if(data.selecteds!=undefined){

        if(data.selecteds.length>0){
             this.detailCopy= data.selecteds.find(x=>x.id ==data.product.id)
             this.AsignPurchaseOrderCopy(this.detailCopy);
        }
        this.selectedproduct=[];
    }
    if (data != null) {
      this.tabpanelprices.onChanceTaxableDeductibles(data); //prices --llama el activate
    }
  }

  EmitTaxable(data) {
    if (data != null) {
      this.tabTaxables.receive(data, 0);
    }
  }

  SaveProductPrice(data) {
    this._ProductDetail = [];
    let DetailProduct = data.product
    DetailProduct.subtotal = this.subtotal
    DetailProduct.subtotalConvertion = this.subtotal / this.PucharseOrderHeader.purchase.exchangeRateSupplier,
      DetailProduct.puchaseTotalTaxable = this.taxableTotal,
      DetailProduct.puchaseTotalDeductible = this.deductibleTotal
    DetailProduct.totalCostbase = this.costbasetotal,
      DetailProduct.totalcostconvertion = this.costbasetotal / this.PucharseOrderHeader.purchase.exchangeRateSupplier,
      this._ProductDetail.push(DetailProduct);
    this._service.savedetail(this._ProductDetail, true).subscribe((data: number) => {
      if (data > 0) {
        this.isSave = true;
        this.baseCostNew = 0;
        this.baseCostOld = 0;
       // this.search(); kate
        //this.dtu.reset();
      }
    }, (error: HttpErrorResponse) =>
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." }
      ));
  }

  //#region calculos graficos 
  calculategraphic() {
    let itemPvp = 0;
    let itemcosts = 0;
    let items = 0;
    if (this._purchaseOrderDetail.length > 0) {
      for (let i = 0; i < this._purchaseOrderDetail.length; i++) {
        if (this._purchaseOrderDetail[i].individualPrices.indAdded == 1) {
          if (this._purchaseOrderDetail[i].individualPrices.pvpBaseNew > 0)
            itemPvp = itemPvp + 1;
          if (this._purchaseOrderDetail[i].individualPrices.baseCostNew > 0)
            itemcosts = itemcosts + 1;
          if (this._purchaseOrderDetail[i].individualPrices.packingNumbers > 0)
            items = items + 1;
        }
        else {
          if (this._purchaseOrderDetail[i].masterPrices.pvpBaseNew > 0)
            itemPvp = itemPvp + 1;
          if (this._purchaseOrderDetail[i].masterPrices.baseCostNew > 0)
            itemcosts = itemcosts + 1;
          if (this._purchaseOrderDetail[i].masterPrices.packingNumbers > 0)
            items = items + 1;
        }
      }
      this.itemscost = Math.round((itemcosts / this._purchaseOrderDetail.length) * 100);
      this.itemsPVP = Math.round((itemPvp / this._purchaseOrderDetail.length) * 100);
      this.itemCompleted = items;
    }
    else {
      this.itemscost = itemcosts;
      this.itemsPVP = itemPvp;
      this.itemCompleted = items;
    }

  }

  //#endregion

  //Evento que viene desde  total product 
  onChangeTaxablesDeductiblesHeader(data) {
    if (data != null) {
      let e: any
      this.taxableTotalcab = data.SubtotalTaxables;
      this.deductibleTotalcab = data.SubtotalDeductibles
      this.taxableTotal = this.taxableTotalcab + this.totaltaxableproduct;
      this.deductibleTotal = this.deductibleTotalcab + this.totaldeductiblesproduct;
      this.costbasetotal = this.subtotal + this.taxableTotal - this.deductibleTotal;
      this.costconvertiototal = this.costbasetotal / this.PucharseOrderHeader.purchase.exchangeRateSupplier;
      this.save(false);
      //this.taxableTotal=
      //Evaluar como se va a enviar al activate
      // this.tabpanelprices.onChanceTaxableDeductibles(data); //prices --llama el activate
    }
  }

  //Evento para calcular los imponibles aplica a todos 
  onChangeTaxablesDeductiblesHeaderProducAll(data) {
    if (data != null) {
      if (data.TaxableListHeaderSave != null) {
        if (data.TaxableListHeaderSave.taxables != undefined) {
          if (data.TaxableListHeaderSave.taxables.length > 0 || data.TaxableListHeaderSave.deductibles.length > 0)

            for (let j = 0; j < this._purchaseOrderDetail.length; j++) {
              let costdexNetBase = 0;
              let costdexNetSales = 0;
              let costdexnetconvertion = 0;
              let costNetBase = 0;
              let costNetSales = 0;
              let costnetconvertion = 0;

              /// Porque no esta calculado
              let costdexNetSalesProduct = 0;
              let costtaxNetSalesProduct = 0;
              let costBase = this._purchaseOrderDetail[j].individualPrices.indAdded == 1 ? this._purchaseOrderDetail[j].individualPrices.baseCostNew : this._purchaseOrderDetail[j].masterPrices.baseCostNew;
              // this._product.taxables = [];
              this.isSave = false;

              for (let i = 0; i < data.TaxableListHeaderSave.taxables.length; i++) {


                if (data.TaxableListHeaderSave.taxables[i].idApply == ApplyCost.costNetBase) {
                  if (data.TaxableListHeaderSave.taxables[i].rate > 0) {
                    costNetBase = costNetBase + (costBase * (data.TaxableListHeaderSave.taxables[i].rate / 100))
                    costnetconvertion = costNetBase / parseFloat(this.PucharseOrderHeader.purchase.exchangeRateSupplier.toString());
                  } else {
                    costNetBase = costNetBase + data.TaxableListHeaderSave.taxables[i].amount;
                    costnetconvertion = costNetBase / parseFloat(this.PucharseOrderHeader.purchase.exchangeRateSupplier.toString());
                  }

                } else {

                  //Recorrido de los deducibles  del producto en costo neto. 
                  for (let impro = 0; impro < this._purchaseOrderDetail[j].taxables.length; impro++) {

                    if (this._purchaseOrderDetail[j].taxables[impro].rate > 0) {
                      costtaxNetSalesProduct = costtaxNetSalesProduct + (costBase * (this._purchaseOrderDetail[j].taxables[impro].rate / 100))
                    } else {
                      costtaxNetSalesProduct = costtaxNetSalesProduct + this._purchaseOrderDetail[j].taxables[impro].amount
                    }
                  }

                  if (data.TaxableListHeaderSave.taxables[i].rate > 0) {
                    costNetSales = costNetSales + (costBase * (data.TaxableListHeaderSave.taxables[i].rate / 100))
                  } else {
                    costNetSales = costNetSales + data.TaxableListHeaderSave.taxables[i].amount
                  }
                }
                // this._product.taxables.push(this.listtaxable);

              }

              if (data.TaxableListHeaderSave.deductibles != undefined) //deductible add-update
              {
                if (data.TaxableListHeaderSave.deductibles.length > 0) {
                  let costNetBase = 0;
                  let costNetSales = 0;
                  let costnetconvertion = 0;
                  //this._product.deductibles = [];
                  this.isSave = false;
                  //this._product.deductibles = [];
                  for (let i = 0; i < data.TaxableListHeaderSave.deductibles.length; i++) {

                    if (data.TaxableListHeaderSave.deductibles[i].idApply == ApplyCost.costNetBase) {
                      if (data.TaxableListHeaderSave.deductibles[i].rate > 0) {
                        costdexNetBase = costdexNetBase + (costBase * (data.TaxableListHeaderSave.deductibles[i].rate / 100))
                        costdexnetconvertion = costdexNetBase / parseFloat(this.PucharseOrderHeader.purchase.exchangeRateSupplier.toString());
                      } else {
                        costdexNetBase = costdexNetBase + data.TaxableListHeaderSave.deductibles[i].amount;
                        costdexnetconvertion = costdexNetBase / parseFloat(this.PucharseOrderHeader.purchase.exchangeRateSupplier.toString());
                      }

                    } else {
                      //Recorrido de los deducibles  del producto en costo neto. 
                      for (let impro = 0; impro < this._purchaseOrderDetail[j].deductibles.length; impro++) {

                        if (this._purchaseOrderDetail[j].deductibles[impro].rate > 0) {
                          costdexNetSalesProduct = costdexNetSalesProduct + (costBase * (this._purchaseOrderDetail[j].deductibles[impro].rate / 100))
                        } else {
                          costdexNetSalesProduct = costdexNetSalesProduct + this._purchaseOrderDetail[j].deductibles[impro].amount
                        }
                      }
                      if (data.TaxableListHeaderSave.deductibles[i].rate > 0) {
                        costdexNetSales = costdexNetSales + (costBase * (data.TaxableListHeaderSave.deductibles[i].rate / 100))
                      } else {
                        costdexNetSales = costdexNetSales + data.TaxableListHeaderSave.deductibles[i].amount
                      }
                    }
                    // this._product.deductibles.push(this.listdeductible);
                  }

                }
              }

              if (this._purchaseOrderDetail[j].individualPrices.indAdded == 1) {

                this._purchaseOrderDetail[j].individualPrices.netCost = (this._purchaseOrderDetail[j].individualPrices.baseCostNew + this._purchaseOrderDetail[j].individualPrices.taxableBase + costNetBase - (this._purchaseOrderDetail[j].individualPrices.deductibleBase + costdexNetBase)); //prueba sergio
                this._purchaseOrderDetail[j].individualPrices.salesNetCost = (this._purchaseOrderDetail[j].individualPrices.baseCostNew + costNetSales + costtaxNetSalesProduct - (costdexNetSales + costdexNetSalesProduct))
                this._purchaseOrderDetail[j].individualPrices.taxableBase = 0;
                this._purchaseOrderDetail[j].individualPrices.taxableConversion = 0;
                this._purchaseOrderDetail[j].individualPrices.taxableBase = this._purchaseOrderDetail[j].individualPrices.taxableBase + costNetBase;
                this._purchaseOrderDetail[j].individualPrices.taxableConversion = this._purchaseOrderDetail[j].individualPrices.taxableConversion + costnetconvertion;
                this._purchaseOrderDetail[j].individualPrices.deductibleBase = 0;
                this._purchaseOrderDetail[j].individualPrices.deductibleConvertion = 0;
                this._purchaseOrderDetail[j].individualPrices.deductibleBase = this._purchaseOrderDetail[j].individualPrices.deductibleBase + costdexNetBase;
                this._purchaseOrderDetail[j].individualPrices.deductibleConvertion = this._purchaseOrderDetail[j].individualPrices.deductibleConvertion + costdexnetconvertion;
              } else {
                this._purchaseOrderDetail[j].masterPrices.netCost = (this._purchaseOrderDetail[j].masterPrices.baseCostNew + +this._purchaseOrderDetail[j].masterPrices.taxableBase + costNetBase - (this._purchaseOrderDetail[j].masterPrices.deductibleBase + costdexNetBase));
                this._purchaseOrderDetail[j].masterPrices.salesNetCost = (this._purchaseOrderDetail[j].masterPrices.baseCostNew + costNetSales + costtaxNetSalesProduct - (costdexNetSales + costdexNetSalesProduct));
                this._purchaseOrderDetail[j].masterPrices.taxableBase = 0;
                this._purchaseOrderDetail[j].masterPrices.taxableConversion = 0;
                this._purchaseOrderDetail[j].masterPrices.taxableBase = this._purchaseOrderDetail[j].masterPrices.taxableBase + costNetBase;
                this._purchaseOrderDetail[j].masterPrices.taxableConversion = this._purchaseOrderDetail[j].masterPrices.taxableConversion + costnetconvertion;
                this._purchaseOrderDetail[j].masterPrices.deductibleBase = 0;
                this._purchaseOrderDetail[j].masterPrices.deductibleConvertion = 0;
                this._purchaseOrderDetail[j].masterPrices.deductibleBase = this._purchaseOrderDetail[j].masterPrices.deductibleBase + costdexNetBase;
                this._purchaseOrderDetail[j].masterPrices.deductibleConvertion = this._purchaseOrderDetail[j].masterPrices.deductibleConvertion + costdexnetconvertion;

              }
            }

        }
      }
    }

  }


  onChangeDetailPage(idEnum: number) {
    if (idEnum == this.menuTabOrder.products) {
      this.showDetail = true;
      this.indmenuTab = this.menuTabOrder.products;
      this.showtaxable = false;
      this.showPrice = false;
      this.showTabPrice = false;

    } else if (idEnum == this.menuTabOrder.prices) {
      this.showDetail = false;
      this.showtaxable = false;
      this.showTabPrice = true;
      this.indmenuTab = this.menuTabOrder.prices;
      if (this._viewModel.idPackagingType == EnumPackingType.Master) {
        this.showPrice = false;
        this.tabpanelprices.refreshViewFromTable(this.showPrice);
        if (this._viewModel.masterPrices.baseCostNew <= 0)
          this.showButtonNext = false;
      }
      else {
        this.showPrice = true;
        this.tabpanelprices.refreshViewFromTable(this.showPrice);
        if (this._viewModel.individualPrices.baseCostNew <= 0)
          this.showButtonNext = false;
      }
    } else if (idEnum == this.menuTabOrder.imponible) {
      this.showtaxable = true;
      this.showPrice = false;
      this.showTabPrice = false;
      this.showDetail = false;
      this.indmenuTab = this.menuTabOrder.imponible
      //if(this.baseCostNew!=0 && this.baseCostNew != this.baseCostOld)
      if (!this.isSave)
        this.SaveProductOnNextButton();
      this.tabTaxables.onshow();
    }
  }

  checkAlls() {
    debugger
    if (this.checkAll) {
      this.selectedproduct = []
      this._purchaseOrderDetail.forEach(product => {
        this.selectedproduct.push(product);
      });
    } else {
      //this.selectedproduct = this.selectedproduct;
      this.selectedproduct = []
    }
  }
  checkedproduct(e: any) {
    if (e.checked) {
      if (this.selectedproduct.length == this._purchaseOrderDetail.length)
        this.checkAll = true;
    }
    else
      this.checkAll = false;
  }


  triggerFalseClick() {
    this.ActiveIndexTab = 0;
    this.activeIndex = 0;
    this.indmenuTab = this.menuTabOrder.totalresume;
    this.tabselected = false;
    this.showtaxable = false;
    this.showTabPrice = false;
    // let el: HTMLElement = this.btnTotalc.nativeElement;
    // el.click();
  }

  onSelectProductsLowStock(dataaux)
  {
    let dataaux2:PoitnBreakSupplierCatalog[] = [];
    dataaux2=dataaux;
    if (dataaux != null) {

      let _purchaseOrderDetailaux = this._purchaseOrderDetail;
      let cont = 0;
   
       dataaux.forEach(product => {

        this.detail = new PurchaseOrderProduct();
        let price = new PurchaseOrderProductPrice();
        this.detail.productId = product.idProduct;
        this.detail.name = product.name;
        this.detail.gtin = product.barra;
        this.detail.internalReference = product.internalRef;
        this.detail.indHeavy = true;
        this.detail.category = product.category;
        this.detail.idPackagingType = 2;
        this.detail.packagingType = 'Individual';
        this.detail.idPackaging = 50;
        this.detail.packaging = 'Prueba';
        this.detail.unitPerPackaging = 1;
        this.detail.status = 1
        this.detail.indconsigment = 0;
        this.detail.idOrderPurchase = this._idOrderPurchase;
        this.detail.indAdd = 1;
        this.detail.subtotal = this.subtotal
        this.detail.subtotalConvertion = this.subtotal / this.PucharseOrderHeader.purchase.exchangeRate,
        this.detail.puchaseTotalTaxable = this.taxableTotal,
        this.detail.puchaseTotalDeductible = this.deductibleTotal
        this.detail.totalCostbase = this.costbasetotal,
        this.detail.totalcostconvertion = this.costbasetotal / this.PucharseOrderHeader.purchase.exchangeRate,
        this.detail.prices = [];
        price.idPacking = this.detail.idPackaging
        price.bar = this.detail.gtin;
        price.productId = this.detail.productId;
        price.idPackingType = this.detail.idPackaging;
        price.unitsNumberPacking = this.detail.unitPerPackaging;
        price.unitsNumber = this.detail.unitPerPackaging;
        price.packingNumbers = this.detail.packagingQuantity;
        price.totalUnits = this.detail.totalUnits;
        price.indAdded = 1;
        this.detail.prices.push(price);
        if (this.detail.status == 2)/// verificar si  el producto esta desincorporado en al sucursal
          this.contproductdesincoporate += 1
        if (_purchaseOrderDetailaux.findIndex(x => x.productId == this.detail.productId && this.detail.status != 2) == -1) {
          if (this.detail.status == 0)
            this.contproductactive += 1
          if (this.detail.indconsigment == 0 && this.PucharseOrderHeader.purchase.idTypeNegotiation == this.typenegotiationIDs.consignment_ID)
            this.contproductconsigment += 1

          _purchaseOrderDetailaux.push(this.detail);
        }

       
      });
        
        //this._purchaseOrderDetail = _purchaseOrderDetailaux;
        //guardado
        if (cont == dataaux2.length) {
          if (this.contproductdesincoporate > 0)
            this.messageService.add({ key: "msgwarn", severity: 'warn', summary: 'Advertencia', detail: "Los productos en estatus desincorporados en la sucursal no seran agregados a la orden." });
          if (_purchaseOrderDetailaux.filter(x => x.id <= 0).length > 0) {
            this._service.savedetail(_purchaseOrderDetailaux.filter(x => x.id <= 0), false).subscribe((data: number) => {
              if (data > 0) {
                this.messageService.add({ key: "msgwarn", severity: 'success', summary: 'Guardado', detail: "Guardado exitoso." });
                this.search();
                this.dtu.reset();
                if (this.contproductactive > 0)
                  this.messageService.add({ key: "msgwarn", severity: 'warn', summary: 'Advertencia', detail: "Existen productos que no se encuentran activos en la sucursal." });
                if (this.contproductconsigment > 0)
                  this.messageService.add({ key: "msgwarn", severity: 'warn', summary: 'Advertencia', detail: "Existen productos que no poseen el indicador de consignación." });

                this.contproductactive = 0
                this.contproductconsigment = 0
                this.DisableNext = false;
                this.loadingService.stopLoading();
              }
            }, (error: HttpErrorResponse) => {
              this.loadingService.stopLoading();
              this.messageService.add({ key: "msgwarn", severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." })
            });
          }
          this.contproductdesincoporate = 0
        }
      // }, (error: HttpErrorResponse) => {
      //   this.loading = false;
      //   this.loadingService.stopLoading();
      //   this.messageService.add({ key: "msgwarn", severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando los productos" });
      // });
    }
  }


  // CalculateTaxDedAll(data) {
  //   //ADD and update
  //   if (data.indtabtaxable == undefined) {
  //     data.indtabtaxable = false;
  //     //this.ischange = true;
  //   }
  //   else
  //     data.indtabtaxable = false;

  //   // let costBase = this._product.individualPrices.indAdded == 1 ? this._product.individualPrices.baseCostNew : this._product.masterPrices.baseCostNew;
  //   // let costnet=this._product.individualPrices.indAdded == 1 ? this._product.individualPrices.netCost: this._product.masterPrices.netCost;
  //   let costdexNetBase = 0;
  //   let costdexNetSales = 0;
  //   let costdexnetconvertion = 0;
  //   let costNetBase = 0;
  //   let costNetSales = 0;
  //   let costnetconvertion = 0;
  //   let apllysalescost = false
  //   if (data._products != null) {
  //     //if (data.TaxableListSave.taxables != undefined) {
  //     for (let j = 0; j < data._products.length; j++) {
  //       this.product = this._purchaseOrderDetail.find(x => x.id == data._products.id);
  //       let costBase = this.product.individualPrices.indAdded == 1 ? this.product.individualPrices.baseCostNew : this.product.masterPrices.baseCostNew;
  //       let costnet = this.product.individualPrices.indAdded == 1 ? this.product.individualPrices.netCost : this.product.masterPrices.netCost;
  //       this.isSave = false;
  //       if (data._products.taxables.length > 0) {
  //         //this._product.taxables = [];
         
  //         for (let i = 0; i < data._products.taxables.length; i++) {
  //           this.listtaxable = new PurchaseOrdertaxableDetail();
  //           this.listtaxable.id = data.TaxableListSave.taxables[i].idPurchaseOrderTaxableDeductible;
  //           this.listtaxable.idPurchaseOrder = data.TaxableListSave.taxables[i].idPurchaseOrder;
  //           this.listtaxable.idPurchaseOrderDetail = data.TaxableListSave.taxables[i].idPurchaseOrderDetail;
  //           this.listtaxable.taxableDeductibleBaseId = data.TaxableListSave.taxables[i].taxableDeductibleBaseId;
  //           this.listtaxable.idTaxableType = data.TaxableListSave.taxables[i].idTaxableType;
  //           this.listtaxable.taxableType = data.TaxableListSave.taxables[i].taxableType;
  //           this.listtaxable.idTaxable = data.TaxableListSave.taxables[i].idTaxable;
  //           this.listtaxable.taxableDeductible = data.TaxableListSave.taxables[i].taxableDeductible;
  //           this.listtaxable.idApply = data.TaxableListSave.taxables[i].idApply;
  //           this.listtaxable.applyCost = data.TaxableListSave.taxables[i].applyCost;
  //           this.listtaxable.distributionCalculationId = data.TaxableListSave.taxables[i].distributionCalculationId;
  //           this.listtaxable.distributionCalculation = data.TaxableListSave.taxables[i].distributionCalculation;
  //           this.listtaxable.idTaxType = data.TaxableListSave.taxables[i].idTaxType;
  //           this.listtaxable.idTax = data.TaxableListSave.taxables[i].idTax;
  //           this.listtaxable.taxableDeductibleBase = data.TaxableListSave.taxables[i].taxableDeductibleBase;
  //           this.listtaxable.indFixedTax = data.TaxableListSave.taxables[i].indFixedTax;
  //           this.listtaxable.indTaxable = data.TaxableListSave.taxables[i].indTaxable;
  //           this.listtaxable.indDeductible = data.TaxableListSave.taxables[i].indDeductible;
  //           this.listtaxable.indPurchaseTaxableDetail = data.TaxableListSave.taxables[i].indPurchaseTaxableDetail;
  //           this.listtaxable.indPurchaseTaxable = data.TaxableListSave.taxables[i].indPurchaseTaxable;
  //           this.listtaxable.indProductsAll = data.TaxableListSave.taxables[i].indProductsAll;
  //           this.listtaxable.indBaseNetSale = data.TaxableListSave.taxables[i].indBaseNetSale;
  //           this.listtaxable.indBaseNetCost = data.TaxableListSave.taxables[i].indBaseNetCost;
  //           this.listtaxable.rate = data.TaxableListSave.taxables[i].rate;
  //           this.listtaxable.amount = data.TaxableListSave.taxables[i].amount;
  //           if (data._products.taxables[i] == ApplyCost.costNetBase) {
  //             if (this.listtaxable.rate > 0) {
  //               costNetBase = costNetBase + (costBase * (this.listtaxable.rate / 100))
  //               //costnetconvertion = costNetBase / parseFloat(this._purchaseheader.purchase.exchangeRateSupplier.toString());
  //             } else {
  //               costNetBase = costNetBase + this.listtaxable.amount;
  //               //costnetconvertion = costNetBase / parseFloat(this._purchaseheader.purchase.exchangeRateSupplier.toString());
  //             }

  //           } else {
  //             if (this.listtaxable.rate > 0) {
  //               costNetSales = costNetSales + (costBase * (this.listtaxable.rate / 100))
  //             } else {
  //               costNetSales = costNetSales + this.listtaxable.amount
  //             }
  //             apllysalescost = true;
  //           }

  //           this.product.taxables.push(this.listtaxable);

  //         }
  //         //Asignacion de nuevos costos

  //         //this._sendNewCost.emit({ product: this._product, indtabtaxable: data.indtabtaxable, ischange: this.ischange });

  //       }
  //       // }
  //       if (data.TaxableListSave.deductibles != undefined) //deductible add-update
  //       {
  //         if (data.TaxableListSave.deductibles.length > 0) {
  //           //this._product.deductibles = [];
  //           this.isSave = false;
  //          // this._product.deductibles = [];
  //           for (let i = 0; i < data.TaxableListSave.deductibles.length; i++) {
  //             this.listdeductible = new PurchaseOrderdeductibleDetail();
  //             this.listdeductible.id = data.TaxableListSave.deductibles[i].idPurchaseOrderTaxableDeductible;
  //             this.listdeductible.idPurchaseOrder = data.TaxableListSave.deductibles[i].idPurchaseOrder;
  //             this.listdeductible.idPurchaseOrderDetail = data.TaxableListSave.deductibles[i].idPurchaseOrderDetail;
  //             this.listdeductible.taxableDeductibleBaseId = data.TaxableListSave.deductibles[i].taxableDeductibleBaseId;
  //             this.listdeductible.idTaxableType = data.TaxableListSave.deductibles[i].idTaxableType;
  //             this.listdeductible.taxableType = data.TaxableListSave.deductibles[i].taxableType;
  //             this.listdeductible.idTaxable = data.TaxableListSave.deductibles[i].idTaxable;
  //             this.listdeductible.taxableDeductible = data.TaxableListSave.deductibles[i].taxableDeductible;
  //             this.listdeductible.idApply = data.TaxableListSave.deductibles[i].idApply;
  //             this.listdeductible.applyCost = data.TaxableListSave.deductibles[i].applyCost;
  //             this.listdeductible.distributionCalculationId = data.TaxableListSave.deductibles[i].distributionCalculationId;
  //             this.listdeductible.distributionCalculation = data.TaxableListSave.deductibles[i].distributionCalculation;
  //             this.listdeductible.idTaxType = data.TaxableListSave.deductibles[i].idTaxType;
  //             this.listdeductible.idTax = data.TaxableListSave.deductibles[i].idTax;
  //             this.listdeductible.taxableDeductibleBase = data.TaxableListSave.deductibles[i].taxableDeductibleBase;
  //             this.listdeductible.indFixedTax = data.TaxableListSave.deductibles[i].indFixedTax;
  //             this.listdeductible.indTaxable = data.TaxableListSave.deductibles[i].indTaxable;
  //             this.listdeductible.indDeductible = data.TaxableListSave.deductibles[i].indDeductible;
  //             this.listdeductible.indPurchaseTaxableDetail = data.TaxableListSave.deductibles[i].indPurchaseTaxableDetail;
  //             this.listdeductible.indPurchaseTaxable = data.TaxableListSave.deductibles[i].indPurchaseTaxable;
  //             this.listdeductible.indProductsAll = data.TaxableListSave.deductibles[i].indProductsAll;
  //             this.listdeductible.indBaseNetSale = data.TaxableListSave.deductibles[i].indBaseNetSale;
  //             this.listdeductible.indBaseNetCost = data.TaxableListSave.deductibles[i].indBaseNetCost;
  //             this.listdeductible.rate = data.TaxableListSave.deductibles[i].rate;
  //             this.listdeductible.amount = data.TaxableListSave.deductibles[i].amount;

  //             if (this.listdeductible.idApply == ApplyCost.costNetBase) {
  //               if (this.listdeductible.rate > 0) {
  //                 costdexNetBase = costdexNetBase + (costBase * (this.listdeductible.rate / 100))
  //                 costdexnetconvertion = costdexNetBase / parseFloat(this._purchaseheader.purchase.exchangeRateSupplier.toString());
  //               } else {
  //                 costdexNetBase = costdexNetBase + this.listdeductible.amount;
  //                 costdexnetconvertion = costdexNetBase / parseFloat(this._purchaseheader.purchase.exchangeRateSupplier.toString());
  //               }

  //             } else {
  //               if (this.listdeductible.rate > 0) {
  //                 costdexNetSales = costdexNetSales + (costBase * (this.listdeductible.rate / 100))
  //               } else {
  //                 costdexNetSales = costdexNetSales + this.listdeductible.amount
  //               }
  //               apllysalescost = true;
  //             }
  //             this.product.deductibles.push(this.listdeductible);
  //           }
  //           //Asignacion de nuevos costos
  //           // if (this._product.individualPrices.indAdded == 1) {
  //           //   this._product.individualPrices.netCost = (this._product.individualPrices.baseCostNew - costNetBase);
  //           //   this._product.individualPrices.salesNetCost = (this._product.individualPrices.baseCostNew - costNetSales);
  //           //   this._product.individualPrices.deductibleBase = 0;
  //           //   this._product.individualPrices.deductibleConvertion = 0;
  //           //   this._product.individualPrices.deductibleBase = this._product.individualPrices.deductibleBase + costNetBase;
  //           //   this._product.individualPrices.deductibleConvertion = this._product.individualPrices.deductibleConvertion + costnetconvertion;
  //           // } else {
  //           //   this._product.masterPrices.netCost = (this._product.masterPrices.baseCostNew - costNetBase);
  //           //   this._product.masterPrices.salesNetCost = (this._product.masterPrices.baseCostNew - costNetSales);
  //           //   this._product.masterPrices.deductibleBase = 0;
  //           //   this._product.masterPrices.deductibleConvertion = 0;
  //           //   this._product.masterPrices.deductibleBase = this._product.masterPrices.deductibleBase + costNetBase;
  //           //   this._product.masterPrices.deductibleConvertion = this._product.masterPrices.deductibleConvertion + costnetconvertion;
  //           // }
  //           //this._sendNewCost.emit({ product: this._product, indtabtaxable: data.indtabtaxable, ischange: this.ischange });
  //         }
  //       }

  //       if (this.product.individualPrices.indAdded == 1) {

  //         this.product.individualPrices.netCost = (this.product.individualPrices.baseCostNew + costNetBase - costdexNetBase); //prueba sergio
  //         //this._product.individualPrices.salesNetCost = (this._product.individualPrices.baseCostNew + costNetSales-costdexNetSales)
  //         this.product.individualPrices.salesNetCost = (this.product.individualPrices.netCost + costNetSales - costdexNetSales)
  //         this.product.individualPrices.taxableBase = 0;
  //         this.product.individualPrices.taxableConversion = 0;
  //         this.product.individualPrices.taxableBase = (this.product.individualPrices.taxableBase + costNetBase) * this.product.packagingQuantity;
  //         this.product.individualPrices.taxableConversion = (this.product.individualPrices.taxableConversion + costnetconvertion) * this.product.packagingQuantity;
  //         this.product.individualPrices.deductibleBase = 0;
  //         this.product.individualPrices.deductibleConvertion = 0;
  //         this.product.individualPrices.deductibleBase = (this.product.individualPrices.deductibleBase + costdexNetBase) * this.product.packagingQuantity;
  //         this.product.individualPrices.deductibleConvertion = (this.product.individualPrices.deductibleConvertion + costdexnetconvertion) * this.product.packagingQuantity;
  //       } else {
  //         this.product.masterPrices.netCost = (this.product.masterPrices.baseCostNew + costNetBase - costdexNetBase);
  //         //this._product.masterPrices.salesNetCost = (this._product.masterPrices.baseCostNew + costNetSales-costdexNetSales);
  //         this.product.masterPrices.salesNetCost = (this.product.masterPrices.netCost + costNetSales - costdexNetSales);
  //         this.product.masterPrices.taxableBase = 0;
  //         this.product.masterPrices.taxableConversion = 0;
  //         this.product.masterPrices.taxableBase = (this.product.masterPrices.taxableBase + costNetBase) * this.product.packagingQuantity;
  //         this.product.masterPrices.taxableConversion = (this.product.masterPrices.taxableConversion + costnetconvertion) * this.product.packagingQuantity;
  //         this.product.masterPrices.deductibleBase = 0;
  //         this.product.masterPrices.deductibleConvertion = 0;
  //         this.product.masterPrices.deductibleBase = (this.product.masterPrices.deductibleBase + costdexNetBase) * this.product.packagingQuantity;
  //         this.product.masterPrices.deductibleConvertion = (this.product.masterPrices.deductibleConvertion + costdexnetconvertion) * this.product.packagingQuantity;
  
  //       }
  //       //this._sendNewCost.emit({ product: this.product, indtabtaxable: data.indtabtaxable, ischange: this.ischange, applycostsales: apllysalescost });
  //       //this.onChangeTaxablesDeductibles()
  //       //this.isSaveChange.emit(this.isSave);
  //     } //fin del for 
      
  //   }
  // }

  /* cambio de tasa desde cabecera de ODC*/ 
  changeRatePurchaseOrder(tax:number, calculationbase:boolean,detailist:PurchaseOrderProduct[]=null)
  {
    if(detailist !=undefined){
     if(detailist.length>0)
       this._purchaseOrderDetail=detailist;}

    if(this._purchaseOrderDetail.length>0)
    {
    
      let apllysalescost = false
      this.isSave = false;
      let e :any

      for (let i = 0; i < this._purchaseOrderDetail.length; i++) 
      {
        let costdexNetBase = 0;
        let costdexNetSales = 0;
        let costdexnetconvertion = 0;
        let costNetBase = 0;
        let costNetSales = 0;
        let costnetconvertion = 0;
        let costBase = this._purchaseOrderDetail[i].individualPrices.indAdded == 1 ? this._purchaseOrderDetail[i].individualPrices.baseCostNew : this._purchaseOrderDetail[i].masterPrices.baseCostNew;
        let costConv = this._purchaseOrderDetail[i].individualPrices.indAdded == 1 ? this._purchaseOrderDetail[i].individualPrices.baseCostNew/tax : this._purchaseOrderDetail[i].masterPrices.baseCostNew/tax;
        
        let costnet = this._purchaseOrderDetail[i].individualPrices.indAdded == 1 ? this._purchaseOrderDetail[i].individualPrices.netCost : this._purchaseOrderDetail[i].masterPrices.netCost;
        this._purchaseOrderDetail[i].supplierExchangeRate=tax;
        let detailCopy = new PurchaseOrderProduct();
        if (this._purchaseOrderDetail[i].idPackagingType == EnumPackingType.Master)
        {
          detailCopy.masterPrices.packingNumbers = this._purchaseOrderDetail[i].masterPrices.packingNumbers;
          detailCopy.masterPrices.baseCostNew = this._purchaseOrderDetail[i].masterPrices.baseCostNew;
          detailCopy.masterPrices.convertionCost = this._purchaseOrderDetail[i].masterPrices.convertionCost;
          detailCopy.masterPrices.netCost = this._purchaseOrderDetail[i].masterPrices.netCost;
          detailCopy.masterPrices.netCostConversion = this._purchaseOrderDetail[i].masterPrices.netCostConversion;
          detailCopy.masterPrices.salesNetCost = this._purchaseOrderDetail[i].masterPrices.salesNetCost;
          detailCopy.masterPrices.pvpBaseNew = this._purchaseOrderDetail[i].masterPrices.pvpBaseNew;
          detailCopy.masterPrices.pvpConversionNew = this._purchaseOrderDetail[i].masterPrices.pvpConversionNew;
          detailCopy.masterPrices.indAdded = this._purchaseOrderDetail[i].masterPrices.indAdded;
          detailCopy.masterPrices.taxableBase = this._purchaseOrderDetail[i].masterPrices.taxableBase;
          detailCopy.masterPrices.deductibleBase = this._purchaseOrderDetail[i].masterPrices.deductibleBase;
        } 
        else
        {
          detailCopy.individualPrices.packingNumbers = this._purchaseOrderDetail[i].individualPrices.packingNumbers;
          detailCopy.individualPrices.baseCostNew = this._purchaseOrderDetail[i].individualPrices.baseCostNew;
          detailCopy.individualPrices.convertionCost = this._purchaseOrderDetail[i].individualPrices.convertionCost;
          detailCopy.individualPrices.netCost = this._purchaseOrderDetail[i].individualPrices.netCost;
          detailCopy.individualPrices.netCostConversion = this._purchaseOrderDetail[i].individualPrices.netCostConversion;
          detailCopy.individualPrices.salesNetCost = this._purchaseOrderDetail[i].individualPrices.salesNetCost;
          detailCopy.individualPrices.pvpBaseNew = this._purchaseOrderDetail[i].individualPrices.pvpBaseNew;
          detailCopy.individualPrices.pvpConversionNew = this._purchaseOrderDetail[i].individualPrices.pvpConversionNew;
          detailCopy.individualPrices.indAdded =this._purchaseOrderDetail[i].individualPrices.indAdded;
          detailCopy.individualPrices.taxableBase = this._purchaseOrderDetail[i].individualPrices.taxableBase;
          detailCopy.individualPrices.deductibleBase = this._purchaseOrderDetail[i].individualPrices.deductibleBase;
        }
        this.AsignPurchaseOrderCopy(detailCopy);
        if (this._purchaseOrderDetail[i].individualPrices.indAdded == 1)
        { 
          if(!calculationbase)
           this.tabpanelprices.activate(e, costBase.toString().replace('.',','), 1, false, this._purchaseOrderDetail[i].individualPrices.idPackingType, this._purchaseOrderDetail[i], this.detailCopy,false);
          else{
            this._purchaseOrderDetail[i].individualPrices.convertionCost=costConv;
            this.tabpanelprices.activate(e, this._purchaseOrderDetail[i].individualPrices.convertionCost.toString().replace('.',','), 1, true, this._purchaseOrderDetail[i].individualPrices.idPackingType, this._purchaseOrderDetail[i],this.detailCopy,false);
          }
       }
        else{

          if(!calculationbase)
          this.tabpanelprices.activate(e, costBase.toString().replace('.',','), 1, false, this._purchaseOrderDetail[i].masterPrices.idPackingType, this._purchaseOrderDetail[i],this.detailCopy,false);
          else{
            this._purchaseOrderDetail[i].masterPrices.convertionCost=costConv;
            this.tabpanelprices.activate(e,this._purchaseOrderDetail[i].masterPrices.convertionCost.toString().replace('.',','), 1, true, this._purchaseOrderDetail[i].masterPrices.idPackingType, this._purchaseOrderDetail[i],this.detailCopy,false);
          }
        }
     
        if (this._purchaseOrderDetail[i].taxables.length > 0) {
          
          for (let j = 0; j < this._purchaseOrderDetail[i].taxables.length; j++) {
            if (this._purchaseOrderDetail[i].taxables[j].idApply == ApplyCost.costNetBase) {
              if (this._purchaseOrderDetail[i].taxables[j].rate > 0) {
                costNetBase = costNetBase + (costBase * (this._purchaseOrderDetail[i].taxables[j].rate / 100))
                costnetconvertion = costNetBase / parseFloat(tax.toString());
              } else {
                costNetBase = costNetBase + this._purchaseOrderDetail[i].taxables[j].amount;
                costnetconvertion = costNetBase / parseFloat(tax.toString());
              }

            } else {
              if (this._purchaseOrderDetail[i].taxables[j].rate > 0) {
                costNetSales = costNetSales + (costBase * (this._purchaseOrderDetail[i].taxables[j].rate / 100))
              } else {
                costNetSales = costNetSales + this._purchaseOrderDetail[i].taxables[j].amount
              }
              apllysalescost = true;
            }
          }

        }

        if (this._purchaseOrderDetail[i].deductibles != undefined) //deductible add-update
        {
          if (this._purchaseOrderDetail[i].deductibles.length > 0) {
            for (let j = 0; j < this._purchaseOrderDetail[i].deductibles.length; j++) {
              
              if (this._purchaseOrderDetail[i].deductibles[j].idApply == ApplyCost.costNetBase) {
                if (this._purchaseOrderDetail[i].deductibles[j].rate > 0) {
                  costdexNetBase = costdexNetBase + (costBase * (this._purchaseOrderDetail[i].deductibles[j].rate / 100))
                  costdexnetconvertion = costdexNetBase / parseFloat(tax.toString());
                } else {
                  costdexNetBase = costdexNetBase + this._purchaseOrderDetail[i].deductibles[j].amount;
                  costdexnetconvertion = costdexNetBase / parseFloat(tax.toString());
                }

              } else {
                if (this._purchaseOrderDetail[i].deductibles[j].rate > 0) {
                  costdexNetSales = costdexNetSales + (costBase * (this._purchaseOrderDetail[i].deductibles[j].rate / 100))
                } else {
                  costdexNetSales = costdexNetSales + this.listdeductible.amount
                }
                apllysalescost = true;
              }
          }
        }
       }
        
        if (this._purchaseOrderDetail[i].individualPrices.indAdded == 1)
        { 
          this._purchaseOrderDetail[i].individualPrices.netCost = (this._purchaseOrderDetail[i].individualPrices.baseCostNew + costNetBase - costdexNetBase); //prueba sergio
          //this._product.individualPrices.salesNetCost = (this._product.individualPrices.baseCostNew + costNetSales-costdexNetSales)
          this._purchaseOrderDetail[i].individualPrices.salesNetCost = (this._purchaseOrderDetail[i].individualPrices.netCost + costNetSales - costdexNetSales)
          this._purchaseOrderDetail[i].individualPrices.taxableBase = 0;
          this._purchaseOrderDetail[i].individualPrices.taxableConversion = 0;
          this._purchaseOrderDetail[i].individualPrices.taxableBase = (this._purchaseOrderDetail[i].individualPrices.taxableBase + costNetBase) * this._purchaseOrderDetail[i].packagingQuantity;
          this._purchaseOrderDetail[i].individualPrices.taxableConversion = (this._purchaseOrderDetail[i].individualPrices.taxableConversion + costnetconvertion) * this._purchaseOrderDetail[i].packagingQuantity;
          this._purchaseOrderDetail[i].individualPrices.deductibleBase = 0;
          this._purchaseOrderDetail[i].individualPrices.deductibleConvertion = 0;
          this._purchaseOrderDetail[i].individualPrices.deductibleBase = (this._purchaseOrderDetail[i].individualPrices.deductibleBase + costdexNetBase) * this._purchaseOrderDetail[i].packagingQuantity;
          this._purchaseOrderDetail[i].individualPrices.deductibleConvertion = (this._purchaseOrderDetail[i].individualPrices.deductibleConvertion + costdexnetconvertion) * this._purchaseOrderDetail[i].packagingQuantity;

        }
        else{
          this._purchaseOrderDetail[i].masterPrices.netCost = (this._purchaseOrderDetail[i].masterPrices.baseCostNew + costNetBase - costdexNetBase);
          //this._product.masterPrices.salesNetCost = (this._product.masterPrices.baseCostNew + costNetSales-costdexNetSales);
          this._purchaseOrderDetail[i].masterPrices.salesNetCost = (this._purchaseOrderDetail[i].masterPrices.netCost + costNetSales - costdexNetSales);
          this._purchaseOrderDetail[i].masterPrices.taxableBase = 0;
          this._purchaseOrderDetail[i].masterPrices.taxableConversion = 0;
          this._purchaseOrderDetail[i].masterPrices.taxableBase = (this._purchaseOrderDetail[i].masterPrices.taxableBase + costNetBase) * this._purchaseOrderDetail[i].packagingQuantity;
          this._purchaseOrderDetail[i].masterPrices.taxableConversion = (this._purchaseOrderDetail[i].masterPrices.taxableConversion + costnetconvertion) * this._purchaseOrderDetail[i].packagingQuantity;
          this._purchaseOrderDetail[i].masterPrices.deductibleBase = 0;
          this._purchaseOrderDetail[i].masterPrices.deductibleConvertion = 0;
          this._purchaseOrderDetail[i].masterPrices.deductibleBase = (this._purchaseOrderDetail[i].masterPrices.deductibleBase + costdexNetBase) * this.product.packagingQuantity;
          this._purchaseOrderDetail[i].masterPrices.deductibleConvertion = (this._purchaseOrderDetail[i].masterPrices.deductibleConvertion + costdexnetconvertion) * this._purchaseOrderDetail[i].packagingQuantity;

        }
        //this.changeexchageTax(this._purchaseOrderDetail[i],apllysalescost);
        //this.onChangeTaxablesDeductibles()             
      }
      this.save(false);
    }

  }


}
