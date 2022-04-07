import { SupplierCatalogExpressDetail } from "./supplier-catalog-express-detail";

export class SupplierCatalogModal {
    idProductSupplier:number=-1;
    idCom:number=-1;
    idProduct:number=-1;
    name:string="";
    barra :string="";
    idUnityMeasurePresentation:number=-1;
    unitMeasure:string="";
    idSupplier:number=-1;
    commercialReason:string="";
    idCategory:number=-1;
    category:string="";
    supplierRef:string="";
    internalRef:string="";
    createdByUser:string="";
    updatedByUser:string="";
    dateCreate:Date;
    dateUpdate:Date;
    active:boolean=true;
    indHeavy:boolean=false;
    indconsigment :number=-1
    status:number=-1
    detail:SupplierCatalogExpressDetail[]=[];
}