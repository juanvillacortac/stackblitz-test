import { Component, Input, OnInit } from '@angular/core';
import { DataviewModel } from 'src/app/models/common/dataview-model';
import { InventoryProductInfo } from 'src/app/models/srm/inventoryproduct-info';
import {OverlayPanel} from 'primeng/overlaypanel';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ModalOrderPointComponent } from 'src/app/modules/srm/dashboard/dashboard-modal/modal-order-point/modal-order-point.component';
@Component({
  selector: 'app-dataview-list-product',
  templateUrl: './dataview-list-product.component.html',
  styleUrls: ['./dataview-list-product.component.scss']
})
export class DataviewListProductComponent implements OnInit {
  @Input("paginator") paginator: boolean = false;  
  @Input("dataViewModel") dataViewModel: DataviewModel;
  ButtomImage: string;
  listProduct:InventoryProductInfo[]=[];
  linkview:boolean;
  constructor(public dialogService: DialogService, public messageService: MessageService) { }

  ngOnInit(): void {
    this.linkview=this.dataViewModel.linkTitleIn;
  
      
  }
  ref: DynamicDialogRef;
  /* Open(idOrder:number){
    this.ref.close(0);
    this.router.navigate(['srm/purchase-order', idOrder]);
  } */
  btnClick(nromodal:number,item:DataviewModel)
  {

    switch (nromodal) {
      case 1:
        this.ref = this.dialogService.open(ModalOrderPointComponent, {
          data: {
            id: item//buscar id de proveedor
        },
          header: 'Puntos de pedido',
          width: '40%',
          contentStyle: {"max-height": "400px", "overflow": "auto"},
          baseZIndex: 10000
      });
        break; 
       
    
      default:
        break;
    }

  }
}
