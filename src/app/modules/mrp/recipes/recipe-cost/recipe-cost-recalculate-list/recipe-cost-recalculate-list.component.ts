import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Recipe } from 'src/app/models/mrp/recipe';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { RecipeService } from '../../shared/recipe.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { RecipeIngredients } from 'src/app/models/mrp/recipe-ingredients';
import { OverlayPanel } from 'primeng/overlaypanel';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';

@Component({
  selector: 'app-recipe-cost-recalculate-list',
  templateUrl: './recipe-cost-recalculate-list.component.html',
  styleUrls: ['./recipe-cost-recalculate-list.component.scss']
})
export class RecipeCostRecalculateListComponent implements OnInit {
  idRoom: number;
  loading: boolean;
  showFilters = false;
  showDialog = false;
  isCallback = false;
  recipe: Recipe = new Recipe();
  recipesList: Recipe[] = [];
  ingredientsList: RecipeIngredients[] = [];
  recipesSelected: Recipe[] = [];
  cols: any[];
  permissionsIDs = {...Permissions};
  displayedIngredientsColumns: ColumnD<RecipeIngredients>[] = [];
  displayedColumns: ColumnD<Recipe>[] = [];
  @ViewChild('op') op: OverlayPanel;
  submitted: boolean;



  constructor(
    public userPermissions: UserPermissions,
    private recipeService: RecipeService,
    private route: Router,
    private dialogService: DialogsService,
    private breadcrumbService: BreadcrumbService,
    private readonly loadingService: LoadingService) {
      this.breadcrumbService.setItems([
        { label: 'MRP' },
        { label: 'Recetas', routerLink: ['/mrp/recipe'] },
        { label: 'Cambio de costos' }
    ]);
  }

  ngOnInit(): void {
    this.loadingService.startLoading('wait_loading');
    this.loadRecipesColumns();
    this.loadIngredientsColumns();
    this.search();
    this.loading = false;
  }

  loadRecipesColumns() {
    this.displayedColumns =
    [
      {template: (data) => data.id, header: 'Id', field: 'Id', display: 'none'},
      {template: (data) => data.name, field: 'name', header: 'Receta afectada', display: 'table-cell'},
      {template: (data) => data.recipeCost.oldNetCost, field: 'recipeCost.oldNetCost', header: 'PVP Actual', display: 'table-cell'},
      {template: (data) => data.recipeCost.netCostPvp, field: 'recipeCost.netCostPvp', header: 'PVP Nuevo', display: 'table-cell'},
      {template: (data) => data.recipeCost.costVariation, field: 'recipeCost.costVariation', header: 'Variación', display: 'table-cell'},
      {field: 'edit', header: '', display: 'table-cell'}
    ];
  }

  loadIngredientsColumns() {
    this.displayedIngredientsColumns =
    [
     {template: (data) => data.id, header: 'Id', field: 'Id', display: 'none'},
     {template: (data) => data.barcode, field: 'barcode', header: 'Barra', display: 'table-cell'},
     {template: (data) => data.name, field: 'name', header: 'Nombre', display: 'table-cell'},
     {template: (data) => data.actualCost, field: 'actualCost', header: 'Costo actual', display: 'table-cell'},
     {template: (data) => data.newCost, field: 'newCost', header: 'Costo nuevo', display: 'table-cell'},
     {template: (data) => data.variation, field: 'variation', header: 'Variación', display: 'table-cell'},
    ];
  }

  search() {
    this.loadRecipesToRecalculate();
  }

  private loadRecipesToRecalculate() {
    this.loading = true;
    this.recipeService
      .loadRecipesToRecalculate()
      .then(recipe => this.recipesList = recipe.sort((a, b) => b.id - a.id))
      .then(() => this.loadingService.stopLoading())
      .catch(error => this.handleError(error));
  }
  openNew() {
    this.route.navigate(['/mrp/recipe-new']);
  }

  cancel() {
    this.route.navigateByUrl('/mrp/recipe');
  }
  onShowIngredients(event: Event, recipe: Recipe) {
    this.ingredientsList = recipe.recipeIngredients.filter(p => p.newCost !== p.actualCost);
    this.op.toggle(event, event.target);
  }
  onSave() {
    if (this.disabledSaveButton) {
      return;
    }
    this.loadingService.startLoading('wait_calculating');
    this.submitted = true;
      this.recipeService
      .updateRecipesCost(this.recipesSelected)
      .then( () => this.search())
      .then(() => this.successAddingRecipe())
      .catch(error => this.handleError(error));
  }

  private handleError(error: HttpErrorResponse) {
    this.loading = false;
    this.loadingService.stopLoading();
    this.dialogService.errorMessage('mrp.ingredients.ingredients', error?.error?.message ?? 'error_service');
  }
  private successAddingRecipe() {
    this.loadingService.stopLoading();
    this.loading = false;
    this.dialogService.successMessage('mrp.recipe.recipes', 'saved');
  }

  get disabledSaveButton() {
    const recipes = this.recipesSelected.length ?? 0;
    if (recipes > 0) {
       return false;
    }
    return true;
  }

}
