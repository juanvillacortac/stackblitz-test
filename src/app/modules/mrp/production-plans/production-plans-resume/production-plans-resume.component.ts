import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseModel } from 'src/app/models/common/BaseModel';
import { PlanRecipe } from 'src/app/models/mrp/plan-recipe';
import { ProductionPlan } from 'src/app/models/mrp/production-plan';
import { ProductionPlansService } from '../shared/production-plans.service';

@Component({
  selector: 'app-production-plans-resume',
  templateUrl: './production-plans-resume.component.html',
  styleUrls: ['./production-plans-resume.component.scss']
})
export class ProductionPlansResumeComponent implements OnInit {
  get displayName() { return this.productionPlan?.name ?? ''; }
  get displayProgress() { return this.productionPlan?.progress ?? 0; }
  get displayRecipes() { return this.productionPlan?.recipes ?? []; }

  cols: any[];
  progressAlign = 'center';
  selectedPlanRecipe: PlanRecipe;
  productionPlan: ProductionPlan;
  filter: BaseModel = { id: null, name: '' };

  constructor(
    private router: Router,
    private readonly service: ProductionPlansService) { }

  ngOnInit(): void {
    this.setupColumns();
  }

  setupColumns() {
    this.cols = [
      { field: 'idProductionOrder', display: 'table-cell', header: 'ID' },
      { field: 'name', display: 'table-cell', header: 'mrp.recipe.recipe' },
      { field: 'quantity', display: 'table-cell', header: 'amount' },
      { field: 'status', display: 'table-cell', header: 'status' },
      { field: 'action', display: 'table-cell', header: '' }
    ];
  }

  onRecipeSelected(plan: PlanRecipe) {
    this.router.navigate(['/mrp/production-orders'], { queryParams: { idOrder: plan.idProductionOrder } });
  }

  getPlanStatusColor() {
    return this.service.getPlanStatusColor(this.productionPlan);
  }

  planRecipeStatus(planRecipe) {
    return planRecipe.isDelayed ? 'delayed' : 'at-time';
  }

  columnWidth(field: string) {
    return (field === 'idRecipe') ? '6rem' : (field === 'idProductionOrder') ? '3rm' : '';
  }
}
