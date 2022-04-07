import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Recipe } from 'src/app/models/mrp/recipe';
import { RecipeFilter } from 'src/app/models/mrp/recipe-filters';
import { RecipeService } from '../../recipes/shared/recipe.service';

@Component({
  selector: 'app-search-mrp-recipes',
  templateUrl: './search-mrp-recipes.component.html',
  styleUrls: ['./search-mrp-recipes.component.scss']
})
export class SearchMrpRecipesComponent implements OnInit {
  @Input() set showSearching(_value: any) {
    if (!_value) { this.emitEvents(); }
  }
  @Input() exceptions: Recipe[] = [];
  @Output() hideSearch: EventEmitter<Recipe> = new EventEmitter<Recipe>();
  @Output() getResult: EventEmitter<Recipe> = new EventEmitter<Recipe>();

  set selectedRecipes(_value: Recipe) {
    if (_value) {
      this.getResult.emit(_value);
    }
  }

  submitted = false;
  recipes: Recipe[] = [];
  loading: boolean;
  filter: RecipeFilter;
  cols: any[];

  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.clearFilters();
    this.setupColumns();
  }

  search() {
    this.loadRecipes();
  }

  clearFilters() {
    this.filter = { id: -1, name: ''};
  }

  setupColumns() {
    this.cols = [
      { field: 'select', header: '' },
      { field: 'id', header: 'id', display: 'none' },
      { field: 'name', header: 'Nombre' },
      { field: 'recipeCost', header: 'Costo' }
    ];
  }
  loadRecipes() {
    this.loading = true;
    this.recipeService
      .getRecipe({...this.filter})
      .then(recipe => this.getRecipes(recipe))
      .then(() => this.submitted = true)
      .then(() => this.loading = false);
  }

  private emitEvents() {
      this.hideSearch.emit(this.selectedRecipes);
      this.recipes = [];
   }

  private getRecipes(recipe: Recipe[]) {
    this.recipes.length = 0;
    recipe.forEach(x => {
      if (!this.isAnException(x)) {
        this.recipes.push(x);
      }
    });
  }
  private isAnException(recipe: Recipe) {
    return this.exceptions.findIndex(x => x.id === recipe.id) >= 0;
  }
}
