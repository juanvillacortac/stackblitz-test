import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ColumnD } from 'src/app/models/common/columnsd';
import { MotivesFilters } from 'src/app/models/masters/motives-filters';
import { MotivesTypeFilters } from 'src/app/models/masters/motives-type-filters';
import { DetailReception } from 'src/app/models/srm/detailreception';
import { DiferencesReception } from 'src/app/models/srm/diferencesreception';
import { Reception } from 'src/app/models/srm/reception';
import { MotivesService } from 'src/app/modules/masters/motives/shared/services/motives.service';
import { MerchandiseReceptionService } from '../../../../services/merchandise-reception/merchandise-reception.service';

@Component({
  selector: 'app-modal-diferences-reception',
  templateUrl: './modal-diferences-reception.component.html',
  styleUrls: ['./modal-diferences-reception.component.scss']
})
export class ModalDiferencesReceptionComponent implements OnInit {

  @Input() visible = false;
  @Input("_product") _product:DetailReception =new DetailReception();
  @Input("reception") reception: Reception;
  @Output() onToggle = new EventEmitter<boolean>();
  @Output("onSubmit") onSubmit = new EventEmitter<{total: number}>();
  @ViewChild('dt') dt: Table;
  load: boolean = false;
  submitted = false;
  isdisabled: boolean = true;
  diferencesReception = new DiferencesReception();
  _DetailListTemp: DiferencesReception[] = [];
  list: DiferencesReception[] = []
  motivelist:any[];
  typemotivelist:any[];
  listaux:DiferencesReception[] = []
  filters: DiferencesReception = new DiferencesReception();
  quantitytotal: number = 0;


  displayedColumns: ColumnD<DiferencesReception>[] =
    [     
      { template: (data) => { return data.motive; }, field: 'motive', header: 'Motivo', display: 'table-cell' },
      { template: (data) => { return data.quantity; }, field: 'quantity', header: 'Diferencia', display: 'table-cell' },
      { template: (data) => { return data.observation; }, field: 'observation', header: 'Observación', display: 'table-cell' },
      { field:'indDevolucion',header: 'Devolución' ,display: 'table-cell' },
    ];
  constructor(private _service:MerchandiseReceptionService,private _motivesService: MotivesService,private messageService: MessageService) { }

  ngOnInit(): void {
  }
  add()
  { 
    this.submitted = true;
      if ((this.diferencesReception.quantity > 0 && this.diferencesReception.idmotive>0))
      {
        if( this._DetailListTemp.findIndex(x=>x.idmotive==this.diferencesReception.idmotive)==-1)
        {
         this.diferencesReception.idTypemotive=21;
         this.diferencesReception.motive = this.motivelist.find(x=>x.value == this.diferencesReception.idmotive).label;
         this.diferencesReception.idProduct=this._product.productId;
         this.diferencesReception.receptionId=this.reception.id;
         this._DetailListTemp.push(this.diferencesReception);
         this.quantitytotal = this._DetailListTemp.reduce((subtotal, item) => subtotal + item.quantity, 0)
         this.dt.reset();
         this.submitted = false;
         this.diferencesReception=new DiferencesReception();
         if(this._product.purchaseReception.diferencesUnits < 0)
          this.diferencesReception.unitDiferences=this._product.purchaseReception.diferencesUnits*-1; 
          else 
          this.diferencesReception.unitDiferences=this._product.purchaseReception.diferencesUnits
        }
        else
          this.messageService.add({severity: 'error', summary: 'Error', detail: "No puede agreaga el mismo motivo." });
      }   
  }
  apply()
  { 
    if (this._DetailListTemp.length > 0)
    {
     if(this.quantitytotal == this.diferencesReception.unitDiferences)
     {
      this._service.addDiferences(this._DetailListTemp).subscribe((data: number) => {
        if (data > 0) {
          this.messageService.add({severity: 'success', summary: 'Guardado', detail: "Guardado exitoso." });
          this.visible = false;
          this.emitVisible();
        }
      });
     }
     else if(this.quantitytotal > this.diferencesReception.unitDiferences)
      this.messageService.add({severity:'error', summary:'Error', detail: "No puede añadir una cantidad mayor a la diferencia indicada."});  
     else
       this.messageService.add({severity:'error', summary:'Error', detail: "No puede añadir una cantidad maenor a la diferencia indicada."});
    }
  }
  onRemove(diferencesReception: DiferencesReception) {
    this.quantitytotal = this.quantitytotal - diferencesReception.quantity;
    this._DetailListTemp=this._DetailListTemp.filter(x => x!=diferencesReception);
  }
  onShow() {
    this.submitted = false;
    this.emitVisible();
    this.ngOnInit();
    this._DetailListTemp = [];
    this.diferencesReception=new DiferencesReception();
    if(this._product.purchaseReception.diferencesUnits < 0)
    {
      this.diferencesReception.unitDiferences=this._product.purchaseReception.diferencesUnits*-1;
      this.diferencesReception.quantity=this._product.purchaseReception.diferencesUnits*-1;
    }
    else
    {
      this.diferencesReception.unitDiferences=this._product.purchaseReception.diferencesUnits;
      this.diferencesReception.quantity=this._product.purchaseReception.diferencesUnits;
    }
    this.list=[];
    this.listaux=[];
    this.loadmotive();
    this.loaddiferences();

  }
  onHide() {
    this.submitted = false;
    this.dt.reset();
    this.emitVisible();
    this._DetailListTemp = [];
    this.listaux=[];
    this.list=[];
  }

  emitVisible() {
    this.onToggle.emit(this.visible);
  }
  clear(event) {
    if (event.target.value == "0,000") {
      event.target.value = 0;
    }
    if (event.target.value == "") {
      event.target.value = 0;
    }
  }
  loadmotive()
  {
    let motivesFilters=new MotivesFilters();
    motivesFilters.active=1;
    motivesFilters.idMotivesType=21; //motivo devolucion
    this._motivesService.gettMotives(motivesFilters).subscribe((data) => {
      data = data.sort((a, b) => a.name.localeCompare(b.name));
       this.motivelist= data.map((item) => ({
        label: item.name,
        value: item.id
      }));
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los motivos"});
    });

  }
  loadtypemotive(){
    let motivesTypeFilters=new MotivesTypeFilters()
    motivesTypeFilters.active=1
    this._motivesService.getMotiveTypes(motivesTypeFilters)
      .subscribe((data) => {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
         this.typemotivelist= data.map((item) => ({
          label: item.name,
          value: item.id
        }));
    }, ()=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando tipos de motivos"});
    });
  } 

  loaddiferences(){
    let Filters=new DiferencesReception();
    Filters.idProduct=this._product.productId;
    Filters.receptionId=this.reception.id; //motivo devolucion
    this._service.getdiferences(Filters).subscribe((data:DiferencesReception[]) => {
      if(data.length >0){
      this._DetailListTemp=data;
      this.quantitytotal = this._DetailListTemp.reduce((subtotal, item) => subtotal + item.quantity, 0);}
    }, (error: HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error cargando los motivos"});
    });
  }
  resetForm(idTypemotive:number){
    this.motivelist=[];
    this.diferencesReception.idmotive=-1;
    if(this.diferencesReception.idTypemotive!=-1)
       this.loadmotive();

  }
}
