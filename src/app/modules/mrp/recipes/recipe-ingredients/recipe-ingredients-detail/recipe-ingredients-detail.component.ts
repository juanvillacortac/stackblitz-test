import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AddIngredientViewModel } from 'src/app/models/mrp/add-room-ingredient';
import { Ingredient } from 'src/app/models/mrp/ingredient';
import { RecipeIngredients } from 'src/app/models/mrp/recipe-ingredients';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { IngredientsService } from '../../../shared/services/ingredients.service';
import { RecipeService } from '../../shared/recipe.service';

@Component({
  selector: 'app-recipe-ingredients-detail',
  templateUrl: './recipe-ingredients-detail.component.html',
  styleUrls: ['./recipe-ingredients-detail.component.scss']
})
export class RecipeIngredientsDetailComponent implements OnInit {
  needToSaveProduct = false;
  daysToRestock = 0;
  qty: number;
  newRecipeIngredient: RecipeIngredients;
  isEdit = false;
  loading: boolean;
  submitted: boolean;
  isSupply = false;
  title: string;
  ingredientSelected: Ingredient = null;
  @Input() showPanel = false;
  @Input() recipeIngredients: RecipeIngredients;
  @Input() addedRecipeIngredient: RecipeIngredients[] = [];
  @Input() idRecipe: number;
  @Output() hideDialogForm = new EventEmitter<boolean>();
  addedIngredients: Ingredient[] = [];
  showSearching = true;
  _validations: Validations = new Validations();
  constructor(
     private _recipeService: RecipeService,
     private dialogService: DialogsService,
     private ingredientService: IngredientsService,
     private readonly loadingService: LoadingService
     ) { }

  ngOnInit(): void {
    this.loadOptions();
  }

  loadOptions() {
    this.title = 'Ingrediente';
    if (this.recipeIngredients) {
        this.loadEditForm();
    } else {
        this.loadAddForm();
    }
  }

  loadEditForm() {
    this.isEdit = true;
    this.qty = this.recipeIngredients.qty;
    this.showSearching = false;
    this.isSupply = this.recipeIngredients.isSupply;
  }

  loadAddForm() {
    this.loadIngredientsFromAddedRecipeIngredients();
    this.qty = 0;
    this.isEdit = false;
    this.showSearching = true;
  }

  getItemsSelected(ingredient) {
    this.ingredientSelected = ingredient ?? null;
    this.onVerifySaveProduct();
  }
  onVerifySaveProduct() {
    this.needToSaveProduct = false;
    if (this.ingredientSelected) {
        this.needToSaveProduct = (this.ingredientSelected.id ?? -1) === -1;
    }
  }

  ingredientToRecipeIngredient(ingredients: Ingredient) {
    const newRecipeIngredient = { id: -1, idIngredients: ingredients.productId, idRecipe: Number(this.idRecipe),
                                  name: ingredients.name, actualCost: ingredients.actualCost,
                                  qty: this.qty, active: true, isSupply: this.isSupply} as RecipeIngredients;
    return newRecipeIngredient;
  }
  verifyQty() {
    return  ((this.qty ?? 0) > 0);
  }
  verifySave() {
    this.submitted = true;
    if (this.isEdit) {
      this.saveEdition();
    } else {
      this.saveNew();
    }
  }
  saveEdition() {
     if (this.verifyQty()) {
         this.loadingService.startLoading('wait_saving');
         this.recipeIngredients.qty = this.qty;
         this.recipeIngredients.isSupply = this.isSupply;
         this.onSave(this.recipeIngredients);
      }
  }
  saveNew() {
    if (this.ingredientSelected !== null && this.verifyQty()) {
        this.loadingService.startLoading('wait_saving');
        if (this.needToSaveProduct) {
            this.createIngredient();
        } else {
            this.onSave(this.ingredientToRecipeIngredient(this.ingredientSelected));
        }
    }
  }
  onSave(model: RecipeIngredients ) {
    this._recipeService
        .addRecipeIngredients(model)
        .then(() => this.successAddingIngredientRecipe())
        .then(() => this.onEmitHideForm(true))
        .catch(error => this.handleError(error));
  }

  public createIngredient() {
    if (this.invalidateDaysToRestock) { this.loadingService.stopLoading(); return; }
    const addViewModel = this.toIngredientViewModel();
    this.loading = true;
    this.ingredientService
        .addIngredients(addViewModel)
        .then(() => this.onSave(this.ingredientToRecipeIngredient(this.ingredientSelected)))
        .catch(error => this.handleError(error));
  }

  toIngredientViewModel() {
    const model = new AddIngredientViewModel();
          this.ingredientSelected.id = this.isEdit ? this.ingredientSelected.id : -1;
          this.ingredientSelected.daysToRestock = this.daysToRestock;
          this.ingredientSelected.barcode = this.ingredientSelected.barcode ?? '';
          this.ingredientSelected.active = true;
          model.idRoom = Number(-1);
          model.ingredients = this.ingredientSelected;
    return model;
  }

  loadIngredientsFromAddedRecipeIngredients() {
    this.addedRecipeIngredient.forEach(recipeIngredient => {
        this.addedIngredients.push(this.getIngredientFromRecipeIngredients(recipeIngredient));
    });
  }
  public onEmitHideForm(reload: boolean): void {
      this.hideDialogForm.emit(reload);
  }
  private getIngredientFromRecipeIngredients(recipeIngredient: RecipeIngredients) {
    return { productId: recipeIngredient.idIngredients, barcode: recipeIngredient.barcode  } as Ingredient;
  }
  private successAddingIngredientRecipe() {
    this.loadingService.stopLoading();
    this.loading = false;
    this.dialogService.successMessage('mrp.recipe.recipes', 'saved');
  }
  private handleError(error: HttpErrorResponse) {
    this.loadingService.stopLoading();
    this.loading = false;
    this.dialogService.errorMessage('mrp.recipe.recipes', error?.error?.message ?? 'error_service');
  }
  get invalidateDaysToRestock () {
    return  (this.daysToRestock === 0 || this.daysToRestock === null);
  }
}
