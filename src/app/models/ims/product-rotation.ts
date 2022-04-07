export class ProductRotation {
    barcode: string;
    baseCost: number;
    baseRetailPrice: number;
    branchOffice: string;
    productName: string;
    scaleCode: string;
    area: string;
    averageStock: string;
    category: string;
    dailyAverageSale: number;
    daysCoverage: number;
    finalStock: number;
    initialStock: number;
    inventoryRotation: number;
    lastSaleDate: Date;
    quantitySold: number;
}

export class ProductRotationFilters {
    barcode: string = '';
    categories: string = '';
    startDate: string;
    endDate: string;
    factoryReference: string = '';
    markId: number;
    productName: string = '';
    reference: string = '';
    statusId: number;
    areaId: number;
    branchOfficeId: number = 0;
    indInventory: number;
    indWeighted: number;
    scaleCode: string = '';
    supplierId: number = 0;
}