export class purchaseOrderDetailsReceived{
    reception: string = "";
    idReception: number = 0;
    status: number = -1;
    packagesRecieved: number = -1;
    packageProductBar: string = "";
    unitsPerPackage: number = -1;
    unitsReceived: number = -1;
    startDate: Date = new Date();
    endDate: Date = new Date();
    baseCost: number = -1;
    conversionCost: number = -1;
    baseNetCost: number = -1;
    converNetCost: number = -1;
    netFactor: number = -1;
    netSellFactor: number = -1;
    sellFactor: number = -1;
    netBaseSellCost: number = -1;
    converNetSellCost: number = -1;
    conversionPVP: number = -1;
    basePVP: number = -1;
}