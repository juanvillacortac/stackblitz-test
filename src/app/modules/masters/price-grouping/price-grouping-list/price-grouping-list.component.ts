import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { priceGrouping } from 'src/app/models/masters/price-grouping';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { PriceGroupingFilter } from '../shared/filters/pricegrouping-filter';
import { PriceGroupingService } from '../shared/service/price-grouping.service';
import * as Permissions from '../../../security/users/shared/user-const-permissions';


@Component({
  selector: 'app-price-grouping-list',
  templateUrl: './price-grouping-list.component.html',
  styleUrls: ['./price-grouping-list.component.scss']
})
export class PriceGroupingListComponent implements OnInit {

  loading: boolean = false
  showFilters: boolean = false
  showDialog: boolean = false
  pricegroupinghowDialog: boolean = false;
  _pricegroupingViewModel: priceGrouping=new priceGrouping();
  permissions: number[] = [];
  permissionsIDs = {...Permissions};
  _status:boolean=true;
  pricegroupingFilter: PriceGroupingFilter = new PriceGroupingFilter();
  
  displayedColumns: ColumnD<priceGrouping>[] =
    [
      { template: (data) => { return data.id; }, header: 'Id', display: 'none',field:'id' },
      { template: (data) => { return data.name; }, header: 'Agrupación de precio', display: 'table-cell',field: 'name' }, 
      { template: (data) => { return data.abbreviation; }, header: 'Abreviatura', display: 'table-cell',field: 'abbreviation' },
      { field: 'active', header: 'Estatus', display: 'table-cell' },
      { template: (data) => { return data.createdByUser; }, header: 'Creado por', display: 'table-cell',field: 'createdByUser' },
      { template: (data) => { return data.updateByUser; }, header: 'Actualizado por', display: 'table-cell',field: 'updateByUser' }
    ];
  constructor(public _pricegroupingService: PriceGroupingService,private breadcrumbService: BreadcrumbService,private messageService: MessageService,public userPermissions: UserPermissions) {
    this.breadcrumbService.setItems([
      { label: 'Configuración' },
      { label: 'Maestros generales' },
      { label: 'Agrupaciones de precios', routerLink: ['/pricegrouping-list'] }
    ]);
   }
    
  ngOnInit(): void {
    this.search();
  }
  search() { 
    this.loading = true;
    this._pricegroupingService.getPriceGroupingList(this.pricegroupingFilter).subscribe((data: priceGrouping[]) => {
      this._pricegroupingService._pricegroupingList = data;
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
    });
  }
  Edit(pricegrouping:priceGrouping) {
    this._pricegroupingViewModel=new priceGrouping();
    this._pricegroupingViewModel.id=pricegrouping.id;
    this._pricegroupingViewModel.name=pricegrouping.name;
    this._pricegroupingViewModel.abbreviation=pricegrouping.abbreviation;
    this._pricegroupingViewModel.active=pricegrouping.active;
    this.pricegroupinghowDialog = true; 
    this._status=pricegrouping.active;   
  }
}
