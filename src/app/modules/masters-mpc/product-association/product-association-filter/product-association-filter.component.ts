import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Panel } from 'primeng/panel';
import { ProductassociationFilter } from '../../shared/filters/productassociation-filter';
import { MessageService, SelectItem } from 'primeng/api';
import { ProductassociationService } from '../../shared/services/ProductAssociationService/productassociation.service';
import { Validations } from '../../shared/Utils/Validations/Validations';

@Component({
  selector: 'app-product-association-filter',
  templateUrl: './product-association-filter.component.html',
  styleUrls: ['./product-association-filter.component.scss']
})
export class ProductAssociationFilterComponent implements OnInit {

  @Input() expanded : boolean = false;
  @Input("filters") filters : ProductassociationFilter;
  @Input("loading") loading : boolean = false;
  @Output("onSearch") onSearch = new EventEmitter<ProductassociationFilter>();
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
