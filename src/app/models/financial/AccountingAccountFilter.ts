export class AccountingAccountFilter {
   
    accountingAccountId?:number = -1
    
    accountingAccountName?: string = "";
    
    accountingAccountCategoryId?:number = -1
  
    typeOfAccountingId?:number = -1

    auxiliary:string = "";

    module:string = "";

    accountingAccountCode?:string = "";

    active?:number = -1;
    
    idBusiness :number = 1
}

export const ACCOUNTING_ACCOUNT_ALL_ACTIVES_FILTER: AccountingAccountFilter = {
    accountingAccountId: -1,
    
    accountingAccountName : "",
    
    accountingAccountCategoryId : -1,
  
    typeOfAccountingId : -1,

    auxiliary : "",

    module :"",

    accountingAccountCode: "",

    active  : 1,

    idBusiness :  1

}
