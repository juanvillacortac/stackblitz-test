import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Motives } from 'src/app/models/masters/motives';
import { MotivesFilters } from 'src/app/models/masters/motives-filters';
import { MotivesService } from 'src/app/modules/masters/motives/shared/services/motives.service';

@Component({
  selector: 'app-reason-cancel',
  templateUrl: './reason-cancel.component.html',
  styleUrls: ['./reason-cancel.component.scss']
})
export class ReasonCancelComponent implements OnInit {
  reasonList:SelectItem[];
  @Output() onToggle = new EventEmitter<boolean>();
  @Input() visible: boolean = false;
  @Input() onReason = new Motives ();
  @Output() onReasonChange = new EventEmitter<Motives>();
  reason: Motives= new Motives();
  submitted: boolean = false;

  constructor( private messageService: MessageService,
    private _motivesService: MotivesService,) { }

  ngOnInit(): void {
  }

  onshow(){
    this.onReason.id=-1;
    this.onReason.name="";
    this.emitVisible();
    this.getMotivesTypePromise(85); //Orden de compra
  }

  getMotivesTypePromise = (idModule: number) => {
   
    var filter = new MotivesFilters();
    filter.idModule = idModule;
    filter.active=1;
    filter.idMotivesType=22; //ODC
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
