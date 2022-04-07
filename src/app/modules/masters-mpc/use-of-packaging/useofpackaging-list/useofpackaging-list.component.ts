import { Component, OnInit } from '@angular/core';
import { Useofpackaging } from 'src/app/models/masters-mpc/useofpackaging';
import { HttpErrorResponse } from '@angular/common/http';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Columns } from 'src/app/models/common/columns';
import { ColumnD } from 'src/app/models/common/columnsd';
import { UseofpackagingFilter } from '../../shared/filters/useofpackaging-filter';
import { UseofpackagingService } from '../../shared/services/UseofPackaging/useofpackaging.service';
import { MessageService, SelectItem } from 'primeng/api';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'app-useofpackaging-list',
  templateUrl: './useofpackaging-list.component.html',
  styleUrls: ['./useofpackaging-list.component.scss']
})
export class UseofpackagingListComponent implements OnInit {

  showFilters : boolean = false;
  loading : boolean = false;
  submitted: boolean; 
  useofpackagingDialog: boolean = false;
  useofpackagingId : UseofpackagingFilter = new UseofpackagingFilter();
  useofpackagingFilters: UseofpackagingFilter = new UseofpackagingFilter();
  useofpackagingModel: Useofpackaging = new Useofpackaging();
  permissionsIDs = {...Permissions};
  activeRegister:boolean = false;
  displayedColumns: ColumnD<Useofpackaging>[] =
  [
   {template: (data) => { return data.id; }, header: 'Id',field: 'Id', display: 'none'},
   {template: (data) => { return data.usePackaging; },field: 'usePackaging', header: 'Uso de empaque', display: 'table-cell'},
   {field: 'active', header: 'Estatus', display: 'table-cell'},
   {template: (data) => { return data.createdByUser; },field: 'createdByUser', header: 'Creado por', display: 'table-cell'},
   {template: (data) => { return data.updatedByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'}
  
   
  //  {template: (data) => { return data.updatedByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'}
  ];
  
  constructor(public _useofpackagingservice: UseofpackagingService, 
    public breadcrumbService: BreadcrumbService, 
    private messageService: MessageService,
    public userPermissions: UserPermissions) { 
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'PLM', routerLink: ['/mpc/dashboard-mpc']  },
      { label: 'Usos de empaques', routerLink: ['/masters-mpc/useofpackaging-list'] }
    ]);
  }

  ngOnInit(): void {
    this.search();
  }

  search(){
    this.loading = true;
    //this._attributeagrupationservice.getAttributesAgrupationList(this.attributeagrupationFilters);
    this.loading = false;
    this._useofpackagingservice.getUseofpackagingbyfilter(this.useofpackagingFilters).subscribe((data: Useofpackaging[]) => {
      this._useofpackagingservice._UseofpackagingList =data.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los tipos de descripción."});
    });
  }

  onEdit(id: number, name: string, active: boolean) {
    this.useofpackagingModel = new Useofpackaging();
 
    this.useofpackagingModel.id = id;
    this.useofpackagingModel.usePackaging = name;
    this.useofpackagingModel.active = active;
    this.useofpackagingDialog = true;
    this.activeRegister = active;
  }

}
