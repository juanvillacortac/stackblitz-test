import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseModel } from 'src/app/models/common/BaseModel';
import { PlanRecipe } from 'src/app/models/mrp/plan-recipe';
import { RecipeInventory } from 'src/app/models/mrp/recipe-inventory';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { ProductionPlansService } from '../shared/production-plans.service';

@Component({
  selector: 'app-production-plans-recipe',
  templateUrl: './production-plans-recipe.component.html',
  styleUrls: ['./production-plans-recipe.component.scss']
})
export class ProductionPlansRecipeComponent implements OnInit {

  @Input() showPanel = false;
  @Input() excludedRecipes: PlanRecipe[] = [];
  @Output() recipeSelected: EventEmitter<PlanRecipe> = new EventEmitter<PlanRecipe>();


  get isValidCapacity() { return this.amountToPrepare > 0; }// && this.selectedRecipeInventory?.availableQty > this._amountToPrepare;  }

  loading = false;
  recipeInventory: RecipeInventory[] = [];
  selectedRecipeInventory: RecipeInventory;
  amountToPrepare: number;
  cols: any[];
  filter: BaseModel = { id: null, name: '' };
  _validations: Validations = new Validations();

  constructor(
    private dialogService: DialogsService,
    private service: ProductionPlansService
  ) { }

  ngOnInit(): void {
    this.setupColumns();
  }

  selectCurrentRecipe() {
    if (this.selectedRecipeInventory) {
      const planRecipe = this.getPlanRecipeByRecipeInventory();
      this.recipeSelected.emit(planRecipe);
      this.closePanel();
    }
  }

  setupColumns() {
    this.cols = [
      { field: 'idRecipe', display: 'table-cell', header: 'ID' },
      { field: 'name', display: 'table-cell', header: 'description' },
      { field: 'availableQty', display: 'table-cell', header: 'mrp.production_plan.elaboration_capacity' }
    ];
  }

  hideDialog() {
    this.closePanel();
    this.recipeSelected.emit(null);
  }

  search() {
    this.loading = true;
    this.service.loadRecipesInventory(this.filter)
      .then(recipes => this.onRecipeLoaded(recipes))
      .then(_ => this.loading = false)
      .catch(error => this.handleError(error));
  }

  onRecipeLoaded(recipes: RecipeInventory[]) {
    this.recipeInventory = recipes.filter(x => !this.isRecipeExcluded(x));
  }

  clearFilters() {
    this.filter = { id: null, name: '' };
  }

  amountPressed(event) {
    if (event.code === 'Tab') { return; }
    this.amountToPrepare = event.target.ariaValueNow;
  }

  private closePanel() {
    this.showPanel = false;
    this.clearFormFields();
  }

  private getPlanRecipeByRecipeInventory(): PlanRecipe {
    return {
      id: -1,
      idProductionOrder: -1,
      idRecipe: this.selectedRecipeInventory.idRecipe,
      currentInventory: this.selectedRecipeInventory.availableQty,
      quantity: Number(this.amountToPrepare),
      name: this.selectedRecipeInventory.name,
      elaborationCapacity: this.selectedRecipeInventory.availableQty,
      idPackage: this.selectedRecipeInventory.idPackage,
      idProduct: this.selectedRecipeInventory.idProduct,
      isDelayed: false,
      prepTime: this.selectedRecipeInventory.prepTime
    };
  }

  private isRecipeExcluded(x: RecipeInventory) {
    return (this.excludedRecipes.findIndex(y => y.idRecipe === x.idRecipe) >= 0);
  }

  private handleError(error: HttpErrorResponse) {
    this.loading = false;
    this.dialogService.errorMessage('mrp.production_plan.search_recipe', error.error?.message ?? 'error_service');
  }

  private clearFormFields() {
    this.amountToPrepare = null;
    this.amountToPrepare = null;
    this.recipeInventory = [];
    this.selectedRecipeInventory = null;
    this.clearFilters();
  }
}
