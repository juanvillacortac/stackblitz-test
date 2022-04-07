export class Lot {
    id:number= -1;
    idProduct:number=-1;
    idPacking:number=-1;
    numberLot:string="";
    internalNumberLot:string="";
    expiredDate:Date= new Date();
    createdDate:Date;
    updatedDate:Date;
    active:boolean=true;
    cantDays:number=0;
    document:string="";
    idcont:number=-1;
    idReceptionDetail: number=-1;
    //datos adicionales
    idTypePacking: number=0;
    typePacking: string="";
    cantPackaging:number=0;
    totalUnidad:number=0;
    unitperPackaging:number=0;
    idPresentacionPackaging: number=0;
    presentacionPackagin: string ="";

}