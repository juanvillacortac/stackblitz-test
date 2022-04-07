import { Wastage } from "./wastage.viewmodel";

export class Generalsection {
    productId: number = -1;
    categoryId: number = -1;
    originTypeId: number = -1;
    productTypeId: number = -1;
    classificationId: number = -1;
    statusId: number = -1;
    groupingGenerationBarId: number = -1;
    typeGenerationBarId: number = -1;
    gtinTypeId: number = -1;
    brandId: number = -1;
    countryofOriginId: number = -1;
    providerId: number = -1;
    structureTypeId: number = -1;
    productRotationId: number = -1;
    integrationId: number = -1;
    SKU: string = "";
    referent: string = "";
    factoryRef: string = "";
    name: string = "";
    barcode: string = "";
    scalecode: string = "";
    CPE: string = "";
    gtin: string = "";
    gtin2: string = "";
    healthRegister: string = "";
    additionalComment: string = "";
    heavyInd: boolean = false;
    wastageTypes: Wastage[];
}
