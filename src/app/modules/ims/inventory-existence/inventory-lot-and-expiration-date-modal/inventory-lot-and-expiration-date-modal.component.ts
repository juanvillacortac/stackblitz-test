import { Component, OnInit } from '@angular/core';
import { ColumnD } from 'src/app/models/common/columnsd';
import { InventoryLotExpirationDate } from 'src/app/models/ims/inventory-lot-expiration-date';

@Component({
  selector: 'app-inventory-lot-and-expiration-date-modal',
  templateUrl: './inventory-lot-and-expiration-date-modal.component.html',
  styleUrls: ['./inventory-lot-and-expiration-date-modal.component.scss']
})
export class InventoryLotAndExpirationDateModalComponent implements OnInit 
{
  showModal:boolean = false;
  displayedColumns:ColumnD<InventoryLotExpirationDate>[] = 
  [    
    { template: (data) => { return data.lot; }, header: 'Número de lote',field:'lot' ,display: 'table-cell' },    
    { template: (data) => { return data.expirationDate; }, header: 'Fecha de vencimiento',field:'expirationDate' ,display: 'table-cell' },
    { template: (data) => { return data.initialQuantity; }, header: 'Cantidad inicial',field:'initialQuantity' ,display: 'table-cell' },
    { template: (data) => { return data.quantity; }, header: 'Cantidad',field:'quantity' ,display: 'table-cell' },
    { template: (data) => { return data.finalQuantity; }, header: 'Cantidad final',field:'finalQuantity' ,display: 'table-cell' },
    { template: (data) => { return data.associatedDocument; }, header: 'Creado por', field:'associatedDocument' ,display: 'table-cell' }
  ];

  constructor() { }

  ngOnInit(): void { }

}
