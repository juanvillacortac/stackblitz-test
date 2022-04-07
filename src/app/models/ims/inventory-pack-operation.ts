import { InventoryPackOperationDetail } from "./inventory-pack-operation-detail";

export class InventoryPackOperation {
    id:number;
    branchOfficeId: number;
    areaId: number;
    spaceId: number;
    statusId: number;
    operationDocumentTypeId: number;
    operationType: number;
    operationDate: string;
    operatorId: number;
    details: InventoryPackOperationDetail[];
    observations: string;
}
