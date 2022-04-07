import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { AttributesagrupationFilter } from '../../shared/filters/attributesagrupation-filter';
import { Validations } from '../../shared/Utils/Validations/Validations';

@Component({
  selector: 'filters-panel',
  templateUrl: './filters-panel.component.html',
  styleUrls: ['./filters-panel.component.scss']
})
export class FiltersPanelComponent implements OnInit {
  
  @Input() expanded : boolean = false;
  @Input("filters") filters : AttributesagrupationFilter;
  @Input("loading") loading : boolean = false;
  @Output("onSearch") onSearch = new EventEmitter<AttributesagrupationFilter>();
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
    this.filters.idAttributeAgrupation=-1;
    this.filters.name="";
    this.filters.description="";
    this.filters.idUser=-1;
    this.filters.active = -1;
  }
}
