import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { MerchandiseRequestReport } from 'src/app/models/tms/merchandise_request_report';
import { MerchandiseRequestReportFilter } from 'src/app/models/tms/merchandise_request_report_filter';
import { ExcelExportService } from 'src/app/modules/common/components/excel-export-button/shared/excel-export.service';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { MerchandiseRequestReportService } from '../service/merchandise-request-report.service';


@Component({
  selector: 'app-merchandise-request-report',
  templateUrl: './merchandise-request-report.component.html',
  styleUrls: ['./merchandise-request-report.component.scss']
})
export class MerchandiseRequestReportComponent implements OnInit {

  loading: boolean = false
  showFilters: boolean = false
  showDialog: boolean = false
  _permissions: number[] = [];
  _permissionsIDs = {...Permissions};
  _status:boolean=true;
  _selectedColumns:  any[];
  _selectedHiddenColumns:  any[];
  hiddenColumns: any[] = [];
  _MerchandiseReport: MerchandiseRequestReport = new MerchandiseRequestReport();
  _ReportFilter: MerchandiseRequestReportFilter= new MerchandiseRequestReportFilter();
  displayedColumns: any[] = [];

  constructor(public _MerchandiseRequestReportService: MerchandiseRequestReportService,
              private breadcrumbService: BreadcrumbService,
              private messageService: MessageService,
              public _userPermissions: UserPermissions, 
              private loadingService: LoadingService,)
  {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
        { label: 'TMS' },
        { label: 'Reportes' },
        { label: 'Reporte de solcicitud de mercancia', routerLink: ['/tms/merchandise-request-report'] }
    ]);
  }

  ngOnInit(): void {
    this.LoadColumms();
  }

  LoadColumms()
  {
    debugger
    this.displayedColumns =
    [      
      { template: (data) => { return data.id; }, header: 'Id', display: 'none', field:'id' },
      { template: (data) => { return data.requestNumber; }, header: 'Numero de solicitud', display: 'table-cell', field:'requestNumber', showColumn: true, isAllowed: true },
      { template: (data) => { return data.requestType; }, header: 'Tipo solicitud', display: 'table-cell', field:'requestType', showColumn: true, isAllowed: true },
      { template: (data) => { return data.demandBranch; }, header: 'Sucursal demanda', display: 'table-cell', field:'demandBranch', showColumn: true, isAllowed: true },
      { template: (data) => { return data.dispatchBranch; }, header: 'Sucursal despacha', display: 'table-cell', field:'dispatchBranch', showColumn: true, isAllowed: true },
      { template: (data) => { return data.associatedDocument; }, header: 'Documento asociado', display: 'table-cell',field: 'associatedDocument', showColumn: true, isAllowed: true },
      { template: (data) => { return data.associatedDocumentDate; }, header:'Fecha del documento', display: 'table-cell',field: 'associatedDocumentDate', showColumn: true, isAllowed: true },
      { template: (data) => { return data.status; }, header:'Estatus del documento', display: 'table-cell',field: 'status', showColumn: false, isAllowed: true },
      { template: (data) => { return data.productCodeBar; }, header:'Barra', display: 'table-cell',field: 'productCodeBar', showColumn: false, isAllowed: true },
      { template: (data) => { return data.productDescription; }, header:'Descripcion', display: 'table-cell',field: 'productDescription', showColumn: false, isAllowed: true },
      { template: (data) => { return data.productReference; }, header:'Referencia', display: 'table-cell',field: 'productReference', showColumn: false, isAllowed: true },
      { template: (data) => { return data.productPackageType; }, header:'Empaque', display: 'table-cell',field: 'productPackageType', showColumn: false, isAllowed: true },
      { template: (data) => { return data.unitsPerPackage; }, header:'Unidades por empaque', display: 'table-cell',field: 'unitsPerPackage', showColumn: false, isAllowed: true },
      { template: (data) => { return data.useType; }, header:'Detalle tipo uso', display: 'table-cell',field: 'useType', showColumn: false, isAllowed: true },
      { template: (data) => { return data.requestedQuantity; }, header:'Cantidad solicitada', display: 'table-cell',field: 'requestedQuantity', showColumn: false, isAllowed: true },
      { template: (data) => { return data.processedQuantity; }, header:'Cantidad procesada', display: 'table-cell',field: 'processedQuantity', showColumn: false, isAllowed: true },
      { field: 'active', header: 'Estatus', display: 'table-cell' }
    ];
    this._selectedColumns = this.displayedColumns.filter(p => p.showColumn && p.isAllowed);
    this.hiddenColumns = this.displayedColumns.filter(p => !p.showColumn && p.isAllowed && p.display !== 'none');
  }
  
  get dataUnavailable() {
    return (!this._MerchandiseRequestReportService._MerchandiseReport  || this._MerchandiseRequestReportService._MerchandiseReport.length === 0);
  }
  
  @Input() get selectedColumns(): any[] {
    return this._selectedHiddenColumns;
  }
  set selectedColumns(val: any[]) {
    this._selectedColumns = this.displayedColumns.filter(col => val.includes(col) || (col.showColumn && col.isAllowed) );
    this._selectedHiddenColumns = this.hiddenColumns.filter(col => val.includes(col) );
  }

  search() {
    debugger
    this.loadingService.startLoading();
    this._MerchandiseRequestReportService.GetMerchandiseRequestList(this._ReportFilter).subscribe((data: MerchandiseRequestReport[]) => 
    {
      this._MerchandiseRequestReportService._MerchandiseReport = data;
      this.loadingService.stopLoading();
    },
    (error: HttpErrorResponse)=>
    {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
  }
 
  

}
