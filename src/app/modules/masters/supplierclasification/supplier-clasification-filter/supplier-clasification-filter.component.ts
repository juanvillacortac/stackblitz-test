import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { SupplierClasificationFilter } from '../shared/filters/supplier-clasification-filter';

@Component({
  selector: 'app-supplier-clasification-filter',
  templateUrl: './supplier-clasification-filter.component.html',
  styleUrls: ['./supplier-clasification-filter.component.scss']
})
export class SupplierClasificationFilterComponent implements OnInit {

  @Input() expanded : boolean = false;
  @Input("filters") filters : SupplierClasificationFilter;
  @Input("loading") loading : boolean = false;
  @Output("onSearch") onSearch = new EventEmitter<SupplierClasificationFilter>();
  status: SelectItem[] = [
    {label: 'Todos', value: "-1"},
    {label: 'Activo', value: "1"},
    {label: 'Inactivo', value: "0"},
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
    this.filters.id=-1;
    this.filters.name="";
    this.filters.active = -1;
  }
}
