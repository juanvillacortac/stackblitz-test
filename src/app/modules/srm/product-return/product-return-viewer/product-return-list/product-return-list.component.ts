import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ColumnD } from 'src/app/models/common/columnsd';

@Component({
  selector: 'app-product-return-list',
  templateUrl: './product-return-list.component.html',
  providers: [DatePipe]
})
export class ProductReturnListComponent implements OnInit {

  constructor(public datepipe: DatePipe) { }

  _selectedColumns: any[];
  
  dataProductoReturn: any[] =[
    {
      numeroDevolucion: 'DEV-01-001-000001',
      documentoProveedor: 'J-1234567-8',
      proveedor: 'Alimentos Polar',
      tipoDevolucion: 'Devolucion automática de compra',
      estatusDevolucion: 'En ejecución',
      estatusMercancia: 'Pendiente por retirar',
      numeroCredito:'N/A',
      cantidadItems:21,
      montoTotal:'36.2560.00',
      fechaCreacion: '02/12/2222',
      fechaFinalizacion: '02/12/2222',
      fechaAnulacion: '02/12/2222',
      fechaFiscalizacion: '02/15/2222',
      creadaPor:'Madelyn Leos',
      finalizadaPor:'Mauricio Marcano',
      anuladaPor:'Engel Lopez'
    },
    {
      numeroDevolucion: 'DEV-01-001-000002',
      documentoProveedor: 'J-1234567-8',
      proveedor: 'Alimentos Polar',
      tipoDevolucion: 'Devolucion automática de compra',
      estatusDevolucion: 'En ejecución',
      estatusMercancia: 'Pendiente por retirar',
      numeroCredito:'N/A',
      cantidadItems:21,
      montoTotal:'36.2560.00',
      fechaCreacion: '02/12/2222',
      fechaFinalizacion: '02/12/2222',
      fechaAnulacion: '02/12/2222',
      fechaFiscalizacion: '02/15/2222',
      creadaPor:'Madelyn Leos',
      finalizadaPor:'Mauricio Marcano',
      anuladaPor:'Engel Lopez'
    },
    {
      numeroDevolucion: 'DEV-01-001-000003',
      documentoProveedor: 'J-1234567-8',
      proveedor: 'Alimentos Polar',
      tipoDevolucion: 'Devolucion automática de compra',
      estatusDevolucion: 'En ejecución',
      estatusMercancia: 'Pendiente por retirar',
      numeroCredito:'N/A',
      cantidadItems:21,
      montoTotal:'36.2560.00',
      fechaCreacion: '02/12/2222',
      fechaFinalizacion: '02/12/2222',
      fechaAnulacion: '02/12/2222',
      fechaFiscalizacion: '02/15/2222',
      creadaPor:'Madelyn Leos',
      finalizadaPor:'Mauricio Marcano',
      anuladaPor:'Engel Lopez'
    },
    {
      numeroDevolucion: 'DEV-01-001-000004',
      documentoProveedor: 'J-1234567-8',
      proveedor: 'Alimentos Polar',
      tipoDevolucion: 'Devolucion automática de compra',
      estatusDevolucion: 'En ejecución',
      estatusMercancia: 'Pendiente por retirar',
      numeroCredito:'N/A',
      cantidadItems:21,
      montoTotal:'36.2560.00',
      fechaCreacion: '02/12/2222',
      fechaFinalizacion: '02/12/2222',
      fechaAnulacion: '02/12/2222',
      fechaFiscalizacion: '02/15/2222',
      creadaPor:'Madelyn Leos',
      finalizadaPor:'Mauricio Marcano',
      anuladaPor:'Engel Lopez'
    },
    {
      numeroDevolucion: 'DEV-01-001-000005',
      documentoProveedor: 'J-1234567-8',
      proveedor: 'Alimentos Polar',
      tipoDevolucion: 'Devolucion automática de compra',
      estatusDevolucion: 'En ejecución',
      estatusMercancia: 'Pendiente por retirar',
      numeroCredito:'N/A',
      cantidadItems:21,
      montoTotal:'36.2560.00',
      fechaCreacion: '02/12/2222',
      fechaFinalizacion: '02/12/2222',
      fechaAnulacion: '02/12/2222',
      fechaFiscalizacion: '02/15/2222',
      creadaPor:'Madelyn Leos',
      finalizadaPor:'Mauricio Marcano',
      anuladaPor:'Engel Lopez'
    },
    {
      numeroDevolucion: 'DEV-01-001-000005',
      documentoProveedor: 'J-1234567-8',
      proveedor: 'Alimentos Polar',
      tipoDevolucion: 'Devolucion automática de compra',
      estatusDevolucion: 'En ejecución',
      estatusMercancia: 'Pendiente por retirar',
      numeroCredito:'N/A',
      cantidadItems:21,
      montoTotal:'36.2560.00',
      fechaCreacion: '02/12/2222',
      fechaFinalizacion: '02/12/2222',
      fechaAnulacion: '02/12/2222',
      fechaFiscalizacion: '02/15/2222',
      creadaPor:'Madelyn Leos',
      finalizadaPor:'Mauricio Marcano',
      anuladaPor:'Engel Lopez'
    },
    {
      numeroDevolucion: 'DEV-01-001-000005',
      documentoProveedor: 'J-1234567-8',
      proveedor: 'Alimentos Polar',
      tipoDevolucion: 'Devolucion automática de compra',
      estatusDevolucion: 'En ejecución',
      estatusMercancia: 'Pendiente por retirar',
      numeroCredito:'N/A',
      cantidadItems:21,
      montoTotal:'36.2560.00',
      fechaCreacion: '02/12/2222',
      fechaFinalizacion: '02/12/2222',
      fechaAnulacion: '02/12/2222',
      fechaFiscalizacion: '02/15/2222',
      creadaPor:'Madelyn Leos',
      finalizadaPor:'Mauricio Marcano',
      anuladaPor:'Engel Lopez'
    },
    {
      numeroDevolucion: 'DEV-01-001-000005',
      documentoProveedor: 'J-1234567-8',
      proveedor: 'Alimentos Polar',
      tipoDevolucion: 'Devolucion automática de compra',
      estatusDevolucion: 'En ejecución',
      estatusMercancia: 'Pendiente por retirar',
      numeroCredito:'N/A',
      cantidadItems:21,
      montoTotal:'36.2560.00',
      fechaCreacion: '02/12/2222',
      fechaFinalizacion: '02/12/2222',
      fechaAnulacion: '02/12/2222',
      fechaFiscalizacion: '02/15/2222',
      creadaPor:'Madelyn Leos',
      finalizadaPor:'Mauricio Marcano',
      anuladaPor:'Engel Lopez'
    },
    
    {
      numeroDevolucion: 'DEV-01-001-000005',
      documentoProveedor: 'J-1234567-8',
      proveedor: 'Alimentos Polar',
      tipoDevolucion: 'Devolucion automática de compra',
      estatusDevolucion: 'En ejecución',
      estatusMercancia: 'Pendiente por retirar',
      numeroCredito:'N/A',
      cantidadItems:21,
      montoTotal:'36.2560.00',
      fechaCreacion: '02/12/2222',
      fechaFinalizacion: '02/12/2222',
      fechaAnulacion: '02/12/2222',
      fechaFiscalizacion: '02/15/2222',
      creadaPor:'Madelyn Leos',
      finalizadaPor:'Mauricio Marcano',
      anuladaPor:'Engel Lopez'
    },
    
    {
      numeroDevolucion: 'DEV-01-001-000005',
      documentoProveedor: 'J-1234567-8',
      proveedor: 'Alimentos Polar',
      tipoDevolucion: 'Devolucion automática de compra',
      estatusDevolucion: 'En ejecución',
      estatusMercancia: 'Pendiente por retirar',
      numeroCredito:'N/A',
      cantidadItems:21,
      montoTotal:'36.2560.00',
      fechaCreacion: '02/12/2222',
      fechaFinalizacion: '02/12/2222',
      fechaAnulacion: '02/12/2222',
      fechaFiscalizacion: '02/15/2222',
      creadaPor:'Madelyn Leos',
      finalizadaPor:'Mauricio Marcano',
      anuladaPor:'Engel Lopez'
    },
    
    {
      numeroDevolucion: 'DEV-01-001-000005',
      documentoProveedor: 'J-1234567-8',
      proveedor: 'Alimentos Polar',
      tipoDevolucion: 'Devolucion automática de compra',
      estatusDevolucion: 'En ejecución',
      estatusMercancia: 'Pendiente por retirar',
      numeroCredito:'N/A',
      cantidadItems:21,
      montoTotal:'36.2560.00',
      fechaCreacion: '02/12/2222',
      fechaFinalizacion: '02/12/2222',
      fechaAnulacion: '02/12/2222',
      fechaFiscalizacion: '02/15/2222',
      creadaPor:'Madelyn Leos',
      finalizadaPor:'Mauricio Marcano',
      anuladaPor:'Engel Lopez'
    },
    
    {
      numeroDevolucion: 'DEV-01-001-000005',
      documentoProveedor: 'J-1234567-8',
      proveedor: 'Alimentos Polar',
      tipoDevolucion: 'Devolucion automática de compra',
      estatusDevolucion: 'En ejecución',
      estatusMercancia: 'Pendiente por retirar',
      numeroCredito:'N/A',
      cantidadItems:21,
      montoTotal:'36.2560.00',
      fechaCreacion: '02/12/2222',
      fechaFinalizacion: '02/12/2222',
      fechaAnulacion: '02/12/2222',
      fechaFiscalizacion: '02/15/2222',
      creadaPor:'Madelyn Leos',
      finalizadaPor:'Mauricio Marcano',
      anuladaPor:'Engel Lopez'
    },
    
    {
      numeroDevolucion: 'DEV-01-001-000005',
      documentoProveedor: 'J-1234567-8',
      proveedor: 'Alimentos Polar',
      tipoDevolucion: 'Devolucion automática de compra',
      estatusDevolucion: 'En ejecución',
      estatusMercancia: 'Pendiente por retirar',
      numeroCredito:'N/A',
      cantidadItems:21,
      montoTotal:'36.2560.00',
      fechaCreacion: '02/12/2222',
      fechaFinalizacion: '02/12/2222',
      fechaAnulacion: '02/12/2222',
      fechaFiscalizacion: '02/15/2222',
      creadaPor:'Madelyn Leos',
      finalizadaPor:'Mauricio Marcano',
      anuladaPor:'Engel Lopez'
    }
    
  ] 
    

