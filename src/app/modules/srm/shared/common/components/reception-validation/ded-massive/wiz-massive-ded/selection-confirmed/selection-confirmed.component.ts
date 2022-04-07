import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { DeductibleRep } from 'src/app/models/srm/reception/deductible-rep';
import { FilterProductMasivo } from 'src/app/models/srm/reception/filterproductmasivo';
import { Productdetailvalidation } from 'src/app/models/srm/reception/productdetailvalidation';
import { ValidationProduct } from 'src/app/models/srm/validation-product';
import { ValidationProductService } from 'src/app/modules/srm/shared/services/validation-product/validation-product.service';

@Component({
  selector: 'app-selection-confirmed',
  templateUrl: './selection-confirmed.component.html',
  styleUrls: ['./selection-confirmed.component.scss']
})
export class SelectionConfirmedComponent implements OnInit {
  selectedDeducible: DeductibleRep[] = [];
  Products: ValidationProduct[] = [];
  filterProduct: FilterProductMasivo[] =[];
  @Input("ProductsApp") ProductsApp: ValidationProduct[]; 
  @Input("DeductiblesApp") DeductiblesApp: DeductibleRep[]; 
  @Input() deductiblesListTemp:DeductibleRep[];
  @Output("DeductiblesAppChange") DeductiblesAppChange = new EventEmitter<DeductibleRep[]>();
  @Output("ProductsAppChange") ValidationProduct = new EventEmitter<ValidationProduct[]>();

  displayedColumns: ColumnD<DeductibleRep>[] =
  [
    // { template: (data) => { return data.taxableDeductibleBaseId; }, header: 'Código', field: 'deductibleId', display: 'none' },
    { template: (data) => { return data.taxableType; }, header: 'Tipo', field: 'taxableType', display: 'table-cell' },
    { template: (data) => { return data.taxableDeductibleBase; }, header: 'Descripción', field: 'taxableDeductibleBase', display: 'table-cell' },
    { field: 'idTemp', header: 'Deducible procedente', display: 'table-cell' },
    { template: (data) => { return data.discountRate; }, header: 'Tipo de valor', field: 'discountRate', display: 'table-cell' },
    { template: (data) => { return data.applyCost; }, header: 'Aplica a', field: 'applyCost', display: 'table-cell' },
    { template: (data) => { return this.decimalPipe.transform(data.rate, '.2'); }, header: 'Tasa %', field: 'rate', display: 'table-cell' },
    { template: (data) => { return this.decimalPipe.transform(data.amount, '.4'); }, header: 'Monto', field: 'amount', display: 'table-cell' }

  ];

  displayedColumnsProducts: ColumnD<ValidationProduct>[] =
  [
    { template: (data) => { return data.id; }, header: 'Id', field: 'id', display: 'none' },
    { template: (data) => { return data.productName; }, field: 'productName', header: 'Nombre', display: 'table-cell' },
    { template: (data) => { return data.packageType; }, field: 'packageType', header: 'Tipo de empaque', display: 'table-cell' },
    { template: (data) => { return data.barcode; }, field: 'barcode', header: 'Barra', display: 'table-cell' },
    { template: (data) => { return data.internalReference; }, field: 'internalReference', header: 'Referencia', display: 'table-cell' },
    { template: (data) => { return data.wasWeighed}, field: 'wasWeighed', header: 'Ind. pesado', display: 'table-cell' },
    { template: (data) => { return this.decimalPipe.transform(data.retailPriceBase, '.4'); }, field: 'netCostBase', header:'PVP', display: 'table-cell' },
    { template: (data) => { return data.unitByPackage; }, field: 'unitByPackage', header: 'Unidades por empaque', display: 'table-cell' },
    //  {template: (data) => { return data.presentationPackage; },field: 'presentationPackage', header: 'Presentación de empaque', display: 'table-cell'},

    //  {template: (data) => { return data.dateCreate == undefined ? "" : this.datepipe.transform(data.dateCreate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(data.dateCreate, "dd/MM/yyyy"); },field: 'dateCreate', header: 'Fecha creación', display: 'table-cell'},
    //  {template: (data) => { return data.dateUpdate == undefined ? "" : this.datepipe.transform(data.dateUpdate, "dd/MM/yyyy").toString() == "01/01/1900" ? "" : this.datepipe.transform(data.dateUpdate, "dd/MM/yyyy"); },field: 'dateUpdate', header: 'Fecha actualización', display: 'table-cell'}
  ];

  constructor( public datepipe: DatePipe,
    private decimalPipe: DecimalPipe,
    private messageService: MessageService,
    private  _serviceValidation: ValidationProductService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.selectedDeducible=this.DeductiblesApp;
    this.Products= this.ProductsApp;
  }

  onRemoveTaxable(id){
   debugger;
    this.selectedDeducible=this.selectedDeducible.filter(x=>x.idTemp!=id);
  }

  onRemoveProduc(id){
    this.Products=  this.Products.filter(x=>x.barcode!=id.barcode);
  }

Save() {
 if (this.selectedDeducible.length > 0 && this.Products.length>0) {
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea aplicar imponibles a los productos seleccionados, afectaran sus costos ? ',
      accept: () => {
        this.aplicar();
      },
    });
  } else{
    this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "Debe tener al menos un producto y descuento para aplicar." });

}
  }
    
  aplicar(){
    debugger
    this.filterProduct=[];
      this.Products.forEach(prod => {
        var prodMasiv= new FilterProductMasivo();
        prodMasiv.id= prod.id ;
        prodMasiv.idPackaging= prod.idPackaging;
        this.filterProduct.push(prodMasiv);
        console.log(this.filterProduct);
      });

      if(this.filterProduct.length>0){
        this._serviceValidation.getProductsTaxable(this.filterProduct).subscribe((data: Productdetailvalidation[]) => {
        if (data.length > 0) {
           //this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
           data.forEach(prod => {
             
          });
        
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al obtener el detalle de productos." });
        }
      }, (error: HttpErrorResponse) => {

        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al obtener los detalles asociados." });
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "Debe tener al menos un producto e imponible." });

    }
      }
}
