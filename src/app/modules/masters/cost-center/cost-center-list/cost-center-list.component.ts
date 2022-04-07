import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../../../design/breadcrumb.service';
import { ColumnD } from '../../../../models/common/columnsd';
import { CostCenter } from '../../../../models/masters/cost-center';
import { UserPermissions } from '../../../security/users/shared/user-permissions.service';
import { CostCenterService } from '../shared/services/cost-center.service';
import * as Permissions from '../../../security/users/shared/user-const-permissions';
import { CostCenterFilters } from '../shared/filters/cost-center-filters';
import {Message,MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-cost-center-list',
  templateUrl: './cost-center-list.component.html',
  styleUrls: ['./cost-center-list.component.scss']
})
export class CostCenterListComponent implements OnInit {


  displayedColumns: ColumnD<CostCenter>[] =
  [
    { template: (data) => { return data.id; }, header: 'Código',field:'id' , display: 'table-cell' },
    { template: (data) => { return data.name; }, header: 'Centro de costos',field:'name' , display: 'table-cell' },
    { field: 'active', header: 'Estatus',display: 'table-cell' },
    { template: (data) => { return data.createdByUser; }, header: 'Creado por', field:'createdByUser' ,display: 'table-cell' },
    { template: (data) => { return data.updatedByUser; }, header: 'Actualizado por', field:'updatedByUser' ,display: 'table-cell' }
  ];

 

  permissionsIDs = {...Permissions};
  showDialog: boolean;
  showFilters: boolean = false;

  submitted: boolean;

  isCallback = false;
  costCenter = new CostCenter();
  costCenters = [] as CostCenter[];
  costCenterFilter = new CostCenterFilters();
  showPanel = false;
  loading = false;

  constructor(public breadcrumbService: BreadcrumbService, public costCenterService: CostCenterService, public userPermissions: UserPermissions, public messageService: MessageService) { 
    this.breadcrumbService.setItems([
      { label: 'Configuración' },
      { label: 'Maestros generales' },
      { label: 'Centros de costos', routerLink: ['/masters/costcenter-list'] }
    ]);
  }

  ngOnInit(): void {
    this.search();
  }



  search() {
    if (this.loading)
      return;
    
    this.loading = true;
    //this.messageService.clear();
    this.costCenterService.getCentersCostsList(this.costCenterFilter).subscribe((data)=>{
      this.loading = false;
      this.costCenters = data.sort((a, b) => 0 - (a.id < b.id ? -1 : 1));;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los centros de costos." });
        
    });
  }

  openNew(){
    this.costCenter= { id: -1 } as CostCenter;
    this.showDialog = true;
  }
  // this.auxiliary = { id: -1 } as Auxiliary;
  // this.showDialog = true;
  openEdit(modelEdit: CostCenter){

    this.costCenter.id = modelEdit.id;
    this.costCenter.name = modelEdit.name;
    this.costCenter.active = modelEdit.active
    this.showDialog = true;
  }

  showDialogChange(show){
    this.showDialog = show;
  }
}
