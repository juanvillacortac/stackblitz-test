import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BaseModel } from 'src/app/models/common/BaseModel';
import { ProductionPlan } from 'src/app/models/mrp/production-plan';
import { RecipeInventory } from 'src/app/models/mrp/recipe-inventory';
import { ProgressViewColors } from 'src/app/modules/common/components/progress-view/progress-view-colors';
import { HttpHelpersService } from 'src/app/modules/common/services/http-helpers.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductionPlansService {
  private apiUrl = `${environment.API_BASE_URL_PRODUCTION_ORDER}/productionplans`;
  public selectedPlan: ProductionPlan;

  constructor(
    private httpClient: HttpClient,
    private httpHelpersService: HttpHelpersService
  ) { }

  async loadAllProductionPlans() {
    const allPlansUrl = `${this.apiUrl}/all`;
    return this.httpClient.get<ProductionPlan[]>(allPlansUrl).toPromise();
  }

  async loadProductionPlansAt(month: number, year: number) {
    const queryParams = { month: month, year: year };
    return this.httpClient.get<ProductionPlan[]>(this.apiUrl, this.convertToParams(queryParams)).toPromise();
  }

  async loadProductionPlanById(idPlan: number) {
    const productionPlanUrl = `${this.apiUrl}/${idPlan}`;
    return this.httpClient.get<ProductionPlan>(productionPlanUrl).toPromise();
  }

  async loadRecipesInventory(filter: BaseModel) {
    const planRecipeUrl = `${this.apiUrl}/recipes/inventory`;
    return this.httpClient.get<RecipeInventory[]>(planRecipeUrl, this.convertToParams(filter)).toPromise();
  }

  async saveProductionPlan(plan: ProductionPlan) {
    return this.httpClient.post<boolean>(this.apiUrl, plan).toPromise();
  }

  getPlanStatusColor(plan: ProductionPlan) {
    if (plan?.progress >= 100) { return ProgressViewColors.GREEN; }
    switch (plan?.statusProgress) {
      case 0: return ProgressViewColors.GREEN;
      case 1: return ProgressViewColors.YELLOW;
      case 2: return ProgressViewColors.RED;
    }
    return ProgressViewColors.GREEN;
  }

  private convertToParams(object) { return { params: this.httpHelpersService.getHttpParamsFromPlainObject(object) }; }
}
