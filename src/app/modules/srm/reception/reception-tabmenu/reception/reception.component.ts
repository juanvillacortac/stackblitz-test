import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DetailReception } from 'src/app/models/srm/detailreception';
import { Reception } from 'src/app/models/srm/reception';
import { ProductDetailLoteComponent } from './products/product-detail-lote/product-detail-lote.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { PurchaseOrderReceptionComponent } from './products/purchase-order-reception/purchase-order-reception.component';

@Component({
  selector: 'app-reception',
  templateUrl: './reception.component.html',
  styleUrls: ['./reception.component.scss']
})
export class ReceptionComponent implements OnInit {

  @Input("reception") reception:Reception
  @Input("_product") _product: DetailReception = new DetailReception();
  @ViewChild(ProductListComponent) productListComponent: ProductListComponent;
  @ViewChild(ProductDetailComponent) weigthproductComponent: ProductDetailComponent;
  @ViewChild(ProductDetailLoteComponent) productDetailLoteComponent: ProductDetailLoteComponent;
  @ViewChild(PurchaseOrderReceptionComponent) purchaseOrderReceptionComponent: PurchaseOrderReceptionComponent;
  indexx: number = 0;
  @Output('haveChange') haveChange = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit(): void {
    let element: HTMLElement = document.getElementsByClassName('sidebar-pin')[0] as HTMLElement;
    element.click();
  }
  onshow(){
    if(this.indexx==0)
      this.productListComponent.onshow();
  }
  handleChange(e) {
     this.indexx=e.index;
     if(this.indexx==0)
     {
       this.productListComponent.onshow();
       this.productListComponent.onRowUnselect(e);
     }
     if(this.indexx==1){
       this.weigthproductComponent.onshow(this._product);
     }
     if(this.indexx==2)
       this.purchaseOrderReceptionComponent.onshow(this.reception);
    if(this.indexx==3)
      this.productDetailLoteComponent.onshow(this._product);
  }
  asignproduct(data)
  { 
     if(data !=null)
     { 
       this._product=data.detail;     
     }
  }

  haveproduct(data){
    this.haveChange.emit(data);
  }

}
