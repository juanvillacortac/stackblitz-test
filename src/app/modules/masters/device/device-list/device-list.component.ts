import { Component, OnInit } from '@angular/core';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Device } from 'src/app/models/masters/device';
import { DeviceFilter } from '../shared/filters/device-filter';
import { DeviceViewmodel } from '../shared/view-models/device-viewmodel';
import * as Permissions from '../../../security/users/shared/user-const-permissions';
import { DeviceService } from '../shared/services/device.service';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { MessageService } from 'primeng/api';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit {
  DeviceshowDialog:boolean=false;
  showFilters:boolean=false;
  showDialog:boolean=false;
  loading: boolean = false;
  
  _DeviceViewModel:Device;
  deviceFilters: DeviceFilter = new DeviceFilter();
  deviceEdit : DeviceFilter;
  
  displayedColumns:ColumnD<DeviceViewmodel>[] = 
  [
    { template: (data) => { return data.id; }, header: 'Id',field:'Id' ,display: 'none' },
    { template: (data) => { return data.name; }, header: 'Dispositivo',field:'name' ,display: 'table-cell' },
    { template: (data) => { return data.abbreviation; }, header: 'Abreviatura',field:'abbreviation' ,display: 'table-cell' },
    { template: (data) => { return data.brand; }, header: 'Marca',field:'brand' ,display: 'table-cell' },
    { template: (data) => { return data.deviceType; }, header: 'Tipo dispositivo',field:'deviceType' ,display: 'table-cell' },
    { template: (data) => { return data.quantity; }, header: 'Cantidad',field:'quantity' ,display: 'table-cell' },
    { field: 'active', header: 'Estatus', display: 'table-cell' },
    { template: (data) => { return data.createdByUser; }, header: 'Creado por', field:'createdByUser' ,display: 'table-cell' },
    { template: (data) => { return data.updatedByUser; }, header: 'Actualizado por', field:'updatedByUser' ,display: 'table-cell' }
  ];
  permissionsIDs = {...Permissions};

  constructor(public _DeviceService: DeviceService,
    private breadcrumbService: BreadcrumbService ,
    private messageService: MessageService, 
    public userPermissions: UserPermissions) { 
this.breadcrumbService.setItems([
{ label: 'Configuración' },
{ label: 'Maestros generales' },
{ label: 'Dispositivos', routerLink: ['/device-list'] }
]);

}

  ngOnInit(): void {
    this.search();
    this._DeviceViewModel=new Device();
    this._DeviceViewModel.id = -1;
    this._DeviceViewModel.name = "";
    this._DeviceViewModel.active = true;
    this._DeviceViewModel.abbreviation = "";
  }

  search() {
    this.loading = true;
    this._DeviceService.getdeviceList(this.deviceFilters).subscribe((data: Device[]) => {
      this._DeviceService._deviceList= data;
      this.loading = false;
    }, (error: HttpErrorResponse) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los dispositivos" });
    });
  }

  onEdit(device : Device) {
    console.log(device);
    this._DeviceViewModel = new Device;
    this._DeviceViewModel.id = device.id;
    this._DeviceViewModel.name = device.name;
    this._DeviceViewModel.abbreviation = device.abbreviation;
    this._DeviceViewModel.quantity = device.quantity;
    this._DeviceViewModel.idBrand = device.idBrand;
    this._DeviceViewModel.idDeviceType = device.idDeviceType;
    this._DeviceViewModel.active = device.active;
    this.DeviceshowDialog = true;
  }

}
