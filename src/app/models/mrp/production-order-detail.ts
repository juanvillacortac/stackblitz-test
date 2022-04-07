export interface OrderDetail {
    id: number;
    idIngredient: number;
    idProduct: number;
    idPackage: number;
    idMeasureUnit: number;
    ingredientName: string;
    requiredQty: number;
    usedQty: number;
}
