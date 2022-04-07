import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Lots } from 'src/app/models/financial/lots';

@Component({
  selector: 'app-sale-transactions-lot-modal',
  templateUrl: './lot-modal.component.html',
  styleUrls: ['./lot-modal.component.scss'],
})
export class SaleTransactionsLotModalComponent implements OnInit {
  @Input() displayModal: boolean = false;
  @Output() displayModalChange = new EventEmitter<boolean>();

  @Input() lots: Lots[]

  @Output() onSelect = new EventEmitter<Lots>();

  lotName = '';
  lotDate:  string | Date = '';
  lotUser:number; 

  users : SelectItem[];

  loaded = false

  displayedColumns: ColumnD<Lots>[] = [
    { template: d => d.lotName, field: 'lotName', header: 'Lote', display: 'table-cell' },
    { template: d => new Date(d.creationStartDate).toLocaleDateString(), field: 'creationStartDate', header: 'Fecha de creación', display: 'table-cell' },
    { template: d => d.createdByUserName, field: 'createdByUserName', header: 'Creado por', display: 'table-cell' },
  ]

  log = console.log

  constructor() {
  }

  select(lot: Lots) {
    this.onSelect.emit(lot)
    this.hideDialog()
  }

  filterTable(lots: Lots[]) {
    const format = str => str.split('').filter(s => s.match((/^[-\w\s]+$/))).join('')
    let clone = [...lots] 

    if(this.lotDate){
      clone = clone.filter(c =>{
        return new Date(c.creationStartDate).toLocaleDateString() === new Date(this.lotDate).toLocaleDateString()
      })
    }

    if (this.lotName) {
      clone = clone.filter(c => {
        const regex = new RegExp("\\b" + format(this.lotName), 'i')
        return regex.exec(c.lotName)
      })
    }

    if(this.lotUser){
      clone = clone.filter(c =>{
        return c.createdByUserId === this.lotUser
      })
    }

  
    
    // if (this.documentnumber) {
    //   clone = clone.filter(c => {
    //     const regex = new RegExp("\\b" + format(this.documentnumber), 'i')
    //     return regex.exec(c.documentnumber)
    //   })
    // }
    // if (this.socialReason) {
    //   clone = clone.filter(c => {
    //     const regex = new RegExp("\\b" + format(this.socialReason), 'i')
    //     return regex.exec(c.socialReason)
    //   })
    // }
    // if (this.classification) {
    //   clone = clone.filter(c => c.idClientClasification === this.classification)
    // }
    return clone
  }

  ngOnInit(): void {
    this.displayModalChange.emit(this.displayModal);
    this.users = this.lots.map(p =>{
      return {
        label: p.createdByUserName,
        value: p.createdByUserId
      }      
    })
    console.log(this.lots);

    this.users =  [ ...new Set(this.users) ];
  }
    filtered = false


  clear() {
    this.lotName = ''
  }

  hideDialog() {
    this.displayModal = false;
    this.displayModalChange.emit(this.displayModal);
    this.clear()
  }
}
