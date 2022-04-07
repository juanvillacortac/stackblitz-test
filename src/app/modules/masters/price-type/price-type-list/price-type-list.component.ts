import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MessageService, SelectItem, TreeNode } from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { PriceTypeFilters } from 'src/app/models/masters/price-type-filters';
import { PriceType } from 'src/app/models/masters/price-type';
import { PriceTypeService } from '../shared/price-type.service';

@Component({
  selector: 'app-price-type-list',
  templateUrl: './price-type-list.component.html',
  styleUrls: ['./price-type-list.component.scss']
})
export class PriceTypeListComponent implements OnInit {
    showFilters : boolean = false;
    loading : boolean = false;
    
    submitted: boolean;
    showDialog: boolean = false;
    isCallback:boolean = false;
    priceTypeId : PriceTypeFilters = new PriceTypeFilters();
    priceTypeFilters: PriceTypeFilters = new PriceTypeFilters();
    priceType: PriceType = new PriceType();
    priceTypeList: PriceType[] = [];
    priceTypeNotFilteredList: PriceType[] = [];
  
    displayedColumns: ColumnD<PriceType>[] =
    [
     {template: (data) => { return data.id; }, header: 'Id',field: 'Id', display: 'none'},
     {template: (data) => { return data.name; }, field: 'name', header: 'Nombre', display: 'table-cell'},
     {template: (data) => { return data.abbreviation; }, field: 'abbreviation', header: 'Abreviatura', display: 'table-cell'},
     {template: (data) => { return data.pricesGrouping.name; }, field: 'pricesGrouping.name', header: 'Agrupación de precio', display: 'table-cell'},
     {template: (data) => { return data.country.name; }, field: 'country.name', header: 'País', display: 'table-cell'},   
     {field: 'active', header: 'Estatus', display: 'table-cell'},
     {template: (data) => { return data.createdByUser; },field: 'createdByUser', header: 'Creado por', display: 'table-cell'},
     {template: (data) => { return data.updatedByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'},
     {field: 'edit', header: '', display: 'table-cell'}
    ];
  
    
    permissionsIDs = {...Permissions};
    
  
    constructor(
        private _priceTypeService: PriceTypeService,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public userPermissions: UserPermissions,
        private breadcrumbService: BreadcrumbService) { 
          this.breadcrumbService.setItems([
            { label: 'Configuración' },
            { label: 'Maestros generales' },
            { label: 'Tipos de precios', routerLink: ['/pricetype-list'] }
        ]); 
      }
    
      ngOnInit(): void { 
        this.search();
    
      }
    
      search(){
        this.loading = true;
        this._priceTypeService.getPriceTypes(this.priceTypeFilters).then(result => {
          this.priceTypeList = result;
          if(this.priceTypeNotFilteredList.length === 0 || this.isCallback)
          {
            this.priceTypeNotFilteredList = result;
            this.isCallback = false;
          }
          this.loading = false;
        }, (error: HttpErrorResponse)=>{
          this.loading = false;
          this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando tipos de precios"});
        });
      }
      openNew() {
        this.priceType = null;
        this.showDialog = true;
      }
      onEdit(id: number) {
    
        this.priceType = this.priceTypeList.find(p=> p.id === id)
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
    