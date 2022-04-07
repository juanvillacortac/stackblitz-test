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
import { DistrictService } from '../shared/services/district.service';

@Component({
  selector: 'app-district-list',
  templateUrl: './district-list.component.html',
  styleUrls: ['./district-list.component.scss']
})
export class DistrictListComponent implements OnInit {
  showFilters : boolean = false;
  loading : boolean = false;
  
  submitted: boolean;
  showDialog: boolean = false;
  isCallback:boolean = false;
  districtId : DistrictFilters = new DistrictFilters();
  districtFilters: DistrictFilters = new DistrictFilters();
  district:  District = new  District();
  districtList:  District[] = [];
  districtNotFilteredList:  District[] = [];

  displayedColumns: ColumnD< District>[] =
  [
   {template: (data) => { return data.id; }, header: 'Id',field: 'Id', display: 'none'},
   {template: (data) => { return data.name; }, field: 'name', header: 'Municipio', display: 'table-cell'},
   {template: (data) => { return data.state.name; }, field: 'state.name', header: 'Estado', display: 'table-cell'},
   {template: (data) => { return data.country.name; }, field: 'country.name', header: 'País', display: 'table-cell'},
   {template: (data) => { return data.abbreviation; }, field: 'abbreviation', header: 'Abreviatura', display: 'table-cell'},
   {field: 'active', header: 'Estatus', display: 'table-cell'},
   {template: (data) => { return data.createdByUser; },field: 'createdByUser', header: 'Creado por', display: 'table-cell'},
   {template: (data) => { return data.updatedByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'},
   {field: 'edit', header: '', display: 'table-cell'}
  ];

  
  permissionsIDs = {...Permissions};
  

  constructor(
      private _districtFiltersService: DistrictService,
      private formBuilder: FormBuilder,
      private messageService: MessageService,
      private confirmationService: ConfirmationService,
      public userPermissions: UserPermissions,
      private breadcrumbService: BreadcrumbService) { 
        this.breadcrumbService.setItems([
          { label: 'Configuración' },
          { label: 'Maestros generales' },
          { label: 'Municipios', routerLink: ['/district-list'] }
      ]); 
    }
  
    ngOnInit(): void { 
      this.search();
  
    }
  
    search(){
      this.loading = true;
      this._districtFiltersService.getDistrictListPromise(this.districtFilters).then(result => {
        this.districtList = result;
        if(this.districtNotFilteredList.length === 0 || this.isCallback)
        {
          this.districtNotFilteredList = result;
          this.isCallback = false;
        }
        this.loading = false;
      }, (error: HttpErrorResponse)=>{
        this.loading = false;
        this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los municipios"});
      });
    }
    openNew() {
      this.district = null;
      this.showDialog = true;
    }
    onEdit(id: number) {
  
      this.district = this.districtList.find(p=> p.id === id)
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
  