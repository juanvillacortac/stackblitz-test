import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { AdjustmentFilterReport } from 'src/app/models/ims/adjustment-filter-report';
import { AdjustmentReport } from 'src/app/models/ims/adjustment-report';
import { ExcelExportService } from 'src/app/modules/common/components/excel-export-button/shared/excel-export.service';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { InventoryAdjustmentService } from '../shared/services/inventory-adjustment.service';

@Component({
  selector: 'app-inventory-adjustment-report',
  templateUrl: './inventory-adjustment-report.component.html',
  styleUrls: ['./inventory-adjustment-report.component.scss']
})
export class InventoryAdjustmentReportComponent implements OnInit {

  fileName = '';
  showFilters = true;
  loading  = false;
  filters: AdjustmentFilterReport = new AdjustmentFilterReport();
  adjustmentReport = new AdjustmentReport();
  adjustmentReportResult: AdjustmentReport[] = [];
  displayedColumns: any[] = [];
  hiddenColumns: any[] = [];
  permissionsIDs = {...Permissions};
  _selectedColumns:  any[];
  _selectedHiddenColumns:  any[];

  constructor(private breadcrumbService: BreadcrumbService,
    private dialogService: DialogsService,
    private readonly loadingService: LoadingService,
    private readonly excelExportService: ExcelExportService,
    private readonly inventoryAdjustmentService: InventoryAdjustmentService,
    private translateService: TranslateService,
    public userPermissions: UserPermissions) { }

  ngOnInit(): void {
    this.setBreadCrumb();
    this.loadColumns();
  }

  get dataUnavailable() {
    return (!this.adjustmentReportResult  || this.adjustmentReportResult.length === 0);
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedHiddenColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.displayedColumns.filter(col => val.includes(col) || (col.showColumn && col.isAllowed));
    this._selectedHiddenColumns = this.hiddenColumns.filter(col => val.includes(col) );
  }

  search(filters) {
    this.loadingService.startLoading();
    this.inventoryAdjustmentService.getAdjustmentReport(filters)
    .then(data => this.adjustmentReportResult = data)
    .then(() => this.loadingService.stopLoading())
    .catch(error => this.handleError(error));
  }

  exportExcel() {
    if (!this.dataUnavailable) {
      this.fileName = this.getTextByKey('ims.inventory_adjustment_report.report');
      const listToExport = this.loadModelToExport();
      this.excelExportService.exportData(this.fileName, listToExport);
    }
  }


