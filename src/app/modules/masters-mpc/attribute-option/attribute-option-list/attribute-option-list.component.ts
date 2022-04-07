import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Panel } from 'primeng/panel';
import { Columns } from 'src/app/models/common/columns';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Attributeoption } from 'src/app/models/masters-mpc/attributeoption';
import { AttributeoptionFilter } from '../../shared/filters/attributeoption-filter';
import { AttributeoptionService } from '../../shared/services/AttributeOptionService/attributeoption.service';
import { MessageService, SelectItem } from 'primeng/api';
import {AuthService} from 'src/app/modules/login/shared/auth.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { Attributeagrupation } from 'src/app/models/masters-mpc/attributeagrupation';
import { measurementunits } from 'src/app/models/masters-mpc/measurementunits';
import { MeasurementUnits } from '../../shared/view-models/measurement-units.viewmodel';
import { OrderCodes } from '../../shared/Utils/order-codes';

@Component({
  selector: 'app-attribute-option-list',
  templateUrl: './attribute-option-list.component.html',
  styleUrls: ['./attribute-option-list.component.scss']
})
export class AttributeOptionListComponent implements OnInit {

  showFilters : boolean = false;
  loading : boolean = false;
  submitted: boolean;
  attributeoptionDialog: boolean = false;
  _attributeoptionFilters: AttributeoptionFilter = new AttributeoptionFilter();
  attributeoptionModel: Attributeoption = new Attributeoption();
  idattributeoption: number = 0;
  permissionsIDs = {...Permissions};
  displayedColumns: ColumnD<Attributeoption>[] =
  [
   {template: (data) => { return data.id; }, header: 'Id',field: 'id', display: 'none'},
   {template: (data) => { return data.name; },field: 'name', header: 'Valor', display: 'table-cell'},
   {template: (data) => { return data.abbreviation; },field: 'abbreviation', header: 'Abreviatura', display: 'table-cell'},
   {template: (data) => { return data.attributeAgrupation.name; },field: 'attributeAgrupation.name', header: 'Agrupación de atributo', display: 'table-cell'},
   {template: (data) => { return data.measurementUnit.groupingUnitofMeasure; },field: 'measurementUnit.groupingUnitofMeasure', header: 'Agrupación de unidad de medida', display: 'table-cell'},
   {template: (data) => { return data.measurementUnit.name; },field: 'measurementUnit.name', header: 'Unidad de medida', display: 'table-cell'},
   {field: 'active', header: 'Estatus', display: 'table-cell'},
   {template: (data) => { return data.createdByUser; },field: 'createdByUser', header: 'Creado por', display: 'table-cell'},
   {template: (data) => { return data.updatedByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'}
  ];

  constructor(private router: Router, 
    public _authService: AuthService, 
    public _attributeoptionservice: AttributeoptionService, 
    public breadcrumbService: BreadcrumbService, 
    private messageService: MessageService,
    public userPermissions: UserPermissions) { 
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'PLM', routerLink: ['/mpc/dashboard-mpc']  },
      { label: 'Opciones de atributos', routerLink: ['/masters-mpc/attribute-option-list'] }
    ]);
  }

  ngOnInit(): void {
    this.search();
  }

  search(){
    this.loading = true;
    this.loading = false;
    this._attributeoptionservice.getAttributeoptionbyfilter(this._attributeoptionFilters, OrderCodes.CreatedDate).subscribe((data: Attributeoption[]) => {
      this._attributeoptionservice._AttributeoptionList = data;
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando las opciones de atributos"});
    });
  }
  onEdit(id: number, name: string, abbreviation: string, idAgrupation: number, idUnit: number, idGroupingUnit: number, active: boolean) {
    this.attributeoptionModel = new Attributeoption();
    this.attributeoptionModel.id = id;
    this.attributeoptionModel.name = name;
    this.attributeoptionModel.abbreviation = abbreviation;
    this.attributeoptionModel.attributeAgrupation = new Attributeagrupation();
    this.attributeoptionModel.attributeAgrupation.id = idAgrupation;
    this.attributeoptionModel.measurementUnit = new measurementunits();
    this.attributeoptionModel.measurementUnit.id = idUnit;
    this.attributeoptionModel.measurementUnit.idGroupingUnitofMeasure = idGroupingUnit;
    this.attributeoptionModel.active = active == false ? false : true;
    this.attributeoptionDialog = true;
  }

}
