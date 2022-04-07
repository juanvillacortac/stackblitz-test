import { DetailProductReception } from "./detailproductreception";
import { PurchaseReception } from "./purchasereception";

export class DetailReception {
    purchaseId:number=-1
    receptionId:number=-1
    detailReceptionId:number=-1;
    productId:number=-1;
    product:string="";
    areaId:number=-1;
    referencesFactory:string="";
    references:string="";
    referencesearch:string="";
    category:string="";
    image :string="";
    activeOffice:number=0;
    status:number=0;
    indHeavy:boolean=false;
    indLote:boolean=false;
    totalUnits:number=0;
    totalUnitsInvoice:number=0;
    measurementPresentation:string="";
    detail:DetailProductReception=new DetailProductReception();
    purchaseReception :PurchaseReception=new PurchaseReception();
    packaging:DetailProductReception[]=[];
}