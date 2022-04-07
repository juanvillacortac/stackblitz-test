import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Panel } from 'primeng/panel';
import { Columns } from 'src/app/models/common/columns';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Gtintype } from 'src/app/models/masters-mpc/gtintype';
import { GtintypeFilter } from '../../shared/filters/gtintype-filter';
import { GtintypeService } from '../../shared/services/GtinType/gtintype.service';
import { Gtingrouping } from '../../../../models/masters-mpc/common/gtingrouping';
import {​​​​​​​​ UserPermissions }​​​​​​​​ from'src/app/modules/security/users/shared/user-permissions.service';
import*as Permissions from'src/app/modules/security/users/shared/user-const-permissions'; 
import { isDataSource } from '@angular/cdk/collections';


@Component({
  selector: 'app-gtintype',
  templateUrl: './gtintype.component.html',
  styleUrls: ['./gtintype.component.scss']
})
export class GtintypeComponent implements OnInit {

  showFilters: boolean = false; 
  loading: boolean = false;
  permissionsIDs = {...Permissions};
  submitted: boolean;
  gtintypeDialog: boolean = false;
  gtintypeId: GtintypeFilter = new GtintypeFilter();
  gtintypeFilters: GtintypeFilter = new GtintypeFilter();
  gtintypeViewModel: Gtintype = new Gtintype();

  displayedColumns: ColumnD<Gtintype>[] =
    [
      { template: (data) => { return data.id; }, header: 'Id', field: 'id', display: 'none' },
      { template: (data) => { return data.name; }, header: 'Nombre', field: 'name', display: 'table-cell' },
      { template: (data) => { return data.abbreviation; }, header: 'Abreviatura', field: 'abbreviation', display: 'table-cell' },
      { template: (data) => { return data.digitAmount; }, header: 'Cantidad de dígitos', field: 'digitAmount', display: 'table-cell' },
      { template: (data) => { return data.alphanumeric ? "Si" : "No"; }, header: 'Alfanumérico', field: 'alphanumeric', display: 'table-cell' },
      { template: (data) => { return data.checkDigit ? "Si" : "No"; }, header: 'Dígito verificador', field: 'checkDigit', display: 'table-cell' },
      { template: (data) => { return data.gtinGrouping.name; }, header: 'Agrupación', field: 'gtinGrouping.name', display: 'table-cell' },
      { field: 'active', header: 'Estatus', display: 'table-cell' },
      { template: (data) => { return data.createdByUser; }, header: 'Creado por', field: 'createdByUser', display: 'table-cell' },
      { template: (data) => { return data.updatedByUser; }, header: 'Actualizado por', field: 'updatedByUser', display: 'table-cell' }
    ];



  constructor(public _gtintypeservice: GtintypeService, public breadcrumbService: BreadcrumbService, public userPermissions: UserPermissions) {
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'MPC' },
      { label: 'Tipos de GTIN', routerLink: ['/master-mpc/gtintype'] }
    ]);
  }

  ngOnInit(): void {
    this.search();
  }
  search() {
    this.loading = true;
    //this._multimediauseservice.getGMultimediaUseList(this.multimediauseFilters);
    this.loading = false;
    this._gtintypeservice.getGtinTypebyfilter(this.gtintypeFilters).subscribe((data: Gtintype[]) => {
      this._gtintypeservice._gtinTypeList = data;
      this._gtintypeservice._gtinTypeList = data.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
      this.loading = false;
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      alert("Ha ocurrido un error cargando los tipo gtin");
    });
  }
  onEdit(id: number, name: string, abbreviation: string, digit: number, alpha: boolean, checkDigit: boolean, idGtinGrouping: number, active: boolean) {
    this.gtintypeViewModel = new Gtintype();
    this.gtintypeViewModel.id = id;
    this.gtintypeViewModel.name = name;
    this.gtintypeViewModel.abbreviation = abbreviation;
    this.gtintypeViewModel.digitAmount = digit;
    this.gtintypeViewModel.alphanumeric = alpha;
    this.gtintypeViewModel.checkDigit = checkDigit;
    this.gtintypeViewModel.gtinGrouping = new Gtingrouping();
    this.gtintypeViewModel.gtinGrouping.id = idGtinGrouping;
    this.gtintypeViewModel.active = active;
    this.gtintypeDialog = true;
    
  }

}
