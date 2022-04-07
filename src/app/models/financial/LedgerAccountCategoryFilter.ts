export class LedgerAccountCategoryFilter {
  accountingAccountCategoryId: number = -1;
  accountingAccountCategory: string = "";
  active: number = -1;
  IdAccountCategory: string = "";
  accountingAccountCategoryIdBusiness:number = 1
}

export const LEDGERACCOUNTCATEGORY_ALL_ACTIVES_FILTER: LedgerAccountCategoryFilter = {
  accountingAccountCategoryId: -1,
  accountingAccountCategory: "",
  active: 1,
  IdAccountCategory: "",
  accountingAccountCategoryIdBusiness:1,
}
