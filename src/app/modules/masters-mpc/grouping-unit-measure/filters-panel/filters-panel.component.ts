import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GroupingunitmeasureFilter } from '../../shared/filters/groupingunitmeasure-filter';

@Component({
  selector: 'app-filters-panel',
  templateUrl: './filters-panel.component.html',
  styleUrls: ['./filters-panel.component.scss']
})
export class FiltersPanelComponentGroupingUnitMeasure implements OnInit {

  @Input() expanded: boolean = false;
  @Input("filters") filters: GroupingunitmeasureFilter;
  @Input("loading") loading: boolean = false;
  @Output("onSearch") onSearch = new EventEmitter<GroupingunitmeasureFilter>();
  status: any[] = [
    { name: 'Todos', code: '-1' },
    { name: 'Activo', code: '1' },
    { name: 'Inactivo', code: '0' },
  ];
  currentVal: any;

  constructor() { }

  ngOnInit(): void {
    this.currentVal = { name: 'Todos', code: '-1' }
  }

  search() {
    this.filters.active = this.currentVal.code;
    this.onSearch.emit(this.filters);
  }

  clearFilters() {
    this.filters.id = -1;
    this.filters.name = "";
    this.filters.abbreviation = "";
    this.filters.createdByUserId = -1;
    this.filters.active = -1;
    this.currentVal = { name: 'Todos', code: '-1' };
  }

}
