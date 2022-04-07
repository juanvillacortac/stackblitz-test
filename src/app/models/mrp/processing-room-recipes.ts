import { BaseModel } from '../common/BaseModel';

export class ProcessingRoomRecipes extends BaseModel {
    idRecipe: number;
    idProcessingRoom: number;
    recipeCost?: number;
    active: boolean;
}
