export class BankTransactionFilter {
  documentNumber: string
  bankTransactionId = -1
  businessId = -1
  bankAdjustmentTypeId = -1
  typeEstatusTransactionId: number = -1
  bankReasonId = -1
  bankId = -1
  bankAccountId = -1
  date: string
  startDate: string
  endDate: string
  bankAccountCurrencyId = -1
  reference: string
  active = -1
  pageNumber = 1
  pagelogs = 10
}

export class BankTransaction {
  bankTransactionId: number = -1
  businessId:number = 1
  business: string=""
  bankAdjustmentTypeId: number = -1
  bankAdjustmentType: string=""
  bankReasonId:number = -1
  bankReason: string=""
  bankId: number = -1
  bank: string=""
  bankAccountId: number=-1
  accountNumber: string=""
  bankAccountCurrencyId: number = -1
  bankAccountCurrency: string=""
  documentNumber: string=""
  reference: string=""
  amount: number = 0
  bankPostingDate: string | Date=""
  transactionDate: string | Date=""
  active: boolean = true
  createdByUserId: number = -1
  createdByUser:string=""
  updatedByUserId: number = -1
  updateByUser: string=""
  createdDate: string=""
  updatedDate: string=""
  accountingAccount: string=""
  auxiliarId: number = -1
  auxiliar: string=""
  bankingTransactionDescription:string=""
  transmitterReceiver:string=""
  typetaxeChangeId:number=-1
  taxeChangeId:number = -1
  converTypeTaxeChangeId: number=-1
  converTaxeChangeId:number = -1

  // TypeTaxeChangeId:number = -1
  // TypeConverTaxeChangeId:number = -1
  taxeChange:string=""
  typeEstatusTransactionId: number = -1
  typeEstatusTransaction:string=""
  indPermitAuxiliary: boolean=false
  accountingAccountTransactionId:number=-1



  detalle:BankTransactionDetail []=[];

}

export class BankTransactionDetail {

  bankTransactionDetailId: number = -1


  transactionalMasterTypeId: number = 1


  bankTransaction: number = -1


  typeEntriesId: number = -1


  typeEntries: string = ""

  idTypeEstatusTransaction :number=-1


  typeEstatusTransactionDetail :string=""


  codeAccountingAcccount :string=""


  indPermiteAuxiliar :boolean=false
  
  accountingAccountingId: number = -1



  auxiliarIdDetail: number = -1


  auxiliarDetail: string = ""


  debit: number = -1
  credit: number = -1

}
