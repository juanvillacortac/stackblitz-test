import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Typeofparts } from 'src/app/models/masters-mpc/typeofparts';
import { TypeofpartsFilter } from '../../shared/filters/typeofparts-filter';
import { TypeofpartsService } from '../../shared/services/TypeofPartsService/typeofparts.service';
import { MessageService } from 'primeng/api';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';


@Component({
  selector: 'app-typeofparts-list',
  templateUrl: './typeofparts-list.component.html',
  styleUrls: ['./typeofparts-list.component.scss']
})
export class TypeofpartsListComponent implements OnInit {

  showFilters : boolean = false;
  loading : boolean = false;
  submitted: boolean;
  typeofpartsDialog: boolean = false;
  typeofpartsId : TypeofpartsFilter = new TypeofpartsFilter();
  typeofpartsFilters: TypeofpartsFilter = new TypeofpartsFilter();
  typeofpartsModel: Typeofparts = new Typeofparts();
  permissionsIDs = {...Permissions};
  displayedColumns: ColumnD<Typeofparts>[] =
  [
   {template: (data) => { return data.id; }, header: 'Id',field: 'Id', display: 'none'},
   {template: (data) => { return data.name; },field: 'name', header: 'Nombre', display: 'table-cell'},
   {field: 'active', header: 'Estatus', display: 'table-cell'},
   {template: (data) => { return data.createdByUser; },field: 'createdByUser', header: 'Creado por', display: 'table-cell'},
   {template: (data) => { return data.updatedByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'}
  ];

  constructor(public _typeofpartsservice: TypeofpartsService,
    public breadcrumbService: BreadcrumbService,
    private messageService: MessageService,
    public userPermissions: UserPermissions) {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'PLM', routerLink: ['/mpc/dashboard-mpc']  },
      { label: 'Tipos de partes de productos', routerLink: ['/masters-mpc/typeofparts-list'] }
    ]);
  }

  ngOnInit(): void {
    this.search();
  }

  search(){
    this.loading = true;
    //this._attributeagrupationservice.getAttributesAgrupationList(this.attributeagrupationFilters);
    this.loading = false;
    this._typeofpartsservice.getTypeofpartsbyfilter(this.typeofpartsFilters).subscribe((data: Typeofparts[]) => {
      this._typeofpartsservice._typeofPartsList = data.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
      this.loading = false;
    }, (_: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los tipo de partes"});
    });
  }

  onEdit(id: number, name: string, active: boolean) {
    this.typeofpartsModel = new Typeofparts();
    this.typeofpartsModel.id = id;
    this.typeofpartsModel.name = name;
    this.typeofpartsModel.active = active;
    this.typeofpartsDialog = true;
  }
}
