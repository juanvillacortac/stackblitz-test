
import { AssociatedAccounts } from "./AssociatedAccounts"

export class ArticleClassification {
   
    id :number=-1;
   
    businessId:number=-1;
    business :string="";

    // accountingAccountName: string ="";
   
    articleClassificationName: string ="";
   
    descripcion: string ="";
    
    createdByUserId :number =-1
   
    createdByUser :string ="";
   
    updatedByUserId :number =-1
     
    updateByUser :string ="";
   
    createdDate :string ="";
     
    updatedDate :string ="";
   
    associatedAccount:AssociatedAccounts[]=[];
    // auxiliary:string="";

    // idauxiliary:number=-1;

    // indPermiteAuxiliar:boolean = true;

    // accountingAccountCode :string = "";

    // accountUsage :string ="";

    // accountUsageId :number=-1;
    
    active :boolean = true;

   }