export class SaleTransactionFilter {
  indSaleTransactionDirect = false;
  saleTransactionId = -1;
  costCenterNameId = -1;
  providerCustomerId = -1;
  businessId = -1;
  lotId = -1;
  originModuleId = -1;
  transactionCurrencyId = -1;
  branchOfficeId = -1;
  transactionStatusTypeId = -1;
  typeSaleId = -1;
  documentNumber = '';
  filterDate = -1;
  startDate = '';
  endDate = '';
  indActive = -1;
  pageNumber = 1;
  pagelogs = 10;
}

export class SalesTypeFilter {
  typeSaleId = -1;
  typeSale = '';
  indActive = -1;
}

export class SalesType {
  typeSaleId = -1;
  typeSale = '';
  indActive: boolean;
}

export class SalesTransactionResult {
  saleTransactionId = -1;
  costCenterNameId = -1;
  costCenterName = '';
  documentType = '';
  customerSupplierDocumentNumber = '';
  commercialReason = '';
  socialReason = '';
  businessId = -1;
  business = '';
  lotId = -1;
  lot = '';
  originModuleId = -1;
  module = '';
  transactionStatusTypeId = -1;
  transactionStatusType = '';
  createdByUserId = -1;
  createdByUser = '';
  documentNumber = '';
  indActive: boolean;
  documentDate = '';
  expirationDate = '';
}

export class SaleTransaction {
    indSaleTransactionDirect = false;
    saleTransactionId = -1;
    centerCostId = 1;
    centerCost = '';
    providerCustomerId = -1;
    documentType = '';
    documentNumberProviderCustomer = '';
    affectedInvoiceId = -1;
    documentTypeId = -1;
    documentCode = '';
    amount = 0;
    indWithholding: boolean;
    tradingName = '';
    businessName = '';
    paymentConditionId = -1;
    paymentCondition = '';
    businessId = -1;
    business = '';
    lotId = -1;
    lot = '';
    originModuleId = -1;
    originModule = '';
    transactionCurrencyId = -1;
    transactionCurrency = '';
    purchaseOrderId = -1;
    purchaseOrderNumber = '';
    taxPlanId = -1;
    taxPlan = '';
    branchOfficeId = -1;
    branchOffice = '';
    exchangeRateId = -1;
    typeExchange = '';
    exchangeRateCoversionId = -1;
    exchangeRateCoversion = '';
    transactionStatusTypeId = -1;
    transactionStatusType = '';
    salesTypeId = -1;
    createdByUserId = -1;
    createdByUser = '';
    updatedByUserId = -1;
    updatedByUser = '';
    documentNumber = '';
    indActivo: boolean;
    anulleddDate: string | Date = '';
    canceledDate: string | Date = '';
    createdDate: string | Date = '';
    updatedDate: string | Date = '';
    accountingDate: string | Date = '';
    priceDate: string | Date = '';
    documentDate: string | Date = '';
    realShippingDate: string | Date = '';
    shippingRequestDate: string | Date = '';
    orderDate: string | Date = '';
    transactionDate: string | Date = '';
    expirationDate: string | Date = '';
    deliveryDate: string | Date = '';
    articles: SalesTransactionArticle[];
    charges: SalesTransactionPayment[];
    discounts: SalesTransactionDiscount[];
    taxes: SalesTransactionTaxes[];
    details: SalesTransactionDetail[];
}

export class SalesTransactionArticle {
    transactionSalesArticleId = -1;
    articleId = -1;
    taxPlanId = -1;
    quantity = -1;
    cost = -1;
    indActivo: boolean;
    discountsArticles: SalesTransactionArticleDiscount[];
    taxesArticles: SalesTransactionArticleTaxes[];
}

export class SalesTransactionArticleDiscount {
  transactionSalesArticleDiscountId = -1;
  discountTypeId = -1;
  description = '';
  discountValue = -1;
  indActivo: boolean;
}

export class SalesTransactionArticleTaxes {
  transactionSalesArticleTaxId = -1;
  taxId = -1;
  taxBaseId = -1;
  taxRateId = -1;
  taxBaseRateId = -1;
  indActivo: boolean;
}

export class SalesTransactionPayment {
  transactionSalesChargeId = -1;
  bankId = -1;
  bank? = '';
  accountBankId = -1;
  accountBank? = '';
  accountingAccountId? = -1;
  accountingAccount? = '';
  paymentMethodByCurrencyId = -1;
  paymentMethodByCurrency? = '';
  paymentMethodId = -1;
  currencyId = -1;
  currencyOutput? = ''
  currencyOutputId? = -1
  exchangeRateId = -1;
  exchangeRateConvertionId = -1;
  amount = 0;
  reference = '';
  indActivo: boolean;
}

export class SalesTransactionDiscount {
  transactionSalesDiscountId = -1;
  discountTypeApplicationId = -1;
  discountTypeId = -1;
  description = '';
  discountValue = -1;
  indActivo: boolean;
}

export class SalesTransactionTaxes {
  transactionSalesArticleTaxId = -1;
  taxId = -1;
  taxBaseId = -1;
  taxRateId = -1;
  taxBaseRateId = -1;
  source = -1;
  indActivo: boolean;
}

export class SalesTransactionDetail {
  bankTransactionDetailId = -1;
  transactionalMasterTypeId = 3;
  bankTransferId = -1;
  typeEntriesId = -1;
  centerCostId = -1;
  branchOfficeId = -1;
  accountingAcccountId = -1;
  auxiliarIdDetail = -1;
  debit = -1;
  credit = -1;
}


