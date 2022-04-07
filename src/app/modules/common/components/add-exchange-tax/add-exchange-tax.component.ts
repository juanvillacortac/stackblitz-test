import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ExchangeRatesSupplier } from 'src/app/models/masters/exchange-rates-suppliers';
import { SupplierExtend } from 'src/app/models/masters/supplier-extend';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';

@Component({
  selector: 'app-add-exchange-tax',
  templateUrl: './add-exchange-tax.component.html',
  styleUrls: ['./add-exchange-tax.component.scss'],
  providers: [DatePipe]
})
export class AddExchangeTaxComponent implements OnInit {

  @Input() visible: boolean = false;
  @Output("onSubmit") onSubmit = new EventEmitter<{exchangetax:ExchangeRatesSupplier, identifier: number}>();
  @Output("onToggle") onToggle = new EventEmitter<boolean>();
  @Input("_supplier") _supplier:SupplierExtend;
  @Output("_change") _change = new EventEmitter<ExchangeRatesSupplier>();
  @Input("_ListTemp") _ListTemp: ExchangeRatesSupplier[];
  @Input("showDialog")  showDialog: boolean = false;
  @Input("idCompany") idCompany: number;
  @Output("_ListTempChange") _ListTempChange = new EventEmitter<ExchangeRatesSupplier[]>();
  _exchange:ExchangeRatesSupplier=new ExchangeRatesSupplier();
  //@Input("filters") filters : InventoryCountFilter;
  submitted: boolean = false;
  identifierToEdit:number=-1
  _OperatorsString: string="";
  OperatorDialogVisible = false;
  _showdialog: boolean = false;
  multiples:boolean=false;
  model:boolean=false;
  today:Date=new Date();
  coinlist:SelectItem[];
  nameoperator:string="";

  constructor(private _service:CoinsService,private messageService: MessageService, public datepipe: DatePipe) { }

  ngOnInit(): void {

  }

  submit() 
  {
    this.submitted = true;
    if(this._exchange.idCurrency >0 && this._exchange.exchangeRate >0 )
    {
      this._exchange.idcompany=this.idCompany;
      this._exchange.createDatestring=this.datepipe.transform(new Date,"yyyy-MM-dd'T'HH:mm:ss");
      this._exchange.createDate=new Date(this._exchange.createDatestring);
      this.visible = false;
      this.onSubmit.emit({
        exchangetax: this._exchange,
        identifier: this.identifierToEdit
      });
      this.emitVisible(); 
      this.submitted =false;
     }
  }
  
  edit(exchangetax:ExchangeRatesSupplier, identifier: number){
    this._exchange = Object.assign({},exchangetax);
    this.identifierToEdit = identifier;
    this.visible = true;
  }
  onShow()
  {
    this.submitted =false;
    this.emitVisible();
    this.ngOnInit();
    this.onload();   
  }

  onload()
  {
    this._service.getCoinsList(   {
      id:-1,
      name:"",
      idtype:-1,
      abbreviation:"",
      active:1,
   })
   .subscribe((data)=>{
     this.coinlist= data.sort((a, b) => a.name.localeCompare(b.name)).map((item)=>({
       label: item.name,
       value: item.id
     }));
   },(error)=>{
     console.log(error);
   });  
  }
  onHide()
  {
    this.submitted =false;
    this.visible=false;
    this._exchange = new ExchangeRatesSupplier(); 
    this.identifierToEdit = -1;
    this.emitVisible();
  }
  
  emitVisible()
  {   
    this.onToggle.emit(this.visible);
  }

  showmodal(multples:boolean,models:boolean)
  {
    this.multiples = multples;
    this.visible= true;
   }

  onHideOperator(visible: boolean)
  {
    this.visible= visible;
  }
  
  onChange(event:any) 
  {
    this._exchange.currency=this.coinlist.find(x=>x.value==this._exchange.idCurrency).label;
  } 

}
