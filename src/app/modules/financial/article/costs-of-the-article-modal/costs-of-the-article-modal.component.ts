import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ColumnD } from 'src/app/models/common/columnsd';
import { CostsOfTheArticleModal } from 'src/app/models/financial/CostsOfTheArticleModal';

@Component({
  selector: 'app-costs-of-the-article-modal',
  templateUrl: './costs-of-the-article-modal.component.html',
  styleUrls: ['./costs-of-the-article-modal.component.scss']
})
export class CostsOfTheArticleModalComponent implements OnInit {
  @Input("displayModal") displayModal: boolean;
  @Input("_data")_data:CostsOfTheArticleModal= new CostsOfTheArticleModal();
  @Input("_costo")_costo:any;
  @Input("_moneda")_moneda:any;
  @Input("_articulo")_articulo:any;
  MonedaSeleccion:string;
  

  @Output() displayModalChange = new EventEmitter<boolean>();
  constructor() { }

  displayedColumns: ColumnD<CostsOfTheArticleModal>[] =
  [

  {template: (data) => { return data.tipoCambio; }, field: 'tipoCambio', header: 'Tipo de tasa', display: 'table-cell'},
  {template: (data) => { return data.simboloMonedaDestino+''+data.factorConversion.toLocaleString('es-Ve', { minimumFractionDigits: 4 }); }, field: 'factorConversion', header: 'Tasa', display: 'table-cell', textAlign: 'right' },
  {template: (data) => { return data.simboloMonedaDestino+''+(data.factorConversion*this._costo).toLocaleString('es-Ve', { minimumFractionDigits: 4 }) }, field: 'costo', header: 'Costo conversión', display: 'table-cell', textAlign: 'right' },
  {template: (data) => { return this.toDate(data.fechaEfectiva); }, field: 'fechaEfectiva', header: 'Fecha', display: 'table-cell', textAlign: 'center' },
  ];
  ngOnInit(): void {
    debugger
    this.MonedaSeleccion=this._data[0]?.simboloMonedaOrigen
  }
  toDate = (str: string | Date) => {
    const d = new Date(str)
    const padLeft = (n: number) => ("00" + n).slice(-2)
    const dformat = [
      padLeft(d.getDate()),
      padLeft(d.getMonth() + 1),
      d.getFullYear()
    ].join('/');
    return dformat
  }

  hideDialog() {
    this.displayModal = false;
    this.displayModalChange.emit(this.displayModal);
  }
}
