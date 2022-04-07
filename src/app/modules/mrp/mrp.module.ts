import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MrpRoutingModule } from './mrp-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RawMaterialsListComponent } from './derivates-room/raw-materials-list/raw-materials-list.component';
import { ProcessingRoomFiltersComponent } from './processing-room/processing-room-filters/processing-room-filters.component';
import { ProcessingRoomDetailComponent } from './processing-room/processing-room-detail/processing-room-detail.component';
import { ProcessingRoomListComponent } from './processing-room/processing-room-list/processing-room-list.component';
import { MaterialsListComponent } from './derivates-room/materials-list/materials-list.component';
import { MaterialsSearchComponent } from './derivates-room/materials-search/materials-search.component';
import { RawMaterialsFiltersComponent } from './derivates-room/raw-materials-filters/raw-materials-filters.component';
import { RoomRecipesSearchComponent } from './processing-room/room-recipes-search/room-recipes-search.component';
import { ProcessingRoomRecipesComponent } from './processing-room/processing-room-recipes/processing-room-recipes.component';
import { TranslateModule } from '@ngx-translate/core';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { RecipeFiltersComponent } from './recipes/recipe-filters/recipe-filters.component';
import { RecipeIngredientsDetailComponent } from './recipes/recipe-ingredients/recipe-ingredients-detail/recipe-ingredients-detail.component';
import { RecipeIngredientsListComponent } from './recipes/recipe-ingredients/recipe-ingredients-list/recipe-ingredients-list.component';
import { ProductionPlansCalendarComponent } from './production-plans/production-plans-calendar/production-plans-calendar.component';
import { CalendarModule } from 'angular-calendar';
import { ProductionPlansListComponent } from './production-plans/production-plans-list/production-plans-list.component';
import { ProductionPlansDetailComponent } from './production-plans/production-plans-detail/production-plans-detail.component';
import { ProductionPlansRecipeComponent } from './production-plans/production-plans-recipe/production-plans-recipe.component';
import { SubstitutionsIngredientSettingComponent } from './ingredients/substitutions-ingredient-setting/substitutions-ingredient-setting.component';
import { CommonDirectiveModule } from '../shared/common-directive/common-directive.module';
import { CommonAppModule } from '../common/common.module';
import { RawMaterialsDetailComponent } from './derivates-room/raw-materials-detail/raw-materials-detail.component';
import { SearchMrpRecipesComponent } from './shared/search-mrp-recipes/search-mrp-recipes.component';
import { SearchIngredientsComponent } from './shared/search-ingredients/component/search-ingredients.component';
import { ProductionPlansResumeComponent } from './production-plans/production-plans-resume/production-plans-resume.component';
import { IngredientsDetailComponent } from './ingredients/ingredients-detail/ingredients-detail.component';
import { IngredientsListComponent } from './ingredients/ingredients-list/ingredients-list.component';
import { IngredientsFiltersComponent } from './ingredients/ingredients-filters/ingredients-filters.component';
import { OutputProductRecipeSearchComponent } from './recipes/output-product-recipe-search/output-product-recipe-search.component';
import { CuttingOrdersListComponent } from './cutting-requirements/cutting-orders-list/cutting-orders-list.component';
import { CuttingOrdersDetailComponent } from './cutting-requirements/cutting-orders-detail/cutting-orders-detail.component';
import { CuttingWorkOrdersComponent } from './cutting-requirements/cutting-work-orders/cutting-work-orders.component';
import { ProductionOrdersListComponent } from './production-orders/production-orders-list/production-orders-list.component';
import { ProductionOrdersDetailComponent } from './production-orders/production-orders-detail/production-orders-detail.component';
import { RecipeCostRecalculateListComponent } from './recipes/recipe-cost/recipe-cost-recalculate-list/recipe-cost-recalculate-list.component';
import { RecipeIngredientRecalculateListComponent } from './recipes/recipe-cost/recipe-ingredient-recalculate-list/recipe-ingredient-recalculate-list.component';
import { ProductionPlansRecipeEditComponent } from './production-plans/production-plans-recipe-edit/production-plans-recipe-edit.component';
import { PrimengModule } from "../primeng/primeng.module";
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardLayaoutComponent } from '../common/components/dashboard-layaout/dashboard-layaout.component';


@NgModule({
  declarations: [
    RawMaterialsListComponent,
    ProcessingRoomFiltersComponent,
    ProcessingRoomDetailComponent,
    ProcessingRoomListComponent,
    MaterialsListComponent,
    MaterialsSearchComponent,
    RawMaterialsFiltersComponent,
    SearchIngredientsComponent,
    RoomRecipesSearchComponent,
    RecipeDetailComponent,
    RecipeListComponent,
    RecipeFiltersComponent,
    RecipeIngredientsDetailComponent,
    RecipeIngredientsListComponent,
    ProductionPlansCalendarComponent,
    ProductionPlansListComponent,
    ProductionPlansDetailComponent,
    ProductionPlansRecipeComponent,
    ProductionPlansResumeComponent,
    ProcessingRoomRecipesComponent,
    SubstitutionsIngredientSettingComponent,
    RawMaterialsDetailComponent,
    SearchMrpRecipesComponent,
    IngredientsDetailComponent,
    IngredientsListComponent,
    IngredientsFiltersComponent,
    OutputProductRecipeSearchComponent,
    CuttingOrdersListComponent,
    CuttingOrdersDetailComponent,
    CuttingWorkOrdersComponent,
    ProductionOrdersListComponent,
    ProductionOrdersDetailComponent,
    RecipeCostRecalculateListComponent,
    RecipeIngredientRecalculateListComponent,
    ProductionPlansRecipeEditComponent,
    DashboardComponent
  ],
  imports: [
    PrimengModule,
    CommonModule,
    MrpRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    CalendarModule,
    CommonDirectiveModule,
    CommonAppModule
  ]
})
export class MrpModule { }
