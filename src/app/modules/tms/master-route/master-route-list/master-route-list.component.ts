import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MessageService } from "primeng/api";
import { BreadcrumbService } from "src/app/design/breadcrumb.service";
import { ColumnD } from "src/app/models/common/columnsd";
import { Route } from "src/app/models/tms/route";
import { LoadingService } from "src/app/modules/common/components/loading/shared/loading.service";
import { UserPermissions } from "src/app/modules/security/users/shared/user-permissions.service";
import * as Permissions from '../../../security/users/shared/user-const-permissions';
import { RouteFilter } from "../shared/filter/route-filter";
import { RouteService } from "../shared/service/route.service";
import { MasterRoutePanelComponent } from "./master-route-panel/master-route-panel.component";

@Component({
  selector: 'app-master-route-list',
  templateUrl: './master-route-list.component.html',
  styleUrls: ['./master-route-list.component.scss']
})
export class MasterRouteListComponent implements OnInit {
  
  //_loading:boolean = false
  _showFilter:boolean = true
  _showPanel:boolean = false
  _status:boolean = false;
  _route:Route = new Route();
  _routeFilter:RouteFilter = new RouteFilter();
  _permissions: number[] = [];
  _permissionsIDs = {...Permissions};
  
  @ViewChild(MasterRoutePanelComponent) MasterRoutePanelComponent: MasterRoutePanelComponent; 

  displayedColumns: ColumnD<Route>[] =
  [      
    { template: (data) => { return data.id; }, header: 'Id', display: 'none', field:'id' },      
    { template: (data) => { return data.codeRoute; }, header: 'Código de ruta', display: 'table-cell',field: 'codeRoute' },
    { template: (data) => { return data.branchOfficeOrigin; }, header: 'Sucursal de origen', display: 'table-cell',field: 'branchOfficeOrigin' },
    { template: (data) => { return data.branchOfficeDestination; }, header: 'Sucursal de destino', display: 'table-cell',field: 'branchOfficeDestination' },    
    { field: 'indViatics', header: 'Viáticos', display: 'table-cell' },
    { field: 'active', header: 'Estatus', display: 'table-cell' },
    { template: (data) => { return data.createdByUser; }, header: 'Creado por', display: 'table-cell',field: 'createdByUser' },
    { template: (data) => { return data.updatedByUser; }, header: 'Actualizado por', display: 'table-cell',field: 'updatedByUser' }
  ];

  constructor(public _routeService: RouteService, private _breadcrumbService: BreadcrumbService, private _messageService: MessageService, public _userPermissions: UserPermissions, private readonly _loadingService: LoadingService)
  {
    this._breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'TMS' },
      { label: 'Maestros' },
      { label: 'Rutas', routerLink: ['/tms/master-route-list'] }
    ]);
  }

  ngOnInit(): void {    
    this._route.id = -1;
    //this.search();
  }

  search() {       
    this._loadingService.startLoading();
    this._routeService.
    getRoutesList(this._routeFilter).subscribe((data: Route[]) => {
      this._routeService._routeList = data;            
      this._loadingService.stopLoading();
    }, (error: HttpErrorResponse)=>{      
      this._loadingService.stopLoading();
      this._messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });    
  }

  editRoute(pRoute: Route){    
   this.MasterRoutePanelComponent.routeEdit(pRoute);
  }

}
