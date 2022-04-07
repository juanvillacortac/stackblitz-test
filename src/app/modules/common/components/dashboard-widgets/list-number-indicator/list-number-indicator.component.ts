import { Component, Input, OnInit, Type } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Typeindicator } from 'src/app/models/common/type-indicator';
import { HeadcountComponent } from 'src/app/modules/hcm/dashboard-modals/employeeCounts/headcount/headcount.component';
import { ModalCategoryComponent } from 'src/app/modules/srm/dashboard/dashboard-modal/modal-category/modal-category.component';

@Component({
  selector: 'app-list-number-indicator',
  templateUrl: './list-number-indicator.component.html',
  styleUrls: ['./list-number-indicator.component.scss'],
  providers: [DialogService]
})
export class ListNumberIndicatorComponent implements OnInit {
  @Input() chartType: any;
  @Input() data: any[] = [];
  @Input() options: any;
  @Input() nroModal:any;
  ListTypeindicators:Typeindicator[];
  lista:any[];
  cantidad: number;
   nroitems:number;
   

  constructor(public dialogService: DialogService, public messageService: MessageService) { }
  ref: DynamicDialogRef;
  show() {


    switch (this.nroModal) {
      case 1:
        this.ref = this.dialogService.open(ModalCategoryComponent, {
          header: 'Categorías más vendidas',
          width: '50%',
          contentStyle: {"max-height": "400px", "overflow": "auto"},
          baseZIndex: 10000
      });
        break;
      case 2:
        this.ref = this.dialogService.open(HeadcountComponent, {
          header: 'Movimientos de trabajadores por empresa',
          width: '70%',
          contentStyle: {"max-height": "500px", "overflow": "auto"},
          baseZIndex: 10000
        })
    
      default:
        break;
    }
  
   

  /*   this.ref.onClose.subscribe((product: Product) =>{
        if (product) {
            this.messageService.add({severity:'info', summary: 'Product Selected', detail: product.name});
        }
    }); */
}
// ngOnDestroy() {
//   if (this.ref) {
//       this.ref.close();
//   }
// }
  ngOnInit(): void {
    this.lista=[];
    this.lista=this.llenararreglo();

  }
llenararreglo(){
  this.ListTypeindicators=this.data;
  this.nroitems=this.ListTypeindicators.length;
  this.cantidad = Math.round(this.nroitems/4) ;

 for(let i=0; i < this.cantidad; i++) {    
  this.lista.push(i+1);
}
return this.lista;

}
}
