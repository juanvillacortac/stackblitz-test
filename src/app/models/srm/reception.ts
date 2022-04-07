import { BaseModel } from '../common/BaseModel';
import { Supplier } from '../masters/supplier';
import { CalculationBasis } from './common/calculation-basis';
import { PaymentNegotiation } from './common/payment-negotiation';
import { Transport } from './common/transport';

export class Reception {
    id: number;
    purchaseId: number;
    receptionNumber: string;
    branchOfficeId: number;
    receptionAreaId: number;
    centralizedInvoiceInd: boolean;
    invoiceNumber: string;
    controlNumber: string;
    serieNumber: string;
    externalDocumentNumber: string;
    receptionTypeId: number;
    estatus: number;
    receptionNumberRelated: string;
    documentType: string;
    documentTypeId: number;
    purchaseOrderRelated: string;
    purchaseOrderRelatedId: number;
    refundNumberRelated: string;
    documentTypeRelated: string;
    documentTypeRelatedId: number;
    arrivalTime: Date;
    startTime: Date;
    waitingTime: Date;
    receptionElapsedTime: Date;
    validationElapsedTime: Date;
    duration: Date;
    baseInvoiceAmount: number;
    baseTotalAmount: number;
    convertionInvoiceAmount: number;
    convertionTotalAmount: number;
    receivingOperator: BaseModel;
    validatorOperator: BaseModel;
    creatorOperator: BaseModel;
    supplier: Supplier;
    negotiatedCurrency: number;
    paymentNegotiation: PaymentNegotiation;
    transport: Transport;
    calculationBasis: CalculationBasis;
    createdDate: Date;
    endTime: Date;
    validationStartTime: Date;
    validationEndTime: Date;
    supplierCurrencyId: number;
    supplierExchangeType: number;
    cantItems:number=0
    idReason:number=-1;
    description: string="";
    operationDocumentTypeId:number=3;
}

export class ChildReception {
    id: number=-1;
    receptionId: number=-1;
    childReceptionNumber: string="";
    purchaseId: number=-1;
    receptionNumber: string="";
    areaId: number=-1;
    area:string="";
    statusId: number=-1;
    status:string="";
    receivingOperatorId: number=-1;
    responsible: string="";
    taskId: number=-1;
    numberTask: string="";
    arrivalTime: Date;
    startTime: Date;
    finishTime: Date;
    observation: string="";
    documentType: string="";
    documentNumber: string="";
    purchaseOrderRelatedId: number=-1;
    invoiceNumber: string="";
    receptionCountItems: number=-1;
    packingQty: number=0;
    packingIndividualQty: number=0;
    totalUnits: number=0;
    totalUnitsIndividual: number=0;
    cubing: number=0;
    responsibleParent:string="";
    supplierId: number=-1;
    supplier: string="";
    rif: string="";
    supplierDocument: string="";
    stoppedTime: number=0;
    runningTime: number=0;
    duration: number=0;
    createDate: Date;
    createdBy: string="";
    indCentralized:boolean=false;
    indParent:boolean=false;
    updateDate:Date
    taskObservation:string="";
    totalTime:number=0;
    operationDocumentTypeId:number=3;
    statusReceptionParentId:number=-1;
    idReason:number=0;
    description:string="";
}

export enum ReceptionStatus {
    pending = 55,
    started = 56,
    finalized = 57,
    validated = 58,
    reject=61,
    canceled=74,
    in_Validation=89

} 


export class ReceptionProperties {
    responsibleOperatorDisabled: boolean;
    validatorOperatorDisabled: boolean;
    providerDataDisabled: boolean;
    headReceptionDataDisabled: boolean;
    associatedDocumentDisabled: boolean;
}

export class ReceptionUpdateStatus {
    receptionId: number;
    statusId: number;
    motiveId: number;
    observation: string;
}

export enum InvoiceStatus {
    pending = 90,
    started = 91,
    finalized = 92,
    validated = 93,
    reject=94,
    PendingForReview=95,
    Review=96
} 

