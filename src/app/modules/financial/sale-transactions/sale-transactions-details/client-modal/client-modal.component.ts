import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { SupplierClasification } from 'src/app/models/masters/supplier-clasification';
import { SupplierExtend } from 'src/app/models/masters/supplier-extend';
import { TaxeTypeApplication } from 'src/app/models/masters/taxe-type-application';

@Component({
  selector: 'sale-transactions-client-modal',
  templateUrl: './client-modal.component.html',
  styleUrls: ['./client-modal.component.scss'],
})
export class SaleTransactionsClientModalComponent implements OnInit {
  @Input() displayModal: boolean = false;
  @Output() displayModalChange = new EventEmitter<boolean>();

  @Input() clients: SupplierExtend[]
  @Input() classifications: SupplierClasification[]

  @Input() initialClientId?: number

  @Output() onSelect = new EventEmitter<SupplierExtend>();

  socialReason = ''
  documentnumber = ''
  classification: number

  loaded = false

  displayedColumns: ColumnD<SupplierExtend>[] = [
    { template: d => d.socialReason, field: 'socialReason', header: 'Razón social', display: 'table-cell' },
    { template: d => d.identifier + '-' + d.documentnumber, field: 'documentnumber', header: 'Documento', display: 'table-cell' },
    { template: d => d.documenttype, field: 'documenttype', header: 'Tipo', display: 'table-cell' },
    { template: d => d.clientClasification, field: 'clientClasification', header: 'Clasificación', display: 'table-cell' },
  ]

  log = console.log

  constructor() {
  }

  select(client: SupplierExtend) {
    this.onSelect.emit(client)
    this.hideDialog()
  }

  filterTable(clients: SupplierExtend[]) { 
    console.log(this.clients);
    const format = str => str.split('').filter(s => s.match((/^[-\w\s]+$/))).join('')
    let clone = [...clients]
    if (this.socialReason) {
      clone = clone.filter(c => {
        const regex = new RegExp("\\b" + format(this.socialReason), 'i')
        return regex.exec(c.socialReason)
      })
    }
    if (this.documentnumber) {
      clone = clone.filter(c => {
        const regex = new RegExp("\\b" + format(this.documentnumber), 'i')
        return regex.exec(c.documentnumber)
      })
    }
    if (this.socialReason) {
      clone = clone.filter(c => {
        const regex = new RegExp("\\b" + format(this.socialReason), 'i')
        return regex.exec(c.socialReason)
      })
    }
    //Mod
    if (this.classification) {
      clone = clone.filter(c => c.idClientClasification === this.classification)
    }
    return clone
  }

  ngOnInit(): void {
    this.displayModalChange.emit(this.displayModal);
  }

  filtered = false

  clear() {
    this.socialReason = ''
    this.classification = undefined
    this.documentnumber = ''
  }

  hideDialog() {
    this.displayModal = false;
    this.displayModalChange.emit(this.displayModal);
    this.clear()
  }
}
