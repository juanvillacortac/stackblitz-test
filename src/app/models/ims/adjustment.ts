import { AdjustmentDetail } from "./adjustment-detail";

export class Adjustment {
      id:number=-1;
      idbranchoffice:number=-1;  
      branchoffice:string= "";
      idarea:number=-1; 
      area:string= ""; 
      idtransactiontype:number=2 
      transactiontype:string= ""; 
      idadjustmenttype:number=-1;
      idcategory:number=-2;
      adjustmenttype:string= ""; 
      idphysycalcount:number=0; 
      idEstatus:number=-1; 
      estatus:string="";
      documentnumber:string= ""; 
      active:boolean=false; 
      observation:string= ""; 
      createdByUser:string= "";
      createdByUserId:number=-1 
      updatedByUser:string= ""; 
      updatedByUserId:number=-1 
      createdate:Date = new Date(); 
      modifieddate:Date = new Date(); 
      numberitems:number=0;
      itemsQuantity:number=0;
      idresponsableuser:number=-1;
      operator:string="";
      description:string="";
      physicalCount:string="";
      adjustemntdetailList : AdjustmentDetail[];
}