import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Panel } from 'primeng/panel';
import { Columns } from 'src/app/models/common/columns';
import { ColumnD } from 'src/app/models/common/columnsd';
import { groupingunitmeasure } from 'src/app/models/masters-mpc/groupingunitmeasure';
import { GroupingunitmeasureFilter } from '../../shared/filters/groupingunitmeasure-filter';
import { GroupingunitmeasureService } from '../../shared/services/GroupingUnitMeasureService/groupingunitmeasure.service';
import { GroupingUnitMeasure } from '../../shared/view-models/grouping-unit-measure.viewmodel';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions'; 
import { OrderCodes } from '../../shared/Utils/order-codes';
@Component({
  selector: 'app-groupingunitmeasure',
  templateUrl: './groupingunitmeasure.component.html',
  styleUrls: ['./groupingunitmeasure.component.scss']
})
export class GroupingunitmeasureComponent implements OnInit {

  showFilters: boolean = false;
  loading: boolean = false;
  permissionsIDs = {...Permissions};
  submitted: boolean;
  groupingunitmeasureDialog: boolean = false;
  groupingunitmeasureId: GroupingunitmeasureFilter = new GroupingunitmeasureFilter();
  groupingunitmeasureFilters: GroupingunitmeasureFilter = new GroupingunitmeasureFilter();
  groupingunitmeasureViewModel: GroupingUnitMeasure = new GroupingUnitMeasure();
  StatusEdit: any = {};

  displayedColumns: ColumnD<GroupingUnitMeasure>[] =
    [
      { template: (data) => { return data.id; }, header: 'Id', field: 'id', display: 'none' },
      { template: (data) => { return data.name; }, header: 'Nombre', field: 'name', display: 'table-cell' },
      { template: (data) => { return data.abbreviation; }, header: 'Abreviatura', field: 'abbreviation', display: 'table-cell' },
      { field: 'active', header: 'Estatus', display: 'table-cell' },
      { template: (data) => { return data.createdByUser; }, header: 'Creado por', field: 'createdByUser', display: 'table-cell' },
      { template: (data) => { return data.updatedByUser; }, header: 'Actualizado por', field: 'updatedByUser', display: 'table-cell' }
    ];



  constructor(public _groupingunitmeasureservice: GroupingunitmeasureService, public breadcrumbService: BreadcrumbService, public userPermissions: UserPermissions) {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'PLM', routerLink: ['/mpc/dashboard-mpc']  },
      { label: 'Agrupaciones de unidades de medidas', routerLink: ['/masters-mpc/groupingunitmeasure'] }
    ]);
  }

  ngOnInit(): void {
    this.search();
  }
  search() {
    this.loading = true;
    //this._groupingunitmeasureservice.getGroupingUnitMeasureList(this.attributeagrupationFilters);
    this.loading = false;
    this._groupingunitmeasureservice.getGroupingUnitMeasurebyfilter(this.groupingunitmeasureFilters, OrderCodes.CreatedDate).subscribe((data: groupingunitmeasure[]) => {
      this._groupingunitmeasureservice._groupingUnitMeasureList = data;
      this.loading = false;
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      alert("Ha ocurrido un error cargando las agrupaciones de unidades de medida");
    });
  }
  onEdit(id: number, name: string, abbreviation: string, activeUnitMeasure: number, active: boolean) {
    this.groupingunitmeasureViewModel = new GroupingUnitMeasure();
    this.groupingunitmeasureViewModel.id = id;
    this.groupingunitmeasureViewModel.name = name;
    this.groupingunitmeasureViewModel.abbreviation = abbreviation;
    this.groupingunitmeasureViewModel.activeUnitMeasure = activeUnitMeasure;
    this.groupingunitmeasureViewModel.active = active;
    this.StatusEdit = active;
    this.groupingunitmeasureDialog = true;
  }
}
