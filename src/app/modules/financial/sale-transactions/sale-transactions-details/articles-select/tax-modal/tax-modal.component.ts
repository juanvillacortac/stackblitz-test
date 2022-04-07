import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Article } from 'src/app/models/financial/article';
import { Coins } from 'src/app/models/masters/coin';
import { SupplierExtend } from 'src/app/models/masters/supplier-extend';

@Component({
  selector: 'app-sale-transactions-articles-select-modal',
  templateUrl: './tax-modal.component.html',
  styleUrls: ['./tax-modal.component.scss'],
})
export class SaleTransactionsArticlesSelectModalComponent implements OnInit {
  @Input() displayModal: boolean = false;
  @Output() displayModalChange = new EventEmitter<boolean>();

  @Input() articles: Article[]
  @Input() currencyMap: Coins[]

  @Output() onSelect = new EventEmitter<Article>();

  articleName = ''

  loaded = false

  displayedColumns: ColumnD<Article>[] = [
    { template: d => d.articleId, field: 'articleId', header: 'Código', display: 'table-cell' },
    { template: d => d.articleName, field: 'articleName', header: 'Nombre', display: 'table-cell' },
    { template: d => d.tipoArticulo, field: 'tipoArticulo', header: 'Tipo', display: 'table-cell' },
    { template: d => this.currencyMap.find(c => c.id == d.monedaIdArt)?.symbology + ' ' + d.costoArt.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 4 }), field: 'costoArt', header: 'Costo', display: 'table-cell' },
    { template: d => new Date(d.createdDate).toLocaleDateString(), field: 'createdDate', header: 'Fecha de creación', display: 'table-cell' },
  ]

  log = console.log

  constructor() {
  }

  select(article: Article) {
    this.onSelect.emit(article)
    this.hideDialog()
  }

  filterTable(articles: Article[]) {
    const format = str => str.split('').filter(s => s.match((/^[-\w\s]+$/))).join('')
    let clone = [...articles]
    if (this.articleName) {
      clone = clone.filter(c => {
        const regex = new RegExp("\\b" + format(this.articleName), 'i')
        return regex.exec(c.articleName)
      })
    }
    return clone
  }

  ngOnInit(): void {
    this.displayModalChange.emit(this.displayModal);
  }

  filtered = false

  clear() {
    this.articleName = ''
  }

  hideDialog() {
    this.displayModal = false;
    this.displayModalChange.emit(this.displayModal);
    this.clear()
  }
}
