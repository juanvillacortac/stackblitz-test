import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { DistrictFilters } from 'src/app/models/masters/district-filters';
import { District } from 'src/app/models/masters/district';
import { DistrictService } from '../../district/shared/services/district.service';
import { City } from 'src/app/models/masters/city';
import { CityFilters } from 'src/app/models/masters/city-filters';
import { CityService } from '../shared/services/city.service';


@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.scss']
})
export class CityListComponent implements OnInit {
  showFilters = false;
  loading = false;
  submitted: boolean;
  showDialog = false;
  isCallback = false;
  cityId: CityFilters = new CityFilters();
  cityFilters: CityFilters = new CityFilters();
  city:  City = new  City();
  cityList:  City[] = [];
  cityNotFilteredList:  City[] = [];

  displayedColumns: ColumnD< City>[] =
  [
   {template: (data) => data.id, header: 'Id', field: 'Id', display: 'none'},
   {template: (data) => data.name, field: 'name', header: 'Ciudad', display: 'table-cell'},
   {template: (data) => data.district.name, field: 'district.name', header: 'Municipio', display: 'table-cell'},
   {template: (data) =>  data.state, field: 'state', header: 'Estado', display: 'table-cell'},
   {template: (data) => data.country, field: 'country', header: 'País', display: 'table-cell'},
   {template: (data) => data.abbreviation, field: 'abbreviation', header: 'Abreviatura', display: 'table-cell'},
   {field: 'active', header: 'Estatus', display: 'table-cell'},
   {template: (data) => data.createdByUser, field: 'createdByUser', header: 'Creado por', display: 'table-cell'},
   {template: (data) => data.updatedByUser, field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'},
   {field: 'edit', header: '', display: 'table-cell'}
  ];

  permissionsIDs = {...Permissions};

  constructor(
      private _cityFiltersService: CityService,
      private _districtFiltersService: DistrictService,
      private formBuilder: FormBuilder,
      private messageService: MessageService,
      private confirmationService: ConfirmationService,
      public userPermissions: UserPermissions,
      private breadcrumbService: BreadcrumbService) {
        this.breadcrumbService.setItems([
          { label: 'Configuración' },
          { label: 'Maestros generales' },
          { label: 'Ciudades/Sectores', routerLink: ['/city-list'] }
      ]);
    }

    ngOnInit(): void {
      this.search();
    }

    search() {
      this.loading = true;
      this._cityFiltersService.getCityListPromise(this.cityFilters).then(result => {
        this.cityList = result;
        if ( this.cityNotFilteredList.length === 0 || this.isCallback) {
          this.cityNotFilteredList = result;
          this.isCallback = false;
        }
        this.loading = false;
      }, (error: HttpErrorResponse) => {
        this.loading = false;
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error cargando las ciudades'});
      });
    }
    openNew() {
      this.city = null;
      this.showDialog = true;
    }
    onEdit(id: number) {

      this.city = this.cityList.find(p => p.id === id);
      this.showDialog = true;
    }
    public childCallBack(reload: boolean): void {
      this.showDialog = false;
      if (reload) {
        this.isCallback = true;
        this.search();
      }
  }
}
