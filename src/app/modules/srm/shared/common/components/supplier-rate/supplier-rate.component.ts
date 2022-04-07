import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { ExchangeRatesSupplier } from 'src/app/models/masters/exchange-rates-suppliers';
import { CoinsService } from 'src/app/modules/masters/coin/shared/service/coins.service';
import { ExchangeRatesSupplierFilter } from 'src/app/modules/masters/exchange-rates-suppliers/filter/exchange-rates-supplier-filter';
import { ExchangeratesupplierService } from 'src/app/modules/masters/exchange-rates-suppliers/shared/exchangeratesupplier.service';

@Component({
  selector: 'app-supplier-rate',
  templateUrl: './supplier-rate.component.html',
  styleUrls: ['./supplier-rate.component.scss'],
  providers: [DatePipe, DecimalPipe],
})
export class SupplierRateComponent implements OnInit {

  @ViewChild('dt',{static:false})dt:any
  selectedRateSuppliers: any[] = [];
  selectedRateSuppliersOnly: any = null;
  currencyList: SelectItem[];
  rateSupplierList: SelectItem[];
  exRateSupplier:ExchangeRatesSupplier= new ExchangeRatesSupplier();
  submitted: boolean;
  @Input("supplierRate") supplierRate: ExchangeRatesSupplier = new ExchangeRatesSupplier();
  @Output("supplierRateChange") supplierRateChange= new  EventEmitter<ExchangeRatesSupplier>();

  @Input("RatesupplierFilters") RatesupplierFilters: ExchangeRatesSupplierFilter;
  loading: boolean = false;
  @Output("onToggle") onToggle = new EventEmitter<boolean>();
  @Output("onAssig") onAssig = new EventEmitter();
  @Input() visible: boolean = false;

  displayedColumns: ColumnD<ExchangeRatesSupplier>[] =
    [
      { template: (data) => { return data.idExchangeRateSupplier; }, header: 'Código', field: 'idExchangeRateSupplier', display: 'none' },
      { template: (data) => { return this.decimalPipe.transform(data.exchangeRate, '.4'); }, header: 'Tasa', field: 'exchangeRate', display: 'table-cell' },
      // { template: (data) => { return data.documentType; }, header: 'Tipo de documento', field: 'documentType', display: 'table-cell' },
      { template: (data) => { return data.currency; }, header: 'Moneda', field: 'currency', display: 'table-cell' },
      { template: (data) => { return this.datepipe.transform(data.createDate, "dd/MM/yyyy"); }, field: 'dateCreate', header: 'Fecha de creación', display: 'table-cell' }
    ];
  constructor(public datepipe: DatePipe, 
  public rateSupplier: ExchangeratesupplierService,
  private messageService: MessageService,
  public _coinService: CoinsService,
  private decimalPipe: DecimalPipe) { }

  ngOnInit(): void {
  }

  onShow(){
    this.emitVisible();
    this.GetCoins();
    this.exRateSupplier.idCurrency=this.RatesupplierFilters.idCurrency;
    this.exRateSupplier.idSupplierCompany= this.RatesupplierFilters.idClientSupplierCom;
    this.loadRateSupplier();
  }
  onHide(){
    this.exRateSupplier.exchangeRate=0;
    this.emitVisible();
  }
  emitVisible(){
    this.onToggle.emit(this.visible);
  }
 //Obtener monedas
 GetCoins() {
  this._coinService.getCoinsList({
    id: -1,
    name: "",
    idtype: -1,
    abbreviation: "",
    active: 1,
  })
    .subscribe((data) => {
      this.currencyList = data.sort((a, b) => a.name.localeCompare(b.name)).map((item) => ({
        label: item.name,
        value: item.id
      }));
    }, (error) => {
      console.log(error);
    });
}

  loadRateSupplier() {
    this.loading = true;
    this.rateSupplier.getExchangeRatesbyFilter(this.RatesupplierFilters).subscribe((data: ExchangeRatesSupplier[]) => {
      this.rateSupplier._RateSupplierList = data.sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());;
      var dat: any[] = data;
      this.loading = false;
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Consulta', detail: "Ha ocurrido un error al cargar las tasas del proveedor" });
    });
  }

  clear(event){
    if (event.target.value == "0,0000" || event.target.value == "0,00" || event.target.value == "0") {
      event.target.value = "";
    }
  }
  submitRate(){
    if (this.selectedRateSuppliersOnly!= null) {
       //this.selectedRateSuppliersOnly = this.selectedContact;
      this.supplierRate.exchangeRate = this.selectedRateSuppliersOnly.exchangeRate;
      
      this.supplierRateChange.emit(this.supplierRate);
      this.onAssig.emit();
      this.visible = false;
    } else {
      this.messageService.add({ severity: 'error', summary: 'Alerta', detail: "Seleccione una tasa." });
    }

  }

  newRate():void{
    this.submitted = true;
    if(this.exRateSupplier.exchangeRate>0){
      this.rateSupplier.InsertRateSupplier(this.exRateSupplier).subscribe((data: number) => {
        if (data > 0) {
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: "Guardado exitoso" });
         
           this.rateSupplier.getExchangeRatesbyFilter(this.RatesupplierFilters).subscribe((data: ExchangeRatesSupplier[]) => {
            this.rateSupplier._RateSupplierList = data.sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());;
            this.exRateSupplier.exchangeRate=0;
          });
          this.submitted = false;    
        }else if (data == -1){
          console.log(data);
          this.messageService.add({severity:'error', summary:'Alerta', detail: "Ha ocurrido un error al guardar la tasa de proveedor."});
        
        }else{
          console.log(data);
          this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la tasa."});
        }
      }, (error: HttpErrorResponse)=>{
        
        this.messageService.add({severity:'error', summary:'Error', detail: "Ha ocurrido un error al guardar la tasa de proveedor."});
    });
    }
  }
}
