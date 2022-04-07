import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RecipeFilter } from 'src/app/models/mrp/recipe-filters';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';

@Component({
  selector: 'app-recipe-filters',
  templateUrl: './recipe-filters.component.html',
  styleUrls: ['./recipe-filters.component.scss']
})
export class RecipeFiltersComponent implements OnInit {
  @Input() expanded = false;
  @Input() filters: RecipeFilter;
  @Input() loading = false;
  @Output() search = new EventEmitter<RecipeFilter>();
  _validations: Validations = new Validations();

  constructor() {
  }

  ngOnInit(): void {
  }

  onSearch() {
    this.search.emit(this.filters);
  }
  clearFilters() {
    this.filters.id = -1;
    this.filters.name = '';
  }
}
