import { BaseModel } from '../common/BaseModel';

export class RecipeIngredients extends BaseModel {
    idRecipe: number;
    idIngredients: number;
    actualCost: number;
    isSupply: boolean;
    qty: number;
    active: boolean;
    barcode: string;
    newCost: number;
    variation?: number;
    packageId = 0;
}
