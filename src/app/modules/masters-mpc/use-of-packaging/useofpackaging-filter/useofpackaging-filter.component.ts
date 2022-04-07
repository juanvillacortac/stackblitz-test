import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { UseofpackagingFilter } from '../../shared/filters/useofpackaging-filter';
import { Validations } from '../../shared/Utils/Validations/Validations';

@Component({
  selector: 'useofpackaging-filter',
  templateUrl: './useofpackaging-filter.component.html',
  styleUrls: ['./useofpackaging-filter.component.scss']
})
export class UseofpackagingFilterComponent implements OnInit {

 
  @Input() expanded: boolean = false;
  @Input("filters") filters: UseofpackagingFilter;
  @Input("loading") loading: boolean = false;
  @Output("onSearch") onSearch = new EventEmitter<UseofpackagingFilter>();
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
 this.filters.usePackaging= "";
 this.filters.active=-1;
this.filters.createdByUserId=-1;
  }

}
