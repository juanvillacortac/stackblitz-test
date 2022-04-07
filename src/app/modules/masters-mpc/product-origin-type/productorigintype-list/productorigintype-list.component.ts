import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Panel } from 'primeng/panel';
import { Columns } from 'src/app/models/common/columns';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Productorigintype } from 'src/app/models/masters-mpc/productorigintype';
import { ProductorigintypeFilter } from '../../shared/filters/productorigintype-filter';
import { ProductorigintypeService } from '../../shared/services/ProductOriginType/productorigintype.service';
import { MessageService, SelectItem } from 'primeng/api';
import {AuthService} from 'src/app/modules/login/shared/auth.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';


@Component({
  selector: 'app-productorigintype-list',
  templateUrl: './productorigintype-list.component.html',
  styleUrls: ['./productorigintype-list.component.scss']
})
export class ProductorigintypeListComponent implements OnInit {

  showFilters : boolean = false;
  loading : boolean = false;
  submitted: boolean;
  productorigintypeDialog: boolean = false;
  _productorigintypeFilters: ProductorigintypeFilter = new ProductorigintypeFilter();
  productorigintypeModel: Productorigintype = new Productorigintype();
  idproductorigintype: number = 0;
  permissionsIDs = {...Permissions};
  displayedColumns: ColumnD<Productorigintype>[] =
  [
   {template: (data) => { return data.id; }, header: 'Id',field: 'Id', display: 'none'},
   {template: (data) => { return data.name; },field: 'name', header: 'Nombre', display: 'table-cell'},
   {field: 'active', header: 'Estatus', display: 'table-cell'},
   {template: (data) => { return data.createdByUser; },field: 'createdByUser', header: 'Creado por', display: 'table-cell'},
   {template: (data) => { return data.updatedByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'}
  ];

  constructor(private router: Router, 
    public _authService: AuthService, 
    public _productorigintypeservice: ProductorigintypeService, 
    public breadcrumbService: BreadcrumbService, 
    private messageService: MessageService,
    public userPermissions: UserPermissions) { 
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'PLM', routerLink: ['/mpc/dashboard-mpc']  },
      { label: 'Tipos de origen', routerLink: ['/masters-mpc/productorigintype-list'] }
    ]);
  }

  ngOnInit(): void {
    this.search();
  }

  search(){
    this.loading = true;
    //this._attributeagrupationservice.getAttributesAgrupationList(this.attributeagrupationFilters);
    this.loading = false;
    this._productorigintypeservice.getProductorigintypebyfilter(this._productorigintypeFilters).subscribe((data: Productorigintype[]) => {
      this._productorigintypeservice._ProductorigintypeList = data.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los tipos de origen del producto"});
    });
  }
  onEdit(id: number, name: string, active: boolean) {
    this.productorigintypeModel = new Productorigintype();
    this.productorigintypeModel.id = id;
    console.log(active);
    this.productorigintypeModel.name = name;
    this.productorigintypeModel.active = active == false ? false : true;
    this.productorigintypeDialog = true;
  }
}