  colsMicro: ColumnD<any>[] = [
    { template: (productReturn) => {return productReturn.numeroDevolucion;}, field: 'numeroDevolucion', header: 'Numero devolución', display: 'table-cell' },
    { template: (productReturn) => { return productReturn.documentoProveedor;}, field: 'documentoProveedor', header: 'Número de Documento del proveedor', display: 'table-cell' },
    { template: (productReturn) => { return productReturn.proveedor;}, field: 'proveedor', header: 'Proveedor', display: 'table-cell' },
    { template: (productReturn) => { return productReturn.tipoDevolucion;}, field: 'tipoDevolucion', header: 'Tipo de devolución', display: 'table-cell' },
    { template: (productReturn) => { return productReturn.estatusDevolucion;}, field: 'estatusDevolucion', header: 'Estatus devolucion', display: 'table-cell' },
    { template: (productReturn) => { return productReturn.estatusMercancia;}, field: 'estatusMercancia', header: 'Estatus de la mercancia', display: 'table-cell' },
    { template: (productReturn) => { return productReturn.numeroCredito;}, field: 'numeroCredito', header: 'Número de Nota de Crédito', display: 'table-cell' },
    { template: (productReturn) => { return productReturn.cantidadItems;}, field: 'cantidadItems', header: 'Cantidad items', display: 'table-cell' },
    { template: (productReturn) => { return productReturn.montoTotal;}, field: 'montoTotal', header: 'Monto total', display: 'table-cell' },
    { template: (productReturn) => { return productReturn.fechaCreacion;}, field: 'fechaCreacion', header: 'Fecha creación', display: 'table-cell' },
    { template: (productReturn) => { return productReturn.fechaFinalizacion;}, field: 'fechaFinalizacion', header: 'Fecha finalización', display: 'table-cell' },
    { template: (productReturn) => { return productReturn.fechaAnulacion;}, field: 'fechaAnulacion', header: 'Fecha anulación', display: 'table-cell' },
    { template: (productReturn) => { return productReturn.fechaFiscalizacion;}, field: 'fechaFiscalizacion', header: 'Fecha fiscalización', display: 'table-cell' },
    { template: (productReturn) => { return productReturn.creadaPor;}, field: 'creadaPor', header: 'Creada por', display: 'table-cell' },
    { template: (productReturn) => { return productReturn.finalizadaPor;}, field: 'finalizadaPor', header: 'Finalizada por', display: 'table-cell' },
    { template: (productReturn) => { return productReturn.anuladaPor;}, field: 'anuladaPor', header: 'Anulada por', display: 'table-cell' },
    ]


