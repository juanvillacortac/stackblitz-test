export class SupplierCatalog {
    idProductSupplier:number= -1;
    idProduct:number= -1;
    name:string="";
    idPacking: number =-1;
    barra :string="";
    idPresentationPacking :number =-1;
    presentationPacking : string ="";
    idTipoEmpack:number=-1;
    typePacking:string ="";
    idSupplier:number=-1;
    commercialReason: string ="";
    idCategory:number=-1;
    category :string ="";
    supplierRef:string="";
    internalRef:string="";
    baseCost:number=0;
    conversionCost:number=0;
    available:number=0;
    active: boolean = false;
    dateCreate: Date;
    dateUpdate: Date;
    updatedByUser: string="";
    createdByUser: string="";
    idCom: number=-1;
    image: string="";
}
