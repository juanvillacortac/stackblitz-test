import { CountForCountdetail } from "./count-for-detail-count";

export class DetailInventoryCount
{
    id:number=-1;
    idPhysicalCount:number=-1;
    numberDocument:string="";
    physicalCount:string="";
    idArea :number=-1;
    area:string="";
    idSpace :number=-1;
    space:string="";
    idStatus :number=-1;
    idStatusProduct :number=-1;
    idCategory:number=-1;
    category :string="";
    idDocument:number=-1;
    idProduct:number=-1;
    product:string="";
    references:string="";
    gtin:string="";
    codeBalance:string="";
    count:number=0;
    idPacket:number=-1;
    packet:string="";
    unitPerPackaging:number=1;
    existences:number=0;
    defaultcount:number=0;
    dateCreate:Date;
    dateUpdate:Date;
    active:boolean=false;
    tight:boolean=false;
    indHeavy:boolean=false;
    indBlocked:boolean=false;
    initialCount:boolean=false;
    quatityCount:number=0;
    idSupplier:number=-1;
    details:CountForCountdetail[];
}