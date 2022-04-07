import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Groupingpurchaseorders } from 'src/app/models/srm/groupingpurchaseorders';
import { PurchaseOrder } from 'src/app/models/srm/purchase-order';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { PurchaseOrderFilter } from '../../shared/filters/purchase-order-filter';
import { PurchaseorderService } from '../../shared/services/purchaseorder/purchaseorder.service';
import { Supplier } from "../../../../models/masters/supplier";
import { CompanyService } from 'src/app/modules/masters/companies/shared/services/company.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import { Company } from 'src/app/models/masters/company';
import { BranchofficeService } from 'src/app/modules/masters/branchoffice/shared/services/branchoffice.service';
import { BranchOffice } from 'src/app/modules/hcm/shared/models/masters/branch-office';
import { PaymentCondition } from 'src/app/models/masters/payment-condition';
import { PaymentconditionService } from 'src/app/modules/masters/payment-conditions/shared/paymentcondition.service';
import { PaymentConditionFilter } from 'src/app/modules/masters/shared/filters/payment-condition-filter';
import { TypeNegotiation } from 'src/app/models/srm/common/type-negotiation';
import { CommonsrmService } from '../../shared/services/common/commonsrm.service';
import { TypeNegotiationFilter } from '../../shared/filters/common/type-negotiation-filter';
import { PurchaseOrderProduct } from 'src/app/models/srm/purchase-order-product';
import { ColumnD } from 'src/app/models/common/columnsd';
import { DecimalPipe } from '@angular/common';
import { PurchaseOrderUpdateStatus, PurchaserOrderStatus } from 'src/app/models/srm/purchase-order-status';
import { FilterPurchaseOrder } from '../../shared/filters/filter-purchase-order';
import { Reason } from 'src/app/models/srm/common/reason';
import { CoinxCompanyFilter } from 'src/app/modules/masters/coin/shared/filters/coinxcompany-filter';
import { Coins } from 'src/app/models/masters/coin';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { CoinFilter } from 'src/app/modules/masters/coin/shared/filters/CoinFilter';


import * as typenegotiation from '../../shared/filters/enum-type-negotiation';

@Component({
  selector: 'app-purchase-order-detail',
  templateUrl: './purchase-order-detail.component.html',
  styleUrls: ['./purchase-order-detail.component.scss'],
  providers: [DecimalPipe]
})
export class PurchaseOrderDetailComponent implements OnInit {

  purchaseOrder: Groupingpurchaseorders = new Groupingpurchaseorders (); //this.getPurchaserOrderDefault();
  branchOffice: BranchOffice = new BranchOffice();
  itemsButton: MenuItem[];
  company: Company = new Company();
  paymentTerms: PaymentCondition = new PaymentCondition();
  negotiationType: TypeNegotiation = new TypeNegotiation();
  products: PurchaseOrderProduct[];
  orderfiltersOfValues: FilterPurchaseOrder[] = [];
  cols: ColumnD<PurchaseOrderProduct>[]; 
  typenegotiationIDs = { ...typenegotiation };
  subtotal: number = 0;
  discount: number = 0;
  taxable: number = 0;
  showDialogReason: boolean;
  statusSelected: number;
  currencySymbol: string = "";

  permissionsIDs = {...Permissions};

  _selectedColumns: any[];
  conversionsymbolcoin: any;
  basesymbolcoin: any;
  
    constructor(private readonly companyService: CompanyService,
    private readonly authService: AuthService,
    private readonly breadcrumbService: BreadcrumbService,
    private readonly actRoute: ActivatedRoute, 
    private readonly purchaseService: PurchaseorderService,
    private readonly branchService: BranchofficeService,
    private readonly loadingService: LoadingService,
    private readonly paymentConditionService: PaymentconditionService,
    private readonly currencyServie: CoinsService,
    private readonly commonSRMService: CommonsrmService,
    private readonly router: Router,
    private readonly decimalPipe: DecimalPipe,
    private readonly dialogService: DialogsService,
    private coinsService: CoinsService,
    private messageService: MessageService,
    public userPermissions: UserPermissions,
    private _authservice: AuthService) { 

    }

    @Input() get selectedColumns(): any[] {
      return this._selectedColumns;
    }
  
    set selectedColumns(val: any[]) {
      this._selectedColumns = this.cols.filter(col => val.includes(col));
    }
    
