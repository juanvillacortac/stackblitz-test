export class ProductCatalog {
    productId: number = -1;
    name: string = "";
    barcode: string = "";
    packingId: number = -1;
    statusId: number = -1;
    status:  string = "";
    internalRef: string = "";
    factoryRef: string = "";
    categoryId: number = -1;
    category: string = "";
    classificationId: number = -1;
    classification: string = "";
    structureTypeId: number = -1;
    structureType: string = "";
    brandId: number = -1;
    brand: string = "";
    image: string = "";
    dateCreate: Date = new Date();
    dateUpdate: Date = new Date();
    indHeavy:boolean=false;
    indconsigment :number=-1
    statusi:number=-1
}
