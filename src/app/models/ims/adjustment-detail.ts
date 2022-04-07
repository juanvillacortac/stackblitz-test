export class AdjustmentDetail {
      id:number=-1;
      idadjustment:number=-1;
      idarea:number=-1; 
      idspace:number=-1; 
      idproduct:number=-1;
      product:string= ""; 
      idpackage:number=-1;
      packagepresentation:string= ""; 
      idmotive:number=-1; 
      motive:string= ""; 
      iddocument:number=1; 
      idprovider:number=1; 
      entries:number=0;
      outputs:number=0;
      actualexistence:number=0;
      avaliableinventory:number=0;
      unitsperpackaging:number=0; 
      quantity:number=0; 
      totalunits:number=0;
      createdate:Date = new Date(); 
      modifieddate:Date = new Date(); 
      bar:string="";
      indHeavy:boolean=false;
      iddetailphysicalcount:number=0;
      indLocked:boolean=false;
      localid:number=0;
     }