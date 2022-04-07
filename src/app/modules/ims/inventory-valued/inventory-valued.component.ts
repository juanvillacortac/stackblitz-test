import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ValuedInventoryFilters } from 'src/app/models/ims/valued-inventory';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { ExcelExportService } from '../../common/components/excel-export-button/shared/excel-export.service';
import { LoadingService } from '../../common/components/loading/shared/loading.service';
import { DialogsService } from '../../common/services/dialogs.service';
import { UserPermissions } from '../../security/users/shared/user-permissions.service';
import { ReportService } from '../shared/services/report.service';

@Component({
  selector: 'app-inventory-valued',
  templateUrl: './inventory-valued.component.html',
  styleUrls: ['./inventory-valued.component.scss'],
  providers: [DatePipe]
})
export class InventoryValuedComponent implements OnInit {

  permissionsIDs = {...Permissions};
  filters: ValuedInventoryFilters = new ValuedInventoryFilters();
  showFilters: boolean = false;
  valuedInventoryList = [];
  fileName: string;

  displayedColumns: any[] = [];
  hiddenColumns: any[] = [];

  _selectedColumns:  any[];
  _selectedHiddenColumns:  any[];

  get dataUnavailable() {
    return (!this.valuedInventoryList  || this.valuedInventoryList.length === 0);
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedHiddenColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.displayedColumns.filter(col => val.includes(col) || (col.showColumn));
    this._selectedHiddenColumns = this.hiddenColumns.filter(col => val.includes(col) );
  }

  constructor(private reportService: ReportService,
    public userPermissions: UserPermissions,
    public datepipe: DatePipe,
    private readonly loadingService: LoadingService,
    private readonly dialogService: DialogsService,
    private readonly translateService: TranslateService,
    private readonly excelExportService: ExcelExportService,
    private breadcrumbService: BreadcrumbService) { }

  ngOnInit(): void {
    this.setBreadCrumb();
    this.loadColumns();
  }

  search() {
    this.loadingService.startLoading();
    this.reportService.getInventoryProductHistorylist(this.filters)
    .then(data => this.searchSuccess(data))
    .catch(error => this.handleError(error));
  }

  searchSuccess(data) {
    this.loadingService.stopLoading();
    this.valuedInventoryList = data;
  }

  exportExcel() {
    if (!this.dataUnavailable) {
      this.fileName = this.getTextByKey('report');
      const listToExport = this.loadFullModel();
      this.excelExportService.exportData(this.fileName, listToExport);
    }
  }

