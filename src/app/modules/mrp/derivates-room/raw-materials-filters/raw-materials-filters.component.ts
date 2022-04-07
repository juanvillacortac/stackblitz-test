import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RawMaterial } from 'src/app/models/mrp/raw-material';

@Component({
  selector: 'app-raw-materials-filters',
  templateUrl: './raw-materials-filters.component.html',
  styleUrls: ['./raw-materials-filters.component.scss']
})
export class RawMaterialsFiltersComponent implements OnInit {

  @Input() filters: RawMaterial;

  @Input() expanded = false;
  @Input() loading = false;
  @Output() onSearch = new EventEmitter<RawMaterial>();


  constructor() { }

  ngOnInit(): void {
  }

  search() {
    this.onSearch.emit(this.filters);
  }

  clearFilters() {
    this.filters.id = -1,
    this.filters.barcode = '',
    this.filters.name = '';
  }

}
