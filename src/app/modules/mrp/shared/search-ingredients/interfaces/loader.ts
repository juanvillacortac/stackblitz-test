import { IngredientFilter } from 'src/app/models/mrp/ingredient-filter';

export interface ILoader {

    load(filter: IngredientFilter);

}
