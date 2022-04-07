import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { InventoryReasons } from 'src/app/models/ims/inventory-reasons';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { InventoryReasonFilter } from '../shared/filters/inventory-reason-filter';
import { InventoryReasonService } from '../shared/services/inventory-reason.service';
import { InventoryReasonViewmodel } from '../shared/view-models/inventory-reason-viewmodel';
import * as Permissions from '../../../security/users/shared/user-const-permissions';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';

@Component({
  selector: 'app-inventory-reason-list',
  templateUrl: './inventory-reason-list.component.html',
  styleUrls: ['./inventory-reason-list.component.scss']
})
export class InventoryReasonListComponent implements OnInit {
  InventoryReasonshowDialog:boolean=false;
  showFilters:boolean=false;
  showDialog:boolean=false;
  loading: boolean = false;
  
  _InventoryReasonViewModel:InventoryReasons;
  inventoryReasonFilters: InventoryReasonFilter = new InventoryReasonFilter();
  inventoryReasonFiltersEdit : InventoryReasonFilter;

  displayedColumns:ColumnD<InventoryReasonViewmodel>[] = 
  [
    
    { template: (data) => { return data.name; }, header: 'Motivo de inventario',field:'name' ,display: 'table-cell' },
    { template: (data) => { return data.configuration+" "+"( "+ data.symbol +" )"; }, header: 'Configuración',field:'configuration' ,display: 'table-cell' },
    { template: (data) => { return data.groupingInventoryReason; }, header: 'Agrupación de motivo',field:'groupingInventoryReason' ,display: 'table-cell' },
    { field: 'active', header: 'Estatus', display: 'table-cell' },
    { template: (data) => { return data.createdByUser; }, header: 'Creado por', field:'createdByUser' ,display: 'table-cell' },
    { template: (data) => { return data.updatedByUser; }, header: 'Actualizado por', field:'updatedByUser' ,display: 'table-cell' }
  ];
  permissionsIDs = {...Permissions};

  constructor(private breadcrumbService: BreadcrumbService,
              public _InventoryReasonService: InventoryReasonService,
              private messageService: MessageService, 
              public userPermissions: UserPermissions,
              private readonly loadingService: LoadingService) { 

    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'IMS' },
      { label: 'Maestros' },
      { label: 'Motivos de inventario', routerLink: ['/ims/inventory-reason-list'] }
      ]);
  }

  ngOnInit(): void {
    this.search();
    this._InventoryReasonViewModel=new InventoryReasons();
    this._InventoryReasonViewModel.id = -1;
    this._InventoryReasonViewModel.name = "";
    this._InventoryReasonViewModel.active = true;
    this._InventoryReasonViewModel.idConfiguration = -1;
    this._InventoryReasonViewModel.idGroupingInventoryReason = -1;
  }

  
  search() {
    //this.loading = true;
    this.loadingService.startLoading();
    this._InventoryReasonService.getinventoryReasonList(this.inventoryReasonFilters).subscribe((data: InventoryReasons[]) => {
      this._InventoryReasonService._inventoryReasonList= data;
      //this.loading = false;
      this.loadingService.stopLoading();
    }, (error: HttpErrorResponse) => {
        //this.loading = false;
        this.loadingService.stopLoading();
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los motivos de inventario" });
    });
  }

  onEdit(inventoryreason : InventoryReasons) {
    console.log(inventoryreason);
    this._InventoryReasonViewModel = new InventoryReasons;
    this._InventoryReasonViewModel.id = inventoryreason.id;
    this._InventoryReasonViewModel.name = inventoryreason.name;
    this._InventoryReasonViewModel.idConfiguration = inventoryreason.idConfiguration;
    this._InventoryReasonViewModel.idGroupingInventoryReason = inventoryreason.idGroupingInventoryReason;
    this._InventoryReasonViewModel.active = inventoryreason.active;
    this.InventoryReasonshowDialog = true;
  }

}
