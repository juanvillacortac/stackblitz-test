import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Panel } from 'primeng/panel';
import { MultimediauseFilter } from '../../shared/filters/multimediause-filter';

@Component({
  selector: 'app-filters-panel',
  templateUrl: './filters-panel.component.html',
  styleUrls: ['./filters-panel.component.scss']
})
export class FiltersPanelComponentMultimediaUse implements OnInit {

  @Input() expanded: boolean = false;
  @Input("filters") filters: MultimediauseFilter;
  @Input("loading") loading: boolean = false;
  @Output("onSearch") onSearch = new EventEmitter<MultimediauseFilter>();
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
    this.filters.description = "";
    this.filters.maxAmount = -1;
    this.filters.createdByUserId = -1;
    this.filters.active = -1;
    this.currentVal = { name: 'Todos', code: '-1' };
  }

}
