import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { SupplierClasification } from 'src/app/models/masters/supplier-clasification';
import { SupplierExtend } from 'src/app/models/masters/supplier-extend';
import { TaxeTypeApplication } from 'src/app/models/masters/taxe-type-application';

const deepCompare = (obj1: Object, obj2: Object) => {
  //Loop through properties in object 1
  for (var p in obj1) {
    //Check property exists on both objects
    if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;

    switch (typeof (obj1[p])) {
      //Deep compare objects
      case 'object':
        if (!deepCompare(obj1[p], obj2[p])) return false;
        break;
      //Compare function code
      case 'function':
        if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
        break;
      //Compare values
      default:
        if (obj1[p] != obj2[p]) return false;
    }
  }

  //Check object 2 for any extra properties
  for (var p in obj2) {
    if (typeof (obj1[p]) == 'undefined') return false;
  }
  return true;
};

@Component({
  selector: 'client-modal-dev',
  templateUrl: './client-modal.component.html',
  styleUrls: ['./client-modal.component.scss'],
})
export class ClientModalComponent implements OnInit {
  @Input() displayModal: boolean = false;
  @Output() displayModalChange = new EventEmitter<boolean>();

  @Input() clients: SupplierExtend[]
  @Input() classifications: SupplierClasification[]

  @Output() onSelect = new EventEmitter<SupplierExtend>();

  socialReason = ''
  documentnumber = ''
  classification: number

  loaded = false

  displayedColumns: ColumnD<SupplierExtend>[] = [
    { template: d => d.socialReason, field: 'socialReason', header: 'Razón social', display: 'table-cell' },
    { template: d => d.documentnumber, field: 'documentnumber', header: 'Documento', display: 'table-cell' },
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
