import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ProcessingRoom } from 'src/app/models/mrp/processing-room';
import { ProcessingRoomFilters } from 'src/app/models/mrp/processing-room-filters';
import { ProcessingRoomRecipeFilters } from 'src/app/models/mrp/processing-room-recipe-filters';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { ProcessingRoomService } from '../shared/processing-room.service';

@Component({
  selector: 'app-processing-room-filters',
  templateUrl: './processing-room-filters.component.html',
  styleUrls: ['./processing-room-filters.component.scss']
})
export class ProcessingRoomFiltersComponent implements OnInit {
  @Input() expanded = false;
  @Input() filters: ProcessingRoomFilters;
  @Input() recipeFilters: ProcessingRoomRecipeFilters;
  @Input() loading = false;
  @Input() roomRecipesFilter = false;
  @Output() search = new EventEmitter<ProcessingRoomFilters>();
  @Output() searchRecipe = new EventEmitter<ProcessingRoomRecipeFilters>();
  _validations: Validations = new Validations();

  constructor(
    private messageService: MessageService,
    private _processingRoomService: ProcessingRoomService) {
  }

  ngOnInit(): void {
  }

  onSearch() {
    if (this.roomRecipesFilter) {
      this.searchRecipe.emit(this.recipeFilters);
    } else {
      this.search.emit(this.filters);
    }
  }
  clearFilters() {
    if (this.roomRecipesFilter) {
      this.clearRoomRecipeFilters();
    } else {
      this.clearRoomFilters();
    }
  }

  private clearRoomFilters() {
    this.filters.id = -1;
    this.filters.name = '';
    this.filters.description = '';
    this.filters.idBranchOffice = -1;
  }

  private clearRoomRecipeFilters() {
    this.recipeFilters.id = -1;
    this.recipeFilters.name = '';
    this.recipeFilters.idRecipe = -1;
    this.recipeFilters.active = -1;
    this.recipeFilters.barcode = '';
  }
}
