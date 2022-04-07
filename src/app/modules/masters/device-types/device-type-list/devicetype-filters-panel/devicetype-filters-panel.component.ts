import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DeviceTypeFilter } from '../../shared/filters/device-type-filter';

@Component({
  selector: 'app-devicetype-filters-panel',
  templateUrl: './devicetype-filters-panel.component.html',
  styleUrls: ['./devicetype-filters-panel.component.scss']
})
export class DevicetypeFiltersPanelComponent implements OnInit {
  @Input() expanded: boolean = false;
  @Input("filters") filters: DeviceTypeFilter;
  @Input("loading") loading: boolean = false;
  @Input() cboactive: number;
  //@Input() idRoleType: number;

  @Output("onSearch") onSearch = new EventEmitter<DeviceTypeFilter>();
  statuslist: SelectItem[] = 
  [
      { label: 'Todos', value: '-1' },
      { label: 'Activo', value: '1'},
      { label: 'Inactivo', value: '0'}
  ];
  search() {
    this.onSearch.emit(this.filters);
  }
  constructor() { 
  }

  ngOnInit(): void {
    this.filters.Active = -1;
  }

  clearFilters() {
    this.filters.Abbreviation="";
    this.filters.Active= -1;
    this.filters.Name="";
    //Limpia los filtros
  }

}
