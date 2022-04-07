import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { InventoryProductHistory } from 'src/app/models/ims/inventory-product-history';
import { InventoryProductHistoryFilters } from 'src/app/models/ims/inventory-product-history-filters';
import { ExcelExportService } from 'src/app/modules/common/components/excel-export-button/shared/excel-export.service';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { AuthService } from 'src/app/modules/login/shared/auth.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { InventoryProductHistoryService } from '../shared/service/inventory-product-history.service';
@Component({
  selector: 'app-inventory-product-history-list',
  templateUrl: './inventory-product-history-list.component.html',
  styleUrls: ['./inventory-product-history-list.component.scss']
})
export class InventoryProductHistoryListComponent implements OnInit {
  fileName = '';
  showFilters = true;
  loading  = false;
  filters: InventoryProductHistoryFilters = new InventoryProductHistoryFilters();
  inventoryProductHistoryList: InventoryProductHistory[] = [];
  displayedColumns: any[] = [];
  hiddenColumns: any[] = [];
  permissionsIDs = {...Permissions};
  _selectedColumns:  any[];
  _selectedHiddenColumns:  any[];

  constructor(
    private _inventoryProductHistoryService: InventoryProductHistoryService,
    private breadcrumbService: BreadcrumbService ,
    private dialogService: DialogsService,
    private actRoute: ActivatedRoute,
    private readonly loadingService: LoadingService,
    private readonly excelExportService: ExcelExportService,
    private translateService: TranslateService,
    public userPermissions: UserPermissions,
    private _authService: AuthService) {
      this.breadcrumbService.setItems([
        { label: 'OSM' },
        { label: 'IMS' },
        { label: 'Reportes' },
        { label: 'Historia de productos', routerLink: ['/ims/product-history-report'] }
    ]);
  }

  ngOnInit(): void {
    this.loadColumns();
  }
  search() {
    this.loadProductHistoryList();
  }

loadColumns() {

  this.displayedColumns = [
    {field: 'barCode', header: 'ims.product_histories.barCode_field', display: 'table-cell',
    showColumn: true, dataType: 'string', isAllowed: true},
    {field: 'productName', header: 'ims.product_histories.productName_field', display: 'table-cell',
    showColumn: true, dataType: 'string', isAllowed: true},
    {field: 'scaleCode', header: 'ims.product_histories.scaleCode_field', display: 'table-cell',
    showColumn: false, dataType: 'string', isAllowed: true},
    {field: 'area', header: 'ims.product_histories.area_field', display: 'table-cell',
    showColumn: true, dataType: 'string', isAllowed: true},
    {field: 'initialInventory', header: 'ims.product_histories.initialInventory_field', display: 'table-cell',
    showColumn: false, dataType: 'number', isAllowed: true},
    {field: 'sales', header: 'ims.product_histories.sales_field', display: 'table-cell',
    showColumn: false, dataType: 'number', isAllowed: this.checkPermission},
    {field: 'salesReturn', header: 'ims.product_histories.salesReturn_field', display: 'table-cell',
    showColumn: false, dataType: 'number', isAllowed: this.checkPermission},
    {field: 'transfers', header: 'ims.product_histories.transfers_field', display: 'table-cell',
    showColumn: false, dataType: 'number', isAllowed: this.checkPermission},
    {field: 'adjustments', header: 'ims.product_histories.adjustments_field', display: 'table-cell',
    showColumn: false, dataType: 'number', isAllowed: this.checkPermission},
    {field: 'purchases', header: 'ims.product_histories.purchases_field', display: 'table-cell',
    showColumn: false, dataType: 'number', isAllowed: this.checkPermission},
    {field: 'purchaseReturns', header: 'ims.product_histories.purchaseReturns_field', display: 'table-cell',
    showColumn: false, dataType: 'number', isAllowed: this.checkPermission},
    {field: 'productions', header: 'ims.product_histories.productions_field', display: 'table-cell',
    showColumn: false, dataType: 'number', isAllowed: this.checkPermission},
    {field: 'finalInventory', header: 'ims.product_histories.finalInventory_field', display: 'table-cell',
    showColumn: false, dataType: 'number', isAllowed: true},
    {field: 'hierarchyCategory', header: 'ims.product_histories.category_field', display: 'table-cell',
    showColumn: true, dataType: 'string', isAllowed: true},
    {field: 'supplier', header: 'ims.product_histories.supplier_field', display: 'table-cell',
    showColumn: true, dataType: 'string', isAllowed: true},
    {field: 'brand', header: 'ims.product_histories.brand_field', display: 'table-cell',
    showColumn: false, dataType: 'string', isAllowed: true},
    {field: 'productEstatus', header: 'ims.product_histories.productEstatus_field', display: 'table-cell',
    showColumn: true, dataType: 'string', isAllowed: true},
    {field: 'presentation', header: 'ims.product_histories.presentation_field', display: 'none',
    showColumn: false, dataType: 'string', isAllowed: true},
    {field: 'packing', header: 'ims.product_histories.packing_field', display: 'none',
    showColumn: false, dataType: 'number', isAllowed: true},
    {field: 'unPacking', header: 'ims.product_histories.unPacking_field', display: 'none',
    showColumn: false, dataType: 'number', isAllowed: true},
  ];

  this._selectedColumns = this.displayedColumns.filter(p => p.showColumn && p.isAllowed);
  this.hiddenColumns = this.displayedColumns.filter(p => !p.showColumn && p.isAllowed && p.display !== 'none');
}


