import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Panel } from 'primeng/panel';
import { Columns } from 'src/app/models/common/columns';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Attribute } from 'src/app/models/masters-mpc/attribute';
import { AttributeFilter } from '../../shared/filters/attribute-filter';
import { AttributeService } from '../../shared/services/AttributeService/attribute.service';
import { MessageService, SelectItem } from 'primeng/api';
import {AuthService} from 'src/app/modules/login/shared/auth.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { Attributeagrupation } from 'src/app/models/masters-mpc/attributeagrupation';
import { Attributetype } from 'src/app/models/masters-mpc/common/attributetype';
import { measurementunits } from 'src/app/models/masters-mpc/measurementunits';
import { Attributeoption } from 'src/app/models/masters-mpc/attributeoption';
import { MeasurementUnits } from '../../shared/view-models/measurement-units.viewmodel';
import { OrderCodes } from '../../shared/Utils/order-codes'
@Component({
  selector: 'app-attribute-list',
  templateUrl: './attribute-list.component.html',
  styleUrls: ['./attribute-list.component.scss']
})
export class AttributeListComponent implements OnInit {

  showFilters : boolean = false;
  loading : boolean = false;
  submitted: boolean;
  attributeDialog: boolean = false;
  _attributeFilters: AttributeFilter = new AttributeFilter();
  attributeModel: Attribute = new Attribute();
  idattribute: number = 0;
  permissionsIDs = {...Permissions};
  displayedColumns: ColumnD<Attribute>[] =
  [
   {template: (data) => { return data.id; }, header: 'Id',field: 'Id', display: 'none'},
   {template: (data) => { return data.name; },field: 'name', header: 'Nombre', display: 'table-cell'},
   {template: (data) => { return data.abbreviation; },field: 'abbreviation', header: 'Abreviatura', display: 'table-cell'},
   {template: (data) => { return data.attributeType.name; },field: 'attributeType.name', header: 'Tipo de atributo', display: 'table-cell'},
   {template: (data) => { return data.attributeAgrupation.name; },field: 'attributeAgrupation.name', header: 'Agrupación de atributo', display: 'table-cell'},
   {template: (data) => { return data.measurementUnit.groupingUnitofMeasure; },field: 'measurementUnits.groupingUnitofMeasure', header: 'Agrupación de unidad de medida', display: 'table-cell'},
   {template: (data) => { return data.measurementUnit.name; },field: 'measurementUnits.name', header: 'Unidad de medida', display: 'table-cell'},
   {field: 'active', header: 'Estatus', display: 'table-cell'},
   {template: (data) => { return data.createdByUser; },field: 'createdByUser', header: 'Creado por', display: 'table-cell'},
   {template: (data) => { return data.updatedByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'}
  ];

  constructor(private router: Router, 
    public _authService: AuthService, 
    public _attributeservice: AttributeService, 
    public breadcrumbService: BreadcrumbService, 
    private messageService: MessageService,
    public userPermissions: UserPermissions) { 
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'PLM', routerLink: ['/mpc/dashboard-mpc']  },
      { label: 'Atributos', routerLink: ['/masters-mpc/attribute-list'] }
    ]);
  }

  ngOnInit(): void {
    this.search();
  }

  search(){
    this.loading = true;
    this.loading = false;
    this._attributeservice.getAttributebyfilter(this._attributeFilters, OrderCodes.CreatedDate).subscribe((data: Attribute[]) => {
      this._attributeservice._AttributeList = data;
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando las asociaciones de productos"});
    });
  }
  onEdit(id: number, abbreviation: string, description: string,  name: string, idAgrupation: number, idType: number, idUnit: number, idAgrupationUnit: number, options: Attributeoption[], active: boolean) {
    this.attributeModel = new Attribute();
    this.attributeModel.id = id;
    this.attributeModel.name = name;
    this.attributeModel.abbreviation = abbreviation;
    this.attributeModel.description = description;
    this.attributeModel.attributeAgrupation = new Attributeagrupation();
    this.attributeModel.attributeAgrupation.id = idAgrupation;
    this.attributeModel.attributeType = new Attributetype();
    this.attributeModel.attributeType.id = idType;
    this.attributeModel.measurementUnit = new measurementunits();
    this.attributeModel.measurementUnit.id = idUnit;
    this.attributeModel.measurementUnit.idGroupingUnitofMeasure = idAgrupationUnit;
    this.attributeModel.attributeOptions = options;
    this.attributeModel.active = active == false ? false : true;
    this.attributeDialog = true;
  }

}
