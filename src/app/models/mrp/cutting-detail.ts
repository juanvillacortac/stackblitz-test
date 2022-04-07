import { BaseModel } from '../common/BaseModel';

export class CuttingDetail extends BaseModel {
    productId: number;
    packageId: number;
    performance: number;
    realWeight: number;
    expectedPerformance: number;
}
