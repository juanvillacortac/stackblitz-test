import { CuttingDetail } from './cutting-detail';
import { CuttingType } from './cutting-type';

export class CuttingOrder {
    id: number;
    name: string;
    rawMaterialId: number;
    productId: number;
    packageId: number;
    inventory: number;
    performance: number;
    expectedPerformance: number;
    pieceQuantity: number;
    requirementDate: string;
    startedDate: string;
    endDate: string;
    labeledWeight: number;
    realWeight: number;
    status: number;
    roomId: number;
    cuttings: CuttingDetail[];
}

