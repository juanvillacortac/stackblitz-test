import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { ValueMoreThanZeroValidator } from 'src/app/helpers/confirmed.validator';
import { BaseModel } from 'src/app/models/common/BaseModel';
import { StatusEnum } from 'src/app/models/common/status-enum';
import { measurementunits } from 'src/app/models/masters-mpc/measurementunits';
import { Ingredient } from 'src/app/models/mrp/ingredient';
import { Recipe } from 'src/app/models/mrp/recipe';
import { RecipeCost } from 'src/app/models/mrp/recipe-cost';
import { RecipeFilter } from 'src/app/models/mrp/recipe-filters';
import { LoadingService } from 'src/app/modules/common/components/loading/shared/loading.service';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { MeasurementunitsFilter } from 'src/app/modules/masters-mpc/shared/filters/measurementunits-filter';
import { MeasurementunitsService } from 'src/app/modules/masters-mpc/shared/services/measurementunits.service';
import { Validations } from 'src/app/modules/masters-mpc/shared/Utils/Validations/Validations';
import { RecipeService } from '../shared/recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  idRecipe: number;
  showSearching = false;
  isDisabled = false;
  loading: boolean;
  submitted = false;
  recipeForm: FormGroup;
  isEdit = false;
  formTitle: string;
  outputProductName: string;
  unitOfMeasurement: SelectItem<measurementunits[]> = {value: null};
  ingredientSelected: Ingredient = null;
  recipe: Recipe;
  ingredients: Ingredient[] = [];
  cols: any[];
  ingredientAdded = false;
  recipeCost: RecipeCost = new RecipeCost();
  _validations: Validations = new Validations();
  status: SelectItem[] = [
    {label: 'Inactivo', value: '0'},
    {label: 'Activo', value: '1'}
  ];
  constructor(
    private _measurementUnitsService: MeasurementunitsService,
    private _recipeService: RecipeService,
    private formBuilder: FormBuilder,
    private dialogService: DialogsService,
    private breadcrumbService: BreadcrumbService,
    private actRoute: ActivatedRoute,
    private router: Router,
    private readonly loadingService: LoadingService) {
      this.recipeForm = this.setNewForm();
      this.breadcrumbService.setItems([
        { label: 'MRP' },
        { label: 'Recetas', routerLink: ['/mrp/recipe'] }
      ]);
  }
  ngOnInit(): void {
    this.formTitle = 'Receta';
    this.loadingService.startLoading();
    this.getunitOfMeasurementPromise().then(() => {
      this.loadCurrentRecipeIfExists();
      this.setupColumns();
    }).then(() => this.loadingService.stopLoading());
  }
  setupColumns() {
    this.cols = [
      { field: 'barcode', header: 'Barra' },
      { field: 'name', header: 'Nombre' },
      { field: 'actualCost', header: 'Costo actual' },
      { field: 'edit', display: 'table-cell', header: '' }
    ];
  }

  loadCurrentRecipeIfExists() {
    this.idRecipe = Number(this.actRoute.snapshot.params['id']);
    if (this.idRecipe) {
        if (this.isRouteIdEqualsToServiceId()) {
          const currentRecipe = this._recipeService.selectedRecipe;
          this.onEditForm(currentRecipe);
        } else {
          const filters = this.loadFilters();
          this._recipeService.getRecipe({...filters})
          .then(response => this.onEditForm(response[0]))
          .catch(error => this.handleError(error));
        }
    } else {
    this.onNewForm();
    }
  }
  removeIngredient() {
    this.ingredients = [];
    this.ingredientAdded = false;
  }

  searchIngredient() {
    this.showSearching = true;
  }

  getItemsSelected(ingredient) {
    this.showSearching = false;
    this.ingredientSelected = ingredient ?? null;
    if (this.ingredientSelected) {
      this.ingredients.push(ingredient);
      this.recipeForm.patchValue({
        idOutputProduct: ingredient.productId,
        outputProduct: ingredient.name,
        barcode: ingredient.barcode
      });
      this.ingredientAdded = true;
    }
  }

  onNewForm() {
      this.recipeForm.controls.active.setValue('1');
      this.isEdit = false;
  }
  loadFilters() {
    const model = new RecipeFilter();
    model.id = this.idRecipe;
    return model;
  }
  onEditForm(recipe: Recipe) {
      this.recipeCost = recipe.recipeCost;
      this.outputProductName = recipe.outputProductName;
      this.isEdit = true;
      this.patchFormWithValues(recipe);

  }
  private patchFormWithValues(recipe: Recipe) {
    this.recipeForm.patchValue({
            id: recipe.id,
            name: recipe.name,
            preparation: recipe.preparation,
            prepTime: recipe.prepTime,
            expectedDepletion: recipe.expectedDepletion,
            storageTime: recipe.storageTime,
            storageCondition: recipe.storageCondition,
            qtyPortionResult: recipe.qtyPortionResult,
            unitOfMeasurementSelected: this.unitOfMeasurement.value.find(p => Number(p.id) === Number(recipe.unitOfMeasurement)),
            applyLaborCost: recipe.applyLaborCost,
            applyFactoryCost: recipe.applyFactoryCost,
            laborCost: recipe.laborCost,
            factoryCost: recipe.factoryCost,
            isWeight: recipe.isWeight,
            idOutputProduct: recipe.idOutputProduct,
            outputProductName: recipe.outputProductName,
            barcode: recipe.barcode,
            active: recipe.active ? String(StatusEnum.active) : String(StatusEnum.inactive),
            calculationMargin: recipe.calculationMargin
          });
  }

  getunitOfMeasurementPromise = () => {
    const filters: MeasurementunitsFilter = new MeasurementunitsFilter();
    filters.active = 1;
    return  this._measurementUnitsService.getMeasurementUnitsbyfilterPromise({...filters})
    .then(results => {
      this.unitOfMeasurement.value = results.sort((a, b) => a.name.localeCompare(b.name));
    }).catch(error =>  this.handleError(error));
  }

  handleChange(e) {
    this.isDisabled = e.checked;
  }

  applyFactoryCostChange(e) {
    if (!e.checked) {
      this.recipeForm.patchValue({
        factoryCost: null
      });
    }
  }

  applylaborCostChange(e) {
    if (!e.checked) {
      this.recipeForm.patchValue({
        laborCost: null
      });
    }
  }


  toRecipeModel() {
      const recipesToSave = [];
      const model = new Recipe();
          model.id = this.recipeForm.controls.id.value;
          model.name = this.recipeForm.controls.name.value;
          model.preparation = this.recipeForm.controls.preparation.value;
          model.prepTime = this.recipeForm.controls.prepTime.value;
          model.expectedDepletion = this.recipeForm.controls.expectedDepletion.value;
          model.storageTime = this.recipeForm.controls.storageTime.value ?? 0;
          model.storageCondition = this.recipeForm.controls.storageCondition.value;
          model.qtyPortionResult = this.recipeForm.controls.qtyPortionResult.value;
          model.unitOfMeasurement = this.recipeForm.controls.unitOfMeasurementSelected.value.id;
          model.applyLaborCost = this.recipeForm.controls.applyLaborCost.value;
          model.applyFactoryCost = this.recipeForm.controls.applyFactoryCost.value;
          model.laborCost = this.recipeForm.controls.laborCost.value;
          model.factoryCost = this.recipeForm.controls.factoryCost.value;
          model.isWeight = this.recipeForm.controls.isWeight.value;
          model.idOutputProduct = this.recipeForm.controls.idOutputProduct.value;
          model.outputProductName = this.recipeForm.controls.outputProduct.value;
          model.barcode = this.recipeForm.controls.barcode.value;
          model.active =  this.recipeForm.controls.active.value === '0' ? false : true;
          model.calculationMargin = this.recipeForm.controls.calculationMargin.value;
          model.recipeCost = this.recipeCost;
          recipesToSave.push(model);
      return recipesToSave;
  }
  onSave() {
    this.submitted = true;
    if (this.recipeForm.invalid || this.validateLaborCost || this.validateFactoryCost) {
      return;
    }
    this.loadingService.startLoading('wait_saving');
    const newModel = this.toRecipeModel();
      this._recipeService
      .addRecipes(newModel)
      .then( (results) => { this.onEmitHideForm(Number(results)); })
      .then(() => this.successAddingRecipe())
      .catch(error => this.handleError(error));
}

