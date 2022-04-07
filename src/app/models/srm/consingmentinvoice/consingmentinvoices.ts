import { Supplier } from "../../masters/supplier"
import { CalculationBasis } from "../common/calculation-basis"
import { PaymentNegotiation } from "../common/payment-negotiation"

export class ConsingmentInvoice
{
    id:number=-1
    branchOfficeId:number=-1
    numberFC:string=""
    // idArea:number=-1
    // area:string=""
    idtypedocument:number=-1
    idtypeFC:number=-1
    typeFC:string=""
    numberInvoice:string=""
    numberDocument:string=""
    numberReceptions:string=""
    controlNumber: string;
    serieNumber: string;
    idOperatorCreate:number=-1
    operatorCreate:string="";
    idResponsibleOperator:number=-1
    responsibleOperator:string="";
    idValidationOperator:number= -1;
    validationOperator:string=""
    observations:string=""
    idStatus: number=-1;
    status:string="";
    dateCreate:Date;
    startDate:Date;
    finalizeDate:Date;
    authorizeDate:Date; 
    indAproved:boolean=false
    supplier: Supplier=new Supplier;
    idReason:number=0
    description:string="" 
    paymentNegotiation: PaymentNegotiation=new PaymentNegotiation;
    calculationBasis: CalculationBasis=new CalculationBasis ;
}
export class ConsingmentInvoiceFilters {
    id: number=-1;
    idCompany: number=-1
  }
  export class InvoiceUpdateStatus {
    id: number;
    statusId: number;
    motiveId: number;
    observation: string;
}