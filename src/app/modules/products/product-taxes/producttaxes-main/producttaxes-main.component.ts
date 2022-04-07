import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { ProductTaxes } from 'src/app/models/products/producttaxes';
import { ProductTaxesFilter } from '../../shared/filters/productaxes-filter';
import { ProducttaxesService } from '../../shared/services/producttaxes/producttaxes.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { Product } from 'src/app/models/products/product';
import { TaxRate } from 'src/app/models/masters/tax-rate';
import { Tax } from 'src/app/models/masters/tax';
import { Country } from 'src/app/models/masters/country';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ProductcatalogFilter } from '../../shared/filters/productcatalog-filter';
import { Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'producttaxes-main',
  templateUrl: './producttaxes-main.component.html',
  styleUrls: ['./producttaxes-main.component.scss'],
  providers: [DecimalPipe]
})
export class ProducttaxesMainComponent implements OnInit {

  @Input("idproduct") idproduct : number = 0;
  _productTaxes : ProductTaxes = new ProductTaxes();
  _productTaxesFilter : ProductTaxesFilter = new ProductTaxesFilter();
  _showdialog: Boolean = false;
  submitted: Boolean = false;
  loading: Boolean = false;
  permissionsIDs = {...Permissions};
  @Output("refreshcompleted") refreshcompleted = new EventEmitter();

  productcatalogfiltersOfValues: ProductcatalogFilter[] = [];

  displayedColumns: ColumnD<ProductTaxes>[] =
  [
   {template: (data) => { return data.id; }, header: 'Id',field: 'Id', display: 'none'},
   {template: (data) => { return data.taxRate.tax.country.name; },field: 'taxRate.tax.country.name', header: 'País', display: 'table-cell'},
   {template: (data) => { return data.taxRate.tax.name; },field: 'taxRate.tax.name', header: 'Impuesto', display: 'table-cell'},
   {template: (data) => { return data.taxRate.name; },field: 'taxRate.name', header: 'Tasa', display: 'table-cell'},
   {template: (data) => { return this.decimalPipe.transform(data.taxRate.value, '.2')+" %"; },field: 'taxRate.value', header: 'Valor (%)', display: 'table-cell'},
   {field: 'active', header: 'Estatus', display: 'table-cell'},
   {template: (data) => { return data.createdByUser; },field: 'createdByUser', header: 'Creado por', display: 'table-cell'},
   {template: (data) => { return data.updatedByUser; },field: 'updatedByUser', header: 'Actualizado por', display: 'table-cell'}
  ];


  constructor(public _ProductTaxesService: ProducttaxesService, 
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService:ConfirmationService,
    public userPermissions: UserPermissions,
    private decimalPipe:DecimalPipe) { }

  ngOnInit(): void {
    if (this.productcatalogfiltersOfValues.length > 0) {
      this.productcatalogfiltersOfValues = this.productcatalogfiltersOfValues;
    }else{
      if (history.state.queryParams!=undefined) {
        const productcatalogfilters = history.state.queryParams.productcatalogfilters;
        if (productcatalogfilters === null) {
          this.productcatalogfiltersOfValues = [];
        } else {
          this.productcatalogfiltersOfValues = JSON.parse(productcatalogfilters);
 
          sessionStorage.setItem('searchParameters', productcatalogfilters)
        }
      }else{
        this.productcatalogfiltersOfValues = JSON.parse(sessionStorage.getItem('searchParameters'));
      }
      
    }
    this._productTaxes= new ProductTaxes();
    this.loadProductTaxes();
  }

  loadProductTaxes(){
    var filterProductTaxes = new ProductTaxesFilter();
    filterProductTaxes.productId = this.idproduct;
    this._ProductTaxesService.getProductTaxesbyfilter(filterProductTaxes).subscribe((data: ProductTaxes[]) => {
      this._ProductTaxesService._productTaxes = data.sort((a, b) => new Date(b.dateCreate).getTime() - new Date(a.dateCreate).getTime());
      this.loading = false;
    }, (error: HttpErrorResponse)=>{
      this.loading = false;
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los impuestos."});
    });
  }

  onEdit(productTaxes: ProductTaxes){
    this._productTaxes = new ProductTaxes();
    this._productTaxes.id = productTaxes.id;
    this._productTaxes.product = new Product();
    this._productTaxes.product.productId = productTaxes.product.productId;
    this._productTaxes.taxRate = new TaxRate();
    this._productTaxes.taxRate.id = productTaxes.taxRate.id;
    this._productTaxes.taxRate.value = productTaxes.taxRate.value;
    this._productTaxes.taxRate.tax = new Tax();
    this._productTaxes.taxRate.tax.id = productTaxes.taxRate.tax.id;
    this._productTaxes.taxRate.tax.country = new Country();
    this._productTaxes.taxRate.tax.country.id = productTaxes.taxRate.tax.country.id;
    this._productTaxes.active = productTaxes.active;
    this._productTaxes.createdByUser = productTaxes.createdByUser;
    this._productTaxes.createdByUserId = productTaxes.createdByUserId;
    this._productTaxes.updatedByUser = productTaxes.updatedByUser;
    this._productTaxes.updatedByUserId = productTaxes.updatedByUserId;
    this._productTaxes.dateCreate = productTaxes.dateCreate;
    this._productTaxes.dateUpdate = productTaxes.dateUpdate;
    this._showdialog = true;
  }

  newProductTaxes(){
    this._productTaxes.active = true;
    this._productTaxes.product = new Product();
    this._productTaxes.taxRate = new TaxRate();
    this._productTaxes.taxRate.tax = new Tax();
    this._productTaxes.taxRate.tax.country = new Country();
    this._productTaxes.product.productId = this.idproduct;
    this._showdialog = true;
  }

  

  back(){
    const queryParams: any = {};
          queryParams.productcatalogfilters = JSON.stringify(this.productcatalogfiltersOfValues);
          const navigationExtras: NavigationExtras = {
            queryParams
          };
          this.router.navigate(['mpc/productcatalog-list'],navigationExtras);
  }

  voidrefreshcompleted(){
    this.refreshcompleted.emit();
  }

}
