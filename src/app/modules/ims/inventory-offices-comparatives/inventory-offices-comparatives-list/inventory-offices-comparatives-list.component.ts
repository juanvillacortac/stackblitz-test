import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { InventoryOfficesComparative } from 'src/app/models/ims/inventory-offices-comparative';
import { InventoryOfficesComparativeFilters } from 'src/app/models/ims/inventory-offices-comparative-filters';
import { InventoryProductByOffice } from 'src/app/models/ims/inventory-product-by-office';
import { ExcelExportService } from 'src/app/modules/common/components/excel-export-button/shared/excel-export.service';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { ReportService } from '../../shared/services/report.service';

@Component({
  selector: 'app-inventory-offices-comparatives-list',
  templateUrl: './inventory-offices-comparatives-list.component.html',
  styleUrls: ['./inventory-offices-comparatives-list.component.scss']
})
export class InventoryOfficesComparativesListComponent implements OnInit {
  fileName = '';
  showFilters = true;
  loading  = false;
  filters: InventoryOfficesComparativeFilters = new InventoryOfficesComparativeFilters();
  inventoryOfficesComparative: InventoryOfficesComparative[] = [];
  inventoryProductByOffice: InventoryProductByOffice[] = [];
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
    private readonly loadingService: LoadingService,
    private readonly excelExportService: ExcelExportService,
    private translateService: TranslateService,
    public userPermissions: UserPermissions) {
      this.breadcrumbService.setItems([
        { label: 'OSM' },
        { label: 'IMS' },
        { label: 'Reportes' },
        { label: 'Comparativos de inventarios', routerLink: ['/ims/offices-comparative-report'] }
    ]);
    }

    ngOnInit(): void {
    }
    search() {
      this.loadOfficesComparativeList();
    }

  loadColumns() {

    this.displayedColumns = [

      {field: 'branchOffice', header: 'ims.inventory_offices_comparative.branchOffice_field', display: 'table-cell',
        showColumn: true, dataType: 'string', isAllowed: true},
      {field: 'area', header: 'ims.inventory_offices_comparative.area_field', display: 'table-cell',
        showColumn: true, dataType: 'string', isAllowed: true},
      {field: 'inventory', header: 'ims.inventory_offices_comparative.inventory_field', display: 'table-cell',
        showColumn: true, dataType: 'number', isAllowed: true},
      {field: 'unitNumbers', header: 'ims.inventory_offices_comparative.units_numbers', display: 'table-cell',
        showColumn: true, dataType: 'number', isAllowed: true}, 
      {field: 'cost', header: 'ims.inventory_offices_comparative.cost_field', display: 'table-cell',
        showColumn: true, dataType: 'number', isAllowed: this.checkPermission && !this.checkSimpleReport },
      {field: 'sellingFactor', header: 'ims.inventory_offices_comparative.selling_factor', display: 'table-cell',
        showColumn: true, dataType: 'number', isAllowed: this.checkPermission && !this.checkSimpleReport},
      {field: 'pvp', header: 'ims.inventory_offices_comparative.pvp_field', display: 'table-cell',
        showColumn: true, dataType: 'number', isAllowed: this.checkPermission && !this.checkSimpleReport},
    ];

    this._selectedColumns = this.displayedColumns.filter(p => p.showColumn && p.isAllowed);
    this.hiddenColumns = this.displayedColumns.filter(p => !p.showColumn && p.isAllowed && p.display !== 'none');
  }


    exportExcel() {
      if (!this.dataUnavailable) {
        this.fileName = this.getTextByKey('ims.inventory_offices_comparative.offices_comparative_report');
        const listToExport = this.loadModelToExport();
        this.excelExportService.exportData(this.fileName, listToExport);
      }
    }

    getTotalInventory(product) {
      return product?.offices && product?.offices.length !== 0 ?
      product?.offices?.reduce((t, { unitNumbers }) => t + unitNumbers, 0) : 0;
    }

    loadModelToExport() {
      const list = (this.checkPermission && !this.checkSimpleReport) ? this.loadFullModel() : this.loadModelWhitoutCostFields();
      return list;
    }
    get checkSimpleReport() {
      return this.filters.simpleReport;
    }
    get checkPermission() {
      return this.userPermissions.allowed(this.permissionsIDs.CHECK_OFFICE_COMPARATIVES_REPORT_COST_FIELDS_ID);
    }
    get dataUnavailable() {
      return (!this.inventoryProductByOffice  || this.inventoryProductByOffice.length === 0);
    }

    private loadFullModel() {
      const model = [];
      this.inventoryProductByOffice.map( item => {
         item.offices.map(office => {
          model.push( {
              [this.getTextByKey('ims.inventory_offices_comparative.barCode_field')]: item.barcode,
              [this.getTextByKey('ims.inventory_offices_comparative.productName_field')]: item.productName,
              [this.getTextByKey('ims.inventory_offices_comparative.scaleCode_field')]: item.scaleCode,
              [this.getTextByKey('ims.inventory_offices_comparative.category_field')]: item.category,
              [this.getTextByKey('ims.inventory_offices_comparative.branchOffice_field')]: office.branchOffice,
              [this.getTextByKey('ims.inventory_offices_comparative.area_field')]: office.area,
              [this.getTextByKey('ims.inventory_offices_comparative.inventory_field')]: office.inventory,
              [this.getTextByKey('ims.inventory_offices_comparative.units_numbers')]: office.unitNumbers,
              [this.getTextByKey('ims.inventory_offices_comparative.cost_field')]: office.cost,
              [this.getTextByKey('ims.inventory_offices_comparative.selling_factor')]: office.sellingFactor,
              [this.getTextByKey('ims.inventory_offices_comparative.pvp_field')]: office.pvp
            });
          });
      });
      return model;
    }
    private loadModelWhitoutCostFields() {
      const model = [];
      this.inventoryProductByOffice.map( item => {
         item.offices.map(office => {
          model.push( {
              [this.getTextByKey('ims.inventory_offices_comparative.barCode_field')]: item.barcode,
              [this.getTextByKey('ims.inventory_offices_comparative.productName_field')]: item.productName,
              [this.getTextByKey('ims.inventory_offices_comparative.scaleCode_field')]: item.scaleCode,
              [this.getTextByKey('ims.inventory_offices_comparative.category_field')]: item.category,
              [this.getTextByKey('ims.inventory_offices_comparative.branchOffice_field')]: office.branchOffice,
              [this.getTextByKey('ims.inventory_offices_comparative.area_field')]: office.area,
              [this.getTextByKey('ims.inventory_offices_comparative.inventory_field')]: office.inventory,
              [this.getTextByKey('ims.inventory_offices_comparative.units_numbers')]: office.unitNumbers
            });
          });
      });
      return model;
     }

    private loadOfficesComparativeList() {
      this.loadColumns();
      this.loadingService.startLoading();
      this._reportService
          .getInventoryOfficesComparativelist({...this.filters})
          .then(data => this.inventoryProductByOffice = data)
          .then(() => this.loadingService.stopLoading())
          .catch(error => this.handleError(error));
    }

    private handleError(error: HttpErrorResponse) {
      this.loadingService.stopLoading();
      this.dialogService.errorMessage('ims.inventory_offices_comparative.offices_comparative_report', error?.error?.message ?? 'error_service');
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
