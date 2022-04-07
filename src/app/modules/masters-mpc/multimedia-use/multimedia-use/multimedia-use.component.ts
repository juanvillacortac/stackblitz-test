import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Panel } from 'primeng/panel';
import { Columns } from 'src/app/models/common/columns';
import { ColumnD } from 'src/app/models/common/columnsd';
import { multimediause } from 'src/app/models/masters-mpc/multimediause';
import { MultimediauseFilter } from '../../shared/filters/multimediause-filter';
import { MultimediauseService } from '../../shared/services/MultimediaUse/multimediause.service';
import { MultimediaUse } from '../../shared/view-models/multimedia-use.viewmodel';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions'; 
@Component({
  selector: 'app-multimedia-use',
  templateUrl: './multimedia-use.component.html',
  styleUrls: ['./multimedia-use.component.scss']
})
export class MultimediaUseComponent implements OnInit {

  showFilters: boolean = false;
  loading: boolean = false;
  permissionsIDs = {...Permissions};
  submitted: boolean;
  multimediauseDialog: boolean = false;
  multimediauseId: MultimediauseFilter = new MultimediauseFilter();
  multimediauseFilters: MultimediauseFilter = new MultimediauseFilter();
  multimediauseViewModel: MultimediaUse = new MultimediaUse();
  StatusEdit: any = {};

  displayedColumns: ColumnD<MultimediaUse>[] =
    [
      { template: (data) => { return data.id; }, header: 'Id', field: 'id', display: 'none' },
      { template: (data) => { return data.name; }, header: 'Nombre', field: 'name', display: 'table-cell' },
      { template: (data) => { return data.description; }, header: 'Descripción', field: 'description', display: 'table-cell' },
      /* { template: (data) => { return data.maxAmount; }, header: 'Cantidad Maxima', field: 'maxAmount', display: 'table-cell' }, */
      { template: (data) => { return data.color; }, header: 'Color', field: 'color', display: 'table-cell' },
      { field: 'active', header: 'Estatus', display: 'table-cell' },
      { template: (data) => { return data.createdByUser; }, header: 'Creado por', field: 'createdByUser', display: 'table-cell' },
      { template: (data) => { return data.updatedByUser; }, header: 'Actualizado por', field: 'updatedByUser', display: 'table-cell' }
    ];



  constructor(public _multimediauseservice: MultimediauseService, public breadcrumbService: BreadcrumbService, public userPermissions: UserPermissions) {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'MPC' },
      { label: 'Maestros' },
      { label: 'Usos de multimedia', routerLink: ['/multimediause'] }
    ]);
  }

  ngOnInit(): void {
    this.search();
  }
  search() {
    this.loading = true;
    //this._multimediauseservice.getGMultimediaUseList(this.multimediauseFilters);
    this.loading = false;
    this._multimediauseservice.getMultimediaUsebyfilter(this.multimediauseFilters).subscribe((data: multimediause[]) => {
      this._multimediauseservice._multimediaUseList = data;
      this._multimediauseservice._multimediaUseList = data.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
      this.loading = false;
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      alert("Ha ocurrido un error cargando las agrupaciones de unidades de medida");
    });
  }
  onEdit(id: number, name: string, description: string, max: number, active: boolean, color: string) {
    this.multimediauseViewModel = new MultimediaUse();
    this.multimediauseViewModel.id = id;
    this.multimediauseViewModel.name = name;
    this.multimediauseViewModel.description = description;
    this.multimediauseViewModel.maxAmount = max;
    this.multimediauseViewModel.active = active;
    this.multimediauseViewModel.color = color;
    this.StatusEdit = active == true ? { name: 'Activo', code: '1' } : { name: 'Inactivo', code: '0' };
    this.multimediauseDialog = true;
  }

}
