import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Groupingpurchaseorders } from 'src/app/models/srm/groupingpurchaseorders';
import { PurchaseOrdertaxableDetail } from 'src/app/models/srm/purchase-order-taxable-detail';
import { Taxable } from 'src/app/models/srm/taxable';
import { TaxableDeductibleFilter } from 'src/app/models/srm/taxable-deductible-filter';
import { Taxabledeductible } from 'src/app/models/srm/taxabledeductible';
import { PurchaseorderService } from '../../../../services/purchaseorder/purchaseorder.service';

@Component({
  selector: 'app-taxable-header',
  templateUrl: './taxable-header.component.html',
  styleUrls: ['./taxable-header.component.scss'],
  providers: [DatePipe, DecimalPipe]
})
export class TaxableHeaderComponent implements OnInit {
 // @Input("ProductOrder") ProductOrder: PurchaseOrderProduct;
  @Input("PurchaseOrder") PurchaseOrder: Groupingpurchaseorders;
  txablesList: Taxable[] = [];
  imponible:Taxable= new Taxable();
  @Output("onhide") onhide = new EventEmitter();
  constructor( public datepipe: DatePipe,
    private decimalPipe: DecimalPipe,
    public purchaseService: PurchaseorderService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) { }
  
  displayedColumns: ColumnD<Taxable>[] =
  [
    { template: (data) => { return data.taxableDeductibleBaseId; }, header: 'Código', field: 'taxableDeductibleBaseId', display: 'none' },
    { template: (data) => { return data.taxableType; }, header: 'Tipo imponible', field: 'taxableType', display: 'table-cell' },
    { template: (data) => { return data.taxableDeductibleBase; }, header: 'Nombre', field: 'taxableDeductibleBase', display: 'table-cell' },
    // { template: (data) => { return data.discountRate; }, header: 'Tipo descuento', field: 'discountRate', display: 'table-cell' },

    // { field: 'idProducTax', header: 'Impuesto MPC', display: 'table-cell' },
    { template: (data) => { return data.applyCost; }, header: 'Aplica', field: 'applyCost', display: 'table-cell' },
    { template: (data) => { return this.decimalPipe.transform(data.rate, '.2'); }, header: 'Tasa %', field: 'rate', display: 'table-cell' },
    { template: (data) => { return this.decimalPipe.transform(data.amount, '.4'); }, header: 'Monto', field: 'amount', display: 'table-cell' }

  ];

   
  
  ngOnInit(): void {
  }

  onshowTaxableHeader(){
 this.search();
  }

  search() {
   // this.loading = true;
    //this.loading = false;
    var filter: TaxableDeductibleFilter = new TaxableDeductibleFilter();
    filter.purchaseOrderId = this.PurchaseOrder.purchase.idOrderPurchase;
    this.purchaseService.GetTaxablesDeductibles(filter).subscribe((data: Taxabledeductible) => {
       this.txablesList= data.taxables;
       this.purchaseService._taxdedpurcharseHeader.taxables=data.taxables;
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

  onEdit(taxable){
    this.imponible.taxableDeductibleBaseId =taxable.taxableDeductibleBaseId;
    this.imponible.idTaxType= taxable.idTaxType;
    this.imponible.idRate= taxable.idRate;
    this.imponible.idProducTax=taxable.idProducTax;
    this.imponible.idPurchaseOrder=taxable.idPurchaseOrder;
    this.imponible.idTaxableType=taxable.idTaxableType;
    this.imponible.distributionCalculationId=taxable.distributionCalculationId;
    this.imponible.idDiscountRate=taxable.idDiscountRate;
    this.imponible.idApply=taxable.idApply;
    this.imponible.idPurchaseOrderTaxableDeductible= taxable.idPurchaseOrderTaxableDeductible;
    this.imponible.indDeductible=taxable.indDeductible;
    this.imponible.indTaxable=taxable.indTaxable;
    this.imponible.idPurchaseOrderDetail=taxable.idPurchaseOrderDetail;
    this.imponible.active= taxable.active;
    this.imponible.rate=taxable.rate;
    this.imponible.amount= taxable.amount;
  }


}
