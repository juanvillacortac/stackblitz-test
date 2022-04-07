import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Groupingpurchaseorders } from 'src/app/models/srm/groupingpurchaseorders';
import { PurchaseOrderProduct } from 'src/app/models/srm/purchase-order-product';
import { Taxabledeductible } from 'src/app/models/srm/taxabledeductible';
import { DeductibleComponent } from './deductible/deductible.component';
import { TaxableComponent } from './taxable/taxable.component';

@Component({
  selector: 'app-taxable-deductible',
  templateUrl: './taxable-deductible.component.html',
  styleUrls: ['./taxable-deductible.component.scss']
})
export class TaxableDeductibleComponent implements OnInit {
  //@Input() visible: boolean = false;
  @Input("showDialog") showDialog: boolean = false;
  @Input() indTabdeductible: boolean = false;

  @ViewChild(TaxableComponent) TaxableComponent : TaxableComponent;
  @ViewChild(DeductibleComponent) DeductibleComponent: DeductibleComponent;
  @Input("ProductOrder") ProductOrder:PurchaseOrderProduct;
  @Input("PurchaseOrder") PurchaseOrder:Groupingpurchaseorders;
  @Input("subtotalHeader") subtotalHeader:number= 0;
  @Input("_products") _products: PurchaseOrderProduct[];
  @Output("_productsChange") _productsChange = new EventEmitter<PurchaseOrderProduct[]>();
  indactive: boolean = false;
  activeIndex: number = 0;
  @Output() showDialogChange = new EventEmitter<boolean>();
  @Output("_sendTaxablesList") _sendTaxablesList = new EventEmitter<{ TaxableListSave : Taxabledeductible}>();
  @Output("_sendTaxablesHeaderList") _sendTaxablesHeaderList = new EventEmitter<{ TaxableListHeaderSave : Taxabledeductible}>();
  @Output("_sendTaxablesHeaderListProd") _sendTaxablesHeaderListProd = new EventEmitter<{ TaxableListHeaderSave : Taxabledeductible}>();
  TaxableListSave:Taxabledeductible = new Taxabledeductible();
  TaxableListHeaderSave:Taxabledeductible = new Taxabledeductible();
  @Output("updateSelectdProducts") updateSelectdProducts = new EventEmitter();
  constructor() { }

  ngOnInit(): void {

  }
  onShow() {
    if (this.indTabdeductible) {
      this.indactive = true;
      this.activeIndex=1;
      this.DeductibleComponent.onShowDeductible();
     
    }
    else {
      this.indactive = false;
      this.activeIndex=0;
      this.TaxableComponent.onShowTaxable();
    }
  }

  onHide() {
    debugger
    if(this.indactive){
        this.DeductibleComponent.deductiblesListTemp=[];
        this.DeductibleComponent.deductiblesfijo=[];
        this.DeductibleComponent.TaxabledeductibleList.deductibles =[];
        this.DeductibleComponent.selectedDeductible=[];
        this.DeductibleComponent.deductibles.idDiscountRate=-1;
        this.DeductibleComponent.deductibles.taxableDeductibleBase="";
        //this.DeductibleComponent.deductibles.idRate=-1;
        this.DeductibleComponent.deductibles.rate=0;
        this.DeductibleComponent.deductibles.amount=0;
        this.DeductibleComponent.deductibles.distributionCalculationId=-1
        this.DeductibleComponent.deductibles.idApply=-1;
        this._products=[];
        this._productsChange.emit(this._products);
    }else{
        this.TaxableComponent.txablesListTemp=[]; 
        this.TaxableComponent.TaxabledeductibleList.taxables =[]
        this.TaxableComponent.selectedTaxable=[];
        this.TaxableComponent.taxables.idTax=-1;
        this.TaxableComponent.taxables.taxableDeductibleBase="";
        this.TaxableComponent.taxables.idRate=-1;
        this.TaxableComponent.taxables.rate=0;
        this.TaxableComponent.taxables.amount=0;
        this.TaxableComponent.taxables.distributionCalculationId=-1
        this.TaxableComponent.taxables.idApply=-1;
        this._products=[];
        this._productsChange.emit(this._products);
        this.updateSelectdProducts.emit();
    }
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
  }

sendList(data){
    this._sendTaxablesList.emit(data);
}

sendListTaxableHeader(data){
   this._sendTaxablesHeaderList.emit(data);
}

sendListTaxableHeaderDetailProd(data){
  this._sendTaxablesHeaderListProd.emit(data);
}

// UpdateSelectdProducts(){

// }

}