    @Input() get selectedColumns(): any[] {
      return this._selectedColumns;
    }
  
    set selectedColumns(val: any[]) {
      //restore original order
      this._selectedColumns = this.colsMicro.filter(col => val.includes(col));
    }
  






/*    displayedColumns: ColumnD<any>[] =
  [
   {template: (data) => { return data.numeroDevolucion; },field: 'numeroDevolucion', header: 'Número devolución', display: 'table-cell'},
   {template: (data) => { return data.documentoProveedor; },field: 'documentoProveedor', header: 'Numero de documento del proveedor', display: 'table-cell'},
   {template: (data) => { return data.proveedor; },field: 'proveedor', header: 'Proveedor', display: 'table-cell'},
   {template: (data) => { return data.tipoDevolucion; },field: 'tipoDevolucion', header: 'Tipo de devolución', display: 'table-cell'},
   {template: (data) => { return data.estatusDevolucion; },field: 'estatusDevolucion', header: 'Estatus devolución', display: 'table-cell'},
   {template: (data) => { return data.estatusMercancia; },field: 'estatusMercancia', header: 'Estatus de la mercancia', display: 'table-cell'},
   {template: (data) => { return data.fechaCreacion == undefined ? "" : this.datepipe.transform(data.fechaCreacion, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(data.fechaCreacion, "dd/MM/yyyy"); },field: 'fechaCreacion', header: 'Fecha de creación', display: 'table-cell'},
   {template: (data) => { return data.fechaFinalizacion == undefined ? "" : this.datepipe.transform(data.fechaFinalizacion, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(data.fechaFinalizacion, "dd/MM/yyyy"); },field: 'fechaFinalizacion', header: 'Fecha de finalización', display: 'table-cell'},
   {template: (data) => { return data.fechaAnulacion == undefined ? "" : this.datepipe.transform(data.fechaAnulacion, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(data.fechaAnulacion, "dd/MM/yyyy"); },field: 'fechaAnulacion', header: 'Fecha de anulación', display: 'table-cell'},
   {template: (data) => { return data.fechaFiscalizacion == undefined ? "" : this.datepipe.transform(data.fechaFiscalizacion, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(data.fechaFiscalizacion, "dd/MM/yyyy"); },field: 'fechaFiscalizacion', header: 'Fecha de fiscalización', display: 'table-cell'},
   {template: (data) => { return data.creadaPor; },field: 'creadaPor', header: 'Creada por', display: 'table-cell'},
   {template: (data) => { return data.finalizadaPor; },field: 'finalizadaPor', header: 'Finalizada por', display: 'table-cell'},
   {template: (data) => { return data.anuladaPor; },field: 'anuladaPor', header: 'Anulada por', display: 'table-cell'},
  
  ]; */

  ngOnInit(): void {
    this._selectedColumns = this.colsMicro;
  }

}
