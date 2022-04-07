import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ColumnD } from 'src/app/models/common/columnsd';
import { RecipeFilter } from 'src/app/models/mrp/recipe-filters';
import { RecipeIngredients } from 'src/app/models/mrp/recipe-ingredients';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { RecipeService } from '../../shared/recipe.service';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';
import { Recipe } from 'src/app/models/mrp/recipe';
import { SelectItem } from 'primeng/api';
import { MeasurementunitsService } from 'src/app/modules/masters-mpc/shared/services/measurementunits.service';
import { measurementunits } from 'src/app/models/masters-mpc/measurementunits';
import { RecipeCost } from 'src/app/models/mrp/recipe-cost';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-recipe-ingredients-list',
  templateUrl: './recipe-ingredients-list.component.html',
  styleUrls: ['./recipe-ingredients-list.component.scss'],
  providers: [DecimalPipe]
})
export class RecipeIngredientsListComponent implements OnInit {
  recipeToRecalculate = 0;
  sellingFactor = 0;
  submitted = false;
  idRecipe: number;
  loading: boolean;
  calculated = false;
  showDialog = false;
  isCallback = false;
  filter: RecipeFilter;
  unitOfMeasurementSelected: measurementunits = new measurementunits();
  recipeSelected: Recipe = new Recipe();
  recipeCost: RecipeCost = new RecipeCost();
  ingredient: RecipeIngredients = new RecipeIngredients();
  ingredientList: RecipeIngredients[] = [];
  ingredientNotFilteredList: RecipeIngredients[] = [];
  cols: any[];
  unitOfMeasurement: SelectItem<measurementunits[]> = {value: null};
  permissionsIDs = {...Permissions};
  displayedColumns: ColumnD<RecipeIngredients>[] =
  [
   {template: (data) => data.id,  field: 'id', header: 'ean', display: 'none'},
   {template: (data) => data.barcode,  field: 'barcode', header: 'Barra', display: 'table-cell'},
   {template: (data) => data.name, field: 'name', header: 'name', display: 'table-cell'},
   {template: (data) => data.isSupply, field: 'isSupply', header: 'mrp.recipe.field_is_supply', display: 'table-cell'},
   {template: (data) => data.qty, field: 'qty', header: 'Cantidad gr/ml', display: 'table-cell'},
   {template: (data) => data.actualCost, field: 'actualCost', header: 'mrp.recipe.field_cost', display: 'table-cell'},
   {field: 'edit', header: '', display: 'table-cell'}
  ];

  constructor(
    public userPermissions: UserPermissions,
    private recipeService: RecipeService,
    private _measurementUnitsService: MeasurementunitsService,
    private actRoute: ActivatedRoute,
    private dialogService: DialogsService,
    private breadcrumbService: BreadcrumbService,
    private readonly loadingService: LoadingService,
    private router: Router,
    private _decimalPipe: DecimalPipe) {
      this.idRecipe = this.actRoute.snapshot.params['id'];
      this.breadcrumbService.setItems([
        { label: 'MRP' },
        { label: 'Recetas', routerLink: ['/mrp/recipe'] },
        { label: 'Ingredientes de la receta', routerLink: [`/mrp/recipe-ingredients/${this.idRecipe}`] }
    ]);
  }

ngOnInit(): void {
  this.loadingService.startLoading();
      this.getunitOfMeasurementPromise().then(() => {
      this.setupFilter();
      this.search();
      this.loading = false;
    });
  }
  setupFilter() {
    this.filter = { id: this.idRecipe, name: '' };
  }
  search() {
    this.loadRecipe();
  }
  onCalculateRecipeCost() {
    this.submitted = true;
    if (this.validateDataForCalculateCost || this.recipeToRecalculate > 0) {
      const model = this.completeRecipeModel();
      this.calculateRecipeCost(model[0]);
    }
  }
  openNew() {
    this.ingredient = null;
    this.showDialog = true;
    this.isCallback = false;
  }
  onEdit(id: number) {
    this.ingredient = this.ingredientList.find(p => p.id === id);
    this.showDialog = true;
    this.isCallback = false;
  }

  onDelete(idIngredient: number) {
    this.dialogService.confirmDeleteDialog('delete', () => {
        this.removeIngredient(idIngredient);
    });
  }

  onSave() {
    this.submitted = true;
    if (!this.disabledSaveButton) {
      this.dialogService.confirmDialog('delete', 'Los costos de la receta se actualizarán. ¿Desea continuar?', () => {
        this.saveRecipeCost();
      });
    }
  }
  cancel() {
    this.closeView();
  }

  public childCallBack(reload: boolean): void {
    this.showDialog = false;
    if (reload) {
      this.isCallback = true;
      this.calculated = false;
      this.loadRecipeIngredients(this.idRecipe);
    }
  }
  public onChangeSellingFactor() {
    if (this.sellingfactorChanged) {
      this.calculated = false;
    } else if (this.netCostPvpChanged) {
      this.calculated = true;
    }
  }
  private getunitOfMeasurementPromise = () => {
    return this._measurementUnitsService.getMeasurementUnitsbyfilterPromise()
        .then(results => { this.unitOfMeasurement.value = results.sort((a, b) => a.name.localeCompare(b.name)); })
        .catch(error => this.handleError(error));
  }
  private loadRecipe() {
    this.loading = true;
    this.recipeService
        .getRecipe({...this.filter})
        .then(recipe => this.loadRecipeModelValues(recipe[0]))
        .then(() => this.loadRecipeIngredients(this.idRecipe, true))
        .catch(error => this.handleError(error));
  }

