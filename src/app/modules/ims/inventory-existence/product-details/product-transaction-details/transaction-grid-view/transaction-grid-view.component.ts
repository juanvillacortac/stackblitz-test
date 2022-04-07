import { Component, Input, OnInit } from '@angular/core';
import { ProductExistenceTransactionDetails } from 'src/app/models/ims/product-existence-transaction-details';

@Component({
  selector: 'app-product-existence-transaction-grid-view',
  templateUrl: './transaction-grid-view.component.html',
  styleUrls: ['./transaction-grid-view.component.scss']
})
export class ProductExistenceTransactionGridViewComponent implements OnInit {
  @Input() product: ProductExistenceTransactionDetails;
  constructor() { }

  ngOnInit(): void {
  }

}
