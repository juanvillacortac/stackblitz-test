import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { InventoryProductAbc } from 'src/app/models/ims/inventory-product-abc';
import { InventoryProductAbcFilters } from 'src/app/models/ims/inventory-product-abc-filters';
import { ExcelExportService } from 'src/app/modules/common/components/excel-export-button/shared/excel-export.service';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { ReportService } from '../../shared/services/report.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
@Component({
  selector: 'app-inventory-product-abc-list',
  templateUrl: './inventory-product-abc-list.component.html',
  styleUrls: ['./inventory-product-abc-list.component.scss']
})
export class InventoryProductAbcListComponent implements OnInit { fileName = '';
showFilters = true;
loading  = false;
filters: InventoryProductAbcFilters = new InventoryProductAbcFilters();
inventoryProductAbcList: InventoryProductAbc[] = [];
displayedColumns: any[] = [];
hiddenColumns: any[] = [];
permissionsIDs = {...Permissions};
_selectedColumns:  any[];
_selectedHiddenColumns:  any[];
expandedRows = {};
isExpanded = false;

constructor(
  private _reportService: ReportService,
  private breadcrumbService: BreadcrumbService ,
  private dialogService: DialogsService,
  private actRoute: ActivatedRoute,
  private readonly loadingService: LoadingService,
  private readonly excelExportService: ExcelExportService,
  private translateService: TranslateService,
  public userPermissions: UserPermissions) {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'IMS' },
      { label: 'Reportes' },
      { label: 'ABC del producto', routerLink: ['/ims/product-abc-report'] }
  ]);
}

ngOnInit(): void {
  this.loadColumns();
}
search() {
  this.loadInventoryProductAbcList();
}

loadColumns() {

this.displayedColumns = [
  {field: 'productId', header: '', display: 'none',
    showColumn: false, dataType: 'number', isAllowed: true},
  {field: 'packageId', header: '', display: 'none',
    showColumn: false, dataType: 'number', isAllowed: true},
  {field: 'product', header: 'ims.inventory_product_abc.productName_field', display: 'table-cell',
    showColumn: true, dataType: 'string', isAllowed: true},  
  {field: 'package', header: 'ims.inventory_product_abc.package', display: 'table-cell',
    showColumn: true, dataType: 'string', isAllowed: true}, 
  {field: 'productAbc', header: 'ims.inventory_product_abc.product_abc', display: 'table-cell',
    showColumn: true, dataType: 'string', isAllowed: true},
  {field: 'unitNumber', header: 'ims.inventory_product_abc.unitNumber', display: 'table-cell',
    showColumn: true, dataType: 'number', isAllowed: true},
  {field: 'unitsTotals', header: 'ims.inventory_product_abc.units', display: 'table-cell',
    showColumn: true, dataType: 'number', isAllowed: this.checkPermission},
  {field: 'salesCost', header: 'ims.inventory_product_abc.salesCost', display: 'table-cell',
    showColumn: true, dataType: 'number', isAllowed: this.checkPermission},
  {field: 'sales', header: 'ims.inventory_product_abc.sales_field', display: 'table-cell',
    showColumn: true, dataType: 'number', isAllowed: this.checkPermission},
  {field: 'percentage', header: 'ims.inventory_product_abc.percentage', display: 'table-cell',
    showColumn: true, dataType: 'number', isAllowed: this.checkPermission},
  {field: 'accrued', header: 'ims.inventory_product_abc.accrued', display: 'table-cell',
    showColumn: true, dataType: 'number', isAllowed: this.checkPermission},
  {field: 'earnings', header: 'ims.inventory_product_abc.earnings', display: 'table-cell',
    showColumn: true, dataType: 'number', isAllowed: this.checkPermission}
];

this._selectedColumns = this.displayedColumns.filter(p => p.showColumn && p.isAllowed);
this.hiddenColumns = this.displayedColumns.filter(p => !p.showColumn && p.isAllowed && p.display !== 'none');
}


exportExcel() {
  if (!this.dataUnavailable) {
    this.fileName = this.getTextByKey('ims.inventory_product_abc.product_abc_report');
    const listToExport = this.loadModelToExport();
    this.excelExportService.exportData(this.fileName, listToExport);
  }
}

loadModelToExport() {
  const list = this.checkPermission ? this.loadFullModel() : this.loadModelWhitoutCostFields();
  return list;
}
get checkPermission() {
  return this.userPermissions.allowed(this.permissionsIDs.CHECK_PRODUCT_ABC_REPORT_COST_FIELDS_ID);
}
get dataUnavailable() {
  return (!this.inventoryProductAbcList  || this.inventoryProductAbcList.length === 0);
}

private loadFullModel() {
 return this.inventoryProductAbcList.map( item => {
    return {
     [this.getTextByKey('ims.inventory_product_abc.productName_field')]: item.product,
     [this.getTextByKey('ims.inventory_product_abc.reference_filters')]: item.reference,
     [this.getTextByKey('ims.inventory_product_abc.factory_references_filters')]: item.factoryReference,
     [this.getTextByKey('ims.inventory_product_abc.brands_filters')]: item.brand,
     [this.getTextByKey('ims.inventory_product_abc.category_filters')]: item.category,
     [this.getTextByKey('ims.inventory_product_abc.utility')]: item.utility,
     [this.getTextByKey('ims.inventory_product_abc.sales_field')]: item.sales,
     [this.getTextByKey('ims.inventory_product_abc.units')]: item.units,
     [this.getTextByKey('ims.inventory_product_abc.product_abc')]: item.productAbc
    };
  });
}
private loadModelWhitoutCostFields() {
  return this.inventoryProductAbcList.map( item => {
     return {
      [this.getTextByKey('ims.inventory_product_abc.productName_field')]: item.product,
      [this.getTextByKey('ims.inventory_product_abc.reference_filters')]: item.reference,
      [this.getTextByKey('ims.inventory_product_abc.factory_references_filters')]: item.factoryReference,
      [this.getTextByKey('ims.inventory_product_abc.brands_filters')]: item.brand,
      [this.getTextByKey('ims.inventory_product_abc.category_filters')]: item.category,
     };
   });
 }

private loadInventoryProductAbcList() {
  this.loadingService.startLoading();
  this._reportService
      .getInventoryProductAbclist({...this.filters})
      .then(data => this.inventoryProductAbcList = data)
      .then(() => this.loadingService.stopLoading())
      .catch(error => this.handleError(error));
}

private handleError(error: HttpErrorResponse) {
  this.loadingService.stopLoading();
  this.dialogService.errorMessage('ims.inventory_product_abc.product_abc_report', error?.error?.message ?? 'error_service');
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
private collapseAll() {
  this.expandedRows = {};
  this.isExpanded = !this.isExpanded;
}
}