  ngOnInit(): void {
    const purchaseOrderId = Number(this.actRoute.snapshot.params['id']);
    this.setProductsCollumns();
    this.setBreadcrumb(purchaseOrderId);
    this.getPurchaseOrder(purchaseOrderId);
    this.getCompanyData();
    // this.getDeliveryBranchOffice();
    this.getFiltersValues();
    this.searchCoinsxCompany();
  }

  save() {
    this.loadingService.startLoading('wait_saving');

    this.purchaseService.postPurchase(this.purchaseOrder).toPromise()
    .then(result => this.saveSuccessed(result))
    .catch(error => this.loadingHandleError(error));
  }

  saveStatusConfirm(status: number, reason = false) {
    this.dialogService.confirmDialog('confirm','Se cambiará el estatus de la orden, ¿desea continuar?', () => {
      this.statusSelected = status;

      if(reason) {
        this.showDialogReason = true;
      } else {
        this.saveStatus();
      }
    });
  }

  saveStatus(reason: Reason = undefined) {
    this.loadingService.startLoading('wait_saving');

    const purchaseOrder = this.getPurchaseOrderStatusProperties(reason);

    this.purchaseService.UpdatePurchase(purchaseOrder).toPromise()
    .then(result => this.saveStatusSuccessed(result))
    .catch(error => this.loadingHandleError(error));
  }

  saveReason(reason: Reason) {
    this.saveStatus(reason);
  }

  saveSuccessed(result) {
    if (result) {
      this.dialogService.successMessage('srm.purchase_order.purchase_order', 'saved');
    }
    this.loadingService.stopLoading();
  }

  saveStatusSuccessed(result) {
    this.saveSuccessed(result);
    this.getPurchaseOrder(this.purchaseOrder.purchase.idOrderPurchase);
    this.purchaseOrder.purchase.idStatus = this.statusSelected;
  }

  back() {
    const queryParams: any = {};
    queryParams.purchasefilters = JSON.stringify(this.orderfiltersOfValues);
    const navigationExtras: NavigationExtras = {
      queryParams
    };
    this.router.navigate(['srm/viewer-document'], navigationExtras);        
  }

  getSupplierContact() {
    return this.purchaseOrder.suppliers.contact ?? 'no_info';
  }

  getSupplierContactPhone() {
    return this.purchaseOrder.suppliers.phone ?? 'no_info';
  }

  getCompanyDocument() {
    return `${this.company.identifier}-${this.company.identification}`
  }

  getCompanyContact() {
    const mainContact = this.company?.contactNumbers?.find(x => x.idType === 1);
    return mainContact?.contact ?? 'no_info';
  }

  
  getCompanyContactNumer() {
    const mainContact = this.company?.contactNumbers?.find(x => x.idType === 1);
    return mainContact?.number ?? 'no_info';
  }

  getCompanyAddress() {
    const fiscalAddress = this.company?.addresses?.find(x => x.idAddressType === 1);
    const address = `${fiscalAddress?.avenue} ${fiscalAddress?.municipality} ${fiscalAddress?.city} ${fiscalAddress?.state}`;
    return fiscalAddress ? address : 'no_info';
  }

  
  getBranchOfficeContactNumer() {
    const mainContact = this.branchOffice?.contactNumbers?.find(x => x.idType === 1);
    return mainContact?.number ?? 'no_info';
  }

  getBranchOfficeAddress(){
    const fiscalAddress = this.branchOffice?.addresses?.find(x => x.idAddressType === 1);
    const address = `${fiscalAddress?.avenue} ${fiscalAddress?.municipality} ${fiscalAddress?.city} ${fiscalAddress?.state}`;
    return fiscalAddress ? address : 'no_info';
  }

  getIdTerm() {
    return this.purchaseOrder.purchase.paymentsConditions.amounterm > 1 ? 'days' : 'day';
  }

  getIdNegotiation(){
    return this.purchaseOrder.purchase.idTypeNegotiation==-1 ?? 'no_info'
  }

  getTotalOrder(){
    return (this.taxable + this.subtotal) - this.discount;
  }

  orderIsInReview() {
    return this.purchaseOrder.purchase.idStatus === PurchaserOrderStatus['inReview'];
  }

  orderIsPendingForReview() {
    return this.purchaseOrder.purchase.idStatus === PurchaserOrderStatus['pending'];
  }

