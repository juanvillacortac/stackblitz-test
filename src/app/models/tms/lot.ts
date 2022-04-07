export class Lot{
    id: number = -1;
    branchId: number = -1;
    areaId: number = -1;
    spaceId: number = -1;
    productId: number = -1;
    packingId: number = -1;
    createByUserID: number = -1;
    updateByUserID: number = -1;
    lotNumber: string = "";
    factoryLotNumber: string = "";
    numberInputUnits: number = 0;
    numberOutputUnits: number = 0;
    numberAvailableUnits: number = 0;
    expirationDate: Date = new Date();
    expirationDateString: String = "";
    createDate: Date = new Date();
    updateDate: Date = new Date();
}