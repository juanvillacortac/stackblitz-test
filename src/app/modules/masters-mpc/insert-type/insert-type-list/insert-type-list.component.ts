import { Component, OnInit } from '@angular/core';
import { InsertType } from 'src/app/models/masters-mpc/insert-type';
import { HttpErrorResponse } from '@angular/common/http';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { InsertTypeFilter } from '../../shared/filters/insert-type-filter';
import { InsertTypeService } from '../../shared/services/InsertTypeService/insert-type.service';
import { MessageService } from 'primeng/api';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'app-insert-type-list',
  templateUrl: './insert-type-list.component.html',
  styleUrls: ['./insert-type-list.component.scss']
})
export class InsertTypeListComponent implements OnInit {
  showFilters : boolean = false;
  loading : boolean = false;
  submitted: boolean;
  insertTypeDialog: boolean = false;
  insertTypeId : InsertTypeFilter = new InsertTypeFilter();
  insertTypeFilters: InsertTypeFilter = new InsertTypeFilter();
  insertTypeModel: InsertType = new InsertType();
  permissionsIDs = {...Permissions};
  activeRegister:boolean = false;
  displayedColumns: ColumnD<InsertType>[] =
  [
   {template: (data) => { return data.id; }, header: 'Id',field: 'Id', display: 'none'},
   {template: (data) => { return data.name; },field: 'name', header: 'Tipo de encarte', display: 'table-cell'},
   {field: 'active', header: 'Estatus', display: 'table-cell'},
   {template: (data) => { return data.createdByUser; },field: 'createdByUser', header: 'Creado por', display: 'table-cell'},
   {template: (data) => { return data.updatedByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'}
  ];

  constructor(public _insertTypeservice: InsertTypeService,
    public breadcrumbService: BreadcrumbService,
    private messageService: MessageService,
    public userPermissions: UserPermissions) {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'MPC' },
      { label: 'Tipos de encartes', routerLink: ['/insert-type-list'] }
    ]);
  }

  ngOnInit(): void {
    this.search();
  }

  search(){
    this.loading = true;
    //this._attributeagrupationservice.getAttributesAgrupationList(this.attributeagrupationFilters);
    this.loading = false;
    this._insertTypeservice.getInsertTypebyfilter(this.insertTypeFilters).subscribe((data: InsertType[]) => {
      this._insertTypeservice._insertTypeList = data.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
      this.loading = false;
    }, (_: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los tipos de descripción."});
    });
  }

  onEdit(id: number, name: string, active: boolean) {
    this.insertTypeModel = new InsertType();
    this.insertTypeModel.id = id;
    this.insertTypeModel.name = name;
    this.insertTypeModel.active = active;
    console.log(this.insertTypeModel.active);
    this.insertTypeDialog = true;
    this.activeRegister = active;
  }

}
