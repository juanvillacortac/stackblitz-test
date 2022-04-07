import { IngredientFilter } from 'src/app/models/mrp/ingredient-filter';
import { DialogsService } from 'src/app/modules/common/services/dialogs.service';
import { IngredientsService } from '../../services/ingredients.service';
import { ILoader } from '../interfaces/loader';

export class IngredientLoader implements ILoader {

    constructor(private ingredientService: IngredientsService) {

    }

    load(filter: IngredientFilter) {
        return this.ingredientService.loadIngredients(filter);
    }
}
