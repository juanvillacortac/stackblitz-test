import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Panel } from 'primeng/panel';
import { ProductorigintypeFilter } from '../../shared/filters/productorigintype-filter';
import { MessageService, SelectItem } from 'primeng/api';
import { ProductorigintypeService } from '../../shared/services/ProductOriginType/productorigintype.service';
import { Validations } from '../../shared/Utils/Validations/Validations';

@Component({
  selector: 'productorigintype-filter-panel',
  templateUrl: './productorigintype-filter-panel.component.html',
  styleUrls: ['./productorigintype-filter-panel.component.scss']
})
export class ProductorigintypeFilterPanelComponent implements OnInit {

  @Input() expanded : boolean = false;
  @Input("filters") filters : ProductorigintypeFilter;
  @Input("loading") loading : boolean = false;
  @Output("onSearch") onSearch = new EventEmitter<ProductorigintypeFilter>();
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
    this.filters.idProductOriginType=-1;
    this.filters.name="";
    this.filters.idUser = -1;
    this.filters.active = -1;
  }
}
