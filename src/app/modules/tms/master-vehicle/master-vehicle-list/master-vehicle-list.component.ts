import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Vehicle } from 'src/app/models/tms/vehicle';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from '../../../security/users/shared/user-const-permissions';
import { VehicleFilter } from '../shared/filter/vehicle-filter';
import { VehicleService } from '../shared/service/vehicle.service';
import { MasterVehiclePanelComponent } from './master-vehicle-panel/master-vehicle-panel.component';

@Component({
  selector: 'app-master-vehicle-list',
  templateUrl: './master-vehicle-list.component.html',
  styleUrls: ['./master-vehicle-list.component.scss']
})
export class MasterVehicleListComponent implements OnInit {

  loading: boolean = false
  showFilters: boolean = true
  showDialog: boolean = false
  _Vehicle: Vehicle= new Vehicle();
  _permissions: number[] = [];
  _permissionsIDs = {...Permissions};
  _status:boolean=true;
  _VehicleFilter: VehicleFilter = new VehicleFilter();

  @ViewChild(MasterVehiclePanelComponent) MasterVehiclePanelComponent: MasterVehiclePanelComponent; 

  displayedColumns: ColumnD<Vehicle>[] =
    [      
      { template: (data) => { return data.id; }, header: 'Id', display: 'none', field:'id' },
      { template: (data) => { return data.vehicleCode; }, header: 'Código', display: 'table-cell', field:'VehicleCode' },
      { template: (data) => { return data.vehicleRegistrationPlate; }, header: 'Placa', display: 'table-cell', field:'VehicleRegistrationPlate' },
      { template: (data) => { return data.vehicleOwner; }, header: 'Propietario', display: 'table-cell', field:'vehicleOwner' },
      { template: (data) => { return data.vehicleDriver; }, header: 'Conductor principal', display: 'table-cell', field:'vehicleDriver' },
      { template: (data) => { return data.vehicleModel; }, header: 'Marca', display: 'table-cell',field: 'vehicleModel' },
      { template: (data) => { return data.vehicleType; }, header:'Uso', display: 'table-cell',field: 'vehicleType' },
      { field: 'active', header: 'Estatus', display: 'table-cell' }
    ];

  constructor(public _vehicleService: VehicleService,private breadcrumbService: BreadcrumbService,private messageService: MessageService,public _userPermissions: UserPermissions, private readonly _loadingService: LoadingService)
  {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'TMS' },
      { label: 'Maestros' },
      { label: 'Vehículos', routerLink: ['/tms/master-vehicle-list'] }
    ]);
   }

  ngOnInit(): void {
    //this.search();
  }

  search() {
    //this.loading = true;
    this._loadingService.startLoading();
    this._vehicleService.getVehiclesList(this._VehicleFilter).subscribe((data: Vehicle[]) => {
      this._vehicleService._vehicleList = data;
      this._loadingService.stopLoading();
      //this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this._loadingService.stopLoading();
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
  }
  editVehicle(pVehicle: Vehicle){       
    this.MasterVehiclePanelComponent.editVehicle(pVehicle);
   }

}