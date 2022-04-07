export class InventoryMovement {
    id:number= -1;
    idProduct:number= -1;
    product:string= "";
    gtin:string= "";
    codeBalance:string= "";
    idCategory:number=-1;
    category : string = "";
    idArea:number= -1;
    area : string = "";
    entries:number=0;
    outputs: number = 0;
    dateCreate:Date;
    idPacket:number=-1;
    packet :string=""; 
    idBranchOffice:number=-1;  
}
