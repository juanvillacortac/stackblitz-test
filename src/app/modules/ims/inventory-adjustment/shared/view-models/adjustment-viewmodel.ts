export class AdjustmentViewmodel {
    id:number=-1;
    idbranchoffice:number=-1;  
    branchoffice:string= "";
    idarea:number=-1; 
    area:string= ""; 
    idtransactiontype:number=-1 
    transactiontype:string= ""; 
    idadjustmenttype:number=-1
    adjustmenttype:string= ""; 
    idphysycalcount:number=-1 
    idEstatus:number=-1; 
    estatus:string="";
    documentnumber:string= ""; 
    active:boolean=false; 
    observation:string= ""; 
    createdByUser:string= "";
    createdByUserId:number=-1 
    updatedByUser:string= ""; 
    ppdatedByUserId:number=-1 
    createdate:Date =new Date(); 
    modifieddate:Date; 
    numberitems:number=-1;
    operator:string= ""; 
    physicalCount:string="";
    description:string="";
    //adjustemntdetailList : AdjustmentDetail[];
}
