import { SupplierViewmodel } from "src/app/modules/masters/supplier/shared/view-models/supplier-viewmodel";
import { PackingViewmodel } from "src/app/modules/srm/shared/view-models/packing-viewmodel";
import { ProductViewmodel } from "src/app/modules/srm/shared/view-models/product-viewmodel";
import { Product } from "../products/product";

export class Productsxsupplier {
    idProductxSupplier:number= -1;
    suppliers:SupplierViewmodel= new SupplierViewmodel(); 
    products:ProductViewmodel= new ProductViewmodel();
    packing: PackingViewmodel = new PackingViewmodel();
    category:string= "";
    // typepackingId:number= -1;
    // companyId:number=-1;
    // customerId:number= -1;
    idBranchoffice=1;
    supplierRef:string="";
    baseCost:number=0;
    conversionCost:number=0;
    available:number=0;
    idReasons:number=-1;
    description:string="";
    active: boolean=true;
    packingxproduct: string ="";
    // statusId: number = -1;
    // dateCreate: Date;
    // dateUpdate: Date;
}
