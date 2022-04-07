import { Company } from "src/app/models/masters/company";

export class SupplierextendViewmodel {
    id:number = -1;
    socialReason : string = "";
    identifier:string="";
    documentnumber : string = "";
    supplierclasification:string="";
    currency:string="";
    country:string="";
    active:boolean=false;
    createdByUser: string="";
    updatedByUser:string="";
    companies:Company[];
}
