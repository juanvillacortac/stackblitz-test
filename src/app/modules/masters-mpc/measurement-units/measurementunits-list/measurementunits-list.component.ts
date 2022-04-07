import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { measurementunits } from 'src/app/models/masters-mpc/measurementunits';
import { MeasurementunitsFilter } from '../../shared/filters/measurementunits-filter';
import { MeasurementunitsService } from '../../shared/services/measurementunits.service';
import { MeasurementUnits } from '../../shared/view-models/measurement-units.viewmodel';
import { MessageService, SelectItem } from 'primeng/api';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';


@Component({
  selector: 'app-measurementunits-list',
  templateUrl: './measurementunits-list.component.html',
  styleUrls: ['./measurementunits-list.component.scss']
})
export class MeasurementunitsListComponent implements OnInit {

  showFilters : boolean = false;
  loading : boolean = false;
  submitted: boolean;
  measurementunitsDialog: boolean = false;
  measurementunitsFilters: MeasurementunitsFilter = new MeasurementunitsFilter();
  measurementunitsViewModel: measurementunits = new measurementunits();
  idMeasurementUnit: number = 0;
  measurementunitsId : MeasurementunitsFilter = new MeasurementunitsFilter();
  permissionsIDs = {...Permissions};
  displayedColumns: ColumnD<MeasurementUnits>[] =
  [
   {template: (data) => { return data.id; }, header: 'Id', field:'Id', display: 'none'},
   {template: (data) => { return data.name; },field: 'name', header: 'Nombre', display: 'table-cell'},
   {template: (data) => { return data.abbreviation; },field: 'abbreviation', header: 'Abreviatura', display: 'table-cell'},
   {template: (data) => { return data.groupingUnitofMeasure.name; },field: 'groupingUnitofMeasure.name', header: 'Agrupación de unidad de medida', display: 'table-cell'},
   {field: 'active', header: 'Estatus', display: 'table-cell'},
   {template: (data) => { return data.createdByUser; },field: 'createdByUser', header: 'Creado por', display: 'table-cell'},
   {template: (data) => { return data.updatedByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'}
  ];

  constructor(public _measurementunitsservice: MeasurementunitsService,
    public breadcrumbService: BreadcrumbService,
    private messageService: MessageService,
    public userPermissions: UserPermissions) {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'MPC' },
      { label: 'Unidades de medida', routerLink: ['masters/measurementunits-list'] }
    ]);
   }

  ngOnInit(): void {
    this.search();
  }

  search(){
    this.loading = true;
    this.loading = false;
    this._measurementunitsservice.getMeasurementUnitsbyfilter(this.measurementunitsFilters).subscribe((data: measurementunits[]) => {
      this._measurementunitsservice._measurementUnitsList = data.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando las unidades de medida"});
    });
  }
  onEdit(id: number, name: string, abbreviation: string, idGroupingUnitofMeasure: number, active: boolean, activeGroupingUnitofMeasure: boolean) {
    this.measurementunitsViewModel = new measurementunits();
    this.measurementunitsViewModel.id = id;
    this.measurementunitsViewModel.name = name;
    this.measurementunitsViewModel.abbreviation = abbreviation;
    this.measurementunitsViewModel.idGroupingUnitofMeasure = idGroupingUnitofMeasure;
    this.measurementunitsViewModel.active = active == false ? false : true;
    this.measurementunitsDialog = true;
    this.measurementunitsViewModel.activeGroupingUnitofMeasure = activeGroupingUnitofMeasure;
  }
}
