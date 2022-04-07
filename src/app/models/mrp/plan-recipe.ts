import { BaseModel } from '../common/BaseModel';

export interface PlanRecipe extends BaseModel {
    idRecipe: number;
    idProduct: number;
    idPackage: number;
    idProductionOrder: number;
    quantity: number;
    currentInventory: number;
    prepTime: number;
    elaborationCapacity: number;
    isDelayed: boolean;
}
