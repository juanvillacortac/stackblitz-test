// export class InternalBankTransferFilter {
//     documentNumber: string
//     bankTransferId: number = -1
//     businessId = -1
//     bankAdjustmentTypeId = -1
//     typeEstatusTransactionId: number = -1
//     bankReasonId = -1
//     bankId = -1
//     bankAccountId = -1
//     date: string
//     startDate: string
//     endDate: string
//     bankAccountCurrencyId = -1
//     reference: string
//     active = -1
//     pageNumber = 1
//     pagelogs = 10
// }

export class InternalBankTransferFilter {
  bankTransferId = -1;
  businessId = -1;
  originBankId = -1;
  destinyBankId = -1;
  originBankAccountId = -1;
  destinyBankAccountId = -1;
  filterDate = -1;
  startDate: string;
  endDate: string;
  reference: string;
  bankTransferenceCurrencyId = -1;
  documentNumber: string;
  transactionTypeStatusId = -1;
  indActive = -1;
  pageNumber = 1;
  pagelogs = 10;
}

export class InternalBankTransfer {
    bankTransferId = -1;

    businessId: number = -1;


    originBankId: number = -1

    originBank: string;

    destinationBankId: number = -1

    destinationBank: string;

    originBankAccountId: number = -1

    destinationBankAccountId: number = -1

    originBankAccountCurrencyId: number = -1

    destinationBankAccountCurrencyId: number = -1

    bankAccountOriginNumber: string;

    destinyBankAccountNumber: string;

    destinyBankAccountCurrency: string;

    taxeChangeId: number = -1

    converTaxeChangeId: number = -1

    //bankAdjustmentTypeId: number = 1

    typeEstatusTransactionId: number = -1

    typeEstatusTransferId: number = -1

    descriptionBankTransfer: string = ""

    amount: number = 0

    documentNumber: string = ""

    reference: string = ""

    active: boolean = false

    bankPostingDate:string | Date=""
    transactionDate:string | Date=""

    transferDate: string = ""

    detalle: InternalBankTransferDetail[] = [];

}

export class InternalBankTransferDetail {

    bankTransactionDetailId: number = -1

    transactionalMasterTypeId: number = -1

    bankTransaction: number = -1

    typeEntriesId: number = -1

    accountingAccountingId: number = -1

    auxiliarIdDetail: number = -1

    debit: number = -1

    credit: number = -1


}
