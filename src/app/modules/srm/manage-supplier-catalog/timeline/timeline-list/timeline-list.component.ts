import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, PrimeIcons } from "primeng/api";
import { Productsxsupplier } from 'src/app/models/srm/productsxsupplier';
import { Providertimeline } from 'src/app/models/srm/providertimeline';
import { ProviderTimelineFilter } from '../../../shared/filters/provider-timeline-filter';
import { SuppliercatalogService } from '../../../shared/services/suppliercatalog/suppliercatalog.service';
import { SupplierCatalog } from '../../../shared/view-models/supplier-catalog.viewmodel';

@Component({
  selector: 'app-timeline-list',
  templateUrl: './timeline-list.component.html',
  styleUrls: ['./timeline-list.component.scss']
})
export class TimelineListComponent implements OnInit {
  
  @Input("showDialogLine") showDialogLine : boolean =false;
  @Input("idsupplierproduct") idsupplierproduct : SupplierCatalog ;
  _supplierproduc: ProviderTimelineFilter = new ProviderTimelineFilter();
  events1: any[];
  @Output() showDialogLineChange = new EventEmitter<boolean>();
  timelineproduct: Providertimeline [] = [];
  constructor(public _suppliercatalogservice: SuppliercatalogService,
    private messageService: MessageService,
    public datepipe: DatePipe) { }

  ngOnInit() {
    if(this.idsupplierproduct.idProductSupplier!=-1){
          this._supplierproduc.id=this.idsupplierproduct.idProductSupplier;
          this.SearchTimeLine();
        }
 
    this.events1 = [
      {
        status: "Ordered",
        date: "15/10/2020 10:30",
        icon: PrimeIcons.SHOPPING_CART,
        color: "#9C27B0",
        image: "game-controller.jpg"
      },
      {
        status: "Processing",
        date: "15/10/2020 14:00",
        icon: PrimeIcons.COG,
        color: "#673AB7"
      },
      {
        status: "Shipped",
        date: "15/10/2020 16:15",
        icon: PrimeIcons.ENVELOPE,
        color: "#FF9800"
      },
      {
        status: "Delivered",
        date: "16/10/2020 10:00",
        icon: PrimeIcons.CHECK,
        color: "#607D8B"
      }
    ];
  }

  hideDialogLine(){
  
    this.showDialogLine = false;
    this.timelineproduct=[];
    this.showDialogLineChange.emit(this.showDialogLine);
  }

  SearchTimeLine(){
      this._suppliercatalogservice.getSupplierProductTimeline(this._supplierproduc).subscribe((data: Providertimeline[]) => {
      if(data!=null){
           this.timelineproduct = data;
           if(this.timelineproduct.length>0){
             let cont=0;
            for (let i = 0; i < this.timelineproduct.length; i++) {
              cont += 1;
              this.timelineproduct[i].image="";
              this.timelineproduct[i].image="https://www.allianceplast.com/wp-content/uploads/no-image.png";
              
              this.timelineproduct[i].color= "#607D8B";
              this.timelineproduct[i].icon=PrimeIcons.CHECK;
              this.datepipe.transform(this.timelineproduct[i].dateCreate, "dd/MM/yyyy");
              this.datepipe.transform(this.timelineproduct[i].dateUpdate, "dd/MM/yyyy");
              console.log(this.timelineproduct);
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
