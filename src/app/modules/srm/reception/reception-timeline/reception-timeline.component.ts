import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReceptionTimeLine } from 'src/app/models/srm/reception-timeline';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MessageService, PrimeIcons} from 'primeng/api';
import { Reception } from 'src/app/models/srm/reception';
import { StatusReception } from '../../shared/Utils/status-reception';
import { ReceptionFilters } from 'src/app/models/srm/reception-filters';
import { ReceptionTimelineFilters } from 'src/app/models/srm/reception/reception-timeline-filters';
import { MerchandiseReceptionService } from '../../shared/services/merchandise-reception/merchandise-reception.service';

@Component({
  selector: 'app-reception-timeline',
  templateUrl: './reception-timeline.component.html',
  styleUrls: ['./reception-timeline.component.scss'],
  providers: [DatePipe]
})
export class ReceptionTimelineComponent implements OnInit {

  statusReception:  typeof StatusReception = StatusReception
  @Input("showDialog") showDialog: boolean = true;
  @Input("reception") reception: Reception = new Reception();
  @Output() showDialogChange = new EventEmitter<boolean>();
  display = true
  timeline: ReceptionTimeLine[]= undefined
  waiting: boolean = true;



  constructor(public datepipe: DatePipe, private messageService: MessageService, public receptionService: MerchandiseReceptionService) { }

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
    let  filters = new ReceptionTimelineFilters()
    filters.idReception=this.reception.id;
    this.receptionService.getTimeline(filters).subscribe((data: ReceptionTimeLine[]) => {
    if(data!=null){
      this.waiting = false;
         this.timeline = data;
         if(this.timeline.length>0){
           let cont=0;
          for (let i = 0; i < this.timeline.length; i++) {
            cont += 1; 
            if(this.timeline[i].idStatus==this.statusReception.pending)
            {         
                this.timeline[i].color= "#EA2027";
                this.timeline[i].icon=PrimeIcons.CLOCK;
            }
            else if(this.timeline[i].idStatus==this.statusReception.started)
            {         
                this.timeline[i].color= "#fa8231";
                this.timeline[i].icon=PrimeIcons.PENCIL;
            }
            else if(this.timeline[i].idStatus==this.statusReception.finalized)
            {         
                this.timeline[i].color= "#f7b731";
                this.timeline[i].icon=PrimeIcons.CHECK_SQUARE;
            }
            else if(this.timeline[i].idStatus==this.statusReception.validated)
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
      console.log('auditoria', this.timeline )
    }else{
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Esta recepcion no esta auditada" });
    }
  }, (error: HttpErrorResponse)=>{
   
    this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar los datos" });
  });

 }
}


