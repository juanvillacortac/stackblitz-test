import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-return-filters',
  templateUrl: './product-return-filters.component.html',
  styleUrls: ['./product-return-filters.component.scss']
})
export class ProductReturnFiltersComponent implements OnInit {

  @Input() expanded = true;

  constructor() { }

  ngOnInit(): void {
  }

}
