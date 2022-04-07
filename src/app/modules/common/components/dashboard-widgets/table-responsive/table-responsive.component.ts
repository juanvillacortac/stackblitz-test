import { Component, OnInit } from '@angular/core';
import { ColumnD } from 'src/app/models/common/columnsd';
import { ProductsModel } from './products-model';

@Component({
  selector: 'app-table-responsive',
  templateUrl: './table-responsive.component.html',
  styleUrls: ['./table-responsive.component.scss']
})

export class TableResponsiveComponent implements OnInit {
  _productsList: ProductsModel[];
  _product: ProductsModel = new ProductsModel();
  displayedColumns: ColumnD<ProductsModel>[] =
  [   
   {template: (data) => { return data.name; },field: 'name', header: 'Nombre', display: 'table-cell'},
   {template: (data) => { return data.code; },field: 'barcode', header: 'Barra', display: 'table-cell'},
   {template: (data) => { return data.quantity; },field: 'structureType', header: 'Estructura', display: 'table-cell'},   
   {template: (data) => { return data.category; },field: 'category', header: 'Categoría', display: 'table-cell'}
  ];
  constructor() { }

  ngOnInit(): void {
    debugger;
    this._product.name = "Prueaba";
    this._product.code = "Prueba 2";
    this._product.category = "Product";
    this._product.quantity = 168168;
    this._productsList=[];
    this._productsList.push(this._product);

  }

}
