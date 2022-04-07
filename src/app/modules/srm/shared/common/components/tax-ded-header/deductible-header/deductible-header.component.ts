import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Deductible } from 'src/app/models/srm/deductible';
import { Groupingpurchaseorders } from 'src/app/models/srm/groupingpurchaseorders';
import { PurchaseOrdertaxableDetail } from 'src/app/models/srm/purchase-order-taxable-detail';
import { TaxableDeductibleFilter } from 'src/app/models/srm/taxable-deductible-filter';
import { Taxabledeductible } from 'src/app/models/srm/taxabledeductible';
import { PurchaseorderService } from '../../../../services/purchaseorder/purchaseorder.service';

@Component({
  selector: 'app-deductible-header',
  templateUrl: './deductible-header.component.html',
  styleUrls: ['./deductible-header.component.scss'],
  providers: [DatePipe, DecimalPipe]
})
export class DeductibleHeaderComponent implements OnInit {
  @Input("PurchaseOrder") PurchaseOrder: Groupingpurchaseorders;
  txablesList: Deductible[] = [];
  @Output("onhide") onhide = new EventEmitter();
  constructor(public datepipe: DatePipe,
  private decimalPipe: DecimalPipe,
  public purchaseService: PurchaseorderService,
  private confirmationService: ConfirmationService,
  private messageService: MessageService) { }
  
  displayedColumns: ColumnD<Deductible>[] =
  [
    { template: (data) => { return data.taxableDeductibleBaseId; }, header: 'Código', field: 'taxableDeductibleBaseId', display: 'none' },
    { template: (data) => { return data.taxableType; }, header: 'Tipo', field: 'taxableType', display: 'table-cell' },
    { template: (data) => { return data.taxableDeductibleBase; }, header: 'Nombre', field: 'taxableDeductibleBase', display: 'table-cell' },
    { template: (data) => { return data.discountRate; }, header: 'Tipo descuento', field: 'discountRate', display: 'table-cell' },

    // { field: 'idProducTax', header: 'Impuesto MPC', display: 'table-cell' },
    { template: (data) => { return data.applyCost; }, header: 'Aplica', field: 'applyCost', display: 'table-cell' },
    { template: (data) => { return this.decimalPipe.transform(data.rate, '.2'); }, header: 'Tasa %', field: 'rate', display: 'table-cell' },
    { template: (data) => { return this.decimalPipe.transform(data.amount, '.4'); }, header: 'Monto', field: 'amount', display: 'table-cell' }

  ];
  ngOnInit(): void {
  }

  onshowDeductibleHeader(){
    this.search();
  }

  search() {
   // this.loading = true;
    //this.loading = false;
    var filter: TaxableDeductibleFilter = new TaxableDeductibleFilter();
    filter.purchaseOrderId = this.PurchaseOrder.purchase.idOrderPurchase;
    this.purchaseService.GetTaxablesDeductibles(filter).subscribe((data: Taxabledeductible) => {
       this.txablesList= data.deductibles;
       console.log(this.txablesList);
      //this.loading = false;
    }, (error: HttpErrorResponse) => {
      //this.loading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al obtener los imponibles." });
     
    });
  }

  onRemove(ProducTax) {
    // this.txablesListTemp = this.txablesListTemp.filter(x => x.idProducTax != idProducTax);
    this.confirmationService.confirm({
     header: 'Confirmación',
     icon: 'pi pi-exclamation-triangle',
     message: '¿Está seguro que desea eliminar este registro?',
     accept: () => {
       let model=new PurchaseOrdertaxableDetail()
       model.indPurchaseTaxable = true;
       model.indPurchaseTaxableDetail = false;
       model.taxableDeductibleBaseId=ProducTax.taxableDeductibleBaseId;
       this.purchaseService.removetaxable(model).subscribe((data: number) => {
         if (data > 0) {
           this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Eliminación exitosa" });
           this.txablesList = this.txablesList.filter(x => x != ProducTax);                 
         }
       }, (error: HttpErrorResponse) =>
         this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." }
         ));
     },
   });
   }


}
