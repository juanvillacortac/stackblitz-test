import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Motives } from 'src/app/models/masters/motives';
import { MotivesFilters } from 'src/app/models/masters/motives-filters';
import { MotivesService } from 'src/app/modules/masters/motives/shared/services/motives.service';

@Component({
  selector: 'app-reason-cancel-reception',
  templateUrl: './reason-cancel-reception.component.html',
  styleUrls: ['./reason-cancel-reception.component.scss']
})
export class ReasonCancelReceptionComponent implements OnInit {
  
  descripcion:string="";
  reasonList:SelectItem[];
  @Output() onToggle = new EventEmitter<boolean>();
  @Input() visible: boolean = false;
  @Input() onReason = new Motives ();
  @Output() onReasonChange = new EventEmitter<Motives>();
  @Input() iscanceled :boolean=false;
  reason: Motives= new Motives();
  submitted: boolean = false;
  constructor(private messageService: MessageService,
    private _motivesService: MotivesService) { }

  ngOnInit( ): void {
  }

  onshow(){
    this.onReason.id=-1;
    this.onReason.name="";
    this.emitVisible();
    this.getMotivesTypePromise(158); //recepcion
    if(this.iscanceled)
      this.descripcion="Motivo de anulación"
    else  
      this.descripcion="Motivo de rechazo"
  }

  getMotivesTypePromise = (idModule: number) => {
   
    var filter = new MotivesFilters();
    filter.idModule = idModule;
    filter.active=1;
    if(this.iscanceled)
       filter.idMotivesType=26; //anulacion VDR
    else
       filter.idMotivesType=25;//rechazo VDR
    this._motivesService.getMotives(filter).then((data: Motives[]) => {
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      this.reasonList = data.map((item)=>({
        label: item.name,
        value: item.id
      }));
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los motivos"});
    });
  //  }
}

save(){
  this.submitted=true;
  if(this.onReason.id>0){
      this.onReasonChange.emit(this.onReason);
      this.submitted=false;
      this.visible = false;
  }
}

emitVisible(){
  this.onToggle.emit(this.visible);
}
onHide(){
  this.emitVisible();
}

}
