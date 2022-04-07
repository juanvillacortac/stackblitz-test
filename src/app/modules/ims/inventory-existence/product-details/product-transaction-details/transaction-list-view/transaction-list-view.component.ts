import { Component, Input, OnInit } from '@angular/core';
import { ProductExistenceTransactionDetails } from 'src/app/models/ims/product-existence-transaction-details';

@Component({
  selector: 'app-product-existence-transaction-list-view',
  templateUrl: './transaction-list-view.component.html',
  styleUrls: ['./transaction-list-view.component.scss']
})
export class ProductExistenceTransactionListViewComponent implements OnInit {
  @Input() product: ProductExistenceTransactionDetails;
  constructor() { }

  ngOnInit(): void {
  }

}
