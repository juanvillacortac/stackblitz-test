import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MotivesService } from '../../shared/services/motives.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { MotivesTypeFilters } from 'src/app/models/masters/motives-type-filters';
import { MotivesType } from 'src/app/models/masters/motives-type';
import { ColumnD } from 'src/app/models/common/columnsd';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';

@Component({
  selector: 'app-motives-type-list',
  templateUrl: './motives-type-list.component.html',
  styleUrls: ['./motives-type-list.component.scss']
})
export class MotivesTypeListComponent implements OnInit {

  showFilters : boolean = false;
  loading : boolean = false;
  
  submitted: boolean;
  showDialog: boolean = false;
  isCallback:boolean = false;
  motivesTypeId : MotivesTypeFilters = new MotivesTypeFilters();
  motivesTypeFilters: MotivesTypeFilters = new MotivesTypeFilters();
  motivesType: MotivesType = new MotivesType();
  motivesTypeList: MotivesType[] = [];
  motivesTypeNotFilteredList: MotivesType[] = [];

  displayedColumns: ColumnD<MotivesType>[] =
  [
   {template: (data) => { return data.id; }, header: 'Id',field: 'Id', display: 'none'},
   {template: (data) => { return data.name; }, field: 'name', header: 'Nombre', display: 'table-cell'},
   {template: (data) => { return data.abbreviation; }, field: 'abbreviation', header: 'Abreviatura', display: 'table-cell'},
   {template: (data) => { return data.module; },field: 'module', header: 'Módulo', display: 'table-cell'},
   {field: 'active', header: 'Estatus', display: 'table-cell'},
   {template: (data) => { return data.createdByUser; },field: 'createdByUser', header: 'Creado por', display: 'table-cell'},
   {template: (data) => { return data.updatedByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'},
   {field: 'edit', header: '', display: 'table-cell'}
  ];

  
  permissionsIDs = {...Permissions};

  constructor(
    private _motivesService: MotivesService,
    private messageService: MessageService,
    public userPermissions: UserPermissions,
    private breadcrumbService: BreadcrumbService) { 
      this.breadcrumbService.setItems([
        { label: 'Configuración' },
        { label: 'Maestros generales' },
        { label: 'Tipos de motivos', routerLink: ['/motives-type-list'] }
    ]); 
  }

  ngOnInit(): void { 
    this.search();

  }

  search(){
    this.loading = true;
    this._motivesService.getMotivesTypes(this.motivesTypeFilters).then(result => {
      this.motivesTypeList= result;
      if(this.motivesTypeNotFilteredList.length === 0 || this.isCallback)
      {
        this.motivesTypeNotFilteredList = result;
        this.isCallback = false;
      }
      this.loading = false;
    }, ()=>{
      this.loading = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando tipos de motivos"});
    });
  }
  openNew() {
    this.motivesType = null;
    this.showDialog = true;
  }
  onEdit(id: number) {

    this.motivesType = this.motivesTypeList.find(p=> p.id === id)
    this.showDialog = true;

  }
  
  public childCallBack(reload: boolean): void {
    this.showDialog = false;
    if (reload) {
      this.isCallback = true;
      this.search();
    }
}

}