  startPurchaseOrder() {
    this.saveStatusConfirm(PurchaserOrderStatus.inReview);
  }

  savePurchaseOrder() {
    if (this.purchaseOrder.purchase.idStatus === PurchaserOrderStatus.inReview) {
      this.save();
    }
  }

  rejectPurchaseOrder() {
    this.saveStatusConfirm(PurchaserOrderStatus.rejectedBySupplier, true);
  }

  rejectDisabled() {
    const result = !(this.purchaseOrder.purchase.idStatus === PurchaserOrderStatus.pending 
      || this.purchaseOrder.purchase.idStatus === PurchaserOrderStatus.inReview);
    return result;
  }

  hideDialogReason() {
     this.showDialogReason = false;
  }

  private getCurrencySymbol() {
    const filters = new CoinFilter();
    filters.id = this.purchaseOrder.purchase.idCurrency;

    this.currencyServie.getCoinsList(filters).toPromise()
    .then(data => this.currencySymbol = data[0].symbology)
    .catch(error => this.handleError(error));
  }

  private getPurchaseOrderStatusProperties(reason: Reason) {
    const obj = new PurchaseOrderUpdateStatus();
    obj.purchaseOrderId = this.purchaseOrder.purchase.idOrderPurchase;
    obj.statusId = this.statusSelected;
    obj.motiveId = reason?.motiveId ?? -1;
    obj.observation = reason?.observation ?? '';

    return obj;
  }
  
  private getFiltersValues() {
      if (history.state.queryParams != undefined) {
        const purchasefilters = history.state.queryParams.purchasefilters;
        if (purchasefilters !== null) {
          this.orderfiltersOfValues = JSON.parse(purchasefilters);
          sessionStorage.setItem('searchParameters', purchasefilters)
        } 
      } else {
        this.orderfiltersOfValues = JSON.parse(sessionStorage.getItem('searchParameters'));
      }
  }

  private calculateTotalOrerProucts() {
    this.subtotal = this.products ? this.products.reduce((t, {subtotal}) => t + subtotal, 0) : 0;
    this.discount = this.products ? this.products.reduce((t, {totalDeductible}) => t + totalDeductible, 0) : 0;
    this.taxable = this.products ? this.products.reduce((t, {totaltaxables}) => t + totaltaxables, 0) : 0;

  }

  private getPurchaseOrder(id: number) {
    if (id > 0) {
      const filters = new PurchaseOrderFilter();
      filters.idOrderPurchase = id;
      this.purchaseService.getPurchase(filters).toPromise()
      .then(data => this.getPurchaseOrderSuccessed(data))
      .catch(error => this.handleError(error));
    }
  }

  private getPurchaseOrderSuccessed(purchaseOrder: Groupingpurchaseorders) {
    this.purchaseOrder = purchaseOrder;
    this.purchaseOrder.purchase.status = purchaseOrder.purchase.status;
    if(this.purchaseOrder.purchase.idStatus == PurchaserOrderStatus.pending)
          this.purchaseOrder.purchase.operatorChecks = this._authservice.storeUser.fullName;
     if(this.purchaseOrder.purchase.idTypeNegotiation==-1)
          this.negotiationType.name= "Sin información"
      else
           this.getNegotiationType();
          
    //this.purchaseOrder.purchase.exchangeRateSupplier
    this.getDeliveryBranchOffice();
    this.getPayementTerm();
    this.getProducts();
    this.getCurrencySymbol();
    this.setMenuButtonItems();
  }

  private getProducts() {
    this.loadingService.startLoading();
    let filters = new PurchaseOrderFilter();
    filters.idOrderPurchase = this.purchaseOrder.purchase.idOrderPurchase;

    this.purchaseService.getPurchaseOrderProduct(filters).toPromise()
    .then(data => this.getProductsSuccessed(data))
    .catch(error => this.loadingHandleError(error));
  }

  private getProductsSuccessed(data: PurchaseOrderProduct[]) {
    this.products = data;
    this.calculateTotalOrerProucts();
    this.loadingService.stopLoading();
  }

