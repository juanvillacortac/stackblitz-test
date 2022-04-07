import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { groupingInventoryReasonFilter } from '../../shared/filter/grouping-inventory-reason-filter';

@Component({
  selector: 'grouping-inventory-reasons-filter',
  templateUrl: './grouping-inventory-reasons-filter.component.html',
  styleUrls: ['./grouping-inventory-reasons-filter.component.scss']
})
export class GroupingInventoryReasonsFilterComponent implements OnInit {

  @Input() expanded : boolean = false;
  @Input("filters") filters : groupingInventoryReasonFilter;
  @Input("loading") loading : boolean = false;
  valid: RegExp = /^[a-zA-ZÀ-ú\sñÑ] *$/

  statuslist: SelectItem[]=[
    { label: 'Todos', value: '-1' },
    { label: 'Activo', value: '1'},
    { label: 'Inactivo', value: '0'}
    ];;

  @Output("onSearch") onSearch = new EventEmitter<groupingInventoryReasonFilter>();
  constructor() {
    
   }

  ngOnInit(): void {
    this.filters.active=-1;
  }
  
  search(){
    this.onSearch.emit(this.filters);
  }

  clearFilters(){
    this.filters.active=-1;
    this.filters.id=-1;
    this.filters.name="";
  }

}
