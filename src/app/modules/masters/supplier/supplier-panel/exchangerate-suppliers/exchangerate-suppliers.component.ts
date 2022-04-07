
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ColumnD } from 'src/app/models/common/columnsd';
import { ExchangeRatesSupplier } from 'src/app/models/masters/exchange-rates-suppliers';
import { SupplierExtend } from 'src/app/models/masters/supplier-extend';

@Component({
  selector: 'app-exchangerate-suppliers',
  templateUrl: './exchangerate-suppliers.component.html',
  styleUrls: ['./exchangerate-suppliers.component.scss'],
  providers: [DatePipe]
  
})
export class ExchangerateSuppliersComponent implements OnInit {
  public _exchangeCopy: ExchangeRatesSupplier[];
  @Input("_dataSupplierExchangeRate") _dataSupplierExchangeRate: SupplierExtend;
  @Input("_CompaniesListTemp") _CompaniesListTemp: any[] = [];
  echangerateexpanded: number = -1;
  idCompany : number = 0;
  _ExchangeRateFilterList : ExchangeRatesSupplier[] = []; 
  SelectedExchangeRate:ExchangeRatesSupplier = new ExchangeRatesSupplier();
  exchangerateDialogVisible = false;
  exchangerateMasiveDialogVisible = false;
  displayedColumnsCustomTaxes: ColumnD<ExchangeRatesSupplier>[] =
    [
      { template: (data) => { return data.idExchangeRateSupplier; }, header: 'id ', field: 'idExchangeRateSupplier', display: 'none' },
      { template: (data) => { return data.idCurrency; }, header: 'id Moneda', field: 'idurrency', display: 'none' },
      { template: (data) => { return data.currency; }, header: 'Moneda', field: 'currency', display: 'table-cell' },
      { template: (data) => { return data.exchangeRate.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}); }, header: 'Tasa de cambio', field: 'exchangeRate', display: 'table-cell' },
      { template: (data) => { return this.datepipe.transform(data.createDate,"dd/MM/yyyy"); }, header: 'Fecha de creación', display: 'table-cell',field: 'createDate' }
    ];

  constructor(public datepipe: DatePipe) { }

  ngOnInit(): void {
  }

  searchExhangeRatesByIdCompany(id: number,e:Event)
  {
    e.stopPropagation();  
    this.idCompany = id;
    this._ExchangeRateFilterList = this._dataSupplierExchangeRate.exchangeRates.filter(x=>x.idcompany == id )
                                                                                .sort((a, b) => new Date(b.createDate).getTime()- new Date(a.createDate).getTime());
  }

  onTabOpen(e)
  {
    var index = e.index;
    var a =  this._dataSupplierExchangeRate.exchangeRates[index];
    this._ExchangeRateFilterList = this._dataSupplierExchangeRate.exchangeRates.filter(x=>x.idcompany == a.idcompany )
                                                                                .sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());
  }

  showAddExchangeRateModal(event,id : number){
    event.stopPropagation();
    this.idCompany = id;
    this.exchangerateDialogVisible = true;
    //this.contactexpanded = id;
  }

  onToggleExchange(visible: boolean) {
    this.exchangerateDialogVisible = visible;
  }

  validateExchange(exchange: ExchangeRatesSupplier, identifier: number) {
    this._exchangeCopy = [];
    this._dataSupplierExchangeRate.exchangeRates.forEach(element => {
      this._exchangeCopy.push(element);
    });
    if (identifier == -1) {
      this._exchangeCopy.push(exchange);
    } else {
      this._exchangeCopy.splice(identifier, 1, exchange);
    }

    var index = this._dataSupplierExchangeRate.exchangeRates.findIndex(x => x.idCurrency == exchange.idCurrency);

    if (index >= 0 && index == identifier || index < 0) {
      return null;
    } else {
      return "Ya se existe una tasa de cambio asociada a la moneda.";
    }
  }
  onSubmitExchange(data) 
  {
    this._dataSupplierExchangeRate.exchangeRates.push(data.exchangetax);
    this._ExchangeRateFilterList =  this._dataSupplierExchangeRate.exchangeRates.filter(x=>x.idcompany == this.idCompany)                                                                             .sort((a, b) => new Date(b.createDate).getTime()- new Date(a.createDate).getTime());
    this.echangerateexpanded = this.idCompany;
     
  }

  showMasiveExhange(e:any)
  { 
    event.stopPropagation();
    this.exchangerateMasiveDialogVisible=true;
  }

  onSubmitExchangeMasive(data)
  {
    this._dataSupplierExchangeRate.exchangeRates=data.exchangetax;
    this._ExchangeRateFilterList=this._dataSupplierExchangeRate.exchangeRates.filter(x=>x.idcompany==this.idCompany)
                                                                             .sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());
  }
  onHideMasiveExchange(visible: boolean) {
    this.exchangerateMasiveDialogVisible = visible;
  }

  onRowSelect(event){
    this.idCompany = this.SelectedExchangeRate.idcompany;
    this.echangerateexpanded = this.SelectedExchangeRate.idcompany;
  }

  RefreshExchangeRateList(exchangerateList :any[])
  {
    this._ExchangeRateFilterList = exchangerateList.filter(x=>x.idcompany ==  this.idCompany )
                                                   .sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());
  }

  removeExchange(exchange:ExchangeRatesSupplier)
  {
    if(exchange.idExchangeRateSupplier <=0)
    {  this._ExchangeRateFilterList=this._ExchangeRateFilterList.filter(x => x !=exchange);
       this._dataSupplierExchangeRate.exchangeRates =  this._dataSupplierExchangeRate.exchangeRates.filter(x => x !=exchange)
                                                                                                    .sort((a, b) => new Date(b.createDate).getTime()- new Date(a.createDate).getTime());
    }    
  }


  PrintCheck(id:Number)
  {
    if(this._dataSupplierExchangeRate.exchangeRates != null && this._dataSupplierExchangeRate.exchangeRates != undefined)
    {
      var a =  this._dataSupplierExchangeRate.exchangeRates.filter(x=>x.idcompany == id);
      
      if(a != null && a != undefined && a.length > 0)
        return true;
      else
        return false;
    }else
    {
      
      return false;
    }
  
  }

}
