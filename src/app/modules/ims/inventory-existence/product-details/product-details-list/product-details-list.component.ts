import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SelectItem } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { InventoryExistence } from 'src/app/models/ims/inventory-existence';
import { ProductExistenceDetails } from 'src/app/models/ims/product-existence-detail';
import { ProductExistenceFilters } from 'src/app/models/ims/product-existence-filters';
import { ProductExistenceTransactionFilters } from 'src/app/models/ims/product-existence-transaction-filters';
import { ExcelExportService } from 'src/app/modules/common/components/excel-export-button/shared/excel-export.service';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { InventoryExistenceFilter } from '../../shared/filters/inventory-existence-filter';
import { InventoryExistenceService } from '../../shared/services/inventory-existence.service';
import { InventoryExistenceViewmodel } from '../../shared/view-models/inventory-existence-viewmodel';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import * as moment from 'moment';
@Component({
  selector: 'app-product-existence-details-list',
  templateUrl: './product-details-list.component.html',
  styleUrls: ['./product-details-list.component.scss'],
  providers: [DatePipe]
})
export class ProductExistenceDetailsListComponent implements OnInit {
  tittle: string;
  idProduct = -1;
  filters: ProductExistenceFilters = new ProductExistenceFilters();
  opEvent: Event;
  transactionsFilters: ProductExistenceTransactionFilters = new ProductExistenceTransactionFilters();
  productSelected: InventoryExistenceViewmodel = new InventoryExistenceViewmodel();
  productExistenceDetailsList: ProductExistenceDetails[] = [];
  showTransactionDetails = false;
  fileName = '';
  permissionsIDs = {...Permissions};
  sortOptions: SelectItem[];
    sortOrder: number;
    sortField: string;

  constructor(
    private breadcrumbService: BreadcrumbService ,
    public _inventoryExistenceService: InventoryExistenceService,
    private dialogService: DialogsService,
    private actRoute: ActivatedRoute,
    public datepipe: DatePipe,
    private readonly loadingService: LoadingService,
    private readonly excelExportService: ExcelExportService,
    private translateService: TranslateService,
    public userPermissions: UserPermissions
    ) {
      this.breadcrumbService.setItems([
        { label: 'OSM' },
        { label: 'IMS' },
        { label: 'Existencias de inventario', routerLink: ['/ims/inventory-existence-list'] },
        { label: 'Detalle del producto'}
        ]);
      }

  ngOnInit(): void {
    this.loadingService.startLoading();
    this.loadCurrentProductIfExists();

  }
  onSortChange(event) {
    const value = event.value;

    if (value.indexOf('!') === 0) {
        this.sortOrder = -1;
        this.sortField = value.substring(1, value.length);
    } else {
        this.sortOrder = 1;
        this.sortField = value;
    }
}
  loadCurrentProductIfExists() {
    debugger
    this.idProduct = Number(this.actRoute.snapshot.params['id']);
        if (this.isRouteIdEqualsToServiceId()) {
          this.productSelected = this._inventoryExistenceService.selectedProduct;
          this.loadingService.stopLoading();
        } else {
          this.searchProduct();
        }
  }

  search() {
    this.loadProductExistenceDetail();
  }

  getTotalSales() {
    return this.productExistenceDetailsList ? this.productExistenceDetailsList.reduce((t, val) => t += val.sales, 0) : 0;
  }
  getTotalSalesReturns() {
    return this.productExistenceDetailsList ? this.productExistenceDetailsList.reduce((t, val) => t += val.salesReturns, 0) : 0;
  }
  getTotalTransfers() {
    return this.productExistenceDetailsList ? this.productExistenceDetailsList.reduce((t, val) => t += val.transfers, 0) : 0;
  }
  getTotalAdjustments() {
    return this.productExistenceDetailsList ? this.productExistenceDetailsList.reduce((t, val) => t += val.adjustments, 0) : 0;
  }
  getTotalPurchases() {
    return this.productExistenceDetailsList ? this.productExistenceDetailsList.reduce((t, val) => t += val.purchases, 0) : 0;
  }
  getTotalPurchaseReturns() {
    return this.productExistenceDetailsList ? this.productExistenceDetailsList.reduce((t, val) => t += val.purchaseReturns, 0) : 0;
  }
  getTotalProductions() {
    return this.productExistenceDetailsList ? this.productExistenceDetailsList.reduce((t, val) => t += val.productions, 0) : 0;
  }

