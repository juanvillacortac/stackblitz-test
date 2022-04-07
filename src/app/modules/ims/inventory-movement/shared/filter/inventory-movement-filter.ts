export class InventoryMovementFilter {
    id:number= -1;
    idProduct:number= -1;
    product:string= "";
    gtin:string= "";
    idCategory:string="";
    category : string = "";
    idArea:number= -1;
    area : string = "";
    factoryReferences : string = "";
    internalReferences: string = "";
    idsupplier:string="";
    supplier : string = "";
    idbrand:string= "";
    brand : string = "";
    indWeigth:number =-1;
    idStatusProduct:number=-1;
    existences:number=0;
    initialDate:string;
    finalDate:string;
    iDate:Date=new Date();
    fDate:Date=new Date();
    idBranchoffice:number=-1;
    codeBalance:string="";
    supplierstring:string="";
}