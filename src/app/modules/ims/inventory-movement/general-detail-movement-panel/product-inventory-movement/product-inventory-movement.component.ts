import { Component, Input, OnInit } from '@angular/core';
import { productInventoryMovement } from 'src/app/models/ims/product-inventory-movemnt';

@Component({
  selector: 'product-inventory-movement',
  templateUrl: './product-inventory-movement.component.html',
  styleUrls: ['./product-inventory-movement.component.scss']
})
export class ProductInventoryMovementComponent implements OnInit {

  @Input("_product") _product : productInventoryMovement;
  @Input("showproduct") showproduct: boolean = true;
  
  constructor() { }

  ngOnInit(): void {   
  }

}
