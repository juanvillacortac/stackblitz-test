import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MessageService, SelectItem, TreeNode } from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { TaxRateFilters } from 'src/app/models/masters/tax-rate-filters';
import { TaxRate } from 'src/app/models/masters/tax-rate';
import { TaxRateService } from '../shared/tax-rate.service';

@Component({
  selector: 'app-tax-rate-list',
  templateUrl: './tax-rate-list.component.html',
  styleUrls: ['./tax-rate-list.component.scss']
})
export class TaxRateListComponent implements OnInit {
    showFilters : boolean = false;
    loading : boolean = false;
    
    submitted: boolean;
    showDialog: boolean = false;
    isCallback:boolean = false;
    taxRatesId : TaxRateFilters = new TaxRateFilters();
    taxRateFilters: TaxRateFilters = new TaxRateFilters();
    taxRate: TaxRate = new TaxRate();
    taxRateList: TaxRate[] = [];
    taxRateNotFilteredList: TaxRate[] = [];
  
    displayedColumns: ColumnD<TaxRate>[] =
    [
     {template: (data) => { return data.id; }, header: 'Id',field: 'Id', display: 'none'},
     {template: (data) => { return data.name; }, field: 'name', header: 'Nombre', display: 'table-cell'},
     {template: (data) => { return data.abbreviation; }, field: 'abbreviation', header: 'Abreviatura', display: 'table-cell'},
     {template: (data) => { return data.tax.name; }, field: 'tax.name', header: 'Impuesto', display: 'table-cell'},
     {template: (data) => { return data.value; }, field: 'value', header: 'Valor', display: 'table-cell'},
     {template: (data) => { return data.rateType.name; }, field: 'rateType.name', header: 'Tipo de tasa', display: 'table-cell'},
     {field: 'active', header: 'Estatus', display: 'table-cell'},
     {template: (data) => { return data.createdByUser; },field: 'createdByUser', header: 'Creado por', display: 'table-cell'},
     {template: (data) => { return data.updatedByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'},
     {field: 'edit', header: '', display: 'table-cell'}
    ];
  
    
    permissionsIDs = {...Permissions};
    
  
    constructor(
        private _taxRateService: TaxRateService,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public userPermissions: UserPermissions,
        private breadcrumbService: BreadcrumbService) { 
          this.breadcrumbService.setItems([
            { label: 'Configuración' },
            { label: 'Maestros Generales' },
            { label: 'Tasas de impuestos', routerLink: ['/taxrate-list'] }
        ]); 
      }
    
      ngOnInit(): void { 
        this.search();
    
      }
    
  search() {
    debugger;
        this.loading = true;
        this._taxRateService.getTaxRates(this.taxRateFilters).then(result => {
          debugger;
          this.taxRateList = result.sort((a,b) => 0 - (a.id < b.id ? -1 : 1));
         
          if(this.taxRateNotFilteredList.length === 0 || this.isCallback)
          {
            this.taxRateNotFilteredList = result;
            this.isCallback = false;
          }
          this.loading = false;
        }, (error: HttpErrorResponse)=>{
          this.loading = false;
          this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando tasas de impuesto"});
        });
      }
      openNew() {
        this.taxRate = null;
        this.showDialog = true;
      }
      onEdit(id: number) {
        debugger;
        this.taxRate = this.taxRateList.find(p=> p.id === id)
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