  private setBreadCrumb() {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'IMS' },
      { label: 'Reportes' },
      { label: 'Reporte de ajustes', routerLink: ['/ims/inventory-adjustment-report'] }
  ]);
  }

  private loadModelToExport() {
    const list = this.adjustmentReportResult.map(item => {
      return {
        [this.getCollumnExcelName('barcode')]: item.barcode,
        [this.getCollumnExcelName('product_name')]: item.productName,
        [this.getCollumnExcelName('area')]: item.area,
        [this.getCollumnExcelName('document_number')]: item.adjustmentNumber,
        [this.getCollumnExcelName('adjustment_date')]: item.adjustmentDate,
        [this.getCollumnExcelName('adjustment_type')]: item.adjustmentType,
        [this.getCollumnExcelName('group_motive')]: item.adjustmentMotiveGroup,
        [this.getCollumnExcelName('motive')]: item.motive,
        [this.getCollumnExcelName('inventory')]: item.inventory,
        [this.getCollumnExcelName('count')]: item.count,
        [this.getCollumnExcelName('total_in')]: item.totalIn,
        [this.getCollumnExcelName('total_out')]: item.totalOut,
        [this.getCollumnExcelName('cost')]: item.cost,
        [this.getCollumnExcelName('price')]: item.price,
        [this.getCollumnExcelName('operator')]: item.operator,
        [this.getCollumnExcelName('reponsible')]: item.responsible,
        [this.getCollumnExcelName('category')]: item.category
        
      };
    });
    return list;
  }

  private getCollumnExcelName(name: string) {
    return this.getTextByKey(`ims.inventory_adjustment_report.fields.${name}`);
  }

  private getHeaderCollumnsName(name: string) {
    return `ims.inventory_adjustment_report.fields.${name}`
  }

  private getTextByKey(key: string) {
    return this.translateService.instant(key);
  }

  private loadColumns() {
    this.displayedColumns = [
      {field: 'barcode', header: this.getHeaderCollumnsName('barcode'), display: 'table-cell', 
      showColumn: true, dataType: 'string', isAllowed: true },
      {field: 'productName', header: this.getHeaderCollumnsName('product_name'), display: 'table-cell', 
      showColumn: true, dataType: 'string', isAllowed: true},
      {field: 'area', header: this.getHeaderCollumnsName('area'), display: 'table-cell', 
      showColumn: true, dataType: 'string', isAllowed: true},
      {field: 'adjustmentNumber', header: this.getHeaderCollumnsName('document_number'), display: 'table-cell', 
      showColumn: true, dataType: 'string', isAllowed: true},
      {field: 'adjustmentDate', header: this.getHeaderCollumnsName('adjustment_date'), display: 'table-cell', 
      showColumn: true, dataType: 'date', isAllowed: true},
      {field: 'adjustmentType', header: this.getHeaderCollumnsName('adjustment_type'), display: 'table-cell', 
      showColumn: true, dataType: 'string', isAllowed: true},
      {field: 'adjustmentMotiveGroup', header: this.getHeaderCollumnsName('group_motive'), display: 'table-cell', 
      showColumn: true, dataType: 'string', isAllowed: true},
      {field: 'motive', header: this.getHeaderCollumnsName('motive'), display: 'table-cell', 
      showColumn: false, dataType: 'string', isAllowed: true},
      {field: 'inventory', header: this.getHeaderCollumnsName('inventory'), display: 'table-cell', 
      showColumn: false, dataType: 'number', isAllowed: true},
      {field: 'count', header: this.getHeaderCollumnsName('count'), display: 'table-cell', 
      showColumn: false, dataType: 'number', isAllowed: true},
      {field: 'total_in', header: this.getHeaderCollumnsName('total_in'), display: 'table-cell', 
      showColumn: false, dataType: 'number', isAllowed: true},
      {field: 'total_out', header: this.getHeaderCollumnsName('total_out'), display: 'table-cell', 
      showColumn: false, dataType: 'number', isAllowed: true},
      {field: 'cost', header: this.getHeaderCollumnsName('cost'), display: 'table-cell', 
      showColumn: false, dataType: 'number', isAllowed: this.checkPermission(this.permissionsIDs.CHECK_INVENTORY_ADJUSTMENT_REPORT_COSTS_FIELDS_ID)},
      {field: 'cost', header: this.getHeaderCollumnsName('price'), display: 'table-cell', 
      showColumn: false, dataType: 'number', isAllowed: this.checkPermission(this.permissionsIDs.CHECK_INVENTORY_ADJUSTMENT_REPORT_PRICES_FIELDS_ID)},
      {field: 'operator', header: this.getHeaderCollumnsName('operator'), display: 'table-cell', 
      showColumn: false, dataType: 'string', isAllowed: true},
      {field: 'responsible', header: this.getHeaderCollumnsName('reponsible'), display: 'table-cell', 
      showColumn: false, dataType: 'string', isAllowed: true},
      {field: 'category', header: this.getHeaderCollumnsName('category'), display: 'table-cell', 
      showColumn: false, dataType: 'string', isAllowed: true}
    ];
  
    this._selectedColumns = this.displayedColumns.filter(p => p.showColumn && p.isAllowed);
    this.hiddenColumns = this.displayedColumns.filter(p => !p.showColumn && p.display !== 'none' && p.isAllowed);
  }  

  private checkPermission(permission) {
    return this.userPermissions.allowed(permission);
  }

  private handleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.dialogService.errorMessage('error', error?.message ?? 'error_service');
  }

}
