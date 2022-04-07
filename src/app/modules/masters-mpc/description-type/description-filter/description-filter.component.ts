import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DescriptionTypeFilter } from '../../shared/filters/descriptionType-filter';
import { Validations } from '../../shared/Utils/Validations/Validations';


@Component({
  selector: 'description-filter',
  templateUrl: './description-filter.component.html',
  styleUrls: ['./description-filter.component.scss']
})
export class DescriptionFilterComponent implements OnInit {

  @Input() expanded: boolean = false;
  @Input("filters") filters: DescriptionTypeFilter;
  @Input("loading") loading: boolean = false;
  @Output("onSearch") onSearch = new EventEmitter<DescriptionTypeFilter>();
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

 this.filters.createdByUserId=-1;
  }

}