  exportExcel() {
    if (!this.dataUnavailable) {
      this.fileName = this.getTextByKey('ims.product_histories.product_history_report');
      const listToExport = this.loadModelToExport();
      this.excelExportService.exportData(this.fileName, listToExport);
    }
  }

  loadModelToExport() {
    const list = this.checkPermission ? this.loadFullModel() : this.loadModelWhitoutCostFields();
    return list;
  }
  get checkPermission() {
    return this.userPermissions.allowed(this.permissionsIDs.CHECK_PRODUCT_HISTORY_REPORT_COST_FIELDS_ID);
  }
  get dataUnavailable() {
    return (!this.inventoryProductHistoryList  || this.inventoryProductHistoryList.length === 0);
  }

  private loadFullModel() {
   return this.inventoryProductHistoryList.map( item => {
      return {
        [this.getTextByKey('ims.product_histories.barCode_field')]: item.barCode,
        [this.getTextByKey('ims.product_histories.productName_field')]: item.productName,
        [this.getTextByKey('ims.product_histories.scaleCode_field')]: item.scaleCode,
        [this.getTextByKey('ims.product_histories.area_field')]: item.area,
        [this.getTextByKey('ims.product_histories.initialInventory_field')]: item.initialInventory,
        [this.getTextByKey('ims.product_histories.sales_field')]: item.sales,
        [this.getTextByKey('ims.product_histories.salesReturn_field')]: item.salesReturn,
        [this.getTextByKey('ims.product_histories.transfers_field')]: item.transfers,
        [this.getTextByKey('ims.product_histories.adjustments_field')]: item.adjustments,
        [this.getTextByKey('ims.product_histories.purchases_field')]: item.purchases,
        [this.getTextByKey('ims.product_histories.purchaseReturns_field')]: item.purchaseReturns,
        [this.getTextByKey('ims.product_histories.productions_field')]: item.productions,
        [this.getTextByKey('ims.product_histories.finalInventory_field')]: item.finalInventory,
        [this.getTextByKey('ims.product_histories.category_field')]: item.hierarchyCategory,
        [this.getTextByKey('ims.product_histories.supplier_field')]: item.supplier,
        [this.getTextByKey('ims.product_histories.brand_field')]: item.brand,
        [this.getTextByKey('ims.product_histories.productEstatus_field')]: item.productEstatus,
        [this.getTextByKey('ims.product_histories.presentation_field')]: item.presentation,
        [this.getTextByKey('ims.product_histories.packing_field')]: item.packing,
        [this.getTextByKey('ims.product_histories.unPacking_field')]: item.unPacking,
      };
    });
  }
  private loadModelWhitoutCostFields() {
    return this.inventoryProductHistoryList.map( item => {
       return {
         [this.getTextByKey('ims.product_histories.barCode_field')]: item.barCode,
         [this.getTextByKey('ims.product_histories.productName_field')]: item.productName,
         [this.getTextByKey('ims.product_histories.scaleCode_field')]: item.scaleCode,
         [this.getTextByKey('ims.product_histories.area_field')]: item.area,
         [this.getTextByKey('ims.product_histories.initialInventory_field')]: item.initialInventory,
         [this.getTextByKey('ims.product_histories.finalInventory_field')]: item.finalInventory,
         [this.getTextByKey('ims.product_histories.category_field')]: item.hierarchyCategory,
         [this.getTextByKey('ims.product_histories.supplier_field')]: item.supplier,
         [this.getTextByKey('ims.product_histories.brand_field')]: item.brand,
         [this.getTextByKey('ims.product_histories.productEstatus_field')]: item.productEstatus,
         [this.getTextByKey('ims.product_histories.presentation_field')]: item.presentation,
         [this.getTextByKey('ims.product_histories.packing_field')]: item.packing,
         [this.getTextByKey('ims.product_histories.unPacking_field')]: item.unPacking,
       };
     });
   }

  private loadProductHistoryList() {
    this.loadingService.startLoading();
    this.filters.idBranchOffice = this._authService.currentOffice;
    this._inventoryProductHistoryService
    .getInventoryProductHistorylist({...this.filters})
    .then(data => this.inventoryProductHistoryList = data)
    .then(() => this.loadingService.stopLoading())
    .catch(error => this.handleError(error));
  }

  private handleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.dialogService.errorMessage('ims.product_histories.product_history', error?.error?.message ?? 'error_service');
  }

  private getTextByKey(key: string) {
    return this.translateService.instant(key);
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedHiddenColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.displayedColumns.filter(col => val.includes(col) || (col.showColumn && col.isAllowed) );
    this._selectedHiddenColumns = this.hiddenColumns.filter(col => val.includes(col) );
  }
}
