import { BaseModel } from '../common/BaseModel';

export class ProcessingRoom extends BaseModel {
    description: string;
    productType: BaseModel = new BaseModel();
    laborCost: number;
    factoryCost: number;
    isDerived: boolean;
    idAnimalType?: number;
    animalType?: string;
    idBranchOffice: number;
    active: boolean;
}
