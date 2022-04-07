export type TaxPlanApplicationType = {
  id: number
  name: string
  active: boolean
}

export class TaxPlanDetail {
  id: number = -1
  taxId: number
  name: string
  abbreviation: string
  rateId: number
  baseRateId: number
  rate: string
  rateAbbreviation: string
  rateValue: number
  rateTypeId: number
  rateType: string
  active: boolean
}

export class TaxPlan {
  id: number = -1
  name: string
  taxCount: number
  taxPlanApplicationTypeId: number
  taxApplicationTypeId: number
  taxPlanApplicationType: string
  taxApplicationType: string
  abbreviation: string
  taxes: TaxPlanDetail[] = []
  active: boolean
  createdByUserId: number
  createdByUser: string
  updatedByUserId: number
  updatedByUser: string
}

export class TaxPlanFilter {
  id = -1
  idBusiness = 1
  name = ''
  taxPlanApplicationTypeId = -1
  active = -1
}

export class TaxPlanRate {
  id: number
  name: string
  abbreviation: string
  value: number
  typeId: number
  type: string
}

export class TaxPlanRawTax {
  id: number
  name: string
  abbreviation: string
  applicationTypeIds: number[]
  rates: TaxPlanRate[]
  baseTaxId: number
  baseTax: string
  baseTaxRates: TaxPlanRate[]
}

export class TaxPlanRawTaxFilter {
  id: number
  rateId: number
  rateTypeId: number
  applicationTypeId: number
  rateName: string
  rateAbbreviation: string
  idBusiness: number = 1
  active: number = 1
}
