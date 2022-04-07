import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { NormativeFilter } from '../../shared/filters/normative-filter';
import { Validations } from '../../shared/Utils/Validations/Validations';

@Component({
  selector: 'app-normatives-filter-panel',
  templateUrl: './normatives-filter-panel.component.html',
  styleUrls: ['./normatives-filter-panel.component.scss']
})
export class NormativesFilterPanelComponent implements OnInit {

  @Input() expanded : boolean = false;
  @Input("filters") filters : NormativeFilter;
  @Input("loading") loading : boolean = false;
  @Output("onSearch") onSearch = new EventEmitter<NormativeFilter>();
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
    this.filters.idUser = -1;
    this.filters.active = -1;
  }

}
