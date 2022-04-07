import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { InsertTypeFilter } from '../../shared/filters/insert-type-filter';
import { Validations } from '../../shared/Utils/Validations/Validations';

@Component({
  selector: 'insert-type-filter',
  templateUrl: './insert-type-filter.component.html',
  styleUrls: ['./insert-type-filter.component.scss']
})
export class InsertTypeFilterComponent implements OnInit {

 
  @Input() expanded: boolean = false;
  @Input("filters") filters: InsertTypeFilter;
  @Input("loading") loading: boolean = false;
  @Output("onSearch") onSearch = new EventEmitter<InsertTypeFilter>();
  status: SelectItem[] = [
    { label: 'Todos', value:'-1' },
    { label: 'Activo', value:'1' },
    { label: 'Inactivo', value:'0' },
  ];
  _validations: Validations = new Validations();
  constructor() { }

  ngOnInit(): void {
    this.filters.active = -1;
  }
  search() {
    this.onSearch.emit(this.filters);
  }
  clearFilters() {
 this.filters.id = -1;
 this.filters.name= "";
 this.filters.active=-1;

 this.filters.idUser=-1;
  }

}
