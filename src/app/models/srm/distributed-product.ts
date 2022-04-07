import { DistributedBranchoffices } from "./distributed-branchoffices";

export class DistributedProduct {
    idAgrupationOrderPurchase: number = -1;
    idOrderPurchase:number=-1;
    productId:number=-1;
    name :string="";
    internalReference:string="";
    internalReferencesearch:string="";
    category:string="";
    image: string = "";
    indHeavy :boolean=false;
    gtin:string="";
    gtinsearch:string="";
    packaging:string="";
    unitmedition:string="";
    idPackagingType:number=-1;
    packagingType:string="";
    idPackaging:number=-1;
    unitPerPackaging:number=0;
    packagingQuantity:number=0;
    totalUnits:number=0;
    indconsigment :number=-1;
    status:number=-1;
    idGroupStatus:number=-1;
    distributedItems:number =-1; 
    branchOffices:DistributedBranchoffices[]=[];
}
