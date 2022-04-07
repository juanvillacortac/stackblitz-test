
export class TrialBalanceFilter {
  page: number = 1
  pageSize: number = 5
  fiscalYearId: number = -1
  initDate: Date = new Date(1900, 0, 1)
  endDate: Date = new Date()
  initAccountingAccount: number = -1
  endAccountingAccount: number = -1
  detailLevel: number = -1
  idBusiness: number = 1
}
