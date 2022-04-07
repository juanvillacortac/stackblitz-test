import { Component, OnInit } from '@angular/core';
import { DescriptionType } from 'src/app/models/masters-mpc/description-type';
import { HttpErrorResponse } from '@angular/common/http';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Panel } from 'primeng/panel';
import { Columns } from 'src/app/models/common/columns';
import { ColumnD } from 'src/app/models/common/columnsd';
import { DescriptionTypeFilter } from '../../shared/filters/descriptionType-filter';
import { DescriptionTypeService } from '../../shared/services/DescriptionType/description-type.service';
import { MessageService, SelectItem } from 'primeng/api';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'app-description-list',
  templateUrl: './description-list.component.html',
  styleUrls: ['./description-list.component.scss']
})
export class DescriptionListComponent implements OnInit {

  showFilters : boolean = false;
  loading : boolean = false;
  submitted: boolean;
  descriptionDialog: boolean = false;
  descriptionId : DescriptionTypeFilter = new DescriptionTypeFilter();
  descriptionFilters: DescriptionTypeFilter = new DescriptionTypeFilter();
  descriptionModel: DescriptionType = new DescriptionType();
  permissionsIDs = {...Permissions};
  activeRegister:boolean = false;
  displayedColumns: ColumnD<DescriptionType>[] =
  [
   {template: (data) => { return data.id; }, header: 'Id',field: 'Id', display: 'none'},
   {template: (data) => { return data.name; },field: 'name', header: 'Tipo de descripción', display: 'table-cell'},
   {field: 'active', header: 'Estatus', display: 'table-cell'},
   {template: (data) => { return data.createdByUser; },field: 'createdByUser', header: 'Creado por', display: 'table-cell'},
   {template: (data) => { return data.updatedByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'}
  
   
  //  {template: (data) => { return data.updatedByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'}
  ];
  
  constructor(public _descriptionservice: DescriptionTypeService, 
    public breadcrumbService: BreadcrumbService, 
    private messageService: MessageService,
    public userPermissions: UserPermissions) { 
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'PLM', routerLink: ['/mpc/dashboard-mpc']  },
      { label: 'Tipos de descripciones', routerLink: ['/masters-mpc/description-list'] }
    ]);
  }

  ngOnInit(): void {
    this.search();
  }

  search(){
    this.loading = true;
    //this._attributeagrupationservice.getAttributesAgrupationList(this.attributeagrupationFilters);
    this.loading = false;
    this._descriptionservice.getDescriptionbyfilter(this.descriptionFilters).subscribe((data: DescriptionType[]) => {
      this._descriptionservice._descriptionList = data.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los tipos de descripción."});
    });
  }

  onEdit(id: number, name: string, active: boolean) {
    this.descriptionModel = new DescriptionType();
 
    this.descriptionModel.id = id;
    this.descriptionModel.name = name;
    this.descriptionModel.active = active;
    console.log(this.descriptionModel.active);
    this.descriptionDialog = true;
    this.activeRegister = active;
  }

}
