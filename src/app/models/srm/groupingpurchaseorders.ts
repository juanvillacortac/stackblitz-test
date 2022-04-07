import { Supplier } from "../masters/supplier";
import { PurchaseOrder } from "./purchase-order";
export class Groupingpurchaseorders {
    purchase: PurchaseOrder = new PurchaseOrder();
    idAgrupationOrderPurchase: number = -1;
    idTypeDistribution:number =-1;
    typeDistribution: string="";
    suppliers: Supplier = new Supplier();
    idBranchOrigin:number =-1;
    branchOrigin: string="";
    idCountry:number =-1;
    countryOrigin: string="";
    idPort:number =-1;
    portOrigin: string="";
    idGroupStatus:number=1;
    numOC: string="";
    distributedItems:number =-1; 
  

}
