import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreadcrumbService } from 'src/app/design/breadcrumb.service';
import { PlanRecipe } from 'src/app/models/mrp/plan-recipe';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { ProductionPlansService } from '../shared/production-plans.service';
import { UserPermissions } from 'src/app/modules/security/users/shared/user-permissions.service';
import { ProductionPlan } from 'src/app/models/mrp/production-plan';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import * as Permissions from 'src/app/modules/security/users/shared/user-const-permissions';

@Component({
  selector: 'app-production-plans-detail',
  templateUrl: './production-plans-detail.component.html',
  styleUrls: ['./production-plans-detail.component.scss']
})
export class ProductionPlansDetailComponent implements OnInit {
  idPlan: number = null;
  productionPlanForm: FormGroup;
  permissionsIDs = {...Permissions};
  planTypes = [ {'value': 1, 'label': 'Almacén'} , {'value': 2, 'label': 'Envío'} ];
  destinyStore = [ {'value': 1, 'label': 'Sucursal'} , {'value': 2, 'label': 'Tienda'}];
  minDate: Date = new Date();
  maxDate: Date = new Date();
  showDialog = false;
  showEdit = false;
  submitted = false;

  recipes: PlanRecipe[] = [];
  editingRecipe: PlanRecipe;
  cols: any[];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private breadcrumbService: BreadcrumbService,
    private service: ProductionPlansService,
    private dialogService: DialogsService,
    private actRoute: ActivatedRoute,
    public userPermissions: UserPermissions,
  ) {
    this.breadcrumbService.setItems([
      { label: 'MRP' },
      { label: 'Producción' },
      { label: 'Plan de producción', routerLink: ['/mrp/production-plans-schedule'] }
    ]);
    this.maxDate.setFullYear(this.maxDate.getFullYear() + 10);
  }

  ngOnInit(): void {
    this.setupForm();
    this.setupColumns();
    this.loadCurrentPlanIfExists();
  }

  loadCurrentPlanIfExists() {
    this.idPlan = Number(this.actRoute.snapshot.params['id']);
    if (this.idPlan) {
      if (this.isRouteIdEqualsToServiceId()) {
        this.patchFormWithValues(this.service.selectedPlan);
      } else {
        this.loadProductionPlan();
      }
    }
  }

  submitProductionPlan() {
    this.submitted = true;
    if (!this.hasPlanRecipes()) {
      this.dialogService.warnMessage('warning', 'mrp.production_plan.validations.recipes_required');
    } else {
      this.savePlanIfValid();
    }
  }

  onRecipeSaved() {
    this.dialogService.successMessage('save', 'mrp.production_plan.production_plan_added');
    this.router.navigateByUrl('/mrp/production-plans-schedule');
  }

  searchRecipe() {
    this.showDialog = true;
  }

  onRecipeSearched(recipe) {
    this.showDialog = false;
    if (recipe) {
      this.recipes = [...this.recipes.concat(recipe)];
    }
  }

  editRecipe(recipe) {
    this.editingRecipe = recipe;
    this.showEdit = true;
  }

  onRecipeEdited(recipe) {
    this.showEdit = false;
    this.editingRecipe = undefined;
    if (recipe != null) {
      this.recipes = [...this.recipeReplacingIfExists(recipe)];
    }
  }

  removeRecipe(recipe) {
    this.recipes = this.recipes.filter(x => x.idRecipe !== recipe.idRecipe);
  }

  isFormFieldValid(fieldName: string) {
    const field = this.productionPlanForm.get(fieldName);
    return field.invalid && (field.dirty || field.touched || this.submitted);
  }

  cancelPressed() {
    this.router.navigateByUrl('/mrp/production-plans-schedule');
  }

  private savePlanIfValid() {
    if (this.productionPlanForm.valid) {
      const productionPlan: ProductionPlan = this.productionPlanForm.value;
      productionPlan.deliveryDate.setHours(18);
      productionPlan.recipes = this.recipes;
      this.saveProductionPlan(productionPlan);
    }
  }

  private loadProductionPlan() {
    this.service.loadProductionPlanById(this.idPlan)
      .then(response => this.patchFormWithValues(response))
      .catch(error => this.handleError(error));
  }

  private saveProductionPlan(productionPlan: ProductionPlan) {
    this.service.saveProductionPlan(productionPlan)
      .then(() => this.onRecipeSaved())
      .catch(error => this.handleError(error));
  }

  private setupColumns() {
    this.cols = [
      { field: 'idRecipe', display: 'table-cell', header: 'mrp.recipe.recipe_id' },
      { field: 'name', display: 'table-cell', header: 'mrp.recipe.recipe' },
      { field: 'quantity', display: 'table-cell', header: 'amount' },
      { field: 'currentInventory', display: 'table-cell', header: 'mrp.production_plan.actual_inventory' },
      { field: 'edit', display: 'table-cell', header: '' }
    ];
  }

  private setupForm() {
    this.productionPlanForm = this.formBuilder.group({
      id: [-1],
      name: ['', Validators.required],
      idType: [undefined, Validators.required],
      idDestinyStore: [undefined, Validators.required],
      deliveryDate: ['', Validators.required],
      progress: [0]
    });
  }

  private patchFormWithValues(plan: ProductionPlan) {
    this.recipes = plan.recipes;
    this.productionPlanForm.patchValue({
      name: plan.name,
      idType: plan.idType,
      idDestinyStore: plan.idDestinyStore,
      deliveryDate: plan.deliveryDate
    });
  }

  private handleError(error: HttpErrorResponse) {
    this.dialogService.errorMessage('error', error.error?.message ?? 'error_service');
  }

  private isRouteIdEqualsToServiceId() {
    return this.service.selectedPlan && this.service.selectedPlan.id === this.idPlan;
  }

  private hasPlanRecipes() {
    return this.recipes.length > 0;
  }

  private recipeReplacingIfExists(recipe) {
    return this.recipes.map(r => {
      if (r.idRecipe === recipe.idRecipe) {
        r.quantity = recipe.quantity;
      }
      return r;
    });
  }
}
