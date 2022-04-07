import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { MessageService} from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';

import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { TaxService } from '../shared/tax.service';
import { TaxFilters } from 'src/app/models/masters/tax-filters';
import { Tax } from 'src/app/models/masters/tax';

@Component({
  selector: 'app-tax-list',
  templateUrl: './tax-list.component.html',
  styleUrls: ['./tax-list.component.scss']
})
export class TaxListComponent implements OnInit {
    showFilters : boolean = false;
    loading : boolean = false;
    
    submitted: boolean;
    showDialog: boolean = false;
    isCallback:boolean = false;
    taxeId : TaxFilters = new TaxFilters();
    taxFilters: TaxFilters = new TaxFilters();
    tax: Tax = new Tax();
    taxList: Tax[] = [];
    taxNotFilteredList: Tax[] = [];
  
    displayedColumns: ColumnD<Tax>[] =
    [
     {template: (data) => { return data.id; }, header: 'Id',field: 'Id', display: 'none'},
     {template: (data) => { return data.name; }, field: 'name', header: 'Nombre', display: 'table-cell'},
     {template: (data) => { return data.abbreviation; }, field: 'abbreviation', header: 'Abreviatura', display: 'table-cell'},
     {template: (data) => { return data.country.name; }, field: 'country.name', header: 'País', display: 'table-cell'},
     {field: 'taxeTypeApplication', header: 'Tipo de aplicación', display: 'table-cell'},
     {field: 'active', header: 'Estatus', display: 'table-cell'},
     {template: (data) => { return data.createdByUser; },field: 'createdByUser', header: 'Creado por', display: 'table-cell'},
     {template: (data) => { return data.updatedByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'},
     {field: 'edit', header: '', display: 'table-cell'}
    ];
  
    
    permissionsIDs = {...Permissions};
    
  
    constructor(
        private _taxService: TaxService,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public userPermissions: UserPermissions,
        private breadcrumbService: BreadcrumbService) { 
          this.breadcrumbService.setItems([
            { label: 'Configuración' },
            { label: 'Maestros generales' },
            { label: 'Impuestos', routerLink: ['/taxes-list'] }
        ]); 
      }
    
      ngOnInit(): void { 
        this.search();
    
      }
    
      search(){
        this.loading = true;
        this._taxService.getTaxes(this.taxFilters).then(result => {
          debugger;
          this.taxList = result.sort((a,b) => 0 - (a.id < b.id ? -1 : 1));
          debugger;
          if(this.taxNotFilteredList.length === 0 || this.isCallback)
          {
            this.taxNotFilteredList = result;
            this.isCallback = false;
          }
          this.loading = false;
        }, (error: HttpErrorResponse)=>{
          this.loading = false;
          this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando impuesto"});
        });
      }
      openNew() {
        this.tax = null;
        this.showDialog = true;
      }
      onEdit(id: number) {
    
        this.tax = this.taxList.find(p=> p.id === id)
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
