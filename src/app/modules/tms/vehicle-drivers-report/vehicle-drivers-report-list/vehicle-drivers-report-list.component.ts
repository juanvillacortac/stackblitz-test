import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { VehicleDriverReport } from 'src/app/models/tms/vehicle-driver-report';
import { VehicleDriverReportFilter } from 'src/app/models/tms/vehicle-driver-report-filter';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { VehicleDriversReportService } from '../shared/vehicle-drivers-report.service';

@Component({
  selector: 'app-vehicle-drivers-report-list',
  templateUrl: './vehicle-drivers-report-list.component.html',
  styleUrls: ['./vehicle-drivers-report-list.component.scss']
})

export class VehicleDriversReportListComponent implements OnInit {
  loading: boolean = false
  showFilters: boolean = false
  showDialog: boolean = false
  _permissions: number[] = [];
  _permissionsIDs = {...Permissions};
  _status:boolean=true;
  _selectedColumns:  any[];
  _selectedHiddenColumns:  any[];
  hiddenColumns: any[] = [];
  _VehicleDriversReport: VehicleDriverReport = new VehicleDriverReport();
  _ReportFilter: VehicleDriverReportFilter = new VehicleDriverReportFilter();
  displayedColumns: any[] = [];

  constructor(public _VehicleDriversReportService: VehicleDriversReportService,
              private breadcrumbService: BreadcrumbService,
              private messageService: MessageService,
              public _userPermissions: UserPermissions, 
              private loadingService: LoadingService,)
  {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
        { label: 'TMS' },
        { label: 'Reportes' },
        { label: 'Vehiculos y conductores', routerLink: ['/tms/vehicle-drivers-report'] }
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
      { template: (data) => { return data.vehicleCode; }, header: 'Código vehículo', display: 'table-cell', field:'vehicleCode', showColumn: true, isAllowed: true },
      { template: (data) => { return data.vehicleModel; }, header: 'Modelo', display: 'table-cell', field:'vehicleModel', showColumn: true, isAllowed: true },
      { template: (data) => { return data.vehicleType; }, header: 'Uso del vehículo', display: 'table-cell',field: 'vehicleType', showColumn: true, isAllowed: true },
      { template: (data) => { return data.vehicleRegistrationPlate; }, header:'Placa', display: 'table-cell',field: 'vehicleRegistrationPlate', showColumn: true, isAllowed: true },
      { template: (data) => { return data.vehicleOwner; }, header:'Propietario', display: 'table-cell',field: 'vehicleOwner', showColumn: false, isAllowed: true },
      { template: (data) => { return data.vehicleYear; }, header:'Año vehículo', display: 'table-cell',field: 'vehicleYear', showColumn: false, isAllowed: true },
      { template: (data) => { return data.motorSerialNumber; }, header:'Serial del motor', display: 'table-cell',field: 'motorSerialNumber', showColumn: false, isAllowed: true },
      { template: (data) => { return data.chargeCapacity; }, header:'Capacidad (kg)', display: 'table-cell',field: 'chargeCapacity', showColumn: false, isAllowed: true },
      { template: (data) => { return data.kilometers; }, header:'Kilometraje (km)', display: 'table-cell',field: 'kilometers', showColumn: false, isAllowed: true },
      { template: (data) => { return data.documentNumber; }, header:'N° Documento operador', display: 'table-cell',field: 'documentNumber', showColumn: false, isAllowed: true },
      { template: (data) => { return data.userDriver; }, header:'Operador tipo uso', display: 'table-cell',field: 'userDriver', showColumn: false, isAllowed: true },
      { template: (data) => { return data.indMedicalCertificate; }, header:'Certificado medico', display: 'table-cell',field: 'indMedicalCertificate', showColumn: false, isAllowed: true },
      { template: (data) => { return data.certificateIssueDate; }, header:'Fecha emisión', display: 'table-cell',field: 'certificateIssueDate', showColumn: false, isAllowed: true },
      { template: (data) => { return data.certificateExpirationDate; }, header:'Fecha vencimiento', display: 'table-cell',field: 'certificateExpirationDate', showColumn: false, isAllowed: true },
      { template: (data) => { return data.indDriverLicense; }, header:'Licencia', display: 'table-cell',field: 'indDriverLicense', showColumn: false, isAllowed: true },
      { template: (data) => { return data.licenseLevel; }, header:'Grado de licencia', display: 'table-cell',field: 'licenseLevel', showColumn: false, isAllowed: true },
      { template: (data) => { return data.licenseIssueDate; }, header:'Fecha emisión', display: 'table-cell',field: 'licenseIssueDate', showColumn: false, isAllowed: true },
      { template: (data) => { return data.licenseExpirationDate; }, header:'Fecha vencimiento', display: 'table-cell',field: 'licenseExpirationDate', showColumn: false, isAllowed: true },
      { field: 'active', header: 'Estatus', display: 'table-cell' }
    ];
    this._selectedColumns = this.displayedColumns.filter(p => p.showColumn && p.isAllowed);
    this.hiddenColumns = this.displayedColumns.filter(p => !p.showColumn && p.isAllowed && p.display !== 'none');
  }
  
  get dataUnavailable() {
    return (!this._VehicleDriversReportService._VehicleDriverReport  || this._VehicleDriversReportService._VehicleDriverReport.length === 0);
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
    this._VehicleDriversReportService.GetVehicleDriverReport(this._ReportFilter).subscribe((data: VehicleDriverReport[]) => 
    {
      this._VehicleDriversReportService._VehicleDriverReport = data;
      this.loadingService.stopLoading();
    })
    // ,
    // (error: HttpErrorResponse)=>
    // {
    //   this.loading = false;
    //   this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    // });
  }

}