import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { FilterProductMasivo } from 'src/app/models/srm/reception/filterproductmasivo';
import { Productdetailvalidation } from 'src/app/models/srm/reception/productdetailvalidation';
import { TaxableRep } from 'src/app/models/srm/reception/taxable-rep';
import { ValidationProduct } from 'src/app/models/srm/validation-product';
import { ValidationProductService } from 'src/app/modules/srm/shared/services/validation-product/validation-product.service';

@Component({
  selector: 'app-confirmed-selection',
  templateUrl: './confirmed-selection.component.html',
  styleUrls: ['./confirmed-selection.component.scss']
})
export class ConfirmedSelectionComponent implements OnInit {
  selectedTaxable: TaxableRep[] = [];
  Products: ValidationProduct[] = [];
  filterProduct: FilterProductMasivo[] =[];

  @Input("ProductsApp") ProductsApp: ValidationProduct[]; 
  @Input("TaxablesApp") TaxablesApp: TaxableRep[]; 
  @Input() txablesListTemp:TaxableRep[];
  @Output("TaxablesAppChange") TaxablesAppChange = new EventEmitter<TaxableRep[]>();
  @Output("ProductsAppChange") ValidationProduct = new EventEmitter<ValidationProduct[]>();
  @Output("_sendTaxablesMasivo") _sendTaxablesMasivo = new EventEmitter< {TaxDetailProd:Productdetailvalidation []}>();
  displayedColumns: ColumnD<TaxableRep>[] =
  [
    { template: (data) => { return data.taxableDeductibleBaseId; }, header: 'Código', field: 'taxableDeductibleBaseId', display: 'none' },
    { template: (data) => { return data.taxableType; }, header: 'Tipo de imponible', field: 'taxableType', display: 'table-cell' },
    { template: (data) => { return data.taxableDeductibleBase; }, header: 'Descripción', field: 'taxableDeductibleBase', display: 'table-cell' },
    // { template: (data) => { return data.discountRate; }, header: 'Tipo descuento', field: 'discountRate', display: 'table-cell' },

    { field: 'idProducTax', header: 'Impuesto procedente', display: 'table-cell' },
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
    this.selectedTaxable=this.TaxablesApp;
    this.Products= this.ProductsApp;
  }

  onRemoveTaxable(id){
   debugger;
    this.selectedTaxable=this.selectedTaxable.filter(x=>x.idProducTax!=id);
  }

  onRemoveProduc(id){
    this.Products=  this.Products.filter(x=>x.barcode!=id.barcode);
  }

Save() {
 if (this.selectedTaxable.length > 0 && this.Products.length>0) {
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      message: '¿Está seguro que desea aplicar imponibles a los productos seleccionados, afectaran sus costos ? ',
      accept: () => {
        this.aplicar();
      },
    });
  } else{
    this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "Debe tener al menos un producto e imponible." });

}
  }
    
  aplicar(){
    let getmasive: boolean=false;
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
debugger
          getmasive=true;
          data.forEach(prod => {
            this.TaxablesApp.forEach(element => {
               element.active=true;
               element.idPurchaseDetail= prod.id;
               prod.taxables.push(element);
            });
            
          });
           //Emitir 
           //this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
        
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al obtener el detalle de productos." });
        }

        if(getmasive){
          this._sendTaxablesMasivo.emit({TaxDetailProd:data});
        }
         
      }, (error: HttpErrorResponse) => {

        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al obtener los detalles asociados." });
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "Debe tener al menos un producto e imponible." });

    }
      }
}



