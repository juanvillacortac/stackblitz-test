import { BaseModel } from '../common/BaseModel';
import { RecipeCost } from './recipe-cost';
import { RecipeIngredients } from './recipe-ingredients';

export class Recipe extends BaseModel {
    descriptions: string;
    productType: BaseModel;
    prepTime: number;
    expectedDepletion: number;
    storageTime: number;
    storageCondition: string;
    qtyPortionResult: number;
    unitOfMeasurement: number;
    applyLaborCost: boolean;
    applyFactoryCost: boolean;
    laborCost?: number;
    factoryCost?: number;
    recipeIngredients: RecipeIngredients[];
    recipeCost: RecipeCost;
    preparation: string;
    isWeight: boolean;
    idOutputProduct: number;
    outputProductName: string;
    barcode: string;
    active: boolean;
    calculationMargin: number;
    packageId = 0;
}
