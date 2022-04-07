import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Panel } from 'primeng/panel';
import { TypeofpartsFilter } from '../../shared/filters/typeofparts-filter';
import { MessageService, SelectItem } from 'primeng/api';
import { Validations } from '../../shared/Utils/Validations/Validations';

@Component({
  selector: 'filters-panel-ToP',
  templateUrl: './filters-panel.component.html',
  styleUrls: ['./filters-panel.component.scss']
})
export class FiltersPanelComponentTypeofParts implements OnInit {

  @Input() expanded : boolean = false;
  @Input("filters") filters : TypeofpartsFilter;
  @Input("loading") loading : boolean = false;
  @Output("onSearch") onSearch = new EventEmitter<TypeofpartsFilter>();
  status: SelectItem[] = [
    {label: 'Todos', value: '-1'},
    {label: 'Activo', value: '1'},
    {label: 'Inactivo', value: '0'},
  ];
  _validations: Validations = new Validations();
  
  constructor() { }

  ngOnInit(): void {
    this.filters.active = -1;
  }

  search(){
    this.onSearch.emit(this.filters);
  }

  clearFilters(){
    this.filters.idTypeofPart=-1;
    this.filters.name="";
    this.filters.active=-1;
  }
}
