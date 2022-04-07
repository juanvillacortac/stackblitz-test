import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MessageService, SelectItem, TreeNode } from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { TaxeTypeApplication } from 'src/app/models/masters/taxe-type-application';
import { TaxeTypeApplicationFilters } from 'src/app/models/masters/taxe-type-application-filters';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { SecurityService } from 'src/app/modules/security/shared/services/security.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { TaxeTypeApplicationService } from '../shared/taxe-type-application.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'app-taxe-type-application-list',
  templateUrl: './taxe-type-application-list.component.html',
  styleUrls: ['./taxe-type-application-list.component.scss']
})
export class TaxeTypeApplicationListComponent implements OnInit {
    showFilters : boolean = false;
    loading : boolean = false;
    
    submitted: boolean;
    showDialog: boolean = false;
    isCallback:boolean = false;
    taxeTypeApplicationsId : TaxeTypeApplicationFilters = new TaxeTypeApplicationFilters();
    taxeTypeApplicationFilters: TaxeTypeApplicationFilters = new TaxeTypeApplicationFilters();
    taxeTypeApplication: TaxeTypeApplication = new TaxeTypeApplication();
    taxeTypeApplicationList: TaxeTypeApplication[] = [];
    taxeTypeApplicationNotFilteredList: TaxeTypeApplication[] = [];
  
    displayedColumns: ColumnD<TaxeTypeApplication>[] =
    [
     {template: (data) => { return data.id; }, header: 'Id',field: 'Id', display: 'none'},
     {template: (data) => { return data.name; }, field: 'name', header: 'Nombre', display: 'table-cell'},
     {template: (data) => { return data.abbreviation; }, field: 'abbreviation', header: 'Abreviatura', display: 'table-cell'},
     {field: 'active', header: 'Estatus', display: 'table-cell'},
     {template: (data) => { return data.createdByUser; },field: 'createdByUser', header: 'Creado por', display: 'table-cell'},
     {template: (data) => { return data.updatedByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'},
     {field: 'edit', header: '', display: 'table-cell'}
    ];
  
    
    permissionsIDs = {...Permissions};
    
  
    constructor(
        private _taxeTypeApplicationService: TaxeTypeApplicationService,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public userPermissions: UserPermissions,
        private breadcrumbService: BreadcrumbService) { 
          this.breadcrumbService.setItems([
            { label: 'Configuración' },
            { label: 'Maestros generales' },
            { label: 'Tipo aplicación de impuestos', routerLink: ['/taxetypeapplication-list'] }
        ]); 
      }
    
      ngOnInit(): void { 
        this.search();
    
      }
    
      search(){
        this.loading = true;
        this._taxeTypeApplicationService.getTaxeTypeApplications(this.taxeTypeApplicationFilters).then(result => {
          this.taxeTypeApplicationList = result;
          if(this.taxeTypeApplicationNotFilteredList.length === 0 || this.isCallback)
          {
            this.taxeTypeApplicationNotFilteredList = result;
            this.isCallback = false;
          }
          this.loading = false;
        }, (error: HttpErrorResponse)=>{
          this.loading = false;
          this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando tipos de aplicacion de impuesto"});
        });
      }
      openNew() {
        this.taxeTypeApplication = null;
        this.showDialog = true;
      }
      onEdit(id: number) {
    
        this.taxeTypeApplication = this.taxeTypeApplicationList.find(p=> p.id === id)
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
    