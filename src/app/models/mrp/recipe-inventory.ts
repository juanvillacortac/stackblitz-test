export interface RecipeInventory {
    idRecipe: number;
    idRoom: number;
    idMeasureUnit: number;
    idProduct: number;
    idPackage: number;
    name: string;
    availableQty: number;
    prepTime: number;
}