  getMaxSales() {
    return this.productExistenceDetailsList ? this.productExistenceDetailsList.reduce((t, val) =>
    t > val.sales ? t : val.sales, 0) : 0;
  }
  getMaxSalesReturns() {
    return this.productExistenceDetailsList ? this.productExistenceDetailsList.reduce((t, val) =>
    t > val.salesReturns ? t : val.salesReturns, 0) : 0;
  }
  getMaxTransfers() {
    return this.productExistenceDetailsList ? this.productExistenceDetailsList.reduce((t, val) =>
    t > val.transfers ? t : val.transfers, 0) : 0;
  }
  getMaxAdjustments() {
    return this.productExistenceDetailsList ? this.productExistenceDetailsList.reduce((t, val) =>
    t > val.adjustments ? t : val.adjustments, 0) : 0;
  }
  getMaxPurchases() {
    return this.productExistenceDetailsList ? this.productExistenceDetailsList.reduce((t, val) =>
    t > val.purchases ? t : val.purchases, 0) : 0;
  }
  getMaxPurchaseReturns() {
    return this.productExistenceDetailsList ? this.productExistenceDetailsList.reduce((t, val) =>
    t > val.purchaseReturns ? t : val.purchaseReturns, 0) : 0;
  }
  getMaxProductions() {
    return this.productExistenceDetailsList ? this.productExistenceDetailsList.reduce((t, val) =>
    t > val.productions ? t : val.productions, 0) : 0;
  }

  onSalesClicked(event: Event, item: ProductExistenceDetails) {
    this.transactionsFilters = this.loadProductTransactionFilters(item, '2');
    this.showTransactionDetails = true;
    this.tittle = this.getTextByKey('ims.product_existence.sales_of_day') + this.datepipe.transform(item.itemDate, 'dd-MM-yyyy');
  }
  onSalesReturnsClicked(event: Event, item: ProductExistenceDetails) {
    this.transactionsFilters = this.loadProductTransactionFilters(item, '13');
    this.showTransactionDetails = true;
    this.tittle = this.getTextByKey('ims.product_existence.salesReturns_of_day') + this.datepipe.transform(item.itemDate, 'dd-MM-yyyy');
  }
  onTransfersClicked(event: Event, item: ProductExistenceDetails) {
    this.transactionsFilters = this.loadProductTransactionFilters(item, '5,6,20');
    this.showTransactionDetails = true;
    this.tittle = this.getTextByKey('ims.product_existence.transfers_of_day') + this.datepipe.transform(item.itemDate, 'dd-MM-yyyy');
  }
  onAdjustmentsClicked(event: Event, item: ProductExistenceDetails) {
    this.transactionsFilters = this.loadProductTransactionFilters(item, '12');
    this.showTransactionDetails = true;
    this.tittle = this.getTextByKey('ims.product_existence.adjustments_of_day') + this.datepipe.transform(item.itemDate, 'dd-MM-yyyy');
  }
  onPurchasesClicked(event: Event, item: ProductExistenceDetails) {
    this.transactionsFilters = this.loadProductTransactionFilters(item, '1,21');
    this.showTransactionDetails = true;
    this.tittle = this.getTextByKey('ims.product_existence.purchases_of_day') + this.datepipe.transform(item.itemDate, 'dd-MM-yyyy');
  }
  onPurchaseReturnsClicked(event: Event, item: ProductExistenceDetails) {
    this.transactionsFilters = this.loadProductTransactionFilters(item, '4');
    this.showTransactionDetails = true;
    this.tittle = this.getTextByKey('ims.product_existence.purchaseReturns_of_day') + this.datepipe.transform(item.itemDate, 'dd-MM-yyyy');
  }
  onProductionsClicked(event: Event, item: ProductExistenceDetails) {
    this.transactionsFilters = this.loadProductTransactionFilters(item, '15,16');
    this.showTransactionDetails = true;
    this.tittle = this.getTextByKey('ims.product_existence.productions_of_day') + this.datepipe.transform(item.itemDate, 'dd-MM-yyyy');
  }

  loadProductTransactionFilters(item: ProductExistenceDetails, transactionType: string) {
    const model = new ProductExistenceTransactionFilters();
    model.idProduct = this.idProduct;
    model.idArea = this.productSelected.idinventoryarea;
    model.idBranchoffice = this.productSelected.idbranchoffice;
    model.idPackage = this.productSelected.idPackage;
    model.idSpace = this.productSelected.idSpace;
    model.transactionDate = this.datepipe.transform(item.itemDate, 'yyyyMMdd');
    model.transactionType = transactionType;
    return model;
  }
  exportExcel() {
    if (!this.dataUnavailable) {
      this.fileName = this.getTextByKey('ims.product_existence.product_history');
      const listToExport = this.loadModelToExport();
      this.excelExportService.exportData(this.fileName, listToExport);
    }
  }

  loadModelToExport() {
    const list = this.productExistenceDetailsList.map( item => {
      return {
        [this.getTextByKey('ims.product_existence.itemDate_field')]: this.datepipe.transform(item.itemDate, 'dd-MM-yyyy'),
        [this.getTextByKey('ims.product_existence.sales_field')]: item.sales,
        [this.getTextByKey('ims.product_existence.salesReturns_field')]: item.salesReturns,
        [this.getTextByKey('ims.product_existence.transfers_field')]: item.transfers,
        [this.getTextByKey('ims.product_existence.adjustments_field')]: item.adjustments,
        [this.getTextByKey('ims.product_existence.purchases_field')]: item.purchases,
        [this.getTextByKey('ims.product_existence.purchaseReturns_field')]: item.purchaseReturns,
        [this.getTextByKey('ims.product_existence.productions_field')]: item.productions
      };
    });
    return list;
  }
  get dataUnavailable() {
    return (!this.productExistenceDetailsList  || this.productExistenceDetailsList.length === 0);
  }

