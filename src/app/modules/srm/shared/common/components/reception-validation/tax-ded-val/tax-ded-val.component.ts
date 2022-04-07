import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Groupingpurchaseorders } from 'src/app/models/srm/groupingpurchaseorders';
import { Productdetailvalidation } from 'src/app/models/srm/reception/productdetailvalidation';
import { PurchaseValidation } from 'src/app/models/srm/reception/purchasevalidation';
import { DexValComponent } from './dex-val/dex-val.component';
import { TaxValComponent } from './tax-val/tax-val.component';



@Component({
  selector: 'app-tax-ded-val',
  templateUrl: './tax-ded-val.component.html',
  styleUrls: ['./tax-ded-val.component.scss']
})
export class TaxDedValComponent implements OnInit {

  @Input("showDialog") showDialog: boolean = false;
  @Input() indTabdeductible: boolean = false;

  @ViewChild(TaxValComponent) TaxableComponent : TaxValComponent;
  @ViewChild(DexValComponent) DeductibleComponent: DexValComponent;
  @Input("ProductOrder") ProductOrder:Productdetailvalidation;
   @Input("Purchase") Purchase:PurchaseValidation;
  @Input("subtotalHeader") subtotalHeader:number= 0;
  // @Input("_products") _products: PurchaseOrderProduct[];
  @Input("_products") _products: Productdetailvalidation[]; //ProductsMAsivos
  indactive: boolean = false;
  activeIndex: number = 0;
  @Output() showDialogChange = new EventEmitter<boolean>();
  // @Output("_sendTaxablesList") _sendTaxablesList = new EventEmitter<{ TaxableListSave : Taxabledeductible}>();
  // @Output("_sendTaxablesHeaderList") _sendTaxablesHeaderList = new EventEmitter<{ TaxableListHeaderSave : Taxabledeductible}>();
  // @Output("_sendTaxablesHeaderListProd") _sendTaxablesHeaderListProd = new EventEmitter<{ TaxableListHeaderSave : Taxabledeductible}>();
  // TaxableListSave:Taxabledeductible = new Taxabledeductible();
  // TaxableListHeaderSave:Taxabledeductible = new Taxabledeductible();

  //Envio de product detail a tab de precios
  @Output("_sendTaxablesProd") _sendTaxablesProd = new EventEmitter<{ProductDetail: Productdetailvalidation}>();
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
    }
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
  }

  sendProd(data){
    debugger;
    console.log(data)
    this._sendTaxablesProd.emit({ProductDetail:data.TaxDetailProd});
  }
}
