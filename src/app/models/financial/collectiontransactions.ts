export class CollectionTransactionFilter {
  collectionTransactionId = -1;
  bankId = -1;
  accountingAccountId = -1;
  client = -1;
  clientSocialReason = "";
  providerCustomerId = -1;
  businessId = -1;
  typeApplicationCollectionId = -1;
  transactionStatusTypeId = -1;
  documentNumber = '';
  filterDate = 1;
  startDate = '';
  endDate = '';
  indActive = -1;
  pageNumber = 1;
  pagelogs = 10;
}

export class CollectionTransaction {
  collectionTransactionId = -1; 
  providerCustomerId = -1;
  documentNumberProviderCustomer = '';
  tradingName = '';
  businessName = '';
  businessId = -1;
  collectionDetailTransactionId = -1;
  documentNumber = '';
  typeApplicationCollectionId = -1;
  typeApplicationCollection = '';
  bankId = -1;
  bank = '';
  bankCode = '';
  swiftCode = '';
  accountingAccountName = '';
  accountingAccountCode = '';
  bankAccountId = -1;
  bankAccountNumber = '';
  auxiliaryBankAccountOriginId = -1;
  auxiliaryBankAccountOrigin = '';
  currencyId = -1;
  currency = '';
  lotId = -1;
  lot = '';
  description = '';
  amount = -1;
  remainingAmount : number;
  transactionStatusTypeId = -1;
  transactionStatusType = '';
  anulleddDate: string | Date = "";
  canceledDate: string | Date = "";
  createdDate: string | Date = "";
  collectionDate: string | Date = "";
  updatedDate: string | Date = "";
  accountingDate: string | Date = "";
  transferDate: string | Date = "";
  indActive: boolean;
  charges: CollectionTransactionCharges[] = [];
  documents: CollectionTransactionDocument[] = [];
  details : CollectionTransactionDistribution[] = [];
} 

export class CollectionTransactionDistribution {
  // Sp data
  collectionTransactionId: number = -1;
  transactionDetailsId: number = -1;
  transactionalMasterTypeId: number = 5;
  bankTransferenceId: number = 2;
  seatTypeId: number = 3;
  costCenterId: number;
  branchOfficeId: number;
  auxiliarId: number;
  debit: number = 0;
  credit: number = 0;
  // Visualization data
  accountingAccount: string = "";
  accountingAccountId: number = -1;
  accountingAccountCode: string;
  branchOffice: string;
  costCenter: string;
  acientType: string;
  indAux: boolean;
  auxiliar: string;
  isClient: boolean = false;

}

export class CollectionTransactionCharges {
  collectionTransactionPaymentDetailsId: number = -1;
  transactionCollectionId: number = -1;
  typeApplicationCollectionId: number = -1;
  typeApplicationCollection: string = "";
  bankAccountId: number = -1;
  bankAccount: string = "";
  bankId: number = -1;
  bank: string = "";
  bankCode: string = "";
  codeSwift: string = "";
  bankAccountingAccount: string = "";
  bankAccountCode: string = "";
  bankAccountNumber: string = "";
  paymentMethod: string = "";
  paymentMethodByCurrency: number = -1;
  currencyId: number = -1;
  currency: string = "";
  exchangeRateId: number = -1;
  exchangeRateConvertionId: number = -1;
  paymentTypeApplicationId: number = -1;
  amount: number = 0;
  amountToApply: number = 0;
  remainingAmount: number = 0;
  appliedAmount: number = 0;
  reference: string = "";
  activeInd: true
 

}

export class CollectionTransactionDocument {
  activeInd:boolean;
  transactionCollectionChargeId = -1; 
  saleTransactionId:number = -1;
  transactionCollectionId = -1;
  documentTypeId = -1;
  amountApplied = -1;
  amountToApply = -1;
  remainingAmount : number;
  totalAmount = -1;
  documentNumber = "";
  indActive: boolean;
  creationDate: string | Date = "";
  updatedDate: string | Date = "";
  expirationDate: string | Date = "";
  chargesApplied: CollectionTransactionDocumentCharges[] = [];
  documentType: string;

}

export class CollectionTransactionDocumentCharges{
  count:number = 0;
  transactionCollectionChargeId = -1;
  transactionCollectionId = -1;
  typeApplicationCollectionId = -1;
  typeApplicationCollection = "";
  paymentMethod = "";
  bankId = -1;
  bank = "";
  bankCode = "";
  accountBankId = -1;
  bankAccountingAccount = "";
  bankAccount = "";
  auxiliaryBankAccountOriginId = -1;
  auxiliaryBankAccountOrigin = "";
  currencyId = -1;
  currency = "";
  appliedAmount: 0;
  amountToApply: 0;
  remainingAmount: number;
}

export class TypeApplicationCollectionFilter {
  id = -1;
  name = "";
  indActive = -1;
}

export class TypeApplicationCollection {
  id = -1;
  name: string;
  indActive: boolean;
}

export class CollectionTransactionDocumentFilter {
  clientSupplierId: number = -1;

  bussinessId: number = 1;

  initialCreationDate:string = '19000101';

  finalCreationDate: string = '19000101';

  documentNumber: string  = "";;

  typeDocumentId:number = -1;;
}

export class CollectionTransactionDocumentModal {
  activeInd: Boolean;
  amount: Number;
  amountToÁpply: Number;
  appliedAmount: Number;
  clientSupplierDocumentNumber: String;
  clientSupplierId: Number;
  commercialReason: String;
  creationDate: String;
  expirationDate:String;
  documentNumber: String;
  remainingAmount: Number;
  saleTransactionId: Number;
  documentType: String;
  documentTypeId: Number;
  socialReason: String;
}