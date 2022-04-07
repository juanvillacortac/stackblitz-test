import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { CountForCountdetail } from 'src/app/models/ims/count-for-detail-count';
import { InventoryCount } from 'src/app/models/ims/inventory-count';
import { OperatorInventoryCount } from 'src/app/models/ims/operator-count';
import { InventoryCountFilter } from '../../shared/filter/inventory-count-filter';
import { InventorycountService } from '../../shared/service/inventorycount.service';

@Component({
  selector: 'add-count-detail',
  templateUrl: './add-count-detail.component.html',
  styleUrls: ['./add-count-detail.component.scss']
})
export class AddCountDetailComponent implements OnInit {
 
  @Input() visible: boolean = false;
  @Output("onSubmit") onSubmit = new EventEmitter<{count: CountForCountdetail, identifier: number}>();
  @Output("onToggle") onToggle = new EventEmitter<boolean>();
  @Output() showDialogCountChange = new EventEmitter<boolean>();
  @Input("_cont") _cont:CountForCountdetail;
  @Input("_conteo") _conteo:InventoryCount;
  @Output("_countChange") _countChange = new EventEmitter<CountForCountdetail>();
  @Input("_CountListTemp") _CountListTemp: CountForCountdetail[];
  @Input("showDialogCount")  showDialogCount: boolean = false;
  @Output("_CountListTempChange") _CountListTempChange = new EventEmitter<CountForCountdetail[]>();
  @Input("filters") filters : InventoryCountFilter;
  @Input("_OperatorListTemp") _OperatorListTemp: OperatorInventoryCount[];
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
    if(this._cont.idOperator > -1 &&  this._cont.count!=null)
    { 
      this._cont.sequence=this._CountListTemp.length+1;
      this._cont.indDefinitive=true;
      this.save();       
      this.showDialogCount =false;
      this.emitVisible();
    }   
  }
  save()
  {
    this._service.InsertcountForInventoryCount(this._cont).subscribe((data) => {
     if (data> 0)
      {
         this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });      
         this.onSubmit.emit({
          count: this._cont,
          identifier: this.identifierToEdit
        }); 
        this.submitted = false;
      }
     else
      {
        if(data==0)
         this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos" });
      }
      }, (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
      });
   }

  onShow()
  {
    this.emitVisible();
    this.ngOnInit();
    this.onloadoperator();
    if(this.operatorlist.length==1)
      this._cont.idOperator=this.operatorlist.find(x=>x.value>-1).value;
  }

  onloadoperator()
  {
    this.operatorlist=this._OperatorListTemp.map<SelectItem>((item)=>({ ///this._conteo.operators.map<SelectItem>((item)=>({
      label: item.operator,
      value: item.idOperator
    }));
  }

  onChange(event:any) 
  {
    this._cont.operator=this.operatorlist.find(x=>x.value==this._cont.idOperator).label;
  } 

  onHide()
  {
    this.showDialogCount=false;
    this.emitVisible();
  }
  
  emitVisible()
  {   
    this.showDialogCountChange.emit(this.showDialogCount);
  }

  showmodal(multples:boolean,models:boolean)
  {
    this.multiples = multples;
    this._showdialogOperator = true;
   }

  onSubmitOperator(data)
  {
    this._cont.operator=data.operator;
    this._cont.idOperator=data.operator.id;
    this._cont.operator=data.operator.name;    
  }

  onHideOperator(visible: boolean)
  {
    this._showdialogOperator= visible;
  }
  
  clear(event){
    if (event.target.value == "0,000") {
      event.target.value =0;
    }
    if (event.target.value == "") {
      event.target.value =0;
    }
  }
}