cancel() {
  this.router.navigateByUrl('/mrp/recipe');
}

  private setNewForm() {
      return this.formBuilder.group({
        id: -1,
        name: ['', Validators.required],
        preparation: [''],
        prepTime: [0, Validators.required],
        expectedDepletion: [0],
        storageTime: [0],
        storageCondition: [''],
        qtyPortionResult: [0, Validators.required],
        unitOfMeasurementSelected: [null, Validators.required],
        applyLaborCost: [false],
        applyFactoryCost: [false],
        laborCost: [null],
        factoryCost: [null],
        isWeight: [false],
        idOutputProduct:  ['', Validators.required],
        outputProduct: [''],
        barcode: [''],
        active: [0],
        calculationMargin: [0, Validators.required]
      },
      {validators: [ValueMoreThanZeroValidator('prepTime'),
                    ValueMoreThanZeroValidator('qtyPortionResult'),
                    ValueMoreThanZeroValidator('calculationMargin')]});
    }
  public onEmitHideForm(id: number): void {
      this.router.navigateByUrl('/mrp/recipe');
  }
  private successAddingRecipe() {
    this.loading = false;
    this.loadingService.stopLoading();
    this.dialogService.successMessage('mrp.recipe.recipes', 'saved');
  }

  private handleError(error: HttpErrorResponse) {
    this.loading = false;
    this.loadingService.stopLoading();
    this.dialogService.errorMessage('mrp.recipe.recipes', error?.error?.message ?? 'error_service');
  }

  private isRouteIdEqualsToServiceId() {
    return this._recipeService.selectedRecipe && this._recipeService.selectedRecipe.id === this.idRecipe;
  }

  get validatePrepTime () {
    return  (this.recipeForm.controls.prepTime.invalid &&
            (this.recipeForm.controls.prepTime.dirty || this.recipeForm.controls.prepTime.touched || this.submitted));
  }

  get validateQtyPortionResult () {
    return  (this.recipeForm.controls.qtyPortionResult.invalid &&
            (this.recipeForm.controls.qtyPortionResult.dirty || this.recipeForm.controls.qtyPortionResult.touched || this.submitted));
  }
  get validateCalculationMargin() {
    return  (this.recipeForm.controls.calculationMargin.invalid &&
      (this.recipeForm.controls.calculationMargin.dirty || this.recipeForm.controls.calculationMargin.touched || this.submitted));
  }
  get validateLaborCost () {
      if (this.checkApplyLaborCost) {
        const laborCostValue = this.recipeForm.controls.laborCost.value;
        return  ((laborCostValue === 0 || !laborCostValue) &&
          (this.recipeForm.controls.laborCost.dirty || this.recipeForm.controls.laborCost.touched || this.submitted));
      }
      return false;
  }
  get validateFactoryCost () {
      if (this.checkApplyFactoryCost) {
          const factoryCostValue = this.recipeForm.controls.factoryCost.value;

        return  ((factoryCostValue === 0 || !factoryCostValue) &&
          (this.recipeForm.controls.factoryCost.dirty || this.recipeForm.controls.factoryCost.touched || this.submitted));
      }
      return false;
  }
  get checkApplyFactoryCost () {
    return this.recipeForm.controls.applyFactoryCost.value;
  }

  get checkApplyLaborCost () {
    return this.recipeForm.controls.applyLaborCost.value;
  }
}
