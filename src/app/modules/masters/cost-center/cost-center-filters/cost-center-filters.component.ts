import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { StaticDataService } from '../../../shared/common-directive/services/static-data.service';
import { CostCenterFilters } from '../shared/filters/cost-center-filters';
import { CostCenterFiltersViewModel } from '../shared/view-models/cost-center-filters.viewmodel';

@Component({
  selector: 'app-cost-center-filters',
  templateUrl: './cost-center-filters.component.html',
  styleUrls: ['./cost-center-filters.component.scss']
})
export class CostCenterFiltersComponent implements OnInit {

  costCenterActive = null;
  costCenterName=String;
  costCenterCodigo:number;
  status: SelectItem[] = [
    {label: 'Todos', value: 0},
    {label: 'Activo', value: 1},
    {label: 'Inactivo', value: 2}
   
  ];
  noneSpecialCharacters:RegExp =/^[a-zA-Z0-9äÄëËïÏöÖüÜáéíóúÁÉÍÓÚñÑ\s]*$/
  @Input() expanded = false;
  @Input() filters: CostCenterFilters;
  @Input() loading = false;
  @Output() onSearch = new EventEmitter<CostCenterFilters>();

  filtersViewModel: CostCenterFiltersViewModel;
  
  constructor(private staticDataService: StaticDataService) { }

  
  ngOnInit(): void {
   this.clearFilters();
  }

  search() {

    this.filters.active = this.costCenterActive ? this.costCenterActive === 2 ? 0 : 1 : -1;
    this.filters.name = this.costCenterName ? this.costCenterName.toString() : ''
    this.filters.id = this.costCenterCodigo ? this.costCenterCodigo : -1
    this.onSearch.emit(this.filters);
   
  }

  clearFilters() {
    this.costCenterActive = null;
    this.costCenterName = null;
    this.costCenterCodigo = null;
   
  }
}
