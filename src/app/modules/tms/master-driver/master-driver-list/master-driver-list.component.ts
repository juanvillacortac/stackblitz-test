import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Driver } from 'src/app/models/tms/driver';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from '../../../security/users/shared/user-const-permissions';
import { DriverFilter } from '../shared/filter/driver-filter';
import { DriverService } from '../shared/service/driver.service';
import { MasterDriverPanelComponent } from './master-driver-panel/master-driver-panel.component';

@Component({
  selector: 'app-master-driver-list',
  templateUrl: './master-driver-list.component.html',
  styleUrls: ['./master-driver-list.component.scss']
})
export class MasterDriverListComponent implements OnInit {
  loading: boolean = false
  showFilters: boolean = true
  showDialog: boolean = false
  showInput: boolean = false
  _Driver: Driver=new Driver();
  permissions: number[] = [];
  permissionsIDs = {...Permissions};
  _status:boolean=false;
  _DriverFilter: DriverFilter = new DriverFilter();
  @ViewChild(MasterDriverPanelComponent) MasterDriverPanelComponent: MasterDriverPanelComponent; 
  displayedColumns: ColumnD<Driver>[] =
    [      
      { template: (data) => { return data.id; }, header: 'Id', display: 'none', field:'id' },
      { template: (data) => { return data.identifier +'-'+ data.documentNumber; }, header: 'Número de documento', display: 'table-cell', field:'documentNumber' },
      { template: (data) => { return data.userDriver; }, header: 'Nombre', display: 'table-cell', field:'userDriver' },
      { template: (data) => { return data.typeDriver; }, header: 'Tipo de conductor', display: 'table-cell', field:'typeDriver' },
      { template: (data) => { return data.licenseLevel; }, header: 'Grado de licencia', display: 'table-cell', field:'licenseLevel' },
      { field: 'indDriverLicense', header: 'Licencia de conducir', display: 'table-cell' },
      { field: 'indMedicalCertificate', header: 'Certificado médico', display: 'table-cell' },      
      { field: 'active', header: 'Estatus', display: 'table-cell' },
      { template: (data) => { return data.createdByUser; }, header: 'Creado por', display: 'table-cell',field: 'createdByUser' },
      { template: (data) => { return data.updatedByUser; }, header: 'Actualizado por', display: 'table-cell',field: 'updatedByUser' }
    ];

  constructor(public _driverService: DriverService,private breadcrumbService: BreadcrumbService,private messageService: MessageService,public userPermissions: UserPermissions, private readonly loadingService: LoadingService)
  {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'TMS' },
      { label: 'Maestros' },
      { label: 'Conductores', routerLink: ['/tms/master-driver-list'] }
    ]);
   }

  ngOnInit(): void {    
    //this.search();    
   }

   editDriver(_driver: Driver){         
    this.MasterDriverPanelComponent.driverEdit(_driver);
  }

  onclick(){
    debugger
    this.showDialog = !this.showDialog 
    this.showInput = false;
  }
  
  search() {
    //this.loading = true;
    this.loadingService.startLoading();
    this._driverService.
    getDriversList(this._DriverFilter).subscribe((data: Driver[]) => {
      this._driverService._driverList = data;
      //this.loading = false;      
      this.loadingService.stopLoading();
    }, (error: HttpErrorResponse)=>{
      //this.loading = false;
      this.loadingService.stopLoading();
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });    
  }
}