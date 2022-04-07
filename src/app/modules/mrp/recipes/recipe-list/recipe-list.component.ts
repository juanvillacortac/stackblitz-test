import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { Recipe } from 'src/app/models/mrp/recipe';
import { RecipeFilter } from 'src/app/models/mrp/recipe-filters';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { RecipeService } from '../shared/recipe.service';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  idRoom: number;
  loading: boolean;
  showFilters = false;
  showDialog = false;
  isCallback = false;
  filter: RecipeFilter = new RecipeFilter();
  recipe: Recipe = new Recipe();
  recipesList: Recipe[] = [];
  recipeNotFilteredList: Recipe[] = [];
  cols: any[];
  recipeToRecalculate = 0;
  permissionsIDs = {...Permissions};

  displayedColumns: ColumnD<Recipe>[] =
  [
   {template: (data) => data.id, header: 'Id', field: 'Id', display: 'none'},
   {template: (data) => data.name, field: 'name', header: 'name', display: 'table-cell'},
   {template: (data) => data.isWeight, field: 'isWeight', header: 'Pesado', display: 'table-cell'},
   {template: (data) => data.outputProductName, field: 'outputProductName', header: 'Producto Salida', display: 'table-cell'},
   {template: (data) => data.recipeCost.netCostPvp, field: 'recipeCost.netCostPvp', header: 'PVP', display: 'table-cell'},
   {field: 'edit', header: '', display: 'table-cell'}
  ];

  constructor(
    public userPermissions: UserPermissions,
    private recipeService: RecipeService,
    private route: Router,
    private dialogService: DialogsService,
    private breadcrumbService: BreadcrumbService,
    private readonly loadingService: LoadingService) {
      this.breadcrumbService.setItems([
        { label: 'MRP' },
        { label: 'Recetas'}
    ]);
  }

  ngOnInit(): void {
    this.search();
    this.loading = false;
  }

  search() {
    this.loadingService.startLoading();
    this.loadRecipes();
  }

  private loadRecipes() {
    this.loading = true;
    this.recipeService
      .getRecipe({...this.filter})
      .then(recipe => this.recipesList = recipe.sort((a, b) => b.id - a.id))
      .then(() => this.loadRecipesToRecalculate())
      .catch(error => this.handleError(error));
  }
  private loadRecipesToRecalculate() {
    this.loadingService.startLoading('wait_calculating');
    this.loading = true;
    this.recipeService
      .loadRecipesToRecalculate()
      .then(recipe => this.recipeToRecalculate = recipe.length ?? 0)
      .then(() => this.successCall())
      .catch(error => this.handleError(error));
  }
  openNew() {
    this.route.navigate(['/mrp/recipe-new']);
  }
  onEdit(recipe: Recipe) {
    this.recipeService.selectedRecipe = recipe;
    this.route.navigate(['/mrp/recipe', recipe.id]);
  }
  onShowDetail(id: number) {
      this.recipeService.idRoom = -1;
      this.route.navigate(['/mrp/recipe-ingredients', id]);
  }
  openRecipesToRecalculateView() {
    this.route.navigate(['/mrp/recipe-cost-recalculate']);
  }

  public childCallBack(reload: boolean): void {
    this.showDialog = false;
    if (reload) {
      this.isCallback = true;
      this.search();
    }
}

  private handleError(error: HttpErrorResponse) {
    this.loading = false;
    this.loadingService.stopLoading();
    this.dialogService.errorMessage('mrp.recipe.recipes', error?.error?.message ?? 'error_service');
  }
  successCall() {
    this.loadingService.stopLoading();
    this.loading = false;
  }
  detail(recipe: Recipe) {
    this.recipeService.selectedRecipe = recipe;
    this.route.navigate(['/mrp/recipe', recipe.id]);
  }
}
