import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MessageService, SortEvent } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Auxiliary } from 'src/app/models/financial/auxiliary';
import { ColumnD } from 'src/app/models/common/columnsd';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { AuxiliaryService } from '../shared/services/auxiliary.service';
import { AuxiliaryFilter, AUXILIAR_ALL_ACTIVES_FILTER } from 'src/app/models/financial/AuxiliaryFilter';
import {Message} from 'primeng//api';
import * as Permissions from '../../../security/users/shared/user-const-permissions';
import{Router} from "@angular/router";
import {  } from '../shared/services/auxiliary.service';
import { InitialSetupService } from '../../initial-setup/shared/initial-setup.service';



@Component({
  selector: 'app-auxiliary-list',
  templateUrl: './auxiliary-list.component.html',
  styleUrls: ['./auxiliary-list.component.scss']
})
export class AuxiliaryListComponent implements OnInit {

  permissionsIDs = {...Permissions};
  showFilters : boolean = false;

  submitted: boolean;
  showDialog = false;
  isCallback = false;
  auxiliary = new Auxiliary();
  auxiliaries = [] as Auxiliary[];
  auxiliaryFilter =new  AuxiliaryFilter();
  showPanel = false;
  loading = false;
  displayedColumns: ColumnD<Auxiliary>[] =
  [
/*    {template: (data) => { return data.id; }, header: 'Id',field: 'id', display: 'table-cell'},
   {template: (data) => { return data.createdByUserId; },field: 'createdByUserId', header: 'Creado por', display: 'table-cell'},
   {template: (data) => { return data.updatedByUserId; },field: 'updatedByUserId', header: 'Actualizado por', display: 'table-cell'}, */
   {template: (data) => { return data.id; }, field: 'id', header: 'Código', display: 'table-cell'},
   {template: (data) => { return data.auxilliaryName; }, field: 'auxilliaryName', header: 'Auxiliar', display: 'table-cell'},
   {field: 'activo', header: 'Estatus', display: 'table-cell' },
   {template: (data) => { return data.createdByUserName; }, field: 'createdByUserName', header: 'Creado por', display: 'table-cell'},
   {template: (data) => { return data.updatedByUserName; }, field: 'updatedByUserName', header: 'Actualizado por', display: 'table-cell'},
/*    {template: (data) => { return data.createdDate; },field: 'createdDate', header: 'Fecha de Creación', display: 'table-cell'},
   {template: (data) => { return data.updatedDate; },field: 'updatedDate', header: 'Fecha de Actualización', display: 'table-cell'} */
  ];

  constructor(public _auxiliaryService: AuxiliaryService, 
    public breadcrumbService: BreadcrumbService, 
    private messageService: MessageService,
    public userPermissions: UserPermissions,private router :Router,
    private setupService: InitialSetupService) { 
    this.breadcrumbService.setItems([
      { label: 'Financiero' },
      { label: 'Maestros' },
      { label: 'Auxiliares', routerLink: ['/financial/masters/auxiliary-list'] }
    ]);
  }
  
  ngOnInit(): void {
    this.setupService.validateConfiguration(1, this.router, () => {
      this.search();
    })
  }

  search(){
  
    if (this.loading)
      return;
    
    this.loading = true;
    //this.messageService.clear();
   
    this._auxiliaryService.getAuxiliariesList(this.auxiliaryFilter).subscribe((data: Auxiliary[]) => {      
      this.auxiliaries = data.sort((a,b) => 0 - (a.id < b.id ? -1 : 1));
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los auxiliares." });
        
    });
  }
  openNew() {
    this.auxiliary = { id: -1 } as Auxiliary;
    this.showDialog = true;
  }

  
  edit(auxiliary: Auxiliary): void {
    this.auxiliary.id = auxiliary.id;
    this.auxiliary.auxilliaryName = auxiliary.auxilliaryName;
    this.auxiliary.activo = auxiliary.activo;
    this.showDialog = true;
  }


  
}

