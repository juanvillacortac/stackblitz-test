import { BaseModel } from '../common/BaseModel';
import { PlanRecipe } from './plan-recipe';

export interface ProductionPlan extends BaseModel {
    deliveryDate: Date;
    idType: number;
    idDestinyStore: number;
    progress: number;
    statusProgress: number;
    recipes: PlanRecipe[];
}
