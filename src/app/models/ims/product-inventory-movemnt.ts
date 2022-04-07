export class productInventoryMovement
 {
    id:number= -1;
    idProduct:number= -1;
    product:string= "";
    gtin:string= "";
    supplier:string= "";
    category : string = "";
    brand:string= "";
    area : string = "";
    abc : string = "";
    existences:number=0;
    existencesAvailable: number = 0;
    existencesBlocked:number=0;
    existencesTransit: number = 0;
    dateCreate:Date;   
}