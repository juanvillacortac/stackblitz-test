import { Lot } from "./lot";

export class DetailProductReception {

    receptionId:number=-1;
    detailReceptionId:number=-1;
    enviroment:number=-1;
    idReceptionDetailHeavy:number=-1;
    productId:number=-1;
    packingId:number=-1;
    areaId:number=-1;
    area:string="";
    spaceId:number=-1;
    space:string="";
    gtin:string="";
    weightNeto:number=0;
    weightTare:number=0;
    weightGross:number=0;
    gtinsearch:string="";
    presetation:string="";
    typePackingId:number=-1;
    typePacking:string="";
    unitsPerPackaging:number=0;
    idMeasurementPresentation:number=-1;
    measurementPresentation:string="";
    receivedPackaging:number=0;
    expectedPackaging:number=-1;
    packagingInvoice:number=-1;
    totalUnits:number=0;
    costbase:number=0;
    temperature:number=0;
    classification:string="";
    ordinal:number=0;
    indHeavy:boolean=false;
    indReturn:boolean=false;
    createDate:Date;
    UpdateDate:Date;
    slaughterDate:Date;
    lots: Lot[]=[] //new Lot();
    indLote:boolean= false;
    quantitydays:number=0;
    numberlots:string="";
    item:number=0;
    unitMeditionCompany:string="";
    abreviationUnitComprany:string="";
}