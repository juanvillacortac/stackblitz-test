import { Component, Input, OnInit } from '@angular/core';
import { InventoryCountReport } from 'src/app/models/ims/inventory-count-report';
import { InventoryCountReportFilter } from 'src/app/models/ims/inventory-count-report-filter';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { ExcelExportService } from 'src/app/modules/common/components/excel-export-button/shared/excel-export.service';
import { TranslateService } from '@ngx-translate/core';
import { InventorycountService } from '../shared/service/inventorycount.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-inventory-counts-report',
  templateUrl: './inventory-counts-report.component.html',
  styleUrls: ['./inventory-counts-report.component.scss']
})
export class InventoryCountsReportComponent implements OnInit {

  fileName = '';
  showFilters = true;
  loading  = false;
  filters: InventoryCountReportFilter = new InventoryCountReportFilter();
  inventoryCountReport = new InventoryCountReport();
  inventoryCountReportResult: InventoryCountReport[] = [];
  displayedColumns: any[] = [];
  hiddenColumns: any[] = [];
  permissionsIDs = {...Permissions};
  _selectedColumns:  any[];
  _selectedHiddenColumns:  any[];

  constructor(private breadcrumbService: BreadcrumbService ,
    private dialogService: DialogsService,
    private readonly loadingService: LoadingService,
    private readonly excelExportService: ExcelExportService,
    private readonly inventoryCountService: InventorycountService,
    private translateService: TranslateService,
    public userPermissions: UserPermissions) { }

  ngOnInit(): void {
    this.setBreadCrumb();
    this.loadColumns();
  }

  get dataUnavailable() {
    return (!this.inventoryCountReportResult  || this.inventoryCountReportResult.length === 0);
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedHiddenColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.displayedColumns.filter(col => val.includes(col) || col.showColumn);
    this._selectedHiddenColumns = this.hiddenColumns.filter(col => val.includes(col) );
  }

  search(filters) {
    this.loadingService.startLoading();
    this.inventoryCountReportResult.length = 0;
    this.inventoryCountService.getInventoryCountReportResult(filters)
    .then(data => this.inventoryCountReportResult = data)
    .then(() => this.loadingService.stopLoading())
    .catch(error => this.handleError(error));
  }

  exportExcel() {
    if (!this.dataUnavailable) {
      this.fileName = this.getTextByKey('ims.inventory_count.inventory_count_report');
      const listToExport = this.loadModelToExport();
      this.excelExportService.exportData(this.fileName, listToExport);
    }
  }


  private setBreadCrumb() {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'IMS' },
      { label: 'Reportes' },
      { label: 'Reporte de conteos', routerLink: ['/ims/inventory-count-report'] }
  ]);
  }

  private loadModelToExport() {
    const list = this.inventoryCountReportResult.map( item => {
      return {
        [this.getTextByKey('ims.inventory_count.fields.document_number')]: item.documentNumber,
        [this.getTextByKey('ims.inventory_count.fields.area')]: item.area,
        [this.getTextByKey('ims.inventory_count.fields.barcode')]: item.barcode,
        [this.getTextByKey('ims.inventory_count.fields.product_name')]: item.productName,
        [this.getTextByKey('ims.inventory_count.fields.inventory')]: item.inventory,
        [this.getTextByKey('ims.inventory_count.fields.count')]: item.count,
        [this.getTextByKey('ims.inventory_count.fields.status')]: item.status,
        [this.getTextByKey('ims.inventory_count.fields.document_adjustment_number')]: item.adjustmentNumber,
        [this.getTextByKey('ims.inventory_count.fields.description')]: item.description,
        [this.getTextByKey('ims.inventory_count.fields.difference')]: item.difference,
        [this.getTextByKey('ims.inventory_count.fields.operator')]: item.operator,
        [this.getTextByKey('ims.inventory_count.fields.responsible')]: item.responsible,
        [this.getTextByKey('ims.product_histories.category_field')]: item.category,
        [this.getTextByKey('ims.inventory_count.fields.start_date')]: item.startDate,
        [this.getTextByKey('ims.inventory_count.fields.end_date')]: item.endDate
      };
    });
    return list;
  }

  private getTextByKey(key: string) {
    return this.translateService.instant(key);
  }

  private loadColumns() {
    this.displayedColumns = [//adjustmentNumber
      {field: 'documentNumber', header: 'ims.inventory_count.fields.document_number', display: 'table-cell', showColumn: true, dataType: 'string' },
      {field: 'area', header: 'ims.inventory_count.fields.area', display: 'table-cell', showColumn: true, dataType: 'string'},
      {field: 'barcode', header: 'ims.inventory_count.fields.barcode', display: 'table-cell', showColumn: true, dataType: 'string'},
      {field: 'productName', header: 'ims.inventory_count.fields.product_name', display: 'table-cell', showColumn: true, dataType: 'string'},
      {field: 'inventory', header: 'ims.inventory_count.fields.inventory', display: 'table-cell', showColumn: true, dataType: 'number'},
      {field: 'count', header: 'ims.inventory_count.fields.count', display: 'table-cell', showColumn: true, dataType: 'number'},
      {field: 'status', header: 'ims.inventory_count.fields.status', display: 'table-cell', showColumn: true, dataType: 'string'},
      {field: 'adjustmentNumber', header: 'ims.inventory_count.fields.document_adjustment_number', display: 'table-cell', showColumn: false, dataType: 'string' },
      {field: 'description', header: 'ims.inventory_count.fields.description', display: 'table-cell', showColumn: false, dataType: 'string'},
      {field: 'difference', header: 'ims.inventory_count.fields.difference', display: 'table-cell', showColumn: false, dataType: 'number'},
      {field: 'operator', header: 'ims.inventory_count.fields.operator', display: 'table-cell', showColumn: false, dataType: 'string'},
      {field: 'responsible', header: 'ims.inventory_count.fields.responsible', display: 'table-cell', showColumn: false, dataType: 'string'},
      {field: 'category', header: 'ims.inventory_count.fields.category', display: 'table-cell', showColumn: false, dataType: 'string'},
      {field: 'startDate', header: 'ims.inventory_count.fields.start_date', display: 'table-cell', showColumn: false, dataType: 'date'},
      {field: 'endDate', header: 'ims.inventory_count.fields.end_date', display: 'table-cell', showColumn: false, dataType: 'date'},
    ];
  
    this._selectedColumns = this.displayedColumns.filter(p => p.showColumn);
    this.hiddenColumns = this.displayedColumns.filter(p => !p.showColumn && p.display !== 'none');
  }  

  private handleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.dialogService.errorMessage('error', error?.message ?? 'error_service');
  }

}
