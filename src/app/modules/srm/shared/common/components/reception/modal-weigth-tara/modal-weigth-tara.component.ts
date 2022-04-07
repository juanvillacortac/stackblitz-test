import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ColumnD } from 'src/app/models/common/columnsd';
import { WeightInstrument, WeightInstrumentFilters } from 'src/app/models/srm/weight-instrument';
import { WeightInstrumentService } from 'src/app/modules/srm/weight-instrument/shared/weight-instrument.service';

@Component({
  selector: 'app-modal-weigth-tara',
  templateUrl: './modal-weigth-tara.component.html',
  styleUrls: ['./modal-weigth-tara.component.scss']
})
export class ModalWeigthTaraComponent implements OnInit {

  @Input() visible = false;
  @Input("weigth") weigth:number
  @Output() onToggle = new EventEmitter<boolean>();
  @Output("onSubmit") onSubmit = new EventEmitter<{total: number}>();
  @ViewChild('dt') dt: Table;
  load: boolean = false;
  submitted = false;
  isdisabled: boolean = true;
  weightInstrument = new WeightInstrument();
  _DetailListTemp: WeightInstrument[] = [];
  weightInstrumentslist: WeightInstrument[] = []
  weightInstrumentslistaux:WeightInstrument[] = []
  filters: WeightInstrumentFilters = new WeightInstrumentFilters();
  quantitytotal: number = 0;

  displayedColumns: ColumnD<WeightInstrument>[] =
    [
      { template: (data) => { return data.name; }, field: 'name', header: 'Nombre', display: 'table-cell' },
      { template: (data) => { return data.weight; }, field: 'weight', header: 'Peso', display: 'table-cell' },
      { template: (data) => { return data.quantity; }, field: 'quantity', header: 'Cantidad', display: 'table-cell' },
      { template: (data) => { return data.total.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }); }, field: 'total', header: 'Total', display: 'table-cell' },
    ];
  constructor(private readonly weightInstrumentService: WeightInstrumentService,
    private messageService: MessageService) { }

  ngOnInit(): void {
  }


  onShow() {
    this.submitted = false;
    this.emitVisible();
    this.ngOnInit();
    this._DetailListTemp = [];
    this. weightInstrument=new WeightInstrument();
    this.weightInstrumentslistaux=[];
    this.weightInstrumentslist=[];
    this.search();

  }
  search() {
    this.filters.active = 1
    this.weightInstrumentService.getWeightInstruments(this.filters)
      .then(data => this.getWeightInstrumentsSuccess(data))
      .catch(error => this.handleError(error));

  }
  private getWeightInstrumentsSuccess(data) {
    data = data.sort((a, b) => a.name.localeCompare(b.name));
    this.weightInstrumentslist = data.map((item) => ({
      label: item.name,
      value: item.id
    }));
    this.weightInstrumentslistaux=data;
  }
  private handleError(error: HttpErrorResponse) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: "Ha ocurrido un error al guardar los datos." });
  }
  onRemove(instrument: WeightInstrument) {
    this.quantitytotal = this.quantitytotal - instrument.total;
    this._DetailListTemp=this._DetailListTemp.filter(x=>x !=instrument);
  }

  onHide() {
    this.submitted = false;
    this.dt.reset();
    this.emitVisible();
    this._DetailListTemp = [];
    this.weightInstrumentslistaux=[];
    this.weightInstrumentslist=[];
  }

  emitVisible() {
    this.onToggle.emit(this.visible);
  }
  add() {
    this.submitted = true;
    if (this._DetailListTemp.findIndex(x => x.id == this.weightInstrument.id) == -1) {
      if ((this.weightInstrument.id > 0 && this.weightInstrument.quantity > 0)) {
        this._DetailListTemp.push(this.weightInstrument);
        this.quantitytotal = this._DetailListTemp.reduce((subtotal, item) => subtotal + item.total, 0)
        this.dt.reset();
        this.submitted = false;
      }
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Este instrumento ya fue agregado." });
    }

  }
  AddInstrument() {
    if (this._DetailListTemp.length > 0) {
      if(this.quantitytotal < this.weigth){
      this.onSubmit.emit({total:this.quantitytotal});
      this.visible = false;
      this.emitVisible();}
      else
         this.messageService.add({ severity: 'error', summary: 'Error', detail: "La totalidad de los pesos no puede ser mayor al peso neto." });
    }
    else
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe ingresar al menos un instrumento." });
  }

  GetWeigth(id) {
    let selected = this.weightInstrumentslistaux.find(x => x.id == id)
    this.weightInstrument.weight = selected.weight;
    this.weightInstrument.name = selected.name;
    this.weightInstrument.total = this.weightInstrument.quantity * this.weightInstrument.weight;
  }
  changequantity(event) {
    if (event.value != "") {
      var quantity = event.value;
      if (quantity != null) {
        this.weightInstrument.quantity = quantity;
        this.weightInstrument.total = this.weightInstrument.weight * quantity;
      }
      else
        this.weightInstrument.quantity = 0;
    }
    else {
      this.weightInstrument.total = 0;
    }
  }
  clear(event) {
    if (event.target.value == "0,000") {
      event.target.value = 0;
    }
    if (event.target.value == "") {
      event.target.value = 0;
    }
  }
}
