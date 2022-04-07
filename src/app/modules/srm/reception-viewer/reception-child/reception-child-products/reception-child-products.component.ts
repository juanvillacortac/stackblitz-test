import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DetailReception } from 'src/app/models/srm/detailreception';
import { ChildReception, Reception, ReceptionStatus } from 'src/app/models/srm/reception';
import { ProductDetailLoteComponent } from '../../../reception/reception-tabmenu/reception/products/product-detail-lote/product-detail-lote.component';
import { ProductDetailComponent } from '../../../reception/reception-tabmenu/reception/products/product-detail/product-detail.component';
import { ProductListComponent } from '../../../reception/reception-tabmenu/reception/products/product-list/product-list.component';
import { PurchaseOrderReceptionComponent } from '../../../reception/reception-tabmenu/reception/products/purchase-order-reception/purchase-order-reception.component';
import * as Permissions from '../../../../security/users/shared/user-const-permissions';
import { BaseModel } from 'src/app/models/common/BaseModel';

@Component({
  selector: 'app-reception-child-products',
  templateUrl: './reception-child-products.component.html',
  styleUrls: ['./reception-child-products.component.scss']
})
export class ReceptionChildProductsComponent implements OnInit {

  @Input() childReception: ChildReception = new ChildReception();
  statusreception: typeof ReceptionStatus  = ReceptionStatus;

  permissionsIDs = {...Permissions};

  reception: Reception = new Reception();
  product: DetailReception = new DetailReception();
  @ViewChild(ProductListComponent) productListComponent: ProductListComponent;
  @ViewChild(ProductDetailComponent) weigthproductComponent: ProductDetailComponent;
  @ViewChild(ProductDetailLoteComponent) productDetailLoteComponent: ProductDetailLoteComponent;
  @ViewChild(PurchaseOrderReceptionComponent) purchaseOrderReceptionComponent: PurchaseOrderReceptionComponent;
  @Output('haveChange') haveChange = new EventEmitter<boolean>();
  index: number = 0;

  constructor() { }

  ngOnInit(): void {  
    let element: HTMLElement = document.getElementsByClassName('sidebar-pin')[0] as HTMLElement;
    element.click();  
  }

  onshow(){
    this.getReceptionData();
    if(this.index==0)
      this.productListComponent.onshow();
  }
  handleChange(e) {
     this.index=e.index;
     if(this.index==0)
     {
       this.productListComponent.onshow();
       this.productListComponent.onRowUnselect(e);
     } else {
       if(this.index==1){
        this.weigthproductComponent.onshow(this.product);
       } else {
        if(this.index==2) {
          this.productDetailLoteComponent.onshow(this.product);
        }
       }
     }
  }

  asignproduct(data)
  { 
     if(data !=null)
     { 
       this.product = data.detail;     
     }
  }

  private getReceptionData() {
    this.reception.id = this.childReception.receptionId;
    this.reception.receptionAreaId = this.childReception.receptionId;
    this.reception.purchaseOrderRelatedId = this.childReception.purchaseOrderRelatedId;
    this.reception.purchaseId = this.childReception.purchaseId;
    this.reception.receivingOperator = new BaseModel();
    this.reception.receivingOperator.id = this.childReception.receivingOperatorId;
    this.reception.estatus = this.childReception.statusId;
  }
  haveproduct(data){
    this.haveChange.emit(data);
  }

}