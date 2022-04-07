import { SubstitutionIngredient } from './substitution-ingredient';

export class SubstitutionIngredientSetting {
    id: number;
    ingredientId: number;
    productId: number;
    productName: string;
    barcode: string;
    fullCategory: string;
    sustitutionIngredients: SubstitutionIngredient[];
}