  private loadRecipeModelValues(recipe: Recipe) {
    this.recipeSelected = recipe;
    this.recipeCost = recipe.recipeCost;
    this.sellingFactor = recipe.recipeCost.sellingFactor;
    this.unitOfMeasurementSelected = this.unitOfMeasurement.value.find(x => x.id === this.recipeSelected.unitOfMeasurement);
  }

  private loadRecipeIngredients(idRecipe: number, isForChek = false) {
    this.loading = true;
    this.recipeService
        .getRecipeIngredients(idRecipe)
        .then(recipeIngredients => {this.ingredientList = recipeIngredients.sort((a, b) => b.id - a.id); })
        .then(() => this.checkIfRecipeCostChanged(isForChek))
        .then(() => this.loadingService.stopLoading())
        .catch(error => this.handleError(error));
  }

  private calculateRecipeCost(model: Recipe, isForChek = false) {
    this.loadingService.startLoading('wait_calculating');
    this.recipeService
        .calculateRecipeCost(model)
        .then(recipeCost => this.successCalculatedRecipeCost(recipeCost, isForChek))
        .then(() => this.loading = false)
        .catch(error => this.handleError(error));
  }
  private removeIngredient(idIngredient: number) {
    this.loadingService.startLoading('wait_saving');
    this.recipeService
        .removeIngredient(idIngredient)
        .then(() => this.loadRecipeIngredients(this.idRecipe))
        .then(() => this.successRemovingIngredient())
        .catch(error => this.handleError(error));
  }

  private saveRecipeCost() {
    this.loadingService.startLoading('wait_saving');
    this.submitted = true;
    const newModel = this.completeRecipeModel();
    this.recipeService
        .addRecipes(newModel)
        .then(() => this.successAddingRecipe())
        .catch(error => this.handleError(error));
  }
  private checkIfRecipeCostChanged(isForChek: boolean) {
    if (isForChek) {
      const model = this.completeRecipeModel();
      this.calculateRecipeCost(model[0], isForChek);
    }
  }
  private completeRecipeModel() {
    const recipesToSave = [];
    const model = {...this.recipeSelected};
    model.recipeIngredients = this.ingredientList;
    model.recipeCost = this.recipeCost;
    model.recipeCost.sellingFactor = this.sellingFactor;
    recipesToSave.push(model);
    return recipesToSave;
  }
  private successCalculatedRecipeCost(model: any, isForChek = false) {
    this.loadingService.stopLoading();
    if (isForChek) {
        this.recipeToRecalculate = this._decimalPipe.transform(model.netCost, '1.2-2') !==
        this._decimalPipe.transform(this.recipeCost.netCost, '1.2-2') ? 1 : 0;
        return;
    }
    this.recipeToRecalculate = 0;
    this.isCallback = false;
    this.calculated = true;
    this.recipeCost = model;
    this.dialogService.successMessage('mrp.recipe.recipes', 'mrp.recipe.cost_calculated');
  }
  private successAddingRecipe() {
    this.loadingService.stopLoading();
    this.isCallback = false;
    this.calculated = false;
    this.recipeSelected.recipeCost = this.recipeCost;
    this.dialogService.successMessage('mrp.recipe.recipes', 'saved');
    this.closeView();
  }
  private successRemovingIngredient() {
    this.loadingService.stopLoading();
    this.isCallback = true;
    this.dialogService.successMessage('mrp.recipe.recipes', 'deleted');
  }
  private handleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.dialogService.errorMessage('mrp.ingredients.ingredients', error?.error?.message ?? 'error_service');
  }
  private closeView() {
    if (this.recipeService.idRoom !== - 1) {
      if (this.userPermissions.allowed(this.permissionsIDs.CHECK_PROCESSINGROOMRECIPE_PERMISSION_ID)) {
        this.router.navigate(['/mrp/room-recipes', this.recipeService.idRoom ]);
      }
    } else {
      this.router.navigateByUrl('/mrp/recipe');
    }
  }
  get validateIngredients() {
    return (this.ingredientList?.length > 0);
  }
  get validateSellingFactor() {
    return (this.sellingFactor === 0 || this.sellingFactor === null );
  }

  get disabledSaveButton() {
    return (!this.calculated || this.isCallback);
  }
  get netCostPvpChanged() {
    const netCostPvpModel = this.recipeSelected?.recipeCost?.netCostPvp ?? Number(0);
    return (this.recipeCost.netCostPvp !== netCostPvpModel);
  }
  get sellingfactorChanged() {
    return (this.recipeCost.sellingFactor !== this.sellingFactor );
  }
  get validateDataForCalculateCost() {
    return this.validateIngredients && !this.validateSellingFactor && (this.sellingfactorChanged || this.isCallback);
  }
  get disabledCalculateButton() {
    return (this.validateDataForCalculateCost || this.recipeToRecalculate > 0);
  }
}
