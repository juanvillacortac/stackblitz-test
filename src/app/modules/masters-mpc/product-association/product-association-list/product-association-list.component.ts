import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { Panel } from 'primeng/panel';
import { Columns } from 'src/app/models/common/columns';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Productassociation } from 'src/app/models/masters-mpc/productassociation';
import { ProductassociationFilter } from '../../shared/filters/productassociation-filter';
import { ProductassociationService } from '../../shared/services/ProductAssociationService/productassociation.service';
import { MessageService, SelectItem } from 'primeng/api';
import {AuthService} from 'src/app/modules/login/shared/auth.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { OrderCodes } from '../../shared/Utils/order-codes';

@Component({
  selector: 'app-product-association-list',
  templateUrl: './product-association-list.component.html',
  styleUrls: ['./product-association-list.component.scss']
})
export class ProductAssociationListComponent implements OnInit {

  showFilters : boolean = false;
  loading : boolean = false;
  submitted: boolean;
  productassociationDialog: boolean = false;
  _productassociationFilters: ProductassociationFilter = new ProductassociationFilter();
  productassociationModel: Productassociation = new Productassociation();
  idproductassociation: number = 0;
  permissionsIDs = {...Permissions};
  displayedColumns: ColumnD<Productassociation>[] =
  [
   {template: (data) => { return data.id; }, header: 'Id',field: 'Id', display: 'none'},
   {template: (data) => { return data.name; },field: 'name', header: 'Nombre', display: 'table-cell'},
   {field: 'active', header: 'Estatus', display: 'table-cell'},
   {template: (data) => { return data.createdByUser; },field: 'createdByUser', header: 'Creado por', display: 'table-cell'},
   {template: (data) => { return data.updatedByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'}
  ];

  constructor(private router: Router, 
    public _authService: AuthService, 
    public _productassociationservice: ProductassociationService, 
    public breadcrumbService: BreadcrumbService, 
    private messageService: MessageService,
    public userPermissions: UserPermissions) { 
    this.breadcrumbService.setItems([
      { label: 'OSM' },
      { label: 'MPC' },
      { label: 'Asociaciones de productos', routerLink: ['/product-association-list'] }
    ]);
  }

  ngOnInit(): void {
    this.search();
  }

  search(){
    this.loading = true;
    this.loading = false;
    this._productassociationservice.getProductassociationbyfilter(this._productassociationFilters, OrderCodes.CreatedDate).subscribe((data: Productassociation[]) => {
      this._productassociationservice._ProductassociationList = data;
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando las asociaciones de productos"});
    });
  }
  onEdit(id: number, name: string, active: boolean) {
    this.productassociationModel = new Productassociation();
    this.productassociationModel.id = id;
    console.log(active);
    this.productassociationModel.name = name;
    this.productassociationModel.active = active == false ? false : true;
    this.productassociationDialog = true;
  }

}
