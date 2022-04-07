export class InventoryCountReport {
    branchId = 1;
    documentNumber: string;
    adjustmentNumber: string;
    description: string;
    status: string;
    area: string;
    barcode: string;
    productName: string;
    inventory: number;
    count: number;
    difference: number;
    operator: string;
    responsible: string;
    category: string;
    startDate: Date;
    endDate: Date;
}