export class ValuedInventory {
    id: number;
    productId: number;
    productName: string;
    classificationId: number;
    packageId: number;
    barcode: string;
    packageTypeId: number;
    PackageType: number;
    units: number;
    branchOfficeId: number;
    branchOffice: number;
    statusId: number;
    status: string;
    supplierId: number;
    supplier: string;
    inventory: number;
    baseCost: number;
    conversionCost: number;
    baseNetCost: number;
    conversionNetCost: number;
    baseNetSellCost: number;
    conversionNetSellCost: number;
    baseRetailPrice: number;
    conversionRetailPrice: number;
    netFactor: number;
    netSellFactor: number;
    netSell: number;
    indConsignment: boolean;
    closedDate: Date;
    purchaseDate: Date;
    transferDate: Date;
}

export class ValuedInventoryFilters {
    barcode: string;
    productName: string;
    reference: string;
    factoryReference: string;
    categories: string;
    supplier: string;
    markId: number;
    statusId: string;
    dateTypeId: number;
    startDate: string;
    endDate: string;
}