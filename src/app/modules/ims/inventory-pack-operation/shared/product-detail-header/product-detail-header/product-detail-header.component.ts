import { Component, Input, OnInit } from '@angular/core';
import { InventoryExistenceViewmodel } from 'src/app/modules/ims/inventory-existence/shared/view-models/inventory-existence-viewmodel';

@Component({
  selector: 'app-product-detail-header',
  templateUrl: './product-detail-header.component.html',
  styleUrls: ['./product-detail-header.component.scss']
})
export class ProductDetailHeaderComponent implements OnInit {
  @Input() productSelected: InventoryExistenceViewmodel;
  @Input() currentExistence = 0;
  @Input() totalUnits = 0;
  constructor() { }

  ngOnInit(): void {
  }

}
