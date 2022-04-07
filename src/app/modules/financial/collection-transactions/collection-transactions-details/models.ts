

export class CollectionTransactionPost {
    collectionTransactionId: number;
    clientSupplierId: number;
    lotId: number;
    description: string;
    documentNumber: string;
    activeInd: boolean;
    paymentDate: string | Date;
    contabilizationDate: string | Date;
    transferenceDate: string | Date;
    chargesDetails: CollectionTransactionPostChargesDetail[];
    chargesDocumentDetails: CollectionTransactionPostChargesDocumentDetail[] = [] as any;
    chargesDocument: CollectionTransactionPostChargesDocument[];
    details: CollectionTransactionPostDetail[];
  }
  
  export class CollectionTransactionPostChargesDetail {
    collectionTransactionPaymentDetailsId: number = -1;
    bankId: number;
    bankAccountId: number;
    paymentMethodByCurrency: number;
    currencyId: number;
    exchangeRateId: number;
    exchangeRateConvertionId: number;
    paymentTypeApplicationId: number;
    amount: number;
    appliedAmount: number;
    reference: string;
    activeInd: boolean;
  }
  
  export class CollectionTransactionPostChargesDocument {
    activeInd: boolean;
    chargeDocumentTransactionId: number;
    documentId: number;
    documentTypeId: number;
    appliedAmount: number;
    amountToApply: number;
    remainingAmount: number;
    totalAmount: number;
    documentNumber: string;
    expirationDate: string | Date;
  }
  
  export class CollectionTransactionPostChargesDocumentDetail {
    documentDetailChargeTransactionId: number = -1;
    documentChargeTransactionId: number = -1;
    chargeTransactionDetailId: number = -1;
    chargeTransactionId: number = -1;
    appliedAmount: number = 0;
    amountToApply: number = 0;
    remainingTotal: number = 0;
    totalAmount: number = 0;
  }
  
  export class CollectionTransactionPostDetail {
    transactionDetailId: number;
    transactionalMasterType: number;
    transactionalChargeId: number;
    seatTypeId: number;
    centerCostId: number;
    branchOfficeId: number;
    accountingAccountId: number;
    auxiliarId: number;
    debit: number;
    credit: number;
  }