  public getValueFormat(itemDate: any) {
    return this.validateDateFormat(itemDate);
  }

  public validateDateFormat(itemDate: any) {
    let formattedDate = itemDate;
      switch (itemDate.length) {
        case 10:
            if (moment(itemDate, 'DD/MM/YYYY', true).isValid()) {
              formattedDate = this.datepipe.transform(moment(formattedDate, 'DD-MM-YYYY'), 'yyyy-MM-dd');
            }
          break;
        case 5:
            if (moment(itemDate, 'DD/MM', true).isValid()) {
              formattedDate = this.datepipe.transform(moment(formattedDate, 'DD-MM'), 'yyyy-MM-dd');
            }
          break;
        default:
          break;
      }
    return formattedDate;
  }

  public overPanelCallBack(show: boolean): void {
    this.showTransactionDetails = show;
  }
  private loadProductExistenceDetail() {
    debugger
    this.loadingService.startLoading();
    this._inventoryExistenceService
    .getProductExistenceDetails({...this.filters})
    .then(details => this.productExistenceDetailsList = details)
    .then(() => this.loadSortOptions())
    .then(() => this.loadingService.stopLoading())
    .catch(error => this.handleError(error));
  }
  private searchProduct() {
    const filters = this.loadFilters();
    this._inventoryExistenceService.getInventoryExistenceList({...filters})
    .then(response => this.productSelected = this.inventoryExistenceToViewModel(response[0]) )
    .then(() => this.loadingService.stopLoading())
    .catch(error => this.handleError(error));
  }

  private inventoryExistenceToViewModel(model: InventoryExistence) {
    const productExistenceViewModel  = new InventoryExistenceViewmodel;
    productExistenceViewModel.bar = model.bar;
    productExistenceViewModel.productname = model.productname;
    productExistenceViewModel.idproduct = model.idproduct;
    productExistenceViewModel.category = model.category;
    productExistenceViewModel.brand = model.brand;
    productExistenceViewModel.supplier = model.supplier;
    productExistenceViewModel.basePvp = model.basePvp;
    productExistenceViewModel.existence = model.existence;
    productExistenceViewModel.idbranchoffice = model.idbranchoffice;
    productExistenceViewModel.idPackage = model.idPackage;
    productExistenceViewModel.idinventoryarea = model.idinventoryarea;
    productExistenceViewModel.inventoryarea = model.inventoryarea;
    productExistenceViewModel.idSpace  = model.idSpace;
    return productExistenceViewModel;
  }

  private loadFilters() {
    const model = new InventoryExistenceFilter();
    model.idproduct = this.idProduct;
    model.inventorydate = this.datepipe.transform(new Date, 'yyyyMMdd');
    return model;
  }

  private handleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.dialogService.errorMessage('ims.inventory_existences.inventory_existence', error?.error?.message ?? 'error_service');
  }
  private isRouteIdEqualsToServiceId() {
    return this._inventoryExistenceService.selectedProduct && this._inventoryExistenceService.selectedProduct.idproduct === this.idProduct;
  }
  private loadSortOptions() {
    this.sortOptions = [
      {label: [this.getTextByKey('ims.product_existence.descending_date')], value: '!itemDate'},
      {label: this.getTextByKey('ims.product_existence.ascending_date'), value: 'itemDate'},
      {label: this.getTextByKey('ims.product_existence.sales_high_low'), value: '!sales'},
      {label: this.getTextByKey('ims.product_existence.sales_low_high'), value: 'sales'},
      {label: this.getTextByKey('ims.product_existence.sales_returns_high_low'), value: '!salesReturns'},
      {label: this.getTextByKey('ims.product_existence.sales_returns_low_high'), value: 'salesReturns'},
      {label: this.getTextByKey('ims.product_existence.transfers_high_low'), value: '!transfers'},
      {label: this.getTextByKey('ims.product_existence.transfers_low_high'), value: 'transfers'},
      {label: this.getTextByKey('ims.product_existence.adjustments_high_low'), value: '!adjustments'},
      {label: this.getTextByKey('ims.product_existence.adjustments_low_high'), value: 'adjustments'},
      {label: this.getTextByKey('ims.product_existence.purchases_high_low'), value: '!purchases'},
      {label: this.getTextByKey('ims.product_existence.purchases_low_high'), value: 'purchases'},
      {label: this.getTextByKey('ims.product_existence.purchases_returns_high_low'), value: '!purchaseReturns'},
      {label: this.getTextByKey('ims.product_existence.purchases_returns_low_high'), value: 'purchaseReturns'},
      {label: this.getTextByKey('ims.product_existence.productions_high_low'), value: '!productions'},
      {label: this.getTextByKey('ims.product_existence.productions_low_high'), value: 'productions'}
  ];
  }
  private getTextByKey(key: string) {
    return this.translateService.instant(key);
  }
}


