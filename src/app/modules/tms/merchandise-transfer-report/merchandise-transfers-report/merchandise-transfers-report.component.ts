import { Component, Input, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { MerchandiseTransfersReport } from 'src/app/models/tms/merchandise_transfers_report';
import { MerchandiseTransfersReportFilter } from 'src/app/models/tms/merchandise_transfers_report_filter';
import { ExcelExportService } from 'src/app/modules/common/components/excel-export-button/shared/excel-export.service';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { MerchandiseTransfersReportService } from '../shared/merchandise-transfers-report.service';

@Component({
  selector: 'app-merchandise-transfers-report',
  templateUrl: './merchandise-transfers-report.component.html',
  styleUrls: ['./merchandise-transfers-report.component.scss']
})

export class MerchandiseTransfersReportComponent implements OnInit {

  loading: boolean = false
  showFilters: boolean = false
  showDialog: boolean = false
  _permissions: number[] = [];
  _permissionsIDs = {...Permissions};
  _status:boolean=true;
  _selectedColumns:  any[];
  _selectedHiddenColumns:  any[];
  hiddenColumns: any[] = [];
  _ReportFilter: MerchandiseTransfersReportFilter = new MerchandiseTransfersReportFilter();
  _MerchandiseTransfersReport: MerchandiseTransfersReport = new MerchandiseTransfersReport();
  displayedColumns: any[] = [];

  constructor(public _MerchandiseTransfersReportService: MerchandiseTransfersReportService,private breadcrumbService: BreadcrumbService,private messageService: MessageService,public _userPermissions: UserPermissions, private loadingService: LoadingService,)
  {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
        { label: 'TMS' },
        { label: 'Reportes' },
        { label: 'Reporte de solcicitud de mercancia', routerLink: ['/tms/merchandise-transfers-report'] }
    ]);
  }

  ngOnInit(): void {
    this.LoadColumms();
  }

  LoadColumms()
  {
    this.displayedColumns =
    [      
      { template: (data) => { return data.id; }, header: 'Id', display: 'none', field:'id' },
      { template: (data) => { return data.transferNumber; }, header: 'Numero de transferencia', display: 'table-cell', field:'transferNumber', showColumn: false, isAllowed: true },
      { template: (data) => { return data.transferType; }, header: 'Tipo transferencia', display: 'table-cell', field:'transferType', showColumn: true, isAllowed: true },
      { template: (data) => { return data.useType; }, header: 'Tipo de uso', display: 'table-cell', field:'useType', showColumn: true, isAllowed: true },
      { template: (data) => { return data.originBranch; }, header: 'Sucursal origen', display: 'table-cell', field:'originBranch', showColumn: true, isAllowed: true },
      { template: (data) => { return data.originArea; }, header: 'Area origen', display: 'table-cell',field: 'originArea', showColumn: true, isAllowed: true },
      { template: (data) => { return data.destinyBranch; }, header:'Sucursal destino', display: 'table-cell',field: 'destinyBranch', showColumn: true, isAllowed: true },
      { template: (data) => { return data.destinyArea; }, header:'Area destino', display: 'table-cell',field: 'destinyArea', showColumn: false, isAllowed: true },
      { template: (data) => { return data.dateofreception; }, header:'Fecha recepcion', display: 'table-cell',field: 'dateofreception', showColumn: false, isAllowed: true },
      { template: (data) => { return data.productCodeBar; }, header:'Barra', display: 'table-cell',field: 'productCodeBar', showColumn: false, isAllowed: true },
      { template: (data) => { return data.productDescription; }, header:'Descripcion', display: 'table-cell',field: 'productDescription', showColumn: false, isAllowed: true },
      { template: (data) => { return data.productReference; }, header:'Referencia', display: 'table-cell',field: 'productReference', showColumn: false, isAllowed: true },
      { template: (data) => { return data.category; }, header:'Categoria', display: 'table-cell',field: 'category', showColumn: false, isAllowed: true },
      { template: (data) => { return data.productPackageType; }, header:'Empaque', display: 'table-cell',field: 'productPackageType', showColumn: false, isAllowed: true },
      { template: (data) => { return data.unitsPerPackage; }, header:'Unidades por empaque', display: 'table-cell',field: 'unitsPerPackage', showColumn: false, isAllowed: true },
      { template: (data) => { return data.detailuseType; }, header:'Detalle tipo uso', display: 'table-cell',field: 'detailuseType', showColumn: false, isAllowed: true },
      { template: (data) => { return data.sendQuantity; }, header:'Cantidad enviada', display: 'table-cell',field: 'sendQuantity', showColumn: false, isAllowed: true },
      { template: (data) => { return data.recivedQuantity; }, header:'Cantidad recibida', display: 'table-cell',field: 'recivedQuantity', showColumn: false, isAllowed: true },
      { template: (data) => { return data.cost; }, header:'Costo', display: 'table-cell',field: 'cost', showColumn: false, isAllowed: true },
      { template: (data) => { return data.netcost; }, header:'Costo neto', display: 'table-cell',field: 'netcost', showColumn: false, isAllowed: true },
      { template: (data) => { return data.salenetcost; }, header:'Costo neto venta', display: 'table-cell',field: 'salenetcost', showColumn: false, isAllowed: true },
      { template: (data) => { return data.factorofsale; }, header:'Factor venta', display: 'table-cell',field: 'factorofsale', showColumn: false, isAllowed: true },
      { template: (data) => { return data.pvp; }, header:'Pvp', display: 'table-cell',field: 'pvp', showColumn: false, isAllowed: true },
      { field: 'active', header: 'Estatus', display: 'table-cell' }
    ];
    this._selectedColumns = this.displayedColumns.filter(p => p.showColumn && p.isAllowed);
    this.hiddenColumns = this.displayedColumns.filter(p => !p.showColumn && p.isAllowed && p.display !== 'none');
  }
  
  get dataUnavailable() {
    return (!this._MerchandiseTransfersReportService._MerchandiseTransfersReport  || this._MerchandiseTransfersReportService._MerchandiseTransfersReport.length === 0);
  }
  
  @Input() get selectedColumns(): any[] {
    return this._selectedHiddenColumns;
  }
  set selectedColumns(val: any[]) {
    this._selectedColumns = this.displayedColumns.filter(col => val.includes(col) || (col.showColumn && col.isAllowed) );
    this._selectedHiddenColumns = this.hiddenColumns.filter(col => val.includes(col) );
  }

  search() {
    this.loadingService.startLoading();
    this._MerchandiseTransfersReportService.GetMerchandiseTransfersList(this._ReportFilter).subscribe((data: MerchandiseTransfersReport[]) => 
    {
      this._MerchandiseTransfersReportService._MerchandiseTransfersReport = data;
      this.loadingService.stopLoading();
    },
    (error: HttpErrorResponse)=>
    {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
  }
}
