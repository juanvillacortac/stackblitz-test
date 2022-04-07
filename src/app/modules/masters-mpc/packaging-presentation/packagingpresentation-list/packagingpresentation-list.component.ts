import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Panel } from 'primeng/panel';
import { Columns } from 'src/app/models/common/columns';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Packagingpresentation } from 'src/app/models/masters-mpc/packagingpresentation';
import { PackagingpresentationFilter } from '../../shared/filters/packagingpresentation-filter';
import { PackagingpresentationService } from '../../shared/services/PackagingPresentationService/packagingpresentation.service';
import { MessageService, SelectItem } from 'primeng/api';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';


@Component({
  selector: 'packagingpresentation-list',
  templateUrl: './packagingpresentation-list.component.html',
  styleUrls: ['./packagingpresentation-list.component.scss']
})
export class PackagingpresentationListComponent implements OnInit {

  showFilters : boolean = false;
  loading : boolean = false;
  submitted: boolean;
  packagingpresentationDialog: boolean = false;
  _packagingpresentationFilters: PackagingpresentationFilter = new PackagingpresentationFilter();
  packagingpresentationModel: Packagingpresentation = new Packagingpresentation();
  idpackagingpresentation: number = 0;
  permissionsIDs = {...Permissions};
  displayedColumns: ColumnD<Packagingpresentation>[] =
  [
   {template: (data) => { return data.id; }, header: 'Id',field: 'id', display: 'none'},
   {template: (data) => { return data.name; },field: 'name', header: 'Nombre', display: 'table-cell'},
   {template: (data) => { return data.packingType; },field: 'packingType', header: 'Tipo de empaque', display: 'table-cell'},
   {field: 'active', header: 'Estatus', display: 'table-cell'},
   {template: (data) => { return data.createdByUser; },field: 'createdByUser', header: 'Creado por', display: 'table-cell'},
   {template: (data) => { return data.updatedByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'}
  ];

  constructor(public _packagingpresentationservice: PackagingpresentationService, 
    public breadcrumbService: BreadcrumbService, 
    private messageService: MessageService,
    public userPermissions: UserPermissions) {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'PLM', routerLink: ['/mpc/dashboard-mpc']  },
      { label: 'Presentaciones de empaques', routerLink: ['/master-mpc/packagingpresentation-list'] }
    ]);
   }

  ngOnInit(): void {
    debugger
    this.search();
  }

  search(){
    this.loading = true;
    //this._attributeagrupationservice.getAttributesAgrupationList(this.attributeagrupationFilters);
    debugger
    this.loading = false;
    this._packagingpresentationservice.getPackagingpresentationbyfilter(this._packagingpresentationFilters).subscribe((data: Packagingpresentation[]) => {
      this._packagingpresentationservice._PackagingPresentationList = data.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
      this.loading = false;
      console.log(this._packagingpresentationservice._PackagingPresentationList);
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando las presentaciones de empaques"});
    });
  }
  onEdit(id: number, name: string, idPackingType: number, active: boolean) {
    this.packagingpresentationModel = new Packagingpresentation();
    this.packagingpresentationModel.id = id;
    this.packagingpresentationModel.name = name;
    this.packagingpresentationModel.idPackingType = idPackingType;
    this.packagingpresentationModel.active = active == false ? false : true;
    this.packagingpresentationDialog = true;
  }
}
