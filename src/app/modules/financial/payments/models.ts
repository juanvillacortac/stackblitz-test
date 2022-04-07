import { SelectItem } from "primeng/api";

export class Payment {
    id:number = -1;
    documentNumber : String = "";
    paymentType : String = "";;
    originAccount: String= "";;
    currency: String= "";;
    lot: String= "";;
    totalAmount: number= -1;
    creationDate: string= "";
    contabilizationDate: string= "";
    transactionDate:string= "";
    bankId: number = -1;
    banks: SelectItem[] = []
    bankAccounts: string[] = []
    bankAccount: number = -1;
    providerId: number = -1;
    provider:string = "";
    providerRif: string = "";
    paymentTypeId: number = -1
    paymentStatusId:number = -1
    documents :PaymentDocument[] = []
  
  
  }

  export class PaymentFilterList{
      documentNumber:String = "";
      filterDateTypeOfId: number = -1;
      beginDate: String = "";
      endDate: String = "";
      bankId: number = -1;
      bankAccount: number = -1;
      providerId: number = -1;
      provider:string = "";
      paymentTypeId: number = -1
      paymentStatusId:number = -1

  }

  export class PaymentDocument{
      id:number =-1
      documentNumber: string = "";
      totalAmount: number = 0;
      appliedAmount:number = 0;
      amountToApply:number = 0;
      remainingAmount: number = 0;
  } 

 