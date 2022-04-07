
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { CountryFilter } from '../../shared/filters/country-filter';
import { SelectItem } from 'primeng/api';
import { CountryService } from '../../shared/services/country.service';

@Component({
  selector: 'app-filters-panel',
  templateUrl: './filters-panel.component.html',
  styleUrls: ['./filters-panel.component.scss']
})
export class FiltersPanelComponentCountries implements OnInit {
  @Input() expanded: boolean = false;
  @Input("filters") filters: CountryFilter;
  @Input("loading") loading: boolean = false;
  @Input() cboactive: number;
  //@Input() idRoleType: number;
 
  @Output("onSearch") onSearch = new EventEmitter<CountryFilter>();

  countriesFilters: CountryFilter = new CountryFilter();
  
  statuslist: SelectItem[]=[
    { label: 'Todos', value: '-1 '},
    { label: 'Activo', value: '1'},
    { label: 'Inactivo', value: '0'}
    ];

  constructor() {
  }

  ngOnInit(): void {
    this.filters.active= -1;
  }

  search() {
    this.onSearch.emit(this.filters);
  }
  
  clearFilters() {
    this.filters.abbreviation="";
    this.filters.idCountry=-1;
    this.filters.name="";
    this.filters.active= -1;
   
  }
}
