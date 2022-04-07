export class bankAccounts {
    bankAccountId: number=-1
    businessId:number=-1
    business:string=""
    descripcionBankAccount:string=""
    accountNumber:string =""
    bank:string=""
    bankId:number=-1
    active:boolean=true
    accountingAccount:string=""
    accountingAccountId:number=-1
    currencyId :number=-1
    currency :string=""
    abbreviation:string=""
    symbol:string=""
    exchangeRatePaymentId:number=-1
    exchangePaymentType:string=""
    paymentCurrency:string=""
    destinationPaymentCurrency:string=""
    abbreviationPaymentCurrency:string=""
    symbolPaymentCurrency:string=""
    paymentConversionFactor:number=0
    depositExchangeRateId:number=-1
    depositExchangeType:string=""
    destinationPaymentCurrencyId:number=-1
    destinationDepositCurrency:string=""
    abbreviationDepositCurrency:string=""
    symbolDepositCurrency:string=""
    depositConversionFactor:number=0
    minimumPayment:number=0
    auxiliaryId:number=-1
    auxiliary:string=""
    bankAccountType:string=""
    bankAccountTypeId:number =-1
    // defaultPaymentRateId:number=-1
    // defaultPaymentRate:string=""
    // defaultDepositRateId:number=-1
    // defaultDepositRate:string=""
    createdByUserId :number =-1
   
    createdByUser :string ="";
   
    updatedByUserId :number =-1
     
    updatedByUser :string ="";
   
    createdDate :string ="";
     
    updatedDate :string ="";

   }


   export class bankAccountsFilter {
    bankAccountId: number=-1
    empresaId:number=1
    accountNumber:string =""
    bankId:number=-1
    active:number=-1
    currencyId :number=-1
    bankAccountTypeId:number =-1

   }


