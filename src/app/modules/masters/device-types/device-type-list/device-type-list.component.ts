import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { DeviceType } from 'src/app/models/masters/device-type';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { DeviceTypeFilter } from '../shared/filters/device-type-filter';
import { DeviceTypeService } from '../shared/services/device-type.service';
import { DeviceTypeViewmodel } from '../shared/view-models/device-type-viewmodel';
import * as Permissions from '../../../security/users/shared/user-const-permissions';

@Component({
  selector: 'app-device-type-list',
  templateUrl: './device-type-list.component.html',
  styleUrls: ['./device-type-list.component.scss']
})
export class DeviceTypeListComponent implements OnInit {
  DeviceTypeshowDialog:boolean=false;
  showFilters:boolean=false;
  showDialog:boolean=false;
  loading: boolean = false;
  
  _DeviceTypeViewModel:DeviceType;
  deviceTypeFilters: DeviceTypeFilter = new DeviceTypeFilter();
  deviceTypeEdit : DeviceTypeFilter;
  

  displayedColumns:ColumnD<DeviceTypeViewmodel>[] = 
  [
    { template: (data) => { return data.id; }, header: 'Id',field:'Id' ,display: 'none' },
    { template: (data) => { return data.name; }, header: 'Tipo de dispositivo',field:'name' ,display: 'table-cell' },
    { template: (data) => { return data.abbreviation; }, header: 'Abreviatura',field:'abbreviation' ,display: 'table-cell' },
    { field: 'active', header: 'Estatus', display: 'table-cell' },
    { template: (data) => { return data.createdByUser; }, header: 'Creado por', field:'createdByUser' ,display: 'table-cell' },
    { template: (data) => { return data.updatedByUser; }, header: 'Actualizado por', field:'updatedByUser' ,display: 'table-cell' }
  ];
  permissionsIDs = {...Permissions};
  constructor(public _DeviceTypeService: DeviceTypeService,
              private breadcrumbService: BreadcrumbService ,
              private messageService: MessageService, 
              public userPermissions: UserPermissions) { 
    this.breadcrumbService.setItems([
      { label: 'Configuración' },
      { label: 'Maestros generales' },
      { label: 'Tipos de dispositivos', routerLink: ['/devicetype-list'] }
    ]);

  }

  ngOnInit(): void {
    this.search();
    this._DeviceTypeViewModel=new DeviceType();
    this._DeviceTypeViewModel.id = -1;
    this._DeviceTypeViewModel.name = "";
    this._DeviceTypeViewModel.active = true;
    this._DeviceTypeViewModel.abbreviation = "";
  }

  search() {
    this.loading = true;
    this._DeviceTypeService.getdeviceTypeList(this.deviceTypeFilters).subscribe((data: DeviceType[]) => {
      this._DeviceTypeService._deviceTypeList= data;
      this.loading = false;
    }, (error: HttpErrorResponse) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los tipos de dispositivos" });
    });
  }

  onEdit(devicetype : DeviceType) {
    this._DeviceTypeViewModel = new DeviceType;
    this._DeviceTypeViewModel.id = devicetype.id;
    this._DeviceTypeViewModel.name = devicetype.name;
    this._DeviceTypeViewModel.abbreviation = devicetype.abbreviation;
    this._DeviceTypeViewModel.active = devicetype.active;
    this.DeviceTypeshowDialog = true;
  }

}