  private loadColumns() {

    this.displayedColumns = [
      {field: 'barcode', header: this.getTranslateLabel("barcode"), display: 'table-cell',
      showColumn: true, dataType: 'string'},
      {field: 'productName', header: this.getTranslateLabel("product_name"), display: 'table-cell',
      showColumn: true, dataType: 'string'},
      {field: 'packageType', header: this.getTranslateLabel("package_type"), display: 'table-cell',
      showColumn: false, dataType: 'string'},
      {field: 'units', header: this.getTranslateLabel("units"), display: 'table-cell',
      showColumn: true, dataType: 'string'},
      {field: 'branchOffice', header: this.getTranslateLabel("branch_office"), display: 'table-cell',
      showColumn: false, dataType: 'string'},
      {field: 'status', header: this.getTranslateLabel("status"), display: 'table-cell',
      showColumn: true, dataType: 'string'},
      {field: 'supplier', header: this.getTranslateLabel("supplier"), display: 'table-cell',
      showColumn: false, dataType: 'string'},
      {field: 'inventory', header: this.getTranslateLabel("inventory"), display: 'table-cell',
      showColumn: false, dataType: 'number'},
      {field: 'baseCost', header: this.getTranslateLabel("base_cost"), display: 'table-cell',
      showColumn: false, dataType: 'number'},
      {field: 'baseNetCost', header: this.getTranslateLabel("base_net_cost"), display: 'table-cell',
      showColumn: false, dataType: 'number'},
      {field: 'conversionNetCost', header: this.getTranslateLabel("conversion_net_cost"), display: 'table-cell',
      showColumn: false, dataType: 'number'},
      {field: 'baseNetSellCost', header: this.getTranslateLabel("base_net_sell_cost"), display: 'table-cell',
      showColumn: false, dataType: 'number'},
      {field: 'conversionNetSellCost', header: this.getTranslateLabel("conversion_net_sell_cost"), display: 'table-cell',
      showColumn: false, dataType: 'number'},
      {field: 'baseRetailPrice', header: this.getTranslateLabel("base_retail_price"), display: 'table-cell',
      showColumn: true, dataType: 'number'},
      {field: 'conversionRetailPrice', header: this.getTranslateLabel("conversion_retail_price"), display: 'table-cell',
      showColumn: true, dataType: 'number'},
      {field: 'netFactor', header: this.getTranslateLabel("net_factor"), display: 'table-cell',
      showColumn: false, dataType: 'number'},
      {field: 'netSellFactor', header: this.getTranslateLabel("net_sell_factor"), display: 'table-cell',
      showColumn: true, dataType: 'number'},
      {field: 'netSell', header: this.getTranslateLabel("net_sell"), display: 'table-cell',
      showColumn: false, dataType: 'number'},
      {field: 'indConsignment', header: this.getTranslateLabel("ind_consignment"), display: 'table-cell',
      showColumn: false, dataType: 'boolean'},
      {field: 'closedDate', header: this.getTranslateLabel("closed_date"), display: 'table-cell',
      showColumn: false, dataType: 'date'},
      {field: 'purchaseDate', header: this.getTranslateLabel("purchase_date"), display: 'table-cell',
      showColumn: false, dataType: 'date'},
      {field: 'transferDate', header: this.getTranslateLabel("transference_date"), display: 'table-cell',
      showColumn: false, dataType: 'date'}
    ];
  
    this._selectedColumns = this.displayedColumns.filter(p => p.showColumn);
    this.hiddenColumns = this.displayedColumns.filter(p => !p.showColumn && p.display !== 'none');
  }

  private loadFullModel() {
    return this.valuedInventoryList.map(item => {
       return {
         [this.getTextByKey('barcode')]: item.barcode,
         [this.getTextByKey('product_name')]: item.productName,
         [this.getTextByKey('package_type')]: item.packageType,
         [this.getTextByKey('units')]: item.units,
         [this.getTextByKey('branch_office')]: item.branchOffice,
         [this.getTextByKey('status')]: item.status,
         [this.getTextByKey('supplier')]: item.supplier,
         [this.getTextByKey('inventory')]: item.inventory,
         [this.getTextByKey('base_cost')]: item.baseCost,
         [this.getTextByKey('base_net_cost')]: item.baseNetCost,
         [this.getTextByKey('conversion_net_cost')]: item.conversionNetCost,
         [this.getTextByKey('base_net_sell_cost')]: item.baseNetSellCost,
         [this.getTextByKey('conversion_net_sell_cost')]: item.conversionNetSellCost,
         [this.getTextByKey('base_retail_price')]: item.baseRetailPrice,
         [this.getTextByKey('conversion_retail_price')]: item.conversionRetailPrice,
         [this.getTextByKey('net_factor')]: item.netFactor,
         [this.getTextByKey('net_sell_factor')]: item.netSellFactor,
         [this.getTextByKey('net_sell')]: item.netSell,
         [this.getTextByKey('ind_consignment')]: item.indConsignment,
         [this.getTextByKey('closed_date')]: this.datepipe.transform(item.closedDate, 'yyyyMMdd'),
         [this.getTextByKey('purchase_date')]: this.datepipe.transform(item.purchaseDate, 'yyyyMMdd'),
         [this.getTextByKey('transference_date')]: this.datepipe.transform(item.transferDate, 'yyyyMMdd'),
       };
     });
   }

  private setBreadCrumb() {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'IMS' },
      { label: 'Reportes' },
      { label: 'Inventario valorizado', routerLink: ['/ims/inventory-valued-report'] }
  ]);
  }

  private getTranslateLabel(key: string) {
    return `ims.inventory_valued.${key}`;
  }

  private getTextByKey(key: string) {
    return this.translateService.instant(`ims.inventory_valued.${key}`);
  }

  private handleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.dialogService.errorMessage('error', error?.error?.message ?? 'error_service');
  }

}
