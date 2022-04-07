import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ColumnD } from 'src/app/models/common/columnsd';
import { ValidationProduct } from 'src/app/models/srm/validation-product';

@Component({
  selector: 'app-selected-prod',
  templateUrl: './selected-prod.component.html',
  styleUrls: ['./selected-prod.component.scss']
})


export class SelectedProdComponent implements OnInit {
  
  @Input("Products") Products: ValidationProduct[] = [];
  selectedProductsCom: any[] = [];
  @Input("selectedProducts") selectedProducts: ValidationProduct[] = [];
  @Output("selectedProductsChange") selectedProductsChange = new EventEmitter<ValidationProduct[]>();
  displayedColumns: ColumnD<ValidationProduct>[] =
  [
    { template: (data) => { return data.id; }, header: 'Id', field: 'id', display: 'none' },
    { template: (data) => { return data.productName; }, field: 'productName', header: 'Nombre', display: 'table-cell' },
    { template: (data) => { return data.packageType; }, field: 'packageType', header: 'Tipo de empaque', display: 'table-cell' },
    { template: (data) => { return data.barcode; }, field: 'barcode', header: 'Barra', display: 'table-cell' },
    { template: (data) => { return data.internalReference; }, field: 'internalReference', header: 'Referencia', display: 'table-cell' },
    { template: (data) => { return data.wasWeighed}, field: 'wasWeighed', header: 'Ind. pesado', display: 'table-cell' },
    { template: (data) => { return this.decimalPipe.transform(data.retailPriceBase, '.4'); }, field: 'retailPriceBase', header:'PVP', display: 'table-cell' },//cambiar por PVP
    { template: (data) => { return data.unitByPackage; }, field: 'unitByPackage', header: 'Unidades por empaque', display: 'table-cell' },
    //  {template: (data) => { return data.presentationPackage; },field: 'presentationPackage', header: 'Presentación de empaque', display: 'table-cell'},

    //  {template: (data) => { return data.dateCreate == undefined ? "" : this.datepipe.transform(data.dateCreate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(data.dateCreate, "dd/MM/yyyy"); },field: 'dateCreate', header: 'Fecha creación', display: 'table-cell'},
    //  {template: (data) => { return data.dateUpdate == undefined ? "" : this.datepipe.transform(data.dateUpdate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(data.dateUpdate, "dd/MM/yyyy"); },field: 'dateUpdate', header: 'Fecha actualización', display: 'table-cell'}
  ];

  @ViewChild('dt', { static: false }) dt: any
  constructor(private decimalPipe: DecimalPipe) { }

  ngOnInit(): void {
    if (this.selectedProducts.length > 0) {
      this.selectedProductsCom = this.selectedProducts;
    } else {
      this.selectedProductsCom =[];
    }
    if (this.dt != undefined) {
      this.dt.reset();
    }
  }

  CheckProducts() {
    //enviar a bd una lista de proveedores para obtener los productos de la empresa a la que pertenecen esos proveedores
    this.selectedProducts = this.selectedProductsCom;
    this.selectedProductsChange.emit(this.selectedProducts);

  }
}
