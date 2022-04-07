import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Panel } from 'primeng/panel';
import { Columns } from 'src/app/models/common/columns';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Attributeagrupation } from 'src/app/models/masters-mpc/attributeagrupation';
import { AttributesagrupationFilter } from '../../shared/filters/attributesagrupation-filter';
import { AttributeagrupationService } from '../../shared/services/attributeagrupation.service';
import { AttributeAgrupation } from '../../shared/view-models/attribute-agrupation.viewmodel';
import { MessageService, SelectItem } from 'primeng/api';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { OrderCodes } from '../../shared/Utils/order-codes';

@Component({
  selector: 'app-attributeagrupation-list',
  templateUrl: './attributeagrupation-list.component.html',
  styleUrls: ['./attributeagrupation-list.component.scss']
})
export class AttributeagrupationListComponent implements OnInit {

  showFilters : boolean = false;
  loading : boolean = false;
  
  submitted: boolean;
  attributeagrupationDialog: boolean = false;
  attributeagrupationId : AttributesagrupationFilter = new AttributesagrupationFilter();
  attributeagrupationFilters: AttributesagrupationFilter = new AttributesagrupationFilter();
  attributeagrupationViewModel: AttributeAgrupation = new AttributeAgrupation();
  permissionsIDs = {...Permissions};
  displayedColumns: ColumnD<AttributeAgrupation>[] =
  [
   {template: (data) => { return data.id; }, header: 'Id',field: 'Id', display: 'none'},
   {template: (data) => { return data.name; }, field: 'name', header: 'Nombre', display: 'table-cell'},
   {template: (data) => { return data.description; },field: 'description', header: 'Descripción', display: 'table-cell'},
   {field: 'active', header: 'Estatus', display: 'table-cell'},
   {template: (data) => { return data.createdByUser; },field: 'createdByUser', header: 'Creado por', display: 'table-cell'},
   {template: (data) => { return data.updatedByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'}
  ];

  

  constructor(public _attributeagrupationservice: AttributeagrupationService,
     public breadcrumbService: BreadcrumbService,
     public messageService: MessageService,
     public userPermissions: UserPermissions) {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'PLM', routerLink: ['/mpc/dashboard-mpc']  },
      { label: 'Agrupaciones de atributos', routerLink: ['/masters-mpc/attributeagrupation-list'] }
    ]);
   }

  ngOnInit(): void {
    this.search();
  }
  search(){
    this.loading = true;
    //this._attributeagrupationservice.getAttributesAgrupationList(this.attributeagrupationFilters);
    this.loading = false;
    this._attributeagrupationservice.getAttributesAgrupationbyfilter(this.attributeagrupationFilters,OrderCodes.CreatedDate).subscribe((data: Attributeagrupation[]) => {
      this._attributeagrupationservice._attributeAgrupationList = data;
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando las agrupaciones de atributos"});
    });
  }
  onEdit(id: number) {
    this.attributeagrupationId = new AttributesagrupationFilter();
    this.attributeagrupationId.idAttributeAgrupation = id;
    this._attributeagrupationservice.getAttributesAgrupationbyfilter(this.attributeagrupationId,OrderCodes.CreatedDate).subscribe((data: Attributeagrupation[]) => {
      this.attributeagrupationViewModel = new AttributeAgrupation();
      this.attributeagrupationViewModel.id = data[0].id;
      this.attributeagrupationViewModel.name = data[0].name;
      this.attributeagrupationViewModel.description = data[0].description;
      this.attributeagrupationViewModel.active = data[0].active;
      this.attributeagrupationDialog = true;
    })
  }
}
