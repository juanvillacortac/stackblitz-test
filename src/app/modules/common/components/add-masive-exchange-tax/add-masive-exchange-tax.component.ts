import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Company } from 'src/app/models/masters/company';
import { ExchangeRatesSupplier } from 'src/app/models/masters/exchange-rates-suppliers';
import { SupplierExtend } from 'src/app/models/masters/supplier-extend';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';

@Component({
  selector: 'app-add-masive-exchange-tax',
  templateUrl: './add-masive-exchange-tax.component.html',
  styleUrls: ['./add-masive-exchange-tax.component.scss'],
  providers: [DatePipe]
})
export class AddMasiveExchangeTaxComponent implements OnInit {

  @Input() visible: boolean = false;
  @Output("onSubmit") onSubmit = new EventEmitter<{exchangetax:ExchangeRatesSupplier[], identifier: number}>();
  @Output("onToggle") onToggle = new EventEmitter<boolean>();
  @Input("_supplier") _supplier:SupplierExtend;
  @Output("_change") _change = new EventEmitter<ExchangeRatesSupplier>();
  @Input("_ListTemp") _ListTemp: ExchangeRatesSupplier[];
  @Input("showDialog")  showDialog: boolean = false;
  @Output("_ListTempChange") _ListTempChange = new EventEmitter<ExchangeRatesSupplier[]>();
  @Input("_ExchangeRateFilterList") _ExchangeRateFilterList: ExchangeRatesSupplier[];
  _exchange:ExchangeRatesSupplier=new ExchangeRatesSupplier();
  exchange:ExchangeRatesSupplier=new ExchangeRatesSupplier();
  //@Input("filters") filters : InventoryCountFilter;
  submitted: boolean = false;
  identifierToEdit:number=-1
  _OperatorsString: string="";
  OperatorDialogVisible = false;
  _showdialog: boolean = false;
  multiples:boolean=false;
  model:boolean=false;
  coinlist:SelectItem[];
  nameoperator:string="";
  checkAllCompany: boolean = false;
  companieslist: Company[] = [];
  selectedCompanies: any[] = [];


  constructor(private _service:CoinsService,private messageService: MessageService,public datepipe: DatePipe) { }

  ngOnInit(): void {

  }

  submit() 
  {  
     this.submitted = true;
     if(this._exchange.idCurrency >0 && this._exchange.exchangeRate >0  && this.selectedCompanies.length > 0)
     {       
         for (let i = 0; i < this.selectedCompanies.length; i++)
         {
            this.exchange=new ExchangeRatesSupplier();
            this.exchange.idCurrency=this._exchange.idCurrency;
            this.exchange.exchangeRate=this._exchange.exchangeRate;
            this.exchange.idcompany=this.selectedCompanies[i].id;
            this.exchange.currency=this.coinlist.find(x=>x.value==this._exchange.idCurrency).label; 
            this.exchange.createDatestring=this.datepipe.transform(new Date,"yyyy-MM-dd'T'HH:mm:ss");
            this.exchange.createDate=new Date(this.exchange.createDatestring);
            this._ExchangeRateFilterList.push(this.exchange);  
            this.visible = false;
                 
         }
         this.selectedCompanies=[];
         this.onSubmit.emit({
         exchangetax: this._ExchangeRateFilterList,
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
    this.onload(); 
    this.onLoadCompaniesList();  
    this.ngOnInit();
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
    this.selectedCompanies=[];
    this.checkAllCompany=false;
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

  checkAllCompanies(){
    if (this.checkAllCompany) {
      this.selectedCompanies = this.selectedCompanies.filter(x => x.active == false);
      var companyselected: Company[] = [];
      this.companieslist.forEach(company => {
        if (company.active) {
          this.selectedCompanies.push(company);
        }
      });
      //this.selectedCompanies = companyselected;
    }else{
      this.selectedCompanies = this.selectedCompanies.filter(x => x.active == false);
    }
  }

  checkedcompany(e:any)
  {
    if(e.checked)
    {
       if(this.selectedCompanies.length==this.companieslist.filter(x=>x.active).length)
         this.checkAllCompany=true;
    }     
    else
       this.checkAllCompany=false;
  }
  onLoadCompaniesList()
  {
    this.companieslist =this._supplier.companies;     
  }

}
