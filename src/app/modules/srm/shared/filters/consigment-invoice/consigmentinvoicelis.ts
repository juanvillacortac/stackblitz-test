export class ConsingmentInvoiceList {
    id:number=-1
    numberFC:string=""
    idArea:number=-1
    area:string=""
    typeFC:string=""
    numberInvoice:string=""
    numberDocument:string=""
    numberRecepcion:string=""
    idSuppliers: string="";
    suppliers: string="";
    exchangeRate:string=""
    cantItems:number=0;
    responsibleOperator:string;
    authorizeOperator:string="'"
    createdby:string="'"
    receptionOperator = -1;
    validationOperator = -1;
    idStatus: string="";
    status:string="";
    idWayToPay: number=-1;
    wayToPay: string="";
    idCoin:number=-1;
    coin: string="";
    idTypeDate: number=-1;
    dateCreate:Date;
    startDate:Date;
    finalizeDate:Date;
    authorizeDate:Date;
    amountInvoice:number=0
    amountBase:number=0
    amountConvertion:number=0
    amountInvoiceConvertion:number=0
    
}