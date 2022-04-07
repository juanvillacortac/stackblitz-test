import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService, PrimeIcons} from 'primeng/api';
import { Groupingpurchaseorders } from 'src/app/models/srm/groupingpurchaseorders';
import { TimeLinePurchaseOrder } from 'src/app/models/srm/timeline-purchaseorder';
import { TimeLinePurchaseOrderFilter } from 'src/app/models/srm/timeline-purchaseorder-filter';
import { PurchaseorderService } from '../../shared/services/purchaseorder/purchaseorder.service';
import { StatusPurchase } from '../../shared/Utils/status-purchase';

@Component({
  selector: 'purchase-order-timeline',
  templateUrl: './purchase-order-timeline.component.html',
  styleUrls: ['./purchase-order-timeline.component.scss']
})
export class PurchaseOrderTimelineComponent implements OnInit {
  events1: any[];
  @Input("PucharseOrderHeader") PucharseOrderHeader: Groupingpurchaseorders = new Groupingpurchaseorders();
  @Input("showDialog") showDialog: boolean = true;
  @Input("idPurchase") idPurchase: number;
  @Output() showDialogChange = new EventEmitter<boolean>();
  timeline:TimeLinePurchaseOrder[]=[];
  statuspurchase: typeof StatusPurchase = StatusPurchase;
  waiting: boolean = true;

  
  constructor(private actRoute: ActivatedRoute,public purchaseService: PurchaseorderService,private messageService: MessageService,
    public datepipe: DatePipe) { }

  ngOnInit(): void {
    this.idPurchase = Number(this.actRoute.snapshot.params['id']);
  }
  hideDialog(): void {
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
  }
  show()
  {
    this.SearchTimeLine();
  }

  SearchTimeLine(){

    let  filter= new TimeLinePurchaseOrderFilter();
    filter.idPurchaseOrder=this.PucharseOrderHeader.purchase.idOrderPurchase;
    this.purchaseService.getTimeline(filter).subscribe((data: TimeLinePurchaseOrder[]) => {
    if(data!=null){
      this.waiting = false;
         this.timeline = data;
         if(this.timeline.length>0){
           let cont=0;
          for (let i = 0; i < this.timeline.length; i++) {
            cont += 1; 
            if(this.timeline[i].idStatus==this.statuspurchase.Eraser)
            {         
                this.timeline[i].color= "#9C27B0";
                this.timeline[i].icon=PrimeIcons.SAVE;
            }
            else if(this.timeline[i].idStatus==this.statuspurchase.Elaborated)
            {         
                this.timeline[i].color= "#673AB7";
                this.timeline[i].icon=PrimeIcons.COG;
            }
            else if(this.timeline[i].idStatus==this.statuspurchase.Authorized)
            {         
                this.timeline[i].color= "#28a745";
                this.timeline[i].icon=PrimeIcons.CHECK;
            }
            else if(this.timeline[i].idStatus==this.statuspurchase.ReviewCompleted)
            {         
                this.timeline[i].color= "#FF9800";
                this.timeline[i].icon=PrimeIcons.BOOKMARK;
            }
            else if(this.timeline[i].idStatus==this.statuspurchase.Received)
            {         
                this.timeline[i].color= "#607D8B";
                this.timeline[i].icon=PrimeIcons.TAGS;
            }
            else if(this.timeline[i].idStatus==this.statuspurchase.Canceled)
            {         
                this.timeline[i].color= "#e24a4a";
                this.timeline[i].icon=PrimeIcons.TIMES;
            }
            else
            {
              this.timeline[i].color= "#607D8B";
              this.timeline[i].icon=PrimeIcons.BOOK;
            }
            this.datepipe.transform(this.timeline[i].ocurrencyDate, "dd/MM/yyyy");
            this.datepipe.transform(this.timeline[i].ocurrencyDate, "dd/MM/yyyy");       
        }
      }
    }else{
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "La barra de empaque no esta asociada." });
    }
  }, (error: HttpErrorResponse)=>{
   
    this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
  });

 }
}
