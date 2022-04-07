import { Component, OnInit } from '@angular/core';
import {Port} from '../../../../models/masters/port';
import {PortFilter} from '../shared/filters/port-filter'; 

import { ColumnD } from '../../../../models/common/columnsd';
import {PortViewmodel} from '../shared/view-models/port-viewmodel';
import {PortService} from '../shared/services/port.service';
import { BreadcrumbService } from '../../../../design/breadcrumb.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from '../../../security/users/shared/user-const-permissions';
@Component({
  selector: 'app-port-list',
  templateUrl: './port-list.component.html',
  styleUrls: ['./port-list.component.scss']
})
export class PortListComponent implements OnInit {
  PortshowDialog:boolean=false;
  showFilters:boolean=false;
  showDialog:boolean=false;
  loading: boolean = false;
  
  _portViewModel:Port;
  portFilters: PortFilter = new PortFilter();
  portEdit : PortFilter;

  displayedColumns:ColumnD<PortViewmodel>[] = 
  [
    { template: (data) => { return data.id; }, header: 'Id',field: 'Id' ,display: 'none' },
    { template: (data) => { return data.name; }, header: 'Puerto',field:'name' ,display: 'table-cell' },
    { template: (data) => { return data.abbreviation; }, header: 'Abreviatura',field:'abbreviation' ,display: 'table-cell' },
    { template: (data) => { return data.country; }, header: 'País',field: 'country',display: 'table-cell' },
    { field: 'active', header: 'Estatus', display: 'table-cell' },
    { template: (data) => { return data.createdByUser; }, header: 'Creado por', field:'createdByUser' ,display: 'table-cell' },
    { template: (data) => { return data.updatedByUser; }, header: 'Actualizado por',field:'updatedByUser', display: 'table-cell' }
  ];
  constructor(public _portService: PortService, 
              private breadcrumbService: BreadcrumbService,
              private messageService: MessageService,
              public userPermissions: UserPermissions) {
    this.breadcrumbService.setItems([
      { label: 'Configuración' },
      { label: 'Maestros generales' },
      { label: 'Puertos', routerLink: ['/port-list'] }
    ]);
  }

  permissionsIDs = {...Permissions};

  ngOnInit(): void {
    this.search();
    this._portViewModel=new Port();
    this._portViewModel.id = -1;
    this._portViewModel.name = "";
    this._portViewModel.active = true;
    this._portViewModel.abbreviation = "";
  }


  search() {
    this.loading = true;
    this._portService.getPortsList(this.portFilters).subscribe((data: Port[]) => {
      this._portService._portsList= data;
      this.loading = false;
    }, (error: HttpErrorResponse) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los puertos" });
    });
  }
  
  onEdit(port : Port) {
    this._portViewModel =  new Port;
    this._portViewModel.id = port.id;
    this._portViewModel.name = port.name;
    this._portViewModel.abbreviation = port.abbreviation;
    this._portViewModel.active = port.active;
    this._portViewModel.idCountry = port.idCountry;
    this.PortshowDialog = true;
  }

}
