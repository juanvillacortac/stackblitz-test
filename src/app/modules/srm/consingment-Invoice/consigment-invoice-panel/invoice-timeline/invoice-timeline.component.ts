import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, PrimeIcons } from 'primeng/api';
import { ConsingmentInvoice, ConsingmentInvoiceFilters } from 'src/app/models/srm/consingmentinvoice/consingmentinvoices';
import { InvoiceTimeLine } from 'src/app/models/srm/consingmentinvoice/invoice-timeline';
import { InvoiceStatus } from 'src/app/models/srm/reception';
import { ConsigmentinvoiceService } from '../../../shared/services/consignmnet-invoice/consigmentinvoice.service';

@Component({
  selector: 'app-invoice-timeline',
  templateUrl: './invoice-timeline.component.html',
  styleUrls: ['./invoice-timeline.component.scss']
})
export class InvoiceTimelineComponent implements OnInit {

  status:  typeof InvoiceStatus = InvoiceStatus
  @Input("showDialog") showDialog: boolean = true;
  @Input("invoiceHeader") invoiceHeader: ConsingmentInvoice = new ConsingmentInvoice();
  @Output() showDialogChange = new EventEmitter<boolean>();
  display = true
  timeline: InvoiceTimeLine[]= undefined
  waiting: boolean = true;



  constructor(public datepipe: DatePipe, private messageService: MessageService, public service: ConsigmentinvoiceService) { }

  ngOnInit(): void {
  }

  hideDialog(): void{
    this.showDialog = false;
    this.showDialogChange.emit(this.showDialog);
    
  }
  show():void{
    this.SearchTimeLine()
  }
  

  SearchTimeLine(){
    let  filters = new ConsingmentInvoiceFilters ()
    filters.id=this.invoiceHeader.id;
    this.service.getTimeline(filters).subscribe((data: InvoiceTimeLine[]) => {
    if(data!=null){
      this.waiting = false;
         this.timeline = data;
         if(this.timeline.length>0){
           let cont=0;
          for (let i = 0; i < this.timeline.length; i++) {
            cont += 1; 
            if(this.timeline[i].idStatus==this.status.pending)
            {         
                this.timeline[i].color= "#EA2027";
                this.timeline[i].icon=PrimeIcons.CLOCK;
            }
            else if(this.timeline[i].idStatus==this.status.started)
            {         
                this.timeline[i].color= "#fa8231";
                this.timeline[i].icon=PrimeIcons.PENCIL;
            }
            else if(this.timeline[i].idStatus==this.status.finalized)
            {         
                this.timeline[i].color= "#f7b731";
                this.timeline[i].icon=PrimeIcons.CHECK_SQUARE;
            }
            else if(this.timeline[i].idStatus==this.status.validated)
            {         
                this.timeline[i].color= "#009432";
                this.timeline[i].icon=PrimeIcons.BOOKMARK;
            }else{
              this.timeline[i].color= "#607D8B";
              this.timeline[i].icon=PrimeIcons.BOOK;
            }
        
            this.datepipe.transform(this.timeline[i].ocurrencyDate, "dd/MM/yyyy");
            this.datepipe.transform(this.timeline[i].ocurrencyDate, "dd/MM/yyyy");       
        }
      }
    }else{
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Esta factura no esta auditada" });
    }
  }, (error: HttpErrorResponse)=>{
   
    this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
  });

 }

}
