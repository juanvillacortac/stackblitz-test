import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { LayoutComponent } from '../layout/layout/layout.component';
import { RawMaterialsListComponent } from './derivates-room/raw-materials-list/raw-materials-list.component';
import { ProcessingRoomRecipesComponent } from './processing-room/processing-room-recipes/processing-room-recipes.component';
import { ProcessingRoomListComponent } from './processing-room/processing-room-list/processing-room-list.component';
import { RecipeIngredientsListComponent } from './recipes/recipe-ingredients/recipe-ingredients-list/recipe-ingredients-list.component';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { ProductionPlansCalendarComponent } from './production-plans/production-plans-calendar/production-plans-calendar.component';
import { ProductionPlansDetailComponent } from './production-plans/production-plans-detail/production-plans-detail.component';
import { ProductionPlansListComponent } from './production-plans/production-plans-list/production-plans-list.component';
import { IngredientsListComponent } from './ingredients/ingredients-list/ingredients-list.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { CuttingOrdersListComponent } from './cutting-requirements/cutting-orders-list/cutting-orders-list.component';
import { CuttingWorkOrdersComponent } from './cutting-requirements/cutting-work-orders/cutting-work-orders.component';
import { ProductionOrdersListComponent } from './production-orders/production-orders-list/production-orders-list.component';
import { ProductionOrdersDetailComponent } from './production-orders/production-orders-detail/production-orders-detail.component';
import { RecipeCostRecalculateListComponent } from './recipes/recipe-cost/recipe-cost-recalculate-list/recipe-cost-recalculate-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '',
  component: LayoutComponent,
  canActivate: [AuthGuard],
  children:
  [
    { path: 'processing-room', component: ProcessingRoomListComponent },
    { path: 'room-recipes/:id', component: ProcessingRoomRecipesComponent },
    { path: 'recipe', component: RecipeListComponent },
    { path: 'recipe/:id', component: RecipeDetailComponent },
    { path: 'recipe-new', component: RecipeDetailComponent },
    { path: 'recipe-ingredients/:id', component: RecipeIngredientsListComponent },
    { path: 'production-plans-schedule', component: ProductionPlansCalendarComponent },
    { path: 'production-plans', component: ProductionPlansListComponent },
    { path: 'production-plans/:id', component: ProductionPlansDetailComponent },
    { path: 'production-orders', component: ProductionOrdersListComponent },
    { path: 'production-orders/:id', component: ProductionOrdersDetailComponent },
    { path: 'production-plans-new', component: ProductionPlansDetailComponent },
    { path: 'derivates-room/:id', component: RawMaterialsListComponent },
    { path: 'ingredients', component: IngredientsListComponent },
    { path: 'cutting-orders', component: CuttingOrdersListComponent },
    { path: 'cutting-work-orders', component: CuttingWorkOrdersComponent },
    { path: 'recipe-cost-recalculate', component: RecipeCostRecalculateListComponent },
    { path: 'dashboard', component: DashboardComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MrpRoutingModule { }
