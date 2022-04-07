export interface SubstitutionIngredient {
    id: number;
    productId: number;
    ingredientId: number;
    packageId: number;
    name: string;
    barcode: number;
    active: boolean;
    order: number;
    actualCost: number;
}
