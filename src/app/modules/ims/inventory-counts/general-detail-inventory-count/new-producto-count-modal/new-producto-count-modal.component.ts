import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { CountForCountdetail } from 'src/app/models/ims/count-for-detail-count';
import { DetailInventoryCount } from 'src/app/models/ims/detail-inventory-count';
import { InventoryCount } from 'src/app/models/ims/inventory-count';
import { InventoryCountFilter } from '../../shared/filter/inventory-count-filter';
import { InventorycountService } from '../../shared/service/inventorycount.service';

@Component({
  selector: 'app-new-producto-count-modal',
  templateUrl: './new-producto-count-modal.component.html',
  styleUrls: ['./new-producto-count-modal.component.scss']
})
export class NewProductoCountModalComponent implements OnInit {

  @Input() visible: boolean = false;
  @Output("onSubmit") onSubmit = new EventEmitter<{detail: DetailInventoryCount, identifier: number}>();
  @Output("onToggle") onToggle = new EventEmitter<boolean>();
  @Output() showDialogNewChange = new EventEmitter<boolean>();
  @Input("_cont") _cont:DetailInventoryCount;
  @Input("_conteo") _conteo:InventoryCount;
  @Output("_countChange") _countChange = new EventEmitter<CountForCountdetail>();
  @Input("_CountListTemp") _CountListTemp: CountForCountdetail[];
  @Input("showDialogNew")  showDialogNew: boolean = false;
  @Output("_CountListTempChange") _CountListTempChange = new EventEmitter<CountForCountdetail[]>();
  @Input("filters") filters : InventoryCountFilter;
  submitted: boolean = false;
  identifierToEdit:number=-1
  _OperatorsString: string="";
  OperatorDialogVisible = false;
  _showdialogOperator: boolean = false;
  multiples:boolean=false;
  model:boolean=false;
  operatorlist:SelectItem[];
  nameoperator:string="";

  constructor(private _service: InventorycountService,private messageService: MessageService) { }

  ngOnInit(): void {

  }

  submit() 
  {
    this.submitted = true;
    if(this._cont.idProduct > 0)
    { 
      //this._cont.=this._CountListTemp.length+1;
      //this._cont.indDefinitive=true;
      this.save();       
      this.showDialogNew =false;
      this.emitVisible();
    }   
  }
  save()
  {
    // this._service.InsertcountForInventoryCount(this._cont).subscribe((data) => {
    //  if (data> 0)
    //   {
    //      this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });      
    //      this.onSubmit.emit({
    //       count: this._cont,
    //       identifier: this.identifierToEdit
    //     }); 
    //     this.submitted = false;
    //   }
    //  else
    //   {
    //     if(data==0)
    //      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
    //   }
    //   }, (error: HttpErrorResponse) => {
    //     this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
    //   });
   }

  onShow()
  {
    this.emitVisible();
    this.ngOnInit();
  }

  onHide()
  {
    this.showDialogNew=false;
    this.emitVisible();
  }
  
  emitVisible()
  {   
    this.showDialogNewChange.emit(this.showDialogNew);
  }

  showmodal(multples:boolean,models:boolean)
  {
    this.multiples = multples;
    this._showdialogOperator = true;
   }

}