  private setProductsCollumns() {
  this.cols =
  [
    { template: (data) => { return data.name; }, header: 'Producto', field: 'name', display: 'table-cell' },
    { template: (data) => { return data.gtin; }, header: 'Barra', field: 'gtin', display: 'table-cell' },
    { field: 'indHeavy', header: 'Pesado', display: 'table-cell' },
    { template: (data) => { return data.packaging; }, header: 'Empaque', field: 'packaging', display: 'table-cell' },
    { template: (data) => { return data.packagingType; }, header: 'Tipo de empaque', field: 'packagingType', display: 'none' },
    { template: (data) => { return data.unitPerPackaging; }, header: 'Unidades por empaque', field: 'unitPerPackaging', display: 'table-cell' },
    { template: (data) => { if (data.individualPrices.indAdded == 1) return this.decimalPipe.transform((data.baseCostUnit = data.individualPrices.baseCostNew), '.4'); else return this.decimalPipe.transform((data.baseCostUnit = data.masterPrices.baseCostNew),'.4') }, field: 'baseCostUnit', header: 'Costo base', display: 'table-cell' },
    { template: (data) => { if (data.individualPrices.indAdded == 1) return this.decimalPipe.transform((data.convertionCostUnit = data.individualPrices.convertionCost),'.4'); else return this.decimalPipe.transform((data.convertionCostUnit = data.masterPrices.convertionCost),'.4') }, field: 'convertionCostUnit', header: 'Costo conversión', display: 'table-cell' },
    { template: (data) => { if (data.indHeavy == true) return this.decimalPipe.transform(data.packagingQuantity,'.3'); else return this.decimalPipe.transform(data.packagingQuantity,'.0') }, header: 'Cantidad de empaques', display: 'table-cell', field: 'packagingQuantity' },
    { template: (data) => { if (data.indHeavy == true) return this.decimalPipe.transform((data.totalUnits = data.packagingQuantity * data.unitPerPackaging),'.3'); else return this.decimalPipe.transform((data.totalUnits = data.packagingQuantity * data.unitPerPackaging),'.0') }, header: 'Total de unidades', display: 'table-cell', field: 'totalUnits' },
    { template: (data) => { if (data.individualPrices.indAdded == 1) return this.decimalPipe.transform((data.baseCostTotal = data.individualPrices.baseCostNew * data.packagingQuantity),'.4'); else return this.decimalPipe.transform((data.baseCostTotal = data.masterPrices.baseCostNew * data.packagingQuantity),'.4') }, field: 'baseCostTotal', header: 'Costo base total', display: 'table-cell' },
    { template: (data) => { if (data.individualPrices.indAdded == 1) return this.decimalPipe.transform((data.convertionCostTotal = data.individualPrices.convertionCost * data.packagingQuantity),'.4'); else return this.decimalPipe.transform((data.convertionCostTotal = data.masterPrices.convertionCost * data.packagingQuantity),'.4') }, field: 'convertionCostTotal', header: 'Costo conversión total', display: 'table-cell' },
    { field: 'sellingFactor', header: 'Factor de venta', display: 'table-cell' },
    { template: (data) => { if (data.individualPrices.indAdded == 1) return this.decimalPipe.transform((data.minFactor = data.individualPrices.minimunFactor),'.2'); else return this.decimalPipe.transform((data.minFactor = data.masterPrices.minimunFactor),'.2') }, field: 'minFactor', header: 'Factor mínimo', display: 'table-cell' },
    { template: (data) => { if (data.individualPrices.indAdded == 1) return this.decimalPipe.transform((data.mediumFactor = data.individualPrices.mediumFactor),'.2'); else return this.decimalPipe.transform((data.mediumFactor = data.masterPrices.mediumFactor),'.2') }, field: 'mediumFactor', header: 'Factor medio', display: 'table-cell' },
    { template: (data) => { if (data.individualPrices.indAdded == 1) return this.decimalPipe.transform((data.maxFactor = data.individualPrices.maximunFactor),'.2'); else return this.decimalPipe.transform((data.maxFactor = data.masterPrices.maximunFactor),'.2') }, field: 'maxFactor', header: 'Factor máximo', display: 'table-cell' },
    { template: (data) => { if (data.individualPrices.indAdded == 1) return this.decimalPipe.transform((data.netCost = data.individualPrices.netCost),'.4'); else return this.decimalPipe.transform((data.netCost = data.masterPrices.netCost),'.4') }, field: 'netCost', header: 'Costo neto', display: 'table-cell' },
    { template: (data) => { if (data.individualPrices.indAdded == 1) return this.decimalPipe.transform((data.netCostConversion = data.individualPrices.netCostConversion),'.4'); else return this.decimalPipe.transform((data.netCostConversion = data.masterPrices.netCostConversion),'.4') }, field: 'netCostConversion', header: 'Costo neto conversión', display: 'table-cell' },
    { template: (data) => { if (data.individualPrices.indAdded == 1) return this.decimalPipe.transform((data.salesNetCost = data.individualPrices.salesNetCost),'.4'); else return this.decimalPipe.transform((data.salesNetCost = data.masterPrices.salesNetCost),'.4') }, field: 'salesNetCost', header: 'Costo neto venta', display: 'table-cell' },
    { template: (data) => { if (data.individualPrices.indAdded == 1) return this.decimalPipe.transform((data.salesNetCostConvertion = data.individualPrices.salesNetCostConvertion),'.4'); else return this.decimalPipe.transform((data.salesNetCostConvertion = data.masterPrices.salesNetCostConvertion),'.4') }, field: 'salesNetCostConvertion', header: 'Costo neto venta conversión', display: 'table-cell' },
    { template: (data) => { if (data.individualPrices.indAdded == 1) return this.decimalPipe.transform((data.pvpBase = data.individualPrices.pvpBaseNew),'.2'); else return this.decimalPipe.transform((data.pvpBase = data.masterPrices.pvpBaseNew),'.2') }, field: 'pvpBase', header: 'PVP base', display: 'table-cell' },
    { template: (data) => { if (data.individualPrices.indAdded == 1) return this.decimalPipe.transform((data.pvpConversion = data.individualPrices.pvpConversionNew),'.2'); else return this.decimalPipe.transform((data.pvpConversion = data.masterPrices.pvpConversionNew),'.2') }, field: 'pvpConversion', header: 'PVP conversión', display: 'table-cell' },
  ];
  this._selectedColumns = this.cols;
  }

