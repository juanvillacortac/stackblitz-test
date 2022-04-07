import { BaseModel } from '../common/BaseModel';

export class CuttingType extends BaseModel {
    productId: number;
    packageId: number;
    inventory: number;
    performance: number;
    expectedPerformance: number;
}
