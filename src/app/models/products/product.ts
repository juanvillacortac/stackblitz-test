import { ProductCompanyViewModel } from "src/app/modules/products/shared/view-models/company.viewmodel";
import { Wastage } from "src/app/modules/products/shared/view-models/wastage.viewmodel";
import { Category } from "../masters-mpc/category";
import { classification } from "../masters-mpc/classification";
import { Groupinggenerationbar } from "../masters-mpc/common/groupinggenerationbar";
import { Producttype } from "../masters-mpc/common/producttype";
import { Status } from "../masters-mpc/common/status";
import { Structuretype } from "../masters-mpc/common/structuretype";
import { Typegenerationbar } from "../masters-mpc/common/typegenerationbar";
import { Gtintype } from "../masters-mpc/gtintype";
import { Productorigintype } from "../masters-mpc/productorigintype";
import { Brands } from "../masters/brands";
import { Company } from "../masters/company";
import { Country } from "../masters/country";

export class Product {
    productId: number = -1;
    categoryId: number = -1;
    category: Category;
    originTypeId: number = -1;
    originType: Productorigintype;
    productTypeId: number = -1;
    productType: Producttype;
    classificationId: number = -1;
    classification: classification;
    statusId: number = -1;
    status: Status;
    groupingGenerationBarId: number = -1;
    groupingGenerationBar: Groupinggenerationbar;
    typeGenerationBarId: number = -1;
    typeGenerationBar: Typegenerationbar;
    gtinTypeId: number = -1;
    gtinType: Gtintype;
    brandId: number = -1;
    brand: Brands;
    countryofOriginId: number = -1;
    country: Country;
    providerId: number = -1;
    structureTypeId: number = -1;
    structureType: Structuretype;
    productRotationId: number = -1;
    integrationId: number = -1;
    idPacking: number = -1;
    gtin: string = "";
    gtin2: string = "";
    SKU: string = "";
    referent: string = "";
    factoryRef: string = "";
    name: string = "";
    barcode: string = "";
    scalecode: string = "";
    cpe: string = "";
    healthRegister: string = "";
    storageTime: number = -1;
    additionalComment: string = "";
    heavyInd: boolean = false;
    handleSerialInd: boolean = false;
    durabilityInd: boolean = false;
    multipartyInd: boolean = false;
    lotInd: boolean = false;
    dateCreate: Date;
    dateUpdate: Date;
    companies: ProductCompanyViewModel[];
    wastageTypes: Wastage[];
    completeData: string = "";
    image: string = "";
}
