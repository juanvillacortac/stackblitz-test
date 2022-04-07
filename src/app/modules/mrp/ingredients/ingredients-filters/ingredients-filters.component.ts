import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { IngredientFilter } from 'src/app/models/mrp/ingredient-filter';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';

@Component({
  selector: 'app-ingredients-filters',
  templateUrl: './ingredients-filters.component.html',
  styleUrls: ['./ingredients-filters.component.scss']
})
export class IngredientsFiltersComponent implements OnInit {
  @Input() expanded = false;
  @Input() filters: IngredientFilter;
  @Input() loading = false;
  @Output() search = new EventEmitter<IngredientFilter>();
  _validations: Validations = new Validations();

  constructor(
    private messageService: MessageService) {
  }

  ngOnInit(): void {
  }

  onSearch() {
    this.search.emit(this.filters);
  }
  clearFilters() {
    this.filters.name = '';
    this.filters.idRoom = -1;
    this.filters.ean = null;
  }

}