  private getNegotiationType() {
    const filters = new TypeNegotiationFilter();
    filters.id = this.purchaseOrder?.purchase?.idTypeNegotiation;
    this.commonSRMService.gettypeNegotiation(filters).toPromise()
    .then(data => this.negotiationType = data[0])
    .catch(error => this.handleError(error));
  }

  private getPayementTerm() {
    const filters = new PaymentConditionFilter();
    filters.idPaymentCondition = this.purchaseOrder?.purchase?.paymentsConditions.idPaymentCondition;
    this.paymentConditionService.getPaymentconditionbyFilter().toPromise()
    .then(data => this.paymentTerms = data[0])
    .catch(error => this.handleError(error));
  }

  private getDeliveryBranchOffice() {
    this.branchService.getBranchOffice(this.purchaseOrder?.purchase?.idBranchRequest).toPromise()
    .then(branchOffice => this.branchOffice = branchOffice)
    .catch(error => this.handleError(error));
  }

  private getCompanyData() {
    this.companyService.getCompany(this.authService.currentCompany).toPromise()
    .then(company => this.company = company)
    .catch(error => this.handleError(error));
  }

  private finalizedPurchaseOrder() {
    this.saveStatusConfirm(PurchaserOrderStatus.reviewFinalized);
  }

  private getPurchaserOrderDefault() {
    const purchaseOrder = new Groupingpurchaseorders();
    purchaseOrder.purchase = new PurchaseOrder();
    purchaseOrder.suppliers = new Supplier();

    return purchaseOrder;
  }

  private setMenuButtonItems() {
    this.itemsButton = [
      { label: 'Finalizar', command: () => {
        this.finalizedPurchaseOrder(); 
        }, disabled: !this.orderIsInReview() || !this.userPermissions.allowed(this.permissionsIDs.FINISH_PURCHASE_ORDER_REVIEW_ID)
      }
  ];
  }

  private setBreadcrumb(id: number) {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'SRM' },
      { label: 'Proveedores' },
      { label: 'Documentos'  },
      { label: 'Orden de compra', routerLink: [`/srm/purchase-order-detail/${id}`] }
    ]);
  }

  private loadingHandleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.handleError(error);
  }

  private handleError(error: HttpErrorResponse) {
    this.dialogService.errorMessage('error', error?.message ?? 'error_service');
  }
  

  searchCoinsxCompany() {
    var filter = new CoinxCompanyFilter();
    filter.idCompany = this.authService.currentCompany;
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
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error cargando las monedas" });
    });
  }
}
