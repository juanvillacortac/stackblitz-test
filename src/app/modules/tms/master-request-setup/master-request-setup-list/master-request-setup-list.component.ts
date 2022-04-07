import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { RequestSetup } from 'src/app/models/tms/requestsetup';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from '../../../security/users/shared/user-const-permissions';
import { MasterRequestSetupPanelComponent } from '../master-request-setup-panel/master-request-setup-panel.component';
import { RequestSetupFilter } from '../shared/filter/request-setup-filter';
import { RequestSetupService } from '../shared/service/request-setup.service';

@Component({
  selector: 'app-master-request-setup-list',
  templateUrl: './master-request-setup-list.component.html',
  styleUrls: ['./master-request-setup-list.component.scss']
})
export class MasterRequestSetupListComponent implements OnInit {
  //loading: boolean = false
  _showFilters: boolean = true
  _showPanel: boolean = false
  _requestSetup: RequestSetup = new RequestSetup();
  _permissions: number[] = [];
  _permissionsIDs = {...Permissions};
  _status: boolean = true;
  _requestSetupFilter : RequestSetupFilter = new RequestSetupFilter();
  @ViewChild(MasterRequestSetupPanelComponent) MasterRequestSetupPanelComponent: MasterRequestSetupPanelComponent; 
  displayedColumns: ColumnD<RequestSetup>[] =
  [      
    { template: (data) => { return data.requestSetupID; }, header: 'Id', display: 'none', field:'requestSetupID' },
    { template: (data) => { return data.branchOfficeRequest; }, header: 'Sucursal que demanda', display: 'table-cell', field:'branchOfficeRequest' },
    { template: (data) => { return data.branchOfficeDispatches; }, header: 'Sucursal que despacha', display: 'table-cell', field:'branchOfficeDispatches' },
    { template: (data) => { return data.category; }, header: 'Categoría', display: 'table-cell', field:'typeDriver' },    
    { template: (data) => { return data.operationsDocument; }, header: 'Tipo de documento de solicitud', display: 'table-cell', field:'operationsDocument' },
    { template: (data) => { return data.priority; }, header: 'Prioridad', display: 'table-cell', field:'priority' },
    { template: (data) => { return data.frequencyRequestSetup; }, header: 'Frecuencia', display: 'table-cell', field:'frequencyRequestSetup' },
    { field: 'active', header: 'Estatus', display: 'table-cell' },
    { template: (data) => { return data.createdByUser; }, header: 'Creado por', display: 'table-cell',field: 'createdByUser' },
    { template: (data) => { return data.updatedByUser; }, header: 'Actualizado por', display: 'table-cell',field: 'updatedByUser' }
  ];
  
  constructor(public _requestSetupService:RequestSetupService, private _breadcrumbService:BreadcrumbService, private _messageService:MessageService, public _userPermissions:UserPermissions, private readonly _loadingService:LoadingService)
  {
    this._breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'TMS' },
      { label: 'Maestros' },
      { label: 'Configuración de solicitudes automáticas', routerLink: ['/tms/master-request-setup-list'] }
    ]);
   }

  ngOnInit(): void {       
   }

   editRequestSetup(_requestSetup: RequestSetup){         
    this.MasterRequestSetupPanelComponent.requestSetupEdit(_requestSetup);
  }
  
  search() {

    this._loadingService.startLoading();
    let _flag = false;
    if(this._requestSetupFilter.categoryID == -2){
      _flag = true;
      this._requestSetupFilter.categoryID = -1;
    }        
    this._requestSetupService.getRequestSetupList(this._requestSetupFilter).subscribe((data: RequestSetup[]) => {
      this._requestSetupService._requestSetupList = data;
      if(_flag == true){
        this._requestSetupFilter.categoryID = -2;
      }
      this._loadingService.stopLoading();
    }, (error: HttpErrorResponse)=>{      
      this._loadingService.stopLoading();
      this._messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });    
  }

}
