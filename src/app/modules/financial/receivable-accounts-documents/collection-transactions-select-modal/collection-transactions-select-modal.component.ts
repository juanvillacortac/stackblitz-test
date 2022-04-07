import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-collection-transactions-select-modal',
  templateUrl: './collection-transactions-select-modal.component.html',
  styleUrls: ['./collection-transactions-select-modal.component.scss']
})
export class CollectionTransactionsSelectModalComponent implements OnInit {
  @Input() showDialog: boolean = false;

  

  constructor() { }

  ngOnInit(): void {
  }


  hideDialog(): void {
    this.showDialog = false;
  } 

  save(){
    console.log("se cerro");
    this.hideDialog();
  }

}